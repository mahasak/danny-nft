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

  uint256 public seed;
  bytes32 internal keyHash;
  uint256 internal chainlinkFee;

  uint256[] internal metaIds;

  string public specialURI;
  string public defaultURI;

  bool requestedVRF;
  bool revealed;

  constructor(
    address _VRFCoordinator,
    address _LINKToken, 
    bytes32 _keyHash,
    string memory _tokenName,
    string memory _tokenSymbol,
    uint256 _mintFee, 
    uint256 _maxSupply, 
    uint256 _limitMint,
    string memory _defaultURI
  ) public 
    DannyBase(_tokenName, _tokenSymbol, _mintFee, _maxSupply, _limitMint)
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
  function _mintDanny(address _to,uint256 numberToken) internal returns (bool) {
    for (uint256 i = 0; i < numberToken; i++) {
      uint256 tokenIndex = totalSupply();
      if (tokenIndex < MAX_SUPPLY) {
        _safeMint(_to, tokenIndex);
      }
    }
    return true;
  }

  function mintDanny(uint256 numberToken)
    public
    payable
    online
    mintable(numberToken)
    returns (bool) {
    return _mintDanny(_msgSender(), numberToken);
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

  function reveal() public onlyOwner {
    require(requestedVRF, "You have NOT request for VRF");
    require(seed > 0, "Your random seed is not populated");
    require(!revealed, "You can only reveal once");
    metaIds = new uint256[](MAX_SUPPLY);
    for (uint256 i = 0; i < MAX_SUPPLY; i++) {
      metaIds[i] = i;
    }
    // shuffle meta id
    for (uint256 i = 0; i < MAX_SUPPLY; i++) {
      uint256 j = (uint256(keccak256(abi.encode(seed, i))) % (MAX_SUPPLY));
      (metaIds[i], metaIds[j]) = (metaIds[j], metaIds[i]);
    }
    revealed = true;
    emit DannyNFTReveal(now);
  }

  function metadataOf(uint256 tokenId) public view returns (string memory) {
    require(tokenId < totalSupply(), "Token id invalid");
    if (seed == 0 || !revealed) return "";
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

    // before reveal, nobody know what happened
    if (!requestedVRF || !revealed) {
      return defaultURI;
    }

    // after reveal, you can know your know.
    return string(abi.encodePacked(baseURI(), metadataOf(tokenId), ".json"));
  }
  
  /**
   * @dev Minted early for owner, only owner can call, use also want to provide link to 5 metadata
   * @notice You only call this one time, and it should be call when offline
   */
  function airdrop(address _to, uint256 numberToken) public offline onlyOwner {
    _mintDanny(_to, numberToken); // mint for marketing & influencer
  }
}