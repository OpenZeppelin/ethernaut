import _ from 'lodash'
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const syncPlayerProgresses = store => next => action => {
  if(action.type !== actions.SYNC_PLAYER_PROGRESS) return next(action)

  const state = store.getState()
  if(
    !state.network.web3 ||
    !state.contracts.ethernaut ||
    !state.gamedata.levels ||
    !state.player.address
  ) return next(action)

  // Watch LevelCompletedLog
  const log = state.contracts.ethernaut.LevelCompletedLog({
    filter: { player: state.player.address }
  });

  log.on('error', (error) => {
    if (error) {
      if (error.message && error.message.includes("TypeError: Cannot read property 'filter' of undefined")) {
        console.error(strings.metamaskKnownIssue);
      } else {
        console.log(strings.eventsCompletionMessage, error);
      }
    }
  })

  log.on('data', (result) => {
    // Only process if level is not known to be completed
    const levelAddr = result.args.level;
    const knownToBeCompleted = state.player.completedLevels[levelAddr];

    if (!knownToBeCompleted) {
      // Fetch level object given the address and dispatch submit action
      const level = _.find(state.gamedata.levels, l => l.deployedAddress === levelAddr);
      if (!level) {
        console.log(strings.unexpectedAddressMessage, levelAddr);
      } else {
        store.dispatch(actions.submitLevelInstance(level, true))
      }
    }
  })

  next(action)
}

export default syncPlayerProgresses