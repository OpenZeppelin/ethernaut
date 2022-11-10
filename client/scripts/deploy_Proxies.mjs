import prompt from 'prompt';
import colors from 'colors';
import Web3 from 'web3';
import fs from 'fs';
import * as ethutil from '../src/utils/ethutil.js';
import * as constants from '../src/constants.js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as ProxyAdminABI from 'contracts/build/contracts/Proxy/ProxyAdmin.sol/ProxyAdmin.json' assert { type: 'json' };
import * as ImplementationABI from 'contracts/build/contracts/metrics/Stats.sol/Stats.json' assert { type: 'json' };
import * as ProxyStatsABI from 'contracts/build/contracts/Proxy/Proxy.sol/ProxyStats.json' assert { type: 'json' };

let web3;

async function deployProxyAdmin(from, props) {
  console.log(`Deploying ProxyAdmin.sol...`);
  const ProxyAdmin = await ethutil.getTruffleContract(ProxyAdminABI.default, {
    from,
  });
  const proxyAdmin = await ProxyAdmin.new(props);
  console.log(` Proxy Admin: ${proxyAdmin.address}`);
  return proxyAdmin.address;
}

async function deployImplementation(from, props) {
  console.log(`Deploying Implementation.sol...`);
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

async function deployProxyStats(from, impl, proxyAdmin) {
  console.log(`Deploying Proxy.sol...`);
  const ProxyStats = await ethutil.getTruffleContract(ProxyStatsABI.default, {
    from,
  });
  const proxyStats = await ProxyStats.new(impl, proxyAdmin);
  console.log(` Proxy Statistics: ${proxyStats.address}`);
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

  let proxyAdmin = await deployProxyAdmin(from, props);
  let impl = await deployImplementation(from, props);
  await deployProxyStats(from, impl, proxyAdmin);

  console.log('Done');
  process.exit();
}

deploy();

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
