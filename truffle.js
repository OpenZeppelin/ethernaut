// These are required to enable ES6 on tets
// and it's dependencies.
require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');
const constants = require('./src/constants')

module.exports = {
  migrations_directory: "./migrations",
  networks: {

    ropsten: {
      host: constants.NETWORKS.ROPSTEN.url,
      port: constants.NETWORKS.ROPSTEN.port,
      network_id: constants.NETWORKS.ROPSTEN.id,
      gas: 3000000,
      gasPrice: 100000000000,
      from: constants.ADDRESSES[constants.NETWORKS.ROPSTEN.name]
    },

    local: {
      host: constants.NETWORKS.LOCAL.url,
      port: constants.NETWORKS.LOCAL.port,
      network_id: constants.NETWORKS.LOCAL.id,
      gas: 3000000,
      gasPrice: 100000000000,
      from: constants.ADDRESSES[constants.NETWORKS.LOCAL.name]
    }

  }
};
