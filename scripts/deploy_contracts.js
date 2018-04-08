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
let deployData;

const PROMPT_ON_DEVELOP = true

async function exec() {

  console.log(colors.cyan(`<< NETWORK: ${constants.ACTIVE_NETWORK.name} >>`).inverse)

  await initWeb3()

  // Retrieve deployment data for the active network.
  try {
    deployData = JSON.parse(fs.readFileSync(`../gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`, 'utf8'));
  }
  catch(err){
    deployData = {};
  }

  // Determine which contracts need to be deployed.
  let count = 0;
  const deployedKey = `deployed_${constants.ACTIVE_NETWORK.name}`
  if(needsDeploy(deployData.ethernaut)) {
    count++
    console.log(colors.red(`(${count}) Will deploy Ethernaut.sol!`))
  }
  gamedata.levels.map((level, key) => {
    if(needsDeploy(deployData[level.deployId])) {
      count++
        console.log(colors.cyan(`(${count}) Will deploy ${level.levelContract} (${level.name})`))
    }
  })

  // Confirm actions with user
  if(PROMPT_ON_DEVELOP || constants.ACTIVE_NETWORK !== constants.NETWORKS.DEVELOPMENT) {
    prompt.start()
    prompt.get({properties: {
      confirmDeployment: {
        description: `Comfirm deployment? (y/n)`
      }}}, function(err, res) {
      if (err) return console.log(err);
      else if (res.confirmDeployment === 'y') {
        deployContracts()
      }
    })
  }
  else deployContracts()
}
exec()

async function deployContracts() {

  backupGameData()
  // console.log(gamedata);

  const props = {
    gasPrice: web3.eth.gasPrice * 10,
    gas: 4500000
  }
  console.log(`deploy params:`, props);

  // Deploy/retrieve ethernaut contract
  const Ethernaut = await ethutil.getTruffleContract(EthernautABI, {
    from: constants.ADDRESSES[constants.ACTIVE_NETWORK.name]
  })
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
        const Contract = await ethutil.getTruffleContract(LevelABI, {
          from: constants.ADDRESSES[constants.ACTIVE_NETWORK.name]
        })
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
  
  // Write new deploy data to disk
  Promise.all(promises).then(() => {
    const path = `gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`
    console.log(colors.green(`Writing updated game data: ${path}`));
    fs.writeFileSync(path, JSON.stringify(deployData, null, 2), 'utf8')
  });
}

// ----------------------------------
// Utils
// ----------------------------------

function withoutExtension(str) {
  return str.split('.')[0]
}

function needsDeploy(deployAddress) {
  if(constants.ACTIVE_NETWORK === constants.NETWORKS.DEVELOPMENT) return true
  return !deployAddress.length === 0 || deployAddress === 'x'
}

function initWeb3() {
  return new Promise(async (resolve, reject) => {

    const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`
    console.log(colors.gray(`conecting web3 to '${providerUrl}'...`));

    const provider = new Web3.providers.HttpProvider(providerUrl);
    web3 = new Web3(provider)

    web3.net.getListening((err, res) => {
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

function backupGameData() {

  console.log(colors.magenta(`Backing up files...`));

  // Mkdir if not present (added in .gitignore)
  const dirPath = './gamedata/bkps/'
  if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)
  // Build new filename
  const bkpSrc = `./gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`;
  const bkpName = `deploy.${constants.ACTIVE_NETWORK.name}.${new Date().getTime()}.json`
  fs.createReadStream(bkpSrc)
    .pipe(fs.createWriteStream(`${dirPath}${bkpName}`));
}
