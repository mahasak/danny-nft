// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract DannyBase is Ownable, ERC721 {
    using SafeMath for uint256;

    uint256 public LIMIT_MINT_PER_TX = 10;
    
    uint256 public MAX_SUPPLY = 11111;
    uint256 public MINT_FEE_PER_TOKEN  =  1 * 10**16; //0.01 ETH

    bytes32 public proven;

    // status = false <=> contract offline
    // status = true <=> contract online
    // token only can mint when contract online
    // admin only can setup contract when contract offline
    bool public status;

    constructor(string memory _tokenName, 
        string memory _tokenSymbol, 
        uint256 _mintFee, 
        uint256 _maxSupply,
        uint256 _limitMint
    ) public ERC721(_tokenName, _tokenSymbol) {
        MAX_SUPPLY = _maxSupply;
        MINT_FEE_PER_TOKEN = _mintFee;
        LIMIT_MINT_PER_TX = _limitMint;
    }

    /***
     * @dev ensure contract is online
     */
    modifier online() {
        require(status, "Contract must be online.");
        _;
    }

    /**
     * @dev ensure contract is offline
     */
    modifier offline() {
        require(!status, "Contract must be offline.");
        _;
    }

     /**
     * @dev ensure collector pays for mint token
     */
    modifier mintable(uint256 numberToken) {
        require(numberToken <= LIMIT_MINT_PER_TX, "Number Token invalid");
        require(msg.value >= numberToken.mul(MINT_FEE_PER_TOKEN), "Payment error");
        _;
    }

    /**
     * @dev change status from online to offline and vice versa
     */
    function toggleActive() public onlyOwner returns (bool) {
        status = !status;
        return true;
    }

    function setMintFee(uint256 _mintFeePerToken)
        public
        onlyOwner
        offline
        returns (bool)
    {
        MINT_FEE_PER_TOKEN = _mintFeePerToken;
        return true;
    }

    /**
     * @dev Set base URI for contract
     * @param _baseURI ipfs hash
     */
    function setBaseURI(string memory _baseURI) public onlyOwner {
        _setBaseURI(_baseURI);
    }

    /**
     * @dev withdraw ether to owner/admin wallet
     * @notice ONLY owner can call this function
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        msg.sender.transfer(balance);
    }

    /**
     * @dev Set proven hash of metadata
     */
    function provenHash(bytes32 _proven) public onlyOwner {
        proven = _proven;
    }

}