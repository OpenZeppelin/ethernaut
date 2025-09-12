import * as actions from '../actions';

const setGameReadOnly = store => next => action => {
  if (action.type !== actions.SET_GAME_READ_ONLY) return next(action)

}

export default setGameReadOnly
