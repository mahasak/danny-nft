README.md

## Configure
* create file `.secrets.json` in main folder with following params:
```
{
  "privateKey": "private key",
  "etherscanApiKey": "ethescan api key",
  "infuraID": "infura id"
}
```

## Build
* run `npx hardhat compile` 

## Test
* run `npx hardhat test`

## Deploy to Hardhat local
* start hardhet node with `npx hardhat node`
* deploy to local network with `npx hardhat run --network hardhat scripts/deploy.js`

## Deploy to Testnet (Rinkeby)
* ensure `.secret` file contain proper account for testnet
* deploy to local network with `npx hardhat run --network hardhat scripts/deploy.js`

## Deploy to Mainnet
* ensure `.secret` file contain proper account for mainnet
* deploy to local network with `npx hardhat run --network infura scripts/deploy.js`