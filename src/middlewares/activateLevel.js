import * as actions from '../actions'
import * as constants from '../constants'
import _ from 'lodash'
import { push } from 'react-router-redux'

export default store => next => action => {
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
  console.secret(`Type help() for a listing of custom web3 addons`)
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  if(isChrome) {
    console.quiet(`Annoying 'Slow network detected' message? Try Dev Tools settings -> User messages only or disable 'chrome://flags/#enable-webfonts-intervention-v2'`)
  }

  // Remove contract reference
  window.contract = `No contract set, go to a level and click 'Get new instance'`
  window.instance = undefined

  // -> 404
  if(!activeLevel) {
    store.dispatch(push(constants.PATH_NOT_FOUND))
    return
  }

  // Auto-restore previoius instance
  if(state.contracts.ethernaut)
    store.dispatch(actions.loadLevelInstance(activeLevel, true))

  window.level = activeLevel.deployedAddress;
  console.info(`=> Level address\n${activeLevel.deployedAddress}`)

  action.activeLevel = activeLevel;
  next(action)
}