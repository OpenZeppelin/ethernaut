import colors from "colors";
import * as ethutil from "../utils/ethutil.js";
import * as LocalFactoryABI from "../contracts/out/LocalFactory.sol/Factory.json";
import { getGasFeeDetails } from "../utils/ethutil.js";
import {
  cacheContract,
  fetchLevelABI,
  getInjectedProvider,
  restoreContract,
  updateCachedContract,
} from "./contractutil";
import { CORE_CONTRACT_NAMES, ID_TO_NETWORK } from "../constants.js";
import { loadTranslations } from "../utils/translations";

const logger = (text) => {
  console.dir(colors.cyan(`<<  ${text.toUpperCase()}  >>`));
};

async function deploySingleContract(
  contractABI,
  gasDetails,
  from,
  { deployParams = [] } = {}
) {
  logger(`Deploying ${contractABI.contractName} contract`);
  const Contract = await ethutil.getTruffleContract(contractABI, {
    from,
  });
  const contract = await Contract.new(...deployParams, gasDetails);
  return contract;
}

const confirmMainnetDeployment = (chainId) => {
  if (
    chainId === 1 ||
    chainId === 1 || // Eth mainnet
    chainId === 137 || // Polygon
    chainId === 10 || // Optmism
    chainId === 42161 || // Arbitrum
    chainId === 56 // Binance
  ) {
    let language = localStorage.getItem("lang");
    const strings = loadTranslations(language);
    const res = window.confirm(strings.confirmMainnetDeploy);
    return res;
  }
  return true;
}

export async function deployAndRegisterLevel(level) {
  try {
    const levelABI = fetchLevelABI(level);
    const web3 = ethutil.getWeb3();
    const chainId = await web3.eth.getChainId();
    if (!confirmMainnetDeployment(chainId)) {
      return false;
    }
    const gasDetails = await getGasFeeDetails({ networkId: chainId, web3: web3 }, 10);
    const from = (await web3.eth.getAccounts())[0];
    const levelContractAddress = await deploySingleContract(
      levelABI,
      { gas: 10000000, ...gasDetails },
      from
    );

    logger(`Registering ${level.name} level on the ethernaut contract `);
    // -- use the factory to register a new level since it owns the ethernaut contract
    const factoryAddress = restoreContract(chainId)["factory"];
    const LocalFactory = await ethutil.getTruffleContract(LocalFactoryABI.default, {
      from,
    });
    const localFactory = await LocalFactory.at(factoryAddress);
    await localFactory.registerLevel(levelContractAddress.address, gasDetails);
    // -- add this level factory instance to state
    updateCachedContract(level.deployId, levelContractAddress.address, chainId);
    return levelContractAddress;
  } catch (err) {
    console.log(err);
    return false;
    // alert(err.message);
  }
  // return contractAddress;
}

export async function deployAdminContracts() {
  try {
    // -- get instance of metamask injected into the environment
    const web3 = getInjectedProvider();
    const chainId = await web3.eth.getChainId();
    if (!confirmMainnetDeployment(chainId)) {
      return false;
    }
    const gameData = restoreContract(chainId);

    const gasDetails = await getGasFeeDetails({ networkId: chainId, web3: web3 }, 10);
    const from = (await web3.eth.getAccounts())[0];

    // -- deploy factory contracts
    const factoryContracts = await deploySingleContract(
      LocalFactoryABI.default,
      { gas: 10000000, ...gasDetails },
      from
    );
    // -- query factory address for ethernaut, proxy, proxyadmin and implementation
    const deployedCoreContracts =
      await Promise.all(
        CORE_CONTRACT_NAMES.map((coreContractName) =>
          factoryContracts[coreContractName]()
        )
      );

    // -- update the game data array with contract values
    CORE_CONTRACT_NAMES.forEach(
      (key, index) => (gameData[key] = deployedCoreContracts[index])
    );
    gameData.factory = factoryContracts.address;
    gameData.owner = from;
    cacheContract(gameData, chainId);

    // -- stop loader (unnecessary since refresh?)
    const deployWindow = document.querySelectorAll(".deploy-window-bg");
    deployWindow[0].style.display = "none";

    // -- refresh page after deploying contracts
    document.location.replace(document.location.origin);
    return true;
  } catch (err) {
    // TODO maybe refresh the page if they fail to deploy the contracts
    console.log(err);
    // alert(err.message); //todo show a notification prompting the user to click something to restart the process
    return false;
  } finally {
    // -- stop the loader
    const elements = document.querySelectorAll(".progress-bar-wrapper");
    elements[0].style.display = "none";
  }
}

export const getDeployData = (networkId) => {
  const active_network = ID_TO_NETWORK[networkId];
  const network = active_network;
  let gameData = {};

  try {
    // try importing the game data file
    gameData = require(`../gamedata/deploy.${network}.json`);
  } catch (err) {
    // if there's an error then check localstorage if data exists for this chain
    gameData = restoreContract(networkId);
  }

  return gameData;
};