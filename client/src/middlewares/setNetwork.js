import * as actions from '../actions';
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

// let wasOnWrongNetwork = false

const setNetwork = store => next => action => {
  if (action.type !== actions.SET_NETWORK_ID) return next(action) //we need to reload the window here

  if (checkWrongNetwork(action.id)) {
    alert(`Your are on wrong network. Currently the game support these networks ${JSON.stringify(Object.keys(constants.NETWORKS).filter((key) => key !== "LOCAL" && key !== "UNDEFINED"))}`)
    async function changeNetwork(){
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(constants.NETWORKS.SEPOLIA.id).toString(16)}` }],//if on wrong network giving option to switch to sepolia network.
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: [{ chainId: `0x${Number(constants.NETWORKS.SEPOLIA.id).toString(16)}` }]
                },
              ],
            });
          } catch (addError) {
            console.error("Can't add nor switch to the selected network")
          }
        }
    }}
    changeNetwork()
    // console.log("hey I am called from here!")
  }
  
  //This will trigger reload if the network is changed between supported network
  if (!checkWrongNetwork(action.id) && store.getState().network.networkId !== undefined && store.getState().network.networkId !== action.id){
    document.location.reload()
    // console.log("hey called from here 2 ")
    return;
  }

  var selectedNetwork;
  var networks = Object.values(constants.NETWORKS)
  for(var i = 0; i<networks.length; i++)
  {
    if(!networks[i]) continue;
    if(networks[i] && `0x${Number(networks[i].id).toString(16)}` === `0x${action.id.toString(16)}`) {
      selectedNetwork = networks[i].name;
    }
  };

  console.info(`=> ${strings.selectedNetworkMessage}\n${selectedNetwork}`)

  next(action)
}

function checkWrongNetwork(id) {
  let onWrongNetwork = false;
  let allNetworkIds = Object.keys(constants.ID_TO_NETWORK).map((key)=>Number(key))
  onWrongNetwork = !allNetworkIds.includes(Number(id));

  return onWrongNetwork;
}
export default setNetwork
