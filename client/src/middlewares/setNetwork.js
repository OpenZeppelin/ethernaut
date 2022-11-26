import * as actions from '../actions';
import * as constants from '../constants';
import { isLocalDeployed } from '../utils/contractutil';
import { deployAdminContracts } from '../utils/deploycontract';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)
let elements = document.querySelectorAll('.progress-bar-wrapper');

// let wasOnWrongNetwork = false

// -- Get the localstorage key then fetch the corresponding value,
// -- IF This is a network supported by default OR there is a localstorage key indicating contracts have been locally deployed THEN continue as normal
// -- ELSE notify the user that they need to deploy on this network to play the game or switch to a network that has the game, then run deployment script and set returned addresses to localstorage
const setNetwork = store => next => action => {
  window.localdeploy = deployAdminContracts; //TODO later remove refrence to contract from windows
  if (action.type !== actions.SET_NETWORK_ID) return next(action) //we need to reload the window here
  elements = document.querySelectorAll('.progress-bar-wrapper');
  const hasBeenLocalDeployed = isLocalDeployed(action.id);

  if (!onPredeployedNetwork(action.id) && !hasBeenLocalDeployed) {
    if (elements[0]) elements[0].style.display = 'flex';
    const shouldDeploy = window.confirm(
      `Currently the game support these networks ${JSON.stringify(
        Object.keys(constants.NETWORKS).filter(
          (key) => key !== "LOCAL" && key !== "UNDEFINED"
        )
      )}. \nWould you like to deploy the game on your current network`
    );
    shouldDeploy ? deployAdminContracts() : changeNetwork();

  }

  //This will trigger reload if the network is changed 
  if (store.getState().network.networkId !== undefined && store.getState().network.networkId !== action.id) {
    elements[0].style.display = 'flex';
    document.location.replace(document.location.origin)
    return;
  }

  next(action)
}

export function onPredeployedNetwork(id) {
  let onRightNetwork = false;
  let allNetworkIds = Object.keys(constants.ID_TO_NETWORK).map((key) => Number(key))
  onRightNetwork = allNetworkIds.includes(Number(id));
  if (id.toString() === constants.NETWORKS.LOCAL.id) {
    onRightNetwork = isLocalDeployed(id);
  }
  return onRightNetwork;
}

// change the network to goreli network
async function changeNetwork() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${Number(constants.NETWORKS.GOERLI.id).toString(16)}` }],//if on wrong network giving option to switch to sepolia network.
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: [{ chainId: `0x${Number(constants.NETWORKS.GOERLI.id).toString(16)}` }]
            },
          ],
        });
      } catch (addError) {
        if (addError.code === 4001) {
          //User has rejected changing the request
          elements[0].style.display = 'none';
        }
        console.error("Can't add nor switch to the selected network")
      }
    } else if (switchError.code === 4001) {
      //User has rejected changing the request
      if (elements[0]) elements[0].style.display = 'none';
    }
  }
}


export default setNetwork
