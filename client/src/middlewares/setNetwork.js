import * as actions from '../actions';
import * as constants from '../constants';
import { isLocalDeployed } from '../utils/contractutil';
import { deployAdminContracts } from '../utils/deploycontract';

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
    const deployWindow = document.querySelectorAll('.deploy-window-bg');
    deployWindow[0].style.display = 'block';
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
  let allNetworkIds = Object.keys(constants.ID_TO_NETWORK).filter(id => constants.ID_TO_NETWORK[id] !== constants.NETWORKS.LOCAL.name).map((key) => Number(key))
  onRightNetwork = allNetworkIds.includes(Number(id));
  return onRightNetwork;
}


export default setNetwork
