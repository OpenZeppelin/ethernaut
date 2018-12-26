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

async function newContract({abi, data, from, args = []}){
  const currentGasPrice = await web3.eth.getGasPrice();
  const suggestedGasPrice = web3.utils.toHex((web3.utils.toBN(currentGasPrice).mul(web3.utils.toBN("10"))));

  const contract = new web3.eth.Contract(abi);
  const deployment = contract.deploy({
    from,
    data,
    arguments: args
  });

  // Estimate gas seem to fail here
  // const gas = await deployment.estimateGas();
  // console.log("Gas");
  // console.log(gas);

  const deployedContract = await deployment.send({
    gas: 4500000,
    gasPrice: suggestedGasPrice,
    from
  });
  
  // console.log(deployedContract);
  
  return deployedContract._address;
}

function loadContract(address, abi, from) {
  const contract = new web3.eth.Contract(abi, address, {
    from,
  });
  return contract;
}

async function deployContracts(deployData) {
  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if(!from) from = web3.eth.accounts[0];

  const currentGasPrice = await web3.eth.getGasPrice();
  const suggestedGasPrice = web3.utils.toHex((web3.utils.toBN(currentGasPrice).mul(web3.utils.toBN("10"))));
  const props = {
    gasPrice: suggestedGasPrice,
    gas: 4500000
  }

  // Deploy/retrieve ethernaut contract
  //const Ethernaut = await ethutil.getTruffleContract(EthernautABI, {from});
  if(needsDeploy(deployData.ethernaut)) {
    const address = await newContract({
      abi: EthernautABI.abi,
      data: EthernautABI.bytecode,
      from
    });
    console.log(colors.yellow(`  Ethernaut: ${address}`));
    deployData.ethernaut = address;
  }
  else {
    console.log('Using deployed Ethernaut.sol:', deployData.ethernaut);
  }
  ethernaut = loadContract(deployData.ethernaut, EthernautABI.abi, from);

  // Sweep levels
  const promises = gamedata.levels.map(async level => {
    // console.log('level: ', level);
    return new Promise(async resolve => {
      if(needsDeploy(deployData[level.deployId])) {
        console.log(`Deploying ${level.levelContract}, deployId: ${level.deployId}...`);

        // Deploy contract
        const LevelABI = require(`../build/contracts/${withoutExtension(level.levelContract)}.json`);

        const address = await newContract({
          abi: LevelABI.abi,
          data: LevelABI.bytecode,
          from
        });
        console.log(colors.yellow(`  ${level.name}: ${address}`));
        deployData[level.deployId] = address
        console.log(colors.gray(`  storing deployed id: ${level.deployId} with address: ${address}`));

        // Register level in Ethernaut contract
        console.log(`  Registering level in Ethernaut.sol...`)
        const tx = await ethernaut.methods.registerLevel(address).send({
          gas: 4500000,
          gasPrice: suggestedGasPrice,
          from
        });
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

    if(process.env.PRIVATE_KEY){
      console.log(`Added private key: 0x${process.env.PRIVATE_KEY}`);
      web3.eth.accounts.wallet.add(`0x${process.env.PRIVATE_KEY}`);
    };

    web3.eth.net.isListening()
    .then(listening => {
      if (listening){
        console.log(colors.gray(`web3 connected:\n`));
        ethutil.setWeb3(web3);
        resolve();
      } else {
        reject(); 
      }
    })
    .catch(reject);
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
