const { BigNumber } = require("ethers");

const chainlink = {
  rinkeby: {
    coordinator: ethers.utils.getAddress("0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"),
    token: ethers.utils.getAddress("0x01BE23585060835E02B77ef475b0Cc51aA1e0709"),
    hashkey: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
  },
  mainnet: {
    coordinator: ethers.utils.getAddress("0x514910771AF9Ca656af840dff83E8264EcF986CA"),
    token: ethers.utils.getAddress("0xf0d54349aDdcf704F77AE15b96510dEA15cb7952"),
    hashkey: "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445"
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Configs
  const token_name = "DarwinX Fan Token";
  const token_symbol = "DANX";
  const mint_fee = new BigNumber.from("1000000000000000") // 0.01 ETH
  const privateSalePrice = new BigNumber.from("7700000000000000") // 0.01 ETH
  const publicSalePrice = new BigNumber.from("8800000000000000") // 0.01 ETH
  const lootboxUrl = "https://maximillion-dev.web.app/metadata/loot.json";
  const mintLimitPerTx = 10;
  const maxAirdrop = 111;
  const maxSupply = 33333;

  // for Rinkby/local
  const coordinator = ethers.utils.getAddress(chainlink.rinkeby.coordinator);
  const linkToken = ethers.utils.getAddress(chainlink.rinkeby.token);
  const hashkey = chainlink.rinkeby.hashkey;

  // for Mainnet
  //const coordinator = ethers.utils.getAddress(chainlink.mainnet.coordinator);
  //const linkToken = ethers.utils.getAddress(chainlink.mainnet.token);
  //const hashkey = chainlink.mainnet.hashkey;

  const contract = await hre.ethers.getContractFactory("DannyNFT");
  const token = await contract.deploy(coordinator, linkToken, hashkey, token_name, token_symbol, privateSalePrice, publicSalePrice, maxAirdrop, maxSupply, mintLimitPerTx, lootboxUrl);

  await token.deployed()
  console.log("Danny contract deployed to:", token.address);
  console.log("Verify contract with following command");
  console.log("\r\nRinkeby");
  console.log(`npx hardhat verify --network rinkeby ${token.address} "${coordinator}" "${linkToken}" "${hashkey}" "${token_name}" "${token_symbol}" ${privateSalePrice}  ${publicSalePrice}  ${maxAirdrop} ${maxSupply} ${mintLimitPerTx} "${lootboxUrl}"`);
  console.log("\r\nMainnet");
  console.log(`npx hardhat verify --network mainnet ${token.address} "${coordinator}" "${linkToken}" "${hashkey}" "${token_name}" "${token_symbol}" ${privateSalePrice}  ${publicSalePrice}  ${maxAirdrop} ${maxSupply} ${mintLimitPerTx} "${lootboxUrl}"`);
  console.log("\r\n BSC Testnet");
  console.log(`npx hardhat verify --network bsctestnet ${token.address} "${coordinator}" "${linkToken}" "${hashkey}" "${token_name}" "${token_symbol}" ${privateSalePrice}  ${publicSalePrice}  ${maxAirdrop} ${maxSupply} ${mintLimitPerTx} "${lootboxUrl}"`);

  //console.log(coordinator, linkToken, hashkey, token_name, token_symbol, mint_fee, max_supply, mint_limit_per_tx, lootboxUrl);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });