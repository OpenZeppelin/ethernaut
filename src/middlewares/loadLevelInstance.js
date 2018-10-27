import * as ethutil from '../utils/ethutil'
import * as actions from '../actions'

export default store => next => action => {
  if(action.type !== actions.LOAD_LEVEL_INSTANCE) return next(action)

  const state = store.getState()
  if(
    !state.network.web3 ||
    !state.contracts.ethernaut ||
    !state.player.address
  ) return next(action)

  // Recover old instance address from local cache?
  let instanceAddress
  if(action.instanceAddress) instanceAddress = action.instanceAddress
  else if(action.reuse) {
    const cache = state.player.emittedLevels[action.level.deployedAddress]
    if(cache) instanceAddress = cache
  }

  // Get a new instance address
  if(!instanceAddress && !action.reuse) {
    console.asyncInfo(`@good Requesting new instance from level...`)

    const showErr = function(error) {
      console.error('@bad Unable to retrieve level instance! Please check gas amount and try again.', error || '')
    }

    // const estimate = await state.contracts.ethernaut.getLevelInstance.estimateGas(action.level.deployedAddress)
    const estimate = parseInt(action.level.instanceGas, 10) || 2000000
    const deployFunds = state.network.web3.toWei(parseInt(action.level.deployFunds, 10), 'ether')
    state.contracts.ethernaut.createLevelInstance(action.level.deployedAddress, {
      gas: estimate,
      gasPrice: 2 * state.network.gasPrice,
      from: state.player.address,
      value: deployFunds
    })
      .then(tx => {
        console.dir(tx)
        instanceAddress = tx.logs[0].args.instance;
        if(tx.logs.length > 0) {
          action.instanceAddress = instanceAddress
          store.dispatch(action)
        }
        else {
          showErr('tx contains no logs')
        }
      })
      .catch(error => {
        showErr(error)
      })
    return
  }

  // Get instance from address
  if(!instanceAddress) return
  console.info(`=> Instance address\n${instanceAddress}`)
  const Instance = ethutil.getTruffleContract(
    require(`../../build/contracts/${withoutExtension(action.level.instanceContract)}.json`),
    {
      from: state.player.address,
      gasPrice: 2 * state.network.gasPrice
    }
  )
  Instance.at(instanceAddress)
    .then(instance => {
      window.instance = instance.address;
      window.contract = instance;
      action.instance = instance;
      next(action);
    })
    .catch(err => {
      console.log(`Error: ${err}, retrying...`);
      setTimeout(() => {
        store.dispatch(action);
      }, 1000);
    })
}

// ----------------------------------
// Utils
// ----------------------------------

function withoutExtension(str) {
  return str.split('.')[0]
}
