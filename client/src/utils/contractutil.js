import * as constants from "../constants";
import { getWeb3, setWeb3, getTruffleContract } from "./ethutil";
import * as LocalFactoryABI from "contracts/build/contracts/factory/LocalFactory.sol/Factory.json";

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
  return require(`contracts/build/contracts/levels/${level.levelContract}/${contractName}.json`);
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

// -- Utils

