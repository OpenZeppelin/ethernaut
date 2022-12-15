import * as actions from '../actions';
import { getLevelsSolvedByPlayer, checkIfPlayerExist } from '../utils/statsContract';

const syncPlayerProgress = store => next => async action => {
  if (action.type !== actions.SYNC_PLAYER_PROGRESS) return next(action)

  const state = store.getState()

  if(
    !state.network.networkId ||
    !state.player.address
  ) return next(action)

  const playerExist = await checkIfPlayerExist(state.player.address, state.network.networkId)

  if (!playerExist) { 
    return next(action)
  }

  const levelAddresses = await getLevelsSolvedByPlayer(state.player.address, state.network.networkId)

  if (levelAddresses.length === 0) { 
    return next(action)
  }
  
  let completedLevels = {}

  for (let levelAddress of levelAddresses) { 
    completedLevels[levelAddress] = true;
  }

  action.completedLevels = completedLevels

  return next(action)
}


export default syncPlayerProgress