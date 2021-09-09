
const { assert, expect } = require('chai'); 
const { BigNumber } = require("ethers");
const chai = require('chai');
const BN = require('bn.js');
const { ethers } = require('hardhat');

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));

// Chainlink addresses and hashkey (Rinkby) - use for test
const COORDINATOR_ADDRESS = ethers.utils.getAddress("0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B");
const LINK_ADDRESS = ethers.utils.getAddress("0x01BE23585060835E02B77ef475b0Cc51aA1e0709");
const KEY_HASH = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"

describe("DannyNFT", function () {
  
  it("Should return the right name and symbol", async function () {
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      1, 
      "http://ipfs.io/x");
    
    await token.deployed();

    expect(await token.name()).to.equal("Test Danny Token");
    expect(await token.symbol()).to.equal("DFC");    
  });

  it("Deployment should NOT assign any of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      1, 
      "http://ipfs.io/x");
    await token.deployed();
    const ownerBalance = await token.balanceOf(owner.address);
    
    expect(BigNumber.from("0")._hex).to.equal(ownerBalance._hex);
    it("Test", async function() {
      expect(true).equals('false');
    })
  });

  it("Airdrop should only allow when offline", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      1, 
      "http://ipfs.io/x");

    await token.deployed();

    await token.toggleActive();

    let error = null
    try {
      await token.airdrop([addr1.address, addr2.address], 5)
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Contract must be offline.'")
  });

  it("Airdrop Should transfer tokens to addresses", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      1, 
      "http://ipfs.io/x");
          await token.deployed();
    
    await token.airdrop([addr1.address, addr2.address], 1)
    
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(BigNumber.from("1")._hex).to.equal(addr1Balance._hex);
    const addr2Balance = await token.balanceOf(addr2.address);
    expect(BigNumber.from("1")._hex).to.equal(addr2Balance._hex);

    const airdropped = await token.totalAirdrop();
    expect(airdropped).to.equal(2);
  });

  it("Airdrop should fail when mint over limit", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      1, 
      "http://ipfs.io/x");

    await token.deployed();

    let error = null
    try {
      await token.airdrop([addr1.address, addr2.address], 66)
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Exceed airdop allowance limit.'")
    const airdropped = await token.totalAirdrop();
    expect(airdropped).to.equal(0);
  });

  it("Allowlist should only add when offline", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      1, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.toggleActive();

    let error = null
    try {
      await token.whitelist([owner.address]);
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Contract must be offline.'")
  });

  it("Private Sale should fail when not add to allowlist", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      1, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.toggleActive();

    let error = null
    try {
      await token.mint(1, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Only whitelist addresses allowed.'")
  });

  it("Private Sale should pass when added to allowlist and not exceed presale amount(2)", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      10, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.whitelist([owner.address]);
    await token.toggleActive();

    let error = null
    try {
      await token.mint(2, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }

    expect(error).not.to.be.an('Error')
    const balance = await token.balanceOf(owner.address);
    expect(BigNumber.from("2")._hex).to.equal(balance._hex);

    try {
      await token.mint(2, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }
    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Max presale amount exceeded.'")

    const presale = await token.totalPrivateSale();
    expect(presale).to.equal(2);
  });

  it("Private Sale should fail when added to allowlist and exceed presale amount(2)", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      10, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.whitelist([owner.address]);
    await token.toggleActive();

    let error = null
    try {
      await token.mint(2, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }

    expect(error).not.to.be.an('Error')
    const balance = await token.balanceOf(owner.address);
    expect(BigNumber.from("2")._hex).to.equal(balance._hex);

    let presale = await token.totalPrivateSale();
    expect(presale).to.equal(2);

    try {
      await token.mint(2, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }
    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Max presale amount exceeded.'")

    presale = await token.totalPrivateSale();
    expect(presale).to.equal(2);
  });

  it("Private Sale should fail when price under settings", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const privateSalePrice = new BigNumber.from("77000000000000000") // 0.01 ETH
    const publicSalePrice = new BigNumber.from("88000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      privateSalePrice, 
      publicSalePrice, 
      111,
      33333, 
      10, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.whitelist([owner.address]);
    await token.toggleActive();
    let error = null
    try {

      await token.mint(1, {value: ethers.utils.parseEther("0.076")})
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Payment error.'")

  });

  it("Public Sale should fail when price under settings", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const privateSalePrice = new BigNumber.from("77000000000000000") // 0.01 ETH
    const publicSalePrice = new BigNumber.from("88000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      privateSalePrice, 
      publicSalePrice, 
      111,
      33333, 
      10, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.whitelist([owner.address]);
    await token.toggleActive();
    await token.startPublicSale();
    const price = await token.publicSale();
    let error = null
    try {

      await token.mint(1, {value: ethers.utils.parseEther("0.087")})
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Payment error.'")

  });

  it("Public Sale should only start after contract online", async function() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      10, 
      "http://ipfs.io/x");

    await token.deployed();  

    let error = null
    try {
       await token.startPublicSale();
    }
    catch (err) {
      error = err
    }
    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Contract must be online.'")
  })

  it("Public Sale should pass when NOT exceed public amount", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      10, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.toggleActive();
    await token.startPublicSale();

    let error = null
    try {
      await token.mint(2, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }

    expect(error).not.to.be.an('Error')
    let balance = await token.balanceOf(owner.address);
    expect(BigNumber.from("2")._hex).to.equal(balance._hex);

    let presale = await token.totalPublicSale();
    expect(presale).to.equal(2);

    try {
      await token.mint(2, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }

    balance = await token.balanceOf(owner.address);
    expect(BigNumber.from("4")._hex).to.equal(balance._hex);

    presale = await token.totalPublicSale();
    expect(presale).to.equal(4);
  });

  it("Public Sale should fail when exceed public amount", async function () {    
    const [owner, addr1, addr2] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(
      COORDINATOR_ADDRESS, 
      LINK_ADDRESS, 
      KEY_HASH,
      "Test Danny Token", 
      "DFC", 
      pointZeroOneEth, 
      pointZeroOneEth, 
      111,
      33333, 
      10, 
      "http://ipfs.io/x");

    await token.deployed();
    await token.toggleActive();
    await token.startPublicSale();

    let error = null
    try {
      await token.mint(10, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }

    expect(error).not.to.be.an('Error')
    let balance = await token.balanceOf(owner.address);
    expect(BigNumber.from("10")._hex).to.equal(balance._hex);

    let presale = await token.totalPublicSale();
    expect(presale).to.equal(10);

    try {
      await token.mint(11, {value: ethers.utils.parseEther("1.0")})
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Number Token invalid.'")

    balance = await token.balanceOf(owner.address);
    expect(BigNumber.from("10")._hex).to.equal(balance._hex);

    presale = await token.totalPublicSale();
    expect(presale).to.equal(10);
  });
});