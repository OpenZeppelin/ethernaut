import * as constants from "../constants";
import { getWeb3, setWeb3, getTruffleContract, getNetworkFromId } from "./ethutil";
import { newGithubIssueUrl } from "./github";
import * as LocalFactoryABI from "../contracts/out/LocalFactory.sol/Factory.json";
import { deployAdminContracts, deployAndRegisterLevel } from "./deploycontract";
var levels = require(`../gamedata/gamedata.json`).levels;


// -- storage
export function cacheContract(data, chainId) {
  const key = constants.STORAGE_CONTRACT_DATA_KEY + chainId;
  // console.log(`CACHE CONTRACT`, key, data)
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function restoreContract(chainId) {
  const key = constants.STORAGE_CONTRACT_DATA_KEY + chainId;
  const data = JSON.parse(window.localStorage.getItem(key));
  // console.log(`RESTORE CONTRACT`, key, data)
  return data || {};
}

export function updateCachedContract(key, value, chainId) {
  const data = restoreContract(chainId);
  data[key] = value;
  cacheContract(data, chainId);
}

export function isLevelDeployed(levelDeployId, chainId) {
  const gamedata = restoreContract(chainId);
  return Boolean(gamedata[levelDeployId]);
}
// -- storage

// -- Utils

export function getInjectedProvider() {
  let web3Instance = window.web3;
  if (window.ethereum) {
    web3Instance = new constants.Web3(window.ethereum);
  }
  if (!getWeb3()) setWeb3(web3Instance);
  return web3Instance;
}

// check the localstorage of the object containing address saved in localstorage
// contains all the core contracts
export function isLocalDeployed(chainId) {
  return constants.CORE_CONTRACT_NAMES.every(
    (contractName) => restoreContract(chainId)[contractName]
  );
}

// return the right key to use to query the level object
// use address if factory is deployed
// use deployId otherwise
export function getLevelKey(levelAddress) {
  return constants.Web3.utils.isAddress(levelAddress)
    ? "deployedAddress"
    : "deployId";
}

export function fetchLevelABI(level) {
  const contractName = level.levelContract.split(".")[0];
  return require(`../contracts/out/${level.levelContract}/${contractName}.json`);
}

// write windows finction to transfer ownership to a new user
window.transferOwnerShip = async function (newOwnerAddress) {
  console.log(`Transferring ownership of contracts to:${newOwnerAddress}`);
  // -- fetch the required provider parameters
  const web3 = getInjectedProvider();
  const chainId = await web3.eth.getChainId();
  const from = (await web3.eth.getAccounts())[0];

  // -- get the factory contract instance
  const { factory } = restoreContract(chainId);
  const LocalFactory = await getTruffleContract(LocalFactoryABI.default, {
    from,
  });

  // -- call the transfer ownership method on it
  const localFactory = await LocalFactory.at(factory);
  await localFactory.transferContractsOwnership(newOwnerAddress);
  // -- update owner in storage
  updateCachedContract("owner", "newOwnerAddress", chainId);
};

// write helper function to load the contracts from localstorage for the current chain
window.loadContracts = async function () {
  const web3 = getInjectedProvider();
  const chainId = await web3.eth.getChainId();
  return restoreContract(chainId);
};

// write helper function to create a new issue, this function should only be called when all the levels have been deployed
export const raiseIssue = async () => {
  const url = newGithubIssueUrl({
    user: 'OpenZeppelin',
    repo: 'ethernaut',
    template: 'New-Network-Support.md',
    title: 'New Network Support - [Network Name]',
  });

  window.open(url, '_blank').focus();
}

// statuses for the contracts deployment
export const deployStatus = {
  DEFAULT: 'DEFAULT',
  CORE_DEPLOYED: 'CORE_DEPLOYED',
  ALL_DEPLOYED: 'ALL_DEPLOYED'
}

// function to check what contracts are deployed on the current network
export const contractsDeploymentStatus = (chainId) => {
  if (!chainId)
    return deployStatus.DEFAULT;

  if (chainId in constants.ID_TO_NETWORK)
    return deployStatus.DEFAULT;

  const gamedata = restoreContract(chainId);
  if (!gamedata)
    return deployStatus.DEFAULT;

  for (let contractName of constants.CORE_CONTRACT_NAMES) {
    if (!gamedata[contractName]) {
      return deployStatus.DEFAULT;
    }
  }

  for (let level of levels) {
    if (!gamedata[level.deployId]) {
      return deployStatus.CORE_DEPLOYED;
    }
  }

  return deployStatus.ALL_DEPLOYED;
}

export const deployRemainingContracts = async () => {
  const chainId = await window.web3.eth.getChainId();

  try {
    let gamedata = restoreContract(chainId);
    if (!gamedata) {
      const deployed = await deployAdminContracts();
      if (!deployed) return;
      gamedata = restoreContract(chainId);
    }

    for (let contractName of constants.CORE_CONTRACT_NAMES) {
      if (!gamedata[contractName]) {
        const deployed = await deployAdminContracts();
        if (!deployed) return;
        gamedata = restoreContract(chainId);
        break;
      }
    }

    for (let level of levels) {
      if (!gamedata[level.deployId]) {
        const deployed = await deployAndRegisterLevel(level);
        if (!deployed) return;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export const verifyContract = async (contractAddress, level, chainId) => {
  const network = getNetworkFromId(chainId);
  if (!network.explorer || !level.verificationDetails)
    return;

  const contractFile = await fetch(`../contracts/src/levels/${level.instanceContract}`);
  const contractCode = await contractFile.text();

  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("apikey", network.explorer.apiKey);
  urlencoded.append("module", "contract");
  urlencoded.append("action", "verifysourcecode");
  urlencoded.append("sourceCode", contractCode);
  urlencoded.append("contractaddress", contractAddress);
  urlencoded.append("codeformat", "solidity-single-file");
  urlencoded.append("contractname", level.verificationDetails.contractName);
  urlencoded.append("compilerversion", level.verificationDetails.compilerVersion);
  urlencoded.append("optimizationUsed", level.verificationDetails.optimization);
  urlencoded.append("runs", level.verificationDetails.runs);
  urlencoded.append("constructorArguements", level.verificationDetails.constructorArguements);
  urlencoded.append("licenseType", level.verificationDetails.licenseTypeId);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };

  try {
    const response = await fetch(`${network.explorer.apiHost}/api`, requestOptions);
    const result = await response.json();
    if (result.status !== '1') {
      throw new Error(result.result);
    }
  } catch (e) {
    console.log('<< Game Instance Verification >>\n', e);
  }
}

// -- Utils
