import * as actions from '../actions'
import _ from 'lodash'

export default store => next => action => {
  if(action.type !== actions.SYNC_PLAYER_PROGRESS) return next(action)

  const state = store.getState()
  if(
    !state.network.web3 ||
    !state.contracts.ethernaut ||
    !state.gamedata.levels ||
    !state.player.address
  ) return next(action)

  // Watch LevelCompletedLog
  const log = state.contracts.ethernaut.LevelCompletedLog(
    { player: state.player.address },
    { fromBlock: 0, toBlock: 'latest' }
  )

  log.watch((error, result) => {
    if (error) {
      if (error.message && error.message.includes("TypeError: Cannot read property 'filter' of undefined")) {
        console.error("Ouch! It seems you have run into a known Metamask issue. Try disabling and re-enabling your metamask plugin, and if that doesn't work, I'm afraid you'll need to close all Chrome processes and restart to work around it, until a fix is released. Don't worry, after restarting you should not see this message ever again.");
      } else {
        console.log("Error watching completion events:", error);
      }
      return;
    }

    // Only process if level is not known to be completed
    const levelAddr = result.args.level;
    const knownToBeCompleted = state.player.completedLevels[levelAddr];

    if (!knownToBeCompleted) {
      // Fetch level object given the address and dispatch submit action
      const level = _.find(state.gamedata.levels, l => l.deployedAddress === levelAddr);
      if (!level) {
        console.log("Unexpected address in LevelCompletedLog event (skipping): ", levelAddr);
      } else {
        store.dispatch(actions.submitLevelInstance(level, true))
          .then(() => store.dispatch(actions.checkAllLevelsCompleted()))
      }
    }
  })

  next(action)
}