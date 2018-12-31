import * as actions from "../actions";
import _ from "lodash";

export default store => next => action => {
  if (action.type !== actions.SYNC_PLAYER_PROGRESS) return next(action);

  const state = store.getState();
  if (
    !state.network.web3 ||
    !state.contracts.ethernaut ||
    !state.gamedata.levels ||
    !state.player.address
  )
    return next(action);

  // Subscribe to levelCompletedLog to check if player has completed the level before
  state.contracts.ethernaut.events
    .LevelCompletedLog(
      { player: state.player.address },
      { fromBlock: 0, toBlock: "latest" }
    )
    .on("data", function(result) {
      const levelAddr = result.returnValues.level;
      const playerAddr = result.returnValues.player;
      const knownToBeCompleted = state.player.completedLevels[levelAddr];

      if (!knownToBeCompleted) {
        // Fetch level object given the address and dispatch submit action
        const level = _.find(
          state.gamedata.levels,
          l => l.deployedAddress === levelAddr
        );
        if (!level) {
          console.log(
            "Unexpected address in LevelCompletedLog event (skipping): ",
            levelAddr
          );
        } else {
          if (playerAddr === state.player.address) {
            store.dispatch(actions.submitLevelInstance(level, true));
          }
        }
      }
    });

  next(action);
};
