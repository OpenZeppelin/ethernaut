import colors from 'colors';
import Web3 from 'web3';
import fs from 'fs';
import * as ethutil from '../src/utils/ethutil.js';
import * as constants from '../src/constants.js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as ProxyAdminABI from 'contracts/out/ProxyAdmin.sol/ProxyAdmin.json' assert { type: 'json' };
import * as ImplementationABI from 'contracts/out/Statistics.sol/Statistics.json' assert { type: 'json' };

let web3;

const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`;

async function deployImplementation(from, props) {
  console.log(colors.green(`Deploying Statistics.sol...`));
  const Implementation = await ethutil.getTruffleContract(
    ImplementationABI.default,
    {
      from,
    }
  );
  const implementation = await Implementation.new(props);
  console.log(` Implementation: ${implementation.address}`);
  return implementation.address;
}

async function upgradeTo(from, props, newImplementation) {
  console.log(colors.green(`Upgrading to new Implementation...`));
  const deployedData = loadDeployData(DEPLOY_DATA_PATH);

  const proxyAdmin = new web3.eth.Contract(
    ProxyAdminABI.default.abi,
    deployedData.proxyAdmin
  );

  await proxyAdmin.methods
    .upgrade(deployedData.proxyStats, newImplementation)
    .send({ from, ...props });

  console.log(colors.bgBlue(`Proxy is upgraded!`));
}

async function deploy() {
  await initWeb3();

  const props = {
    gasPrice: (await web3.eth.getGasPrice()) * 10,
    gas: 4500000,
  };

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if (!from) from = (await web3.eth.getAccounts())[0];
  console.log('FROM: ', from);

  let impl = await deployImplementation(from, props);

  await upgradeTo(from, props, impl);

  let deployData = {
    implementation: impl,
  };

  storeDeployData(DEPLOY_DATA_PATH, deployData);
  console.log('Done');
  process.exit();
}

deploy();

function storeDeployData(path, deployData) {
  console.log(colors.green(`Writing updated deploy data: ${path}`));
  let json = JSON.parse(fs.readFileSync(path));
  Object.assign(json, deployData);
  return fs.writeFileSync(path, JSON.stringify(json), 'utf8');
}

function loadDeployData(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    return {};
  }
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
  });
}
