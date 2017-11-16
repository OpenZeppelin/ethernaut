import * as actions from '../actions'
import * as constants from '../constants'

const initialState = {
  address: undefined,
  completedLevels: {},
  emittedLevels: {}
}

export default function(state = initialState, action) {
  let newState;
  switch(action.type) {

    case actions.CHECK_ALL_COMPLETED:
      newState = {
        ...state,
        allLevelsCompleted: action.allCompleted
      }
      break

    case actions.SET_PLAYER_ADDRESS:
      newState = restorePlayer(action.address) || { ...state, address: action.address }
      break

    case actions.LOAD_LEVEL_INSTANCE:
      newState = {
        ...state,
        emittedLevels: {
          ...state.emittedLevels,
          [action.level.deployedAddress]: action.instance.address
        }
      }
      cachePlayer(newState)
      break

    case actions.SUBMIT_LEVEL_INSTANCE:
      if(action.completed) {
        newState = {
          ...state,
          completedLevels: {
            ...state.completedLevels,
            [action.level.deployedAddress]: action.completed
          }
        }
        cachePlayer(newState)
      }
      else newState = state
      break

    default:
      newState = state;
  }
  return newState
}

function cachePlayer(data) {
  if(data.address) {
    const key = constants.STORAGE_PLAYER_DATA_KEY + data.address
    // console.log(`CACHE PLAYER`, key, data)
    window.localStorage.setItem(key, JSON.stringify(data))
  }
}

function restorePlayer(address) {
  const key = constants.STORAGE_PLAYER_DATA_KEY + address
  const data = JSON.parse(window.localStorage.getItem(key))
  // console.log(`RESTORE PLAYER`, key, data)
  return data
}