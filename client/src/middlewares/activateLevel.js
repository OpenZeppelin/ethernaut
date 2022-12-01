import _ from 'lodash'
import { push } from 'react-router-redux'
import * as actions from '../actions';
import * as constants from '../constants';

import { loadTranslations } from '../utils/translations'
import { onPredeployedNetwork } from './setNetwork';
import { getLevelKey, isLocalDeployed } from '../utils/contractutil';

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const activateLevel = store => next => action => {
  if(action.type !== actions.ACTIVATE_LEVEL) return next(action)
  const state = store.getState()
  const network_id = state.network.networkId

  if(
    !state.gamedata.levels
  ) return next(action)

  // Deactivate previous
  if(state.gamedata.activeLevel) {
    store.dispatch(actions.deactivateLevel(state.gamedata.activeLevel))
  }
  // confirm youre not on a predeployed chain and you've deployed cores locally
  const canDeploy = !onPredeployedNetwork(network_id) && isLocalDeployed(network_id)
  // Find level from deployed level address
  // -- check if the prop is a valid eth address or a number
  // -- if it is a number then match level based on number
  // -- make sure you can only index by id when you are on a chain you can deploy to
  const key = canDeploy ? getLevelKey(action.address) : "deployedAddress"
  const activeLevel = _.find(
    state.gamedata.levels,
    level => +level[key] === +action.address
  )

  if(constants.CLEAR_CONSOLE && constants.CUSTOM_LOGGING && activeLevel) {
    console.clear()
  }
  if(activeLevel) console.greet(activeLevel.name)
  console.secret(strings.typeHelpMessage)
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  if(isChrome) {
    console.quiet(strings.slowNetworkMessage)
  }

  // Remove contract reference
  window.contract = strings.notContractSetMessage
  window.instance = undefined

  // -> 404
  if(!activeLevel || !isLocalDeployed(network_id)) {
    store.dispatch(push(constants.PATH_NOT_FOUND))
    return
  }

  // Auto-restore previous instance
  if(state.contracts.ethernaut)
    store.dispatch(actions.loadLevelInstance(activeLevel, true, false))

  window.level = activeLevel.deployedAddress;
  console.info(`=> ${strings.levelAddressMessage}\n${activeLevel.deployedAddress}`)

  action.activeLevel = activeLevel;
  next(action)
}

export default activateLevel