/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const fs = require('fs')
const {privateKey, etherscanApiKey, infuraID } = require('./.secrets.json');

module.exports = {
  solidity: "0.6.6",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraID}`,
      accounts: [privateKey]
    },
    infura: {
      url: `https://mainnet.infura.io/v3/${infuraID}`,
      accounts: [privateKey]
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [privateKey]
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    //apiKey: etherscanApiKey
    apiKey: "BDMQWDUWHKDV534US2163C4XZ2IQ87AAV7"
  },
};
