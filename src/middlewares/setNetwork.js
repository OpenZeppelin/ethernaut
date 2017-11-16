import * as actions from '../actions'
import * as constants from '../constants'

let wasOnWrongNetwork = false

export default store => next => action => {
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
  if(constants.ACTIVE_NETWORK.id === constants.NETWORKS.DEVELOPMENT.id) {
    onWrongNetwork = parseInt(id, 10) < 1000
  }
  else {
    onWrongNetwork = constants.ACTIVE_NETWORK.id !== id
  }

  return onWrongNetwork
}