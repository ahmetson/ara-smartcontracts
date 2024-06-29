require('@nomicfoundation/hardhat-toolbox')
require('@nomicfoundation/hardhat-verify')
require('@openzeppelin/hardhat-upgrades')
require('dotenv').config()

const INFURA_KEY = process.env.INFURA_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const BASE_PRIVATE_KEY = process.env.BASE_PRIVATE_KEY
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY
const LINEASCAN_KEY = process.env.LINEASCAN_KEY
const BASESCAN_KEY = process.env.BASESCAN_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    testnet: {
      url: 'https://sepolia.infura.io/v3/' + INFURA_KEY,
      accounts: [PRIVATE_KEY],
    },
    lineaTestnet: {
      url: 'https://linea-sepolia.infura.io/v3/' + INFURA_KEY,
      accounts: [PRIVATE_KEY],
      gasPrice: 72750007,
    },
    linea: {
      url: 'https://linea-mainnet.infura.io/v3/' + INFURA_KEY,
      accounts: [PRIVATE_KEY],
      gasPrice: 72750007,
    },
    base: {
      url: 'https://base-mainnet.public.blastapi.io',
      accounts: [BASE_PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at
    apiKey: {
      testnet: ETHERSCAN_KEY,
      lineaTestnet: LINEASCAN_KEY,
      linea: LINEASCAN_KEY,
      base: BASESCAN_KEY,
    },
    customChains: [
      {
        network: 'lineaTestnet',
        chainId: 59141,
        urls: {
          apiURL: 'https://api-sepolia.lineascan.build/api',
          browserURL: 'https://sepolia.lineascan.build/',
        },
      },
      {
        network: 'linea',
        chainId: 59144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: 'https://lineascan.build/',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org/',
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
}
