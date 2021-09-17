import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const submitLevelInstance = store => next => async action => {
  if(action.type !== actions.SUBMIT_LEVEL_INSTANCE) return next(action)
  if(action.completed) return next(action)

  const state = store.getState()
  if(
    !state.network.web3 ||
    !state.contracts.ethernaut ||
    !state.contracts.levels[action.level.deployedAddress] ||
    !state.player.address ||
    !state.network.gasPrice
  ) return next(action)

  console.asyncInfo(`@good ${strings.submitLevelMessage}`)

  let completed = await submitLevelInstanceUtil(
    state.contracts.ethernaut,
    action.level.deployedAddress,
    state.contracts.levels[action.level.deployedAddress].address,
    state.player.address,
    state.network.gasPrice
  )
  if(completed) {
    console.victory(`@good ${strings.wellDoneMessage}, ${strings.completedLevelMessage}`)
  }
  else {
    console.error(`@bad ${strings.uncompletedLevelMessage} @bad`)
  }

  action.completed = completed
  next(action)
}

export default submitLevelInstance

async function submitLevelInstanceUtil(ethernaut, levelAddress, instanceAddress, player, gasPrice) {
  return new Promise(async function(resolve) {
    const data = {from: player, gasPrice}
    const tx = await ethernaut.submitLevelInstance(instanceAddress, data);
    if(tx.logs.length === 0) resolve(false)
    else {
      if(tx.logs.length === 0) resolve(false)
      else {
        const log = tx.logs[0].args;
        const ethLevelAddress = log.level;
        const ethPlayer = log.player;
        if(player === ethPlayer && levelAddress === ethLevelAddress) {
          resolve(true)
        }
        else resolve(false)
      }
    }
  });
}