import _ from 'lodash'
import { push } from 'react-router-redux'
import * as actions from '../actions';
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const activateLevel = store => next => action => {
  if(action.type !== actions.ACTIVATE_LEVEL) return next(action)

  const state = store.getState()
  if(
    !state.gamedata.levels
  ) return next(action)

  // Deactivate previous
  if(state.gamedata.activeLevel) {
    store.dispatch(actions.deactivateLevel(state.gamedata.activeLevel))
  }

  // Find level from deployed level address
  const activeLevel = _.find(
    state.gamedata.levels,
    level => level.deployedAddress === action.address
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
  if(!activeLevel) {
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