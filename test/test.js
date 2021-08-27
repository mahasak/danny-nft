
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
    const token = await contract.deploy(COORDINATOR_ADDRESS, LINK_ADDRESS, KEY_HASH,"Test Danny Token", "DFC", pointZeroOneEth, 111, 1, "http://ipfs.io/x");
    
    await token.deployed();

    expect(await token.name()).to.equal("Test Danny Token");
    expect(await token.symbol()).to.equal("DFC");    
  });

  it("Deployment should NOT assign any of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(COORDINATOR_ADDRESS, LINK_ADDRESS, KEY_HASH,"Test Danny Token", "DFC", pointZeroOneEth, 111, 1, "http://ipfs.io/x");

    await token.deployed();
    const ownerBalance = await token.balanceOf(owner.address);
    
    expect(BigNumber.from("0")._hex).to.equal(ownerBalance._hex);
  });

  it("Early mint should only allow when offline", async function () {    
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(COORDINATOR_ADDRESS, LINK_ADDRESS, KEY_HASH,"Test Danny Token", "DFC", pointZeroOneEth, 111, 1, "http://ipfs.io/x");

    await token.deployed();
    
    await token.toggleActive();
    
    let error = null
    try {
      await token.earlyMint()
    }
    catch (err) {
      error = err
    }

    expect(error).to.be.an('Error')
    expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Contract must be offline.'")
  });

  it("Early mint should allow when offline", async function () {
    const [owner] = await ethers.getSigners();
    
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(COORDINATOR_ADDRESS, LINK_ADDRESS, KEY_HASH,"Test Danny Token", "DFC", pointZeroOneEth, 111, 1, "http://ipfs.io/x");

    await token.deployed();

    await token.earlyMint()
    
    const ownerBalance = await token.balanceOf(owner.address);
    expect(BigNumber.from("60")._hex).to.equal(ownerBalance._hex);
  });

  it("Early mint should allow when offline and mint all when total supply under 60", async function () {
    const [owner] = await ethers.getSigners();
    
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(COORDINATOR_ADDRESS, LINK_ADDRESS, KEY_HASH,"Test Danny Token", "DFC", pointZeroOneEth, 55, 1, "http://ipfs.io/x");

    await token.deployed();
    
    await token.earlyMint()
    
    const ownerBalance = await token.balanceOf(owner.address);
    expect(BigNumber.from("55")._hex).to.equal(ownerBalance._hex);
  });

  it("Airdrop Should transfer tokens to address", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const pointZeroOneEth = new BigNumber.from("1000000000000000") // 0.01 ETH
    const contract = await hre.ethers.getContractFactory("DannyNFT");
    const token = await contract.deploy(COORDINATOR_ADDRESS, LINK_ADDRESS, KEY_HASH,"Test Danny Token", "DFC", pointZeroOneEth, 111, 1, "http://ipfs.io/x");

    await token.deployed();
    
    await token.airdrop(addr1.address, 1)
    
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(BigNumber.from("1")._hex).to.equal(addr1Balance._hex);
  });
});