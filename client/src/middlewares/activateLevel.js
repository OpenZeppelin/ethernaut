import _ from 'lodash'
import Web3 from 'web3';
import { push } from 'react-router-redux'
import * as actions from '../actions';
import * as constants from '../constants';

import { loadTranslations } from '../utils/translations'
import { onPredeployedNetwork } from './setNetwork';
import { getLevelKey, isLocalDeployed } from '../utils/contractutil';

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)
var levels = require(`../gamedata/gamedata.json`).levels;

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
  const key = canDeploy && getLevelKey(action.address)
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
    alert('here')
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