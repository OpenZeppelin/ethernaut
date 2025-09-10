import * as actions from '../actions';
import * as constants from '../constants';
import { deployRemainingContracts, isLocalDeployed } from '../utils/contractutil';
import { deployAdminContracts } from '../utils/deploycontract';
import { networkOnDeprecationOrDeprecated } from '../utils/networkDeprecation';

let elements = document.querySelectorAll('.progress-bar-wrapper');

// let wasOnWrongNetwork = false

// -- Get the localstorage key then fetch the corresponding value,
// -- IF This is a network supported by default OR there is a localstorage key indicating contracts have been locally deployed THEN continue as normal
// -- ELSE notify the user that they need to deploy on this network to play the game or switch to a network that has the game, then run deployment script and set returned addresses to localstorage
const setNetwork = store => next => action => {
  window.localdeploy = deployAdminContracts; //TODO later remove reference to contract from windows
  window.deployAllContracts = deployRemainingContracts;
  if (action.type !== actions.SET_NETWORK_ID) return next(action) //we need to reload the window here
  elements = document.querySelectorAll('.progress-bar-wrapper');
  const hasBeenLocalDeployed = isLocalDeployed(action.id);

  if ((!onPredeployedNetwork(action.id) || networkOnDeprecationOrDeprecated(action.id)) && !hasBeenLocalDeployed) {
    const deployWindow = document.querySelectorAll('.deploy-window-bg');
    if (deployWindow[0]) deployWindow[0].style.display = 'block';
  }

  //This will trigger reload if the network is changed 
  if (store.getState().network.networkId !== undefined && store.getState().network.networkId !== action.id) {
    elements[0].style.display = 'flex';
    document.location.replace(`${document.location.origin}${document.location.pathname.indexOf('level') > 0 ? '' : document.location.pathname}`)
    return;
  }

  next(action)
}

export function onPredeployedNetwork(id) {
  let onRightNetwork = false;
  let allNetworkIds = Object.keys(constants.ID_TO_NETWORK).map((key) => Number(key))
  onRightNetwork = allNetworkIds.includes(Number(id));
  return onRightNetwork;
}

export default setNetwork
