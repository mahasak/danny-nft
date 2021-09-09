/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

const fs = require('fs')
const {privateKey, etherscanApiKey, infuraID, bscscanApiKey, coinmarketcapKey } = require('./.secrets.json');
 

module.exports = {
  solidity: {
    version: "0.6.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    alchemyrinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/OJETIQOWM-Jlf-1jpe38Bbd-Y1dVZh5a',
      accounts: [privateKey]
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/6419cb36c58e45008cb3a2471a2b0aa1',
      accounts: [privateKey]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraID}`,
      accounts: [privateKey],
      gas: 200000000
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
    apiKey: etherscanApiKey
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    coinmarketcap: coinmarketcapKey,
  }
};
