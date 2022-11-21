import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'
import * as constants from "../constants";

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
  const gasDetails = await getGasDetails(state.network)
  let completed = await submitLevelInstanceUtil(
    state.contracts.ethernaut,
    action.level.deployedAddress,
    state.contracts.levels[action.level.deployedAddress].address,
    state.player.address,
    gasDetails
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

async function submitLevelInstanceUtil(ethernaut, levelAddress, instanceAddress, player, gasDetails) {
  try {
    const data = { from: player, ...gasDetails }
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

const getGasDetails = async (network) => {
  if (
    network.networkId.toString() === constants.NETWORKS.MUMBAI.id ||
    network.networkId.toString() === constants.NETWORKS.SEPOLIA.id ||
    network.networkId.toString() === constants.NETWORKS.GOERLI.id
  ) {
    const maxPriorityFeePerGas = network.web3.utils.toWei('2.5', 'gwei');
    const block = await network.web3.eth.getBlock('latest')
    const blockBaseFee = block.baseFeePerGas ? block.baseFeePerGas : 1;
    return {
      maxPriorityFeePerGas,
      maxFeePerGas: 2 * Number(blockBaseFee) + Number(maxPriorityFeePerGas)
    }
  } else { 
    return {
      gasPrice: network.gasPrice
    }
  }
} 