import * as actions from '../actions';
import * as constants from '../constants';

// let wasOnWrongNetwork = false

const setNetwork = store => next => action => {
  if (action.type !== actions.SET_NETWORK_ID) return next(action) //we need to reload the window here
  // if (localStorage.getItem("NetId") == null){
  //   document.location.reload()
  // }
//  if (localStorage.getItem("NetId") !== action.id){
//   localStorage.setItem("NetId",action.id)
//   // document.location.reload();
//  }
//  console.log("from store,",store.getState().network.networkId)
//   console.log("the network id is,", action.id)
//   console.log("the value is ", checkWrongNetwork(action.id))
  // console.log(`ID`, action.id)
  // if (checkWrongNetwork(action.id)) {
  //   wasOnWrongNetwork = true
  // }
  // else if (wasOnWrongNetwork) {
  //   document.location.reload()
  // }
  // let supportedNetworks = constants.ACTIVE_NETWORK.filter((network) => network.name !== 'local')
  // console.log(supportedNetworks)

  // let supportedNetworkNames = supportedNetworks.map((network) => network.name)
  // console.log("list of supported Networks", JSON.stringify(JSON.stringify(constants.ID_TO_NETWORK)))
  // 
  if (checkWrongNetwork(action.id)) {
    alert(`Your are on wrong network. Currently we support these networks ${JSON.stringify(Object.keys(constants.NETWORKS).filter((key) => key !== "LOCAL" && key !== "UNDEFINED"))}`)
    async function changeNetwork(){
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3' }],//if on wrong network giving option to switch to ropsten network.
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

// function checkWrongNetwork(id) {
//   let onWrongNetwork = false
//   if (constants.ACTIVE_NETWORK.id === constants.NETWORKS.LOCAL.id) {
//     onWrongNetwork = parseInt(id, 10) < 1000
//     const allNetworkIds = constants.NETWORKS.map((item) => item);
//     console.log(allNetworkIds)
//   }
//   else {
//     const allNetworkIds = constants.NETWORKS.map((item) => item);
//     console.log(allNetworkIds)
//     console.log("hey soul sister")
//     // onWrongNetwork = Number(constants.ACTIVE_NETWORK.id) !== Number(id) ///first place to consider
//   }

//   return onWrongNetwork
// }
function checkWrongNetwork(id) {
  let onWrongNetwork = false;
  // if (constants.ACTIVE_NETWORK.id === constants.NETWORKS.LOCAL.id) {
  //   onWrongNetwork = Number(id) < 1000;
  // } else {
  let allNetworkIds = Object.keys(constants.ID_TO_NETWORK).map((key)=>Number(key))
  onWrongNetwork = !allNetworkIds.includes(Number(id));
  // }

  // if (onWrongNetwork) {
  //   console.error(
  //     `Heads up, you're on the wrong network!! @bad Please switch to the << ${constants.ACTIVE_NETWORK.name.toUpperCase()} >> network.`
  //   );
  //   console.error(
  //     `1) From November 2 you can turn on privacy mode (off by default) in settings if you don't want to expose your info by default. 2) If privacy mode is turn on you have to authorized metamask to use this page. 3) then refresh.`
  //   );

  //   if (id === constants.NETWORKS.ROPSTEN.id) {
  //     console.error(
  //       `If you want to play on Ropsten, check out https://ropsten.ethernaut.openzeppelin.com/`
  //     );
  //   }
  // }

  return onWrongNetwork;
}
export default setNetwork
