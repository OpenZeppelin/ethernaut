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
const EthernautABI = require('../build/contracts/Ethernaut.json')

const gamedata = require(`../gamedata/gamedata.json`)

let web3;
let ethernaut;

const PROMPT_ON_DEVELOP = true
const DEPLOY_DATA_PATH = `./gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`

async function exec() {

  console.log(colors.cyan(`<< NETWORK: ${constants.ACTIVE_NETWORK.name} >>`).inverse)

  await initWeb3()

  // Retrieve deployment data for the active network.
  const deployData = loadDeployData(DEPLOY_DATA_PATH)

  // Determine which contracts need to be deployed.
  let count = 0;
  if(needsDeploy(deployData.ethernaut)) {
    count++
    console.log(colors.red(`(${count}) Will deploy Ethernaut.sol!`))
  }
  gamedata.levels.map(level => {
    if(needsDeploy(deployData[level.deployId])) {
      count++
      console.log(colors.cyan(`(${count}) Will deploy ${level.levelContract} (${level.name})`))
    }
  })

  if(count === 0) {
    console.log(colors.gray(`No actions to perform, exiting.`));
    return;
  }

  if(await confirmDeployment()) {
    await deployContracts(deployData)
    storeDeployData(DEPLOY_DATA_PATH, deployData)
  }
}
exec()

async function deployContracts(deployData) {
  const props = {
    gasPrice: (await web3.eth.getGasPrice()) * 10,
    gas: 4500000
  }

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if(!from) from = (await web3.eth.getAccounts())[0];
  console.log("FROM: ", from)

  // Deploy/retrieve ethernaut contract
  const Ethernaut = await ethutil.getTruffleContract(EthernautABI, {from})
  if(needsDeploy(deployData.ethernaut)) {
		console.log(deployData);
    console.log(`Deploying Ethernaut.sol...`);
    ethernaut = await Ethernaut.new(props)
    console.log(colors.yellow(`  Ethernaut: ${ethernaut.address}`));
    deployData.ethernaut = ethernaut.address;
  }
  else {
    console.log('Using deployed Ethernaut.sol:', deployData.ethernaut);
    ethernaut = await Ethernaut.at(deployData.ethernaut)
    // console.log('ethernaut: ', ethernaut);
  }

  // Sweep levels
  const promises = gamedata.levels.map(async level => {
    // console.log('level: ', level);
    return new Promise(async resolve => {
      if(needsDeploy(deployData[level.deployId])) {
        console.log(`Deploying ${level.levelContract}, deployId: ${level.deployId}...`);

        // Deploy contract
        const LevelABI = require(`../build/contracts/${withoutExtension(level.levelContract)}.json`)
        const Contract = await ethutil.getTruffleContract(LevelABI, {from})
        const contract = await Contract.new(...level.deployParams, props)
        console.log(colors.yellow(`  ${level.name}: ${contract.address}`));
        deployData[level.deployId] = contract.address
        console.log(colors.gray(`  storing deployed id: ${level.deployId} with address: ${contract.address}`));

        // Register level in Ethernaut contract
        console.log(`  Registering level in Ethernaut.sol...`)
        const tx = await ethernaut.registerLevel(contract.address, props);
        // console.log(tx)
      }
      else {
        console.log(`Using deployed ${level.levelContract}...`);
      }
      resolve(level)
    })
  })

  return Promise.all(promises)
}

// ----------------------------------
// Utils
// ----------------------------------

function withoutExtension(str) {
  return str.split('.')[0]
}

function needsDeploy(deployAddress) {
  if(constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) return true
  return deployAddress === undefined || deployAddress === 'x'
}

function initWeb3() {
  return new Promise(async (resolve, reject) => {

    const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`
    console.log(colors.gray(`connecting web3 to '${providerUrl}'...`));

    const provider = new Web3.providers.HttpProvider(providerUrl);
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

function loadDeployData(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  }
  catch(err){
    return {}
  }
}

function storeDeployData(path, deployData) {
  console.log(colors.green(`Writing updated deploy data: ${path}`))
  fs.writeFileSync(path, JSON.stringify(deployData, null, 2), 'utf8')
}

function confirmDeployment() {
  return new Promise((resolve, reject) => {
    if(PROMPT_ON_DEVELOP || constants.ACTIVE_NETWORK !== constants.NETWORKS.LOCAL) {
      const options = {
        properties: {
          confirmDeployment: {
            description: `Confirm deployment? (y/n)`
          }
        }
      }

      prompt.start()
      prompt.get(options, (err, res) => {
        if (err) return reject(err)
        resolve(res.confirmDeployment === 'y')
      })
    } else {
      resolve(true)
    }
  })
}
