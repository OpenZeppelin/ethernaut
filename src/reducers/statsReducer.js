import * as actions from '../actions'

const initialState = {
  createdInstanceLogs: [],
  completedLevelLogs: []
}

export default function(state = initialState, action) {
  let newState = { ...state }
  switch(action.type) {

    case actions.COLLECT_STATS:
      if(action.createdInstanceLogs) {
        newState.createdInstanceLogs = action.createdInstanceLogs
      }
      if(action.completedLevelLogs) {
        newState.completedLevelLogs = action.completedLevelLogs
      }
      break

    default:
      break
  }
  return newState;
}