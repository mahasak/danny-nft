// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract DannyBase is Ownable, ERC721 {
    using SafeMath for uint256;
    // max token to be mint in each transaction
    uint256 public limitTokenPerTx = 10;
    // max airdrop quota allowed
    uint256 public maxAirdrop = 111;
    // max supply NFT
    uint256 public maxSupply = 11111;
    // price for private sale stage (0.077 ETH)
    uint256 public privateSalePrice = 77 * 10**16;
    // price for public sale stage (0.088 ETH)
    uint256 public publicSalePrice = 88 * 10**16;
    // flag for publis/private sale
    bool public publicSale = false;
    // flag for contract mintable status, admin only airdrop-able when offline
    bool public isOnline = false;

    constructor(string memory _tokenName, 
        string memory _tokenSymbol, 
        uint256 _privateSalePrice, 
        uint256 _publicSalePrice, 
        uint256 _maxAirdrop,
        uint256 _maxSupply,
        uint256 _limitMint
    ) public ERC721(_tokenName, _tokenSymbol) {
        maxAirdrop = _maxAirdrop;
        maxSupply = _maxSupply;
        privateSalePrice = _privateSalePrice;
        publicSalePrice = _publicSalePrice;
        limitTokenPerTx = _limitMint;
    }

    /***
     * @dev ensure contract is online
     */
    modifier online() {
        require(isOnline, "Contract must be online.");
        _;
    }

    /**
     * @dev ensure contract is offline
     */
    modifier offline() {
        require(!isOnline, "Contract must be offline.");
        _;
    }

    /**
     * @dev ensure collector pays for mint token
     * @param numberToken number of token to mint
     */
    modifier mintable(uint256 numberToken) {
        require(numberToken <= limitTokenPerTx, "Number Token invalid");
        if(publicSale) {
            require(msg.value >= numberToken.mul(publicSalePrice), "Payment error");
        }
        if(!publicSale) {
            require(msg.value >= numberToken.mul(privateSalePrice), "Payment error");
        }
        _;
    }

    /**
     * @dev change status from online to offline and vice versa
     * @notice only owner can call this method
     */
    function toggleActive() public onlyOwner returns (bool) {
        isOnline = !isOnline;
        return true;
    }

    /**
     * @dev change sale stage between public / private sale
     * @notice only owner can call this method
     */
    function togglePublicSale() public onlyOwner returns (bool) {
        publicSale = !publicSale;
        return true;
    }

    /**
     * @dev set private sale token price
     * @param _price private sale price
     * @notice only owner can call this method in offline mode
     */
    function setPrivateSalePrice(uint256 _price)
        public
        onlyOwner
        offline
        returns (bool)
    {
        privateSalePrice = _price;
        return true;
    }

    /**
     * @dev set public sale token price
     * @param _price public sale price
     * @notice only owner can call this method in offline mode
     */
    function setPublicSalePrice(uint256 _price)
        public
        onlyOwner
        offline
        returns (bool)
    {
        publicSalePrice = _price;
        return true;
    }

    /**
     * @dev Set base URI for contract
     * @param _baseURI NFT Metadata base URI
     * @notice only owner can call this method
     */
    function setBaseURI(string memory _baseURI) public onlyOwner {
        _setBaseURI(_baseURI);
    }

    /**
     * @dev withdraw ether to owner/admin wallet
     * @notice only owner can call this method
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        msg.sender.transfer(balance);
    }
}