require("@nomiclabs/hardhat-truffle5");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.3"
      },
      {
        version: "0.6.12"
      }
    ]
  },
  paths: {
    artifacts: './build'
  },
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 10000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
    },
  }
};