import * as actions from '../actions'

export default store => next => async action => {
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

  console.asyncInfo(`@good Submitting level instance...`)

  let completed = await submitLevelInstance(
    state.contracts.ethernaut,
    action.level.deployedAddress,
    state.contracts.levels[action.level.deployedAddress].address,
    state.player.address,
    state.network.gasPrice
  )
  if(completed) {
    console.victory(`@good Well done`, `You have completed this level!!!`)
  }
  else {
    console.error(`
    *!@#(*&(@!(#*&(*$&!@#(*&(%@)#$(!@)#(*!@)(#@!(*^#(&()%*)#@(*!@)#(*&
    @bad Oops! Looks like you haven't cracked this level just yet @bad
    *&@#$(*!@_#)(+!@)_*$(@!$_)&*&%!@#$_)@(#_)@_)#(@(#)&(*$^#*&%^#$)(#@
    `)
  }

  action.completed = completed
  next(action)
}

async function submitLevelInstance(ethernaut, levelAddress, instanceAddress, player, gasPrice) {
  return new Promise(async function(resolve) {
    const data = {from: player, gasPrice}
    console.log("Tx", levelAddress, instanceAddress, player, gasPrice);
    const tx = await ethernaut.methods.submitLevelInstance(instanceAddress).send(data);
    console.log("Tx");
    console.log(tx);
    if(Object.keys(tx.events).length === 0) resolve(false)
    else {
      const log = tx.events.LevelCompletedLog.returnValues;
      const ethLevelAddress = log.level;
      const ethPlayer = log.player;
      if(player === ethPlayer && levelAddress === ethLevelAddress) {
        resolve(true)
      }
      else resolve(false)
    }
  });
}