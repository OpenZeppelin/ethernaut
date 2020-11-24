// These are required to enable ES6 on tests
// and it's dependencies.
require('babel-register')({
  ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

// const Ethernaut = artifacts.require("./Ethernaut.sol");
const prompt = require('prompt')
const Web3 = require("web3")
const colors = require('colors')
const fs = require('fs')
const ethutil = require(`../src/utils/ethutil`)
const constants = require(`../src/constants`)
const EthernautABI = require('../build/contracts/Ethernaut.sol/Ethernaut.json')
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

async function exec() {

  console.log(colors.cyan(`<< NETWORK: ${constants.ACTIVE_NETWORK.name} >>`).inverse)

  await initWeb3()

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if(!from) from = (await web3.eth.getAccounts())[0];
  console.log("FROM: ", from)

  await web3.eth.sendTransaction({
    from: from,
    to: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    value: '1000000000000000000'
  })

}
exec()


// ----------------------------------
// Utils
// ----------------------------------

function initWeb3() {
  return new Promise(async (resolve, reject) => {

    let provider
    if(constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) {
      const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`
      console.log(colors.gray(`connecting web3 to '${providerUrl}'...`));
      provider = new Web3.providers.HttpProvider(providerUrl);
    } else {
      provider = new HDWalletProvider(
        constants.ACTIVE_NETWORK.privKey,
        constants.ACTIVE_NETWORK.url
      )
    }

    web3 = new Web3(provider)

    web3.eth.net.isListening((err, res) => {
      if(err) {
        console.log('error connecting web3:', err);
        reject()
        return
      }
      console.log(colors.gray(`web3 connected: ${res}\n`));
      ethutil.setWeb3(web3)
      resolve()
    })
  })
}
