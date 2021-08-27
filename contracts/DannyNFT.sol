// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "./DannyBase.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract DannyNFT is DannyBase, VRFConsumerBase {
  using SafeMath for uint256;
  event DannyNFTRandomnessRequest(uint timestamp);
  event DannyNFTRandomnessFulfil(bytes32 requestId, uint256 tokenId);
  event DannyNFTReveal(uint timestamp);

  enum MintMode {AIRDROP, PRESALE, PUBLICSALE}

  uint256 public seed;
  bytes32 internal keyHash;
  uint256 internal chainlinkFee;

  uint256 private _totalAirdrop;
  uint256 private _totalPrivateSale;
  uint256 private _totalPublicSale;
  uint256 private publicSaleIndex;

  uint256[] internal metaIds;

  string public specialURI;
  string public defaultURI;

  bool requestedVRF = false;
  bool shuffled = false;
  bool privateSaleRevealed = false;
  bool publicSaleRevealed = false;
  bool publicSaleStarted = false;

  mapping(address => uint) public originalOwns;
  mapping(address => bool) public originalOwner;

  constructor(
    address _VRFCoordinator,
    address _LINKToken, 
    bytes32 _keyHash,
    string memory _tokenName,
    string memory _tokenSymbol,
    uint256 _privateSalePrice, 
    uint256 _publicSalePrice, 
    uint256 _maxAirdrop,
    uint256 _maxSupply, 
    uint256 _limitMint,
    string memory _defaultURI
  ) public 
    DannyBase(_tokenName, _tokenSymbol, _privateSalePrice, _publicSalePrice, _maxAirdrop, _maxSupply, _limitMint)
    VRFConsumerBase(_VRFCoordinator, _LINKToken) 
  {
    chainlinkFee = 2 * 10**18; // 2 LINK token
    defaultURI = _defaultURI;
    keyHash = _keyHash;
  }

  function setDefaultURI(string memory _defaultURI) public onlyOwner {
    defaultURI = _defaultURI;
  }

  function setSpecialURI(string memory _specicalURI) public onlyOwner {
    specialURI = _specicalURI;
  }

  /**
   * @dev mint `numberToken` for msg.sender aka who call method.
   * @param numberToken number token collector want to mint
   */
  function _mint(MintMode mode,address _to,uint256 numberToken) internal returns (bool) {
    for (uint256 i = 0; i < numberToken; i++) {
      uint256 tokenIndex = currentTokenIndex(mode);      
      
      if (tokenIndex < maxSupply) {
        _safeMint(_to, tokenIndex);
        if(originalOwner[_to] == false) {
          originalOwner[_to] = true;
        }
        originalOwns[_to] += 1;
        if (mode == MintMode.AIRDROP) _totalAirdrop = _totalAirdrop + 1;
        if (mode == MintMode.PRESALE) _totalPrivateSale = _totalPrivateSale + 1;
        if (mode == MintMode.PUBLICSALE) _totalPublicSale = _totalPublicSale + 1;
      }
    }
    return true;
  }

  function currentTokenIndex(MintMode mode) public view returns (uint256) {
    if (mode == MintMode.AIRDROP) {
        return _totalAirdrop + 1;
      }

      if (mode == MintMode.PRESALE) {
        return _totalPrivateSale + maxAirdrop + 1;
      }

      if (mode == MintMode.PUBLICSALE) {
        return _totalPublicSale + publicSaleIndex + 1;
      }   
  }

  function mint(uint256 numberToken)
    public
    payable
    online
    mintable(numberToken)
    returns (bool) {
    
    return _mint(getMintMode(), _msgSender(), numberToken);
  }

  function getMintMode() internal view returns(MintMode) {
    if (publicSaleStarted) return MintMode.PUBLICSALE;
    return MintMode.PRESALE;
  }


  /**
   * @dev Minted for marketing purpose before public sale e.g. raffling/competetion
   * @param _to address to receive airdrop
   * @param numberToken amount to airdrop
   * @notice You only call this before private sale, and it should be call when offline
   */
  function airdrop(address _to, uint256 numberToken) public offline onlyOwner {
    require(totalSupply() < maxAirdrop, "Exceed airdop allowance limit.");
    _mint(MintMode.AIRDROP, _to, numberToken); // mint for marketing & influencer
  }

  /**
   * @dev Minted for marketing purpose after public sale e.g. raffling/competetion
   * @param _to address to receive airdrop
   * @param numberToken amount to airdrop
   * @notice You only call this before private sale, and it should be call when offline
   */
  function publicAirdrop(address _to, uint256 numberToken) public online onlyOwner {
    _mint(MintMode.PUBLICSALE, _to, numberToken); // mint for marketing & influencer
  }

  function startPublicSale() public offline onlyOwner {
    publicSaleStarted = true;
    publicSaleIndex = currentTokenIndex(MintMode.PRESALE);
  }

  function totalAirdrop() public view returns(uint) {
    return _totalPrivateSale;
  }

  function totalPrivateSale() public view returns(uint) {
    return _totalPrivateSale;
  }

  function totalPublicSale() public view returns(uint) {
    return _totalPublicSale;
  }

  /**
   * @dev reveal metadata of tokens.
   * @dev only can call one time, and only owner can call it.
   */
  function requestChainlinkVRF() public onlyOwner {
    require(!requestedVRF, "You have already generated a random seed");
    require(LINK.balanceOf(address(this)) >= chainlinkFee);
    requestRandomness(keyHash, chainlinkFee);
    requestedVRF = true;
    emit DannyNFTRandomnessRequest(now);
  }

  /**
   * @dev receive random number from chainlink
   * @notice random number will greater than zero
   */
  function fulfillRandomness(bytes32 _requestId, uint256 randomNumber)
    internal
    override {
    if (randomNumber > 0) seed = randomNumber;
      else seed = 1;
    emit DannyNFTRandomnessFulfil(_requestId, seed);
  }

  function isRevealed(uint256 tokenId) internal view returns (bool) {
    if (!shuffled) return false;
    if (tokenId <= _totalPrivateSale +maxAirdrop && privateSaleRevealed ) return true;
    return publicSaleRevealed;
  }

  function privateSaleReveal() public onlyOwner {
    privateSaleRevealed = true;
  }

  function publicSaleReveal() public onlyOwner {
    publicSaleRevealed = true;
  }

  function originalOwn(address addr) public view onlyOwner returns(uint256) {
    if (originalOwner[addr] == false) return 0;
    return originalOwns[addr];
  }

  function shuffle() public onlyOwner {
    require(requestedVRF, "You have NOT request for VRF");
    require(seed > 0, "Your random seed is not populated");
    require(!shuffled, "You can only shuffle once");
    metaIds = new uint256[](maxSupply);
    for (uint256 i = 1; i <= maxSupply; i++) {
      metaIds[i] = i;
    }
    // shuffle meta id
    for (uint256 i = 1; i <= maxSupply; i++) {
      uint256 j = (uint256(keccak256(abi.encode(seed, i))) % (maxSupply));
      (metaIds[i], metaIds[j]) = (metaIds[j], metaIds[i]);
    }
    shuffled = true;
    emit DannyNFTReveal(now);
  }

  function metadataOf(uint256 tokenId) public view returns (string memory) {
    require(tokenId < totalSupply(), "Token id invalid");
    bool isTokenRevealed = isRevealed(tokenId);
    if (seed == 0 || !shuffled || !isTokenRevealed) return "default";
    return Strings.toString(metaIds[tokenId]);
  }

  /**
   * @dev query tokenURI of token Id
   * @dev before reveal will return default URI
   * @dev after reveal return token URI of this token on IPFS 
   * @param tokenId The id of token you want to query
   */
  function tokenURI(uint256 tokenId)
    public
    view
    override (ERC721)
    returns (string memory)
  {
    require(tokenId < totalSupply(), "Token not exist.");
    bool isTokenRevealed = isRevealed(tokenId);
    // before we reveal, everyone will get default URI
    if (!requestedVRF || !shuffled || !isTokenRevealed) return defaultURI;    

    // after revealed, send shuffled metadata to owner
    return string(abi.encodePacked(baseURI(), metadataOf(tokenId), ".json"));
  }
}