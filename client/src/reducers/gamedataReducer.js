import * as actions from '../actions';

const initialState = {
  readOnly: false,
  ethernautAddress: undefined,
  activeLevel: undefined,
  levels: []
}

const gameDataReducer = function(state = initialState, action) {
  switch(action.type) {

    case actions.SET_GAME_READ_ONLY:
      return {
        ...state,
        readOnly: action.readOnly
      }

    case actions.LOAD_GAME_DATA:
      return {
        ...state,
        levels: action.levels,
        ethernautAddress: action.ethernautAddress
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

export default gameDataReducer