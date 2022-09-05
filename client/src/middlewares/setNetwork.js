import * as actions from '../actions';
import * as constants from '../constants';

// let wasOnWrongNetwork = false

const setNetwork = store => next => action => {
  if (action.type !== actions.SET_NETWORK_ID) return next(action) //we need to reload the window here

  if (checkWrongNetwork(action.id)) {
    alert(`Your are on wrong network. Currently the game support these networks ${JSON.stringify(Object.keys(constants.NETWORKS).filter((key) => key !== "LOCAL" && key !== "UNDEFINED"))}`)
    async function changeNetwork(){
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(constants.NETWORKS.SEPOLIA.id).toString(16)}` }],//if on wrong network giving option to switch to sepolia network.
      });
    }
    changeNetwork()
    // alert(`Your are on wrong network. Currently we support these networks ${JSON.stringify(JSON.stringify(constants.ID_TO_NETWORK))}`)
    
  }
  
  //This will trigger reload if the network is changed between supported network
  if (!checkWrongNetwork(action.id) && store.getState().network.networkId !== undefined && store.getState().network.networkId !== action.id){
    document.location.reload()
  }
  next(action)
}

function checkWrongNetwork(id) {
  let onWrongNetwork = false;
  let allNetworkIds = Object.keys(constants.ID_TO_NETWORK).map((key)=>Number(key))
  onWrongNetwork = !allNetworkIds.includes(Number(id));

  return onWrongNetwork;
}
export default setNetwork
