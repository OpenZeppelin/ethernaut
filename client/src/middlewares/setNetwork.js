import * as actions from '../actions';
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

// let wasOnWrongNetwork = false

const setNetwork = store => next => action => {
  if (action.type !== actions.SET_NETWORK_ID) return next(action) //we need to reload the window here

  if (checkWrongNetwork(action.id)) {
    alert(`You are on the wrong network. Currently the game supports these networks ${JSON.stringify(Object.keys(constants.NETWORKS).filter((key) => key !== "LOCAL" && key !== "UNDEFINED"))}`)
    const elements = document.querySelectorAll('.progress-bar-wrapper');
    elements[0].style.display = 'flex';

    async function changeNetwork(){
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
            if(addError.code === 4001) {
              //User has rejected changing the network
              elements[0].style.display = 'none';
              window.alert(strings.noLevelsDataMessage) //need to do something here more nicer to tell user
              window.location.reload();
            }
            console.error("Can't add nor switch to the selected network")
          }
        } else if(switchError.code === 4001) {
          //User has rejected changing the request
          elements[0].style.display = 'none';
          window.alert(strings.noLevelsDataMessage) //need to do something here more nicer to tell user
          window.location.reload();
        }
    }}
    changeNetwork()
  }
  
  //This will trigger reload if the network is changed between supported network
  if (!checkWrongNetwork(action.id) && store.getState().network.networkId !== undefined && store.getState().network.networkId !== action.id){
    const elements = document.querySelectorAll('.progress-bar-wrapper');
    elements[0].style.display = 'flex';
    document.location.replace(document.location.origin)
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
