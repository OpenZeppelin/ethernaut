require("@nomiclabs/hardhat-truffle5")
require("@nomiclabs/hardhat-waffle")


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
        version: "0.6.3"
      }
    ]
  },
  paths: {
    artifacts: './build'
  }
}
