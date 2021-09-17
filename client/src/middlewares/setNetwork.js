import * as actions from '../actions';
import * as constants from '../constants';

let wasOnWrongNetwork = false

const setNetwork = store => next => action => {
  if(action.type !== actions.SET_NETWORK_ID) return next(action)

  // console.log(`ID`, action.id)
  if(checkWrongNetwork(action.id)) {
    wasOnWrongNetwork = true
  }
  else if(wasOnWrongNetwork) {
    document.location.reload()
  }

  next(action)
}

function checkWrongNetwork(id) {
  let onWrongNetwork = false
  if(constants.ACTIVE_NETWORK.id === constants.NETWORKS.LOCAL.id) {
    onWrongNetwork = parseInt(id, 10) < 1000
  }
  else {
    onWrongNetwork = Number(constants.ACTIVE_NETWORK.id) !== Number(id)
  }

  return onWrongNetwork
}

export default setNetwork
