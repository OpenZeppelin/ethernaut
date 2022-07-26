import * as actions from '../actions';
import * as constants from '../constants';

let wasOnWrongNetwork = false

const setNetwork = store => next => action => {
  if (action.type !== actions.SET_NETWORK_ID) return next(action)

  // console.log(`ID`, action.id)
  if (checkWrongNetwork(action.id)) {
    wasOnWrongNetwork = true
  }
  else if (wasOnWrongNetwork) {
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
  onWrongNetwork = !constants.ACTIVE_NETWORK.includes(Number(id));
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
