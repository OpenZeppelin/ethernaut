import prompt from 'prompt';
import colors from 'colors';
import Web3 from 'web3';
import fs from 'fs';
import * as ethutil from '../src/utils/ethutil.js';
import * as constants from '../src/constants.js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as gamedata from '../src/gamedata/gamedata.json' assert { type: 'json' };
import * as EthernautABI from 'contracts/build/contracts/Ethernaut.sol/Ethernaut.json' assert { type: 'json' };
import * as ProxyAdminABI from 'contracts/build/contracts/proxy/ProxyAdmin.sol/ProxyAdmin.json' assert { type: 'json' };
import * as ImplementationABI from 'contracts/build/contracts/metrics/Statistics.sol/Statistics.json' assert { type: 'json' };
import * as ProxyStatsABI from 'contracts/build/contracts/proxy/ProxyStats.sol/ProxyStats.json' assert { type: 'json' };

let web3;
let ethernaut;
let proxyAdmin;
let implementation;
let proxyStats;

const PROMPT_ON_DEVELOP = true;
const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`;

async function exec() {
  console.log(
    colors.cyan(`<< NETWORK: ${constants.ACTIVE_NETWORK.name} >>`).inverse
  );

  await initWeb3();

  // Retrieve deployment data for the active network.
  const deployData = loadDeployData(DEPLOY_DATA_PATH);
  // Determine which contracts need to be deployed.
  let count = 0;
  if (needsDeploy(deployData.ethernaut)) {
    count++;
    console.log(colors.red(`(${count}) Will deploy Ethernaut.sol!`));
  }
  if (needsDeploy(deployData.implementation)) {
    count++;
    console.log(colors.red(`(${count}) Will deploy Statistics.sol!`));
  }
  if (needsDeploy(deployData.proxyAdmin)) {
    count++;
    console.log(colors.red(`(${count}) Will deploy ProxyAdmin.sol!`));
  }
  if (needsDeploy(deployData.proxyStats)) {
    count++;
    console.log(colors.red(`(${count}) Will deploy ProxyStats.sol!`));
  }
  gamedata.default.levels.map((level) => {
    if (needsDeploy(deployData[level.deployId])) {
      count++;
      console.log(
        colors.cyan(
          `(${count}) Will deploy ${level.levelContract} (${level.name})`
        )
      );
    }
  });

  if (count === 0) {
    console.log(colors.gray(`No actions to perform, exiting.`));
    return;
  }

  if (await confirmDeployment()) {
    await deployContracts(deployData);
    storeDeployData(DEPLOY_DATA_PATH, deployData);
    console.log('Done');
    process.exit();
  }
}

exec();

async function deployContracts(deployData) {
  const props = {
    gasPrice: (await web3.eth.getGasPrice()) * 10,
    gas: 4500000,
  };

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];
  console.log('FROM: ', from);

  // Deploy/retrieve ethernaut contract
  const Ethernaut = await ethutil.getTruffleContract(EthernautABI.default, {
    from,
  });

  if (needsDeploy(deployData.ethernaut)) {
    console.log(deployData);
    console.log(`Deploying Ethernaut.sol...`);
    ethernaut = await Ethernaut.new(props);
    console.log(colors.yellow(`  Ethernaut: ${ethernaut.address}`));
    deployData.ethernaut = ethernaut.address;
  } else {
    console.log('Using deployed Ethernaut.sol:', deployData.ethernaut);
    ethernaut = await Ethernaut.at(deployData.ethernaut);
    // console.log('ethernaut: ', ethernaut);
  }

  // Deploy/retrieve Implementation
  await deployImplementation(from, props, deployData);

  // Deploy/retrieve Proxy Admin
  await deployProxyAdmin(from, props, deployData);

  // Deploy/retrieve ProxyStats
  await deployProxyStats(from, props, deployData);

  // set ProxyStats in Ethernaut
  await setStatProxy(from, props);

  // Sweep levels
  const promises = gamedata.default.levels.map(async (level) => {
    // console.log('level: ', level);
    return new Promise(async (resolve) => {
      if (needsDeploy(deployData[level.deployId])) {
        console.log(
          `Deploying ${level.levelContract}, deployId: ${level.deployId}...`
        );

        // Deploy contract
        const LevelABI = JSON.parse(
          fs.readFileSync(
            `contracts/build/contracts/levels/${
              level.levelContract
            }/${withoutExtension(level.levelContract)}.json`,
            'utf-8'
          )
        );
        const Contract = await ethutil.getTruffleContract(LevelABI, { from });
        const contract = await Contract.new(...level.deployParams, props);
        console.log(colors.yellow(`  ${level.name}: ${contract.address}`));
        deployData[level.deployId] = contract.address;
        console.log(
          colors.gray(
            `  storing deployed id: ${level.deployId} with address: ${contract.address}`
          )
        );

        // Register level in Ethernaut contract
        console.log(
          `  Registering level ${level.levelContract} in Ethernaut.sol...`
        );
        const tx = await ethernaut.registerLevel(contract.address, props);
        console.log(`Registered ${level.levelContract}!`);
        // console.log(tx)
      } else {
        console.log(`Using deployed ${level.levelContract}...`);
      }
      resolve(level);
    });
  });

  return Promise.all(promises);
}

// ----------------------------------
// Deployment Functions
// ----------------------------------

async function deployProxyAdmin(from, props, deployData) {
  const ProxyAdmin = await ethutil.getTruffleContract(ProxyAdminABI.default, {
    from,
  });

  if (needsDeploy(deployData.proxyAdmin)) {
    console.log(`Deploying ProxyAdmin.sol...`);
    proxyAdmin = await ProxyAdmin.new(props);
    console.log(colors.yellow(`  ProxyAdmin: ${proxyAdmin.address}`));
    deployData.proxyAdmin = proxyAdmin.address;
  } else {
    console.log('Using deployed ProxyAdmin.sol:', deployData.proxyAdmin);
    proxyAdmin = await ProxyAdmin.at(deployData.proxyAdmin);
  }
  return proxyAdmin.address;
}

async function deployImplementation(from, props, deployData) {
  const Implementation = await ethutil.getTruffleContract(
    ImplementationABI.default,
    {
      from,
    }
  );
  if (needsDeploy(deployData.implementation)) {
    console.log(`Deploying Statistics.sol...`);
    implementation = await Implementation.new(props);
    console.log(colors.yellow(`  Statistics: ${implementation.address}`));
    deployData.implementation = implementation.address;
  } else {
    console.log('Using deployed Statistics.sol:', deployData.implementation);
    implementation = await Implementation.at(deployData.implementation);
  }

  return implementation.address;
}

async function deployProxyStats(from, props, deployData) {
  const ProxyStats = await ethutil.getTruffleContract(ProxyStatsABI.default, {
    from,
  });
  if (needsDeploy(deployData.proxyStats)) {
    console.log(`Deploying Proxy.sol...`);
    proxyStats = await ProxyStats.new(
      ...[implementation.address, proxyAdmin.address, ethernaut.address],
      props
    );
    console.log(colors.yellow(`  Proxy: ${proxyStats.address}`));
    deployData.proxyStats = proxyStats.address;
  } else {
    console.log('Using deployed Proxy.sol:', deployData.proxyStats);
    proxyStats = await ProxyStats.at(deployData.proxyStats);
  }

  return proxyStats.address;
}

// ----------------------------------
// Utils
// ----------------------------------

async function setStatProxy(from, props) {
  console.log(`Setting proxy in Ethernaut.sol...`);

  const ethernautContract = new web3.eth.Contract(
    EthernautABI.default.abi,
    ethernaut.address
  );

  let proxy_address = await ethernaut.statistics();
  if (needsSetProxy(proxy_address)) {
    await ethernautContract.methods.setStatistics(proxyStats.address).send({
      from,
      ...props,
    });
  }
}

function withoutExtension(str) {
  return str.split('.')[0];
}

function needsDeploy(deployAddress) {
  if (constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) return true;
  return deployAddress === undefined || deployAddress === 'x';
}

function needsSetProxy(proxy) {
  return (
    proxy === undefined ||
    proxy === '0x0000000000000000000000000000000000000000'
  );
}

function initWeb3() {
  return new Promise(async (resolve, reject) => {
    let provider;
    if (constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) {
      const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`;
      console.log(colors.gray(`connecting web3 to '${providerUrl}'...`));
      provider = new Web3.providers.HttpProvider(providerUrl);
    } else {
      provider = new HDWalletProvider(
        constants.ACTIVE_NETWORK.privKey,
        constants.ACTIVE_NETWORK.url
      );
    }

    web3 = new Web3(provider);

    web3.eth.net.isListening((err, res) => {
      if (err) {
        console.log('error connecting web3:', err);
        reject();
        return;
      }
      console.log(colors.gray(`web3 connected: ${res}\n`));
      ethutil.setWeb3(web3);
      resolve();
    });

  })
}

function loadDeployData(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    return {};
  }
}

function storeDeployData(path, deployData) {
  console.log(colors.green(`Writing updated deploy data: ${path}`));
  return fs.writeFileSync(path, JSON.stringify(deployData, null, 2), 'utf8');
}

function confirmDeployment() {
  return new Promise((resolve, reject) => {
    if (
      PROMPT_ON_DEVELOP ||
      constants.ACTIVE_NETWORK !== constants.NETWORKS.LOCAL
    ) {
      const options = {
        properties: {
          confirmDeployment: {
            description: `Confirm deployment? (y/n)`,
          },
        },
      };

      prompt.start();
      prompt.get(options, (err, res) => {
        if (err) return reject(err);
        resolve(res.confirmDeployment === 'y');
      });
    } else {
      resolve(true);
    }
  });
}
