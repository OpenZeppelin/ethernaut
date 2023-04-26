import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'
import { getGasFeeDetails } from '../utils/ethutil'
import { getPercentageOfLevelsSolvedByPlayer } from '../utils/statsContract'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const submitLevelInstance = store => next => async action => {
  if (action.type !== actions.SUBMIT_LEVEL_INSTANCE) return next(action)
  if (action.completed) return next(action)

  const state = store.getState()
  if (
    !state.network.web3 ||
    !state.contracts.ethernaut ||
    !state.contracts.levels[action.level.deployedAddress] ||
    !state.player.address ||
    !state.network.gasPrice
  ) return next(action)

  console.asyncInfo(`@good ${strings.submitLevelMessage}`)
  const gasFeeDetails = await getGasFeeDetails(state.network, 2)
  let completed = await submitLevelInstanceUtil(
    state.contracts.ethernaut,
    action.level.deployedAddress,
    state.contracts.levels[action.level.deployedAddress].address,
    state.player.address,
    gasFeeDetails
  )
  if (completed) {
    console.victory(`@good ${strings.wellDoneMessage}, ${strings.completedLevelMessage}`);
    const percentage = await getPercentageOfLevelsSolvedByPlayer(state.player.address, state.network.networkId);
    if(percentage) {
      if( Number(percentage) < 51 && Number(percentage) >= 49) {
        console.info(`${strings.FifthyPercentMessage}`)
      } else if ( Number(percentage) < 76 && Number(percentage) > 74) {
        console.info(`${strings.SeventyFivePercentMessage}`)
      } else if ( Number(percentage) < 91 && Number(percentage) > 89) {
        console.info(`${strings.NinetyPercentMessage}`)
      } else if ( Number(percentage) > 99 ) {
        console.info(`${strings.HundredPercentMessage}`)
      }
    }
  }
  else {
    console.error(`@bad ${strings.uncompletedLevelMessage} @bad`)
  }

  action.completed = completed
  next(action)
}

export default submitLevelInstance

async function submitLevelInstanceUtil(ethernaut, levelAddress, instanceAddress, player, gasFeeDetails) {
  try {
    const data = { from: player, ...gasFeeDetails }
    const tx = await ethernaut.submitLevelInstance(instanceAddress, data);
    if (tx.logs.length === 0) return false
    else {
      if (tx.logs.length === 0) return false
      else {
        const log = tx.logs[0].args;
        const ethLevelAddress = log.level;
        const ethPlayer = log.player;
        if (player === ethPlayer && levelAddress === ethLevelAddress) {
          return true
        }
        else return false
      }
    }
  } catch (error) {
    console.error(error)
    return false
  }
}
