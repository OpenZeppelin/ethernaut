require("@nomiclabs/hardhat-truffle5");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        }
      }
    ]
  },
  paths: {
    artifacts: './build'
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        // Forking the Rinkeby network to use the Uniswap factory & router.
        url: "https://eth-rinkeby.alchemyapi.io/v2/wqHV9Lvcxqi12zVXAcu44uEEOUmpYecF",
        blockNumber: 10692451
      }
    },
  }
};