import colors from "colors";
import * as ethutil from "../utils/ethutil.js";

import * as EthernautABI from "contracts/build/contracts/Ethernaut.sol/Ethernaut.json";
import * as ProxyAdminABI from "contracts/build/contracts/proxy/ProxyAdmin.sol/ProxyAdmin.json";
import * as ImplementationABI from "contracts/build/contracts/metrics/Statistics.sol/Statistics.json";
import * as ProxyStatsABI from "contracts/build/contracts/proxy/ProxyStats.sol/ProxyStats.json";
import {
  cacheContract,
  fetchLevelABI,
  getInjectedProvider,
  restoreContract,
  updateCachedContract,
} from "./contractutil";
import { CORE_CONTRACT_NAMES } from "../constants.js";

const logger = (text) => {
  console.log(colors.cyan(`<<  ${text.toUpperCase()}  >>`));
};

async function deploySingleContract(
  contractABI,
  props,
  from,
  { deployParams = [] } = {}
) {
  logger(`Deploying ${contractABI.contractName} contract`);
  const Contract = await ethutil.getTruffleContract(contractABI, {
    from,
  });
  const contract = await Contract.new(...deployParams, props);
  return contract;
}

export async function deployAndRegisterLevel(level) {
  try {
    const levelABI = fetchLevelABI(level);
    console.log({ level });
    const web3 = ethutil.getWeb3();
    const chainId = await web3.eth.getChainId();
    const props = {
      gasPrice: (await web3.eth.getGasPrice()) * 10,
      gas: 10000000,
    };
    const from = (await web3.eth.getAccounts())[0];
    const levelContractAddress = await deploySingleContract(levelABI, props, from);

    logger(`Registering ${level.name} level on the ethernaut contract `);
    const ethernautAddress = restoreContract(chainId)['ethernaut'];
    const Ethernaut = await ethutil.getTruffleContract(EthernautABI.default, {
      from,
    });
    const ethernaut = await Ethernaut.at(ethernautAddress);
    await ethernaut.registerLevel(levelContractAddress.address, props);
    // -- add this level factory instance to state
    updateCachedContract(level.deployId, levelContractAddress.address, chainId);
    return levelContractAddress;
  } catch (err) {
    alert(err.message)
  }
  // return contractAddress;
}

export async function deployAdminContracts() {
  logger("Deploying core contracts");
  try {
    // -- get instance of metamask injected into the environment
    const web3 = getInjectedProvider();
    const chainId = await web3.eth.getChainId();
    const gameData = restoreContract(chainId);

    const props = {
      gasPrice: (await web3.eth.getGasPrice()) * 10,
      gas: 10000000,
    };
    const from = (await web3.eth.getAccounts())[0];

    // -- deploy ethernaut/proxyadmin/implementation contracts
    const deployedCoreContracts = await Promise.all(
      [EthernautABI, ProxyAdminABI, ImplementationABI].map((contractABI) =>
        deploySingleContract(contractABI.default, props, from)
      )
    );
    // -- deploy proxystats contract
    const [ethernaut, proxyAdmin, implementation] = deployedCoreContracts;
    const proxyStats = await deploySingleContract(
      ProxyStatsABI.default,
      props,
      from,
      {
        deployParams: [
          implementation.address,
          proxyAdmin.address,
          ethernaut.address,
        ],
      }
    );
    deployedCoreContracts.push(proxyStats);
    // -- call the  setstatproxy method
    const ethernautContract = new web3.eth.Contract(
      EthernautABI.default.abi,
      ethernaut.address
    );
    await ethernautContract.methods.setStatistics(proxyStats.address).send({
      from,
      ...props,
    });
    // -- update the game data array with contract values
    CORE_CONTRACT_NAMES.forEach(
      (key, index) => (gameData[key] = deployedCoreContracts[index].address)
    );
    cacheContract(gameData, chainId);
    // -- refresh page after deploying contracts
    document.location.replace(document.location.origin);

    const deployWindow = document.querySelectorAll('.deploy-window-bg');
    deployWindow[0].style.display = 'none';
  } catch (err) {
    // TODO maybe refresh the page if they fail to deploy the contracts
    console.log(err);
    alert(err.message); //todo show a notification prompting the user to click something to restart the process
  } finally {
    // -- stop the loader
    const elements = document.querySelectorAll(".progress-bar-wrapper");
    elements[0].style.display = "none";
  }
}
