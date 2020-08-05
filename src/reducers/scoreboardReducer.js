import * as actions from '../actions'

const initialState = {
    scoreBoard: [],
    isLoaded: false
}

export default function(state = initialState, action) {
  let newState = { ...state }
  switch(action.type) {

    case actions.COLLECT_SCOREBOARD:
      if (action.scoreBoard) {
        newState.scoreBoard = action.scoreBoard;
        newState.isLoaded = action.isLoaded;
      }

      break;

    default:
      break;
  }
  return newState;
}