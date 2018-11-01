import * as actions from '../actions'

const initialState = {
  ethernautAddress: undefined,
  aliasAddress: undefined,
  activeLevel: undefined,
  levels: []
}

export default function(state = initialState, action) {
  switch(action.type) {

    case actions.LOAD_GAME_DATA:
      return {
        ...state,
        levels: action.levels,
        ethernautAddress: action.ethernautAddress,
        aliasAddress: action.aliasAddress
      }

    case actions.ACTIVATE_LEVEL:
      return {
        ...state,
        activeLevel: action.activeLevel
      }

    case actions.DEACTIVATE_LEVEL:
      return {
        ...state,
        activeLevel: undefined
      }

    default:
      return state
  }
}