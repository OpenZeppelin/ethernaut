import colors from "colors";
import * as ethutil from "../utils/ethutil.js";
import * as LocalFactoryABI from "contracts/build/contracts/factory/LocalFactory.sol/Factory.json";

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
    const web3 = ethutil.getWeb3();
    const chainId = await web3.eth.getChainId();
    const props = {
      gasPrice: (await web3.eth.getGasPrice()) * 10,
      gas: 10000000,
    };
    const from = (await web3.eth.getAccounts())[0];
    const levelContractAddress = await deploySingleContract(
      levelABI,
      props,
      from
    );

    logger(`Registering ${level.name} level on the ethernaut contract `);
    // -- use the factory to register a new level since it owns the ethernaut contract
    const factoryAddress = restoreContract(chainId)["factory"];
    const LocalFactory = await ethutil.getTruffleContract(LocalFactoryABI.default, {
      from,
    });
    const localFactory = await LocalFactory.at(factoryAddress);
    await localFactory.registerLevel(levelContractAddress.address, props);
    // -- add this level factory instance to state
    updateCachedContract(level.deployId, levelContractAddress.address, chainId);
    return levelContractAddress;
  } catch (err) {
    alert(err.message);
  }
  // return contractAddress;
}

export async function deployAdminContracts() {
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

    // -- deploy factory contracts
    const factoryContracts = await deploySingleContract(
      LocalFactoryABI.default,
      props,
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
