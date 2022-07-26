import * as actions from '../actions';
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'
// import { store, history } from "./../store";
let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const loadGameData = store => next => action => {
  if (action.type !== actions.LOAD_GAME_DATA) return next(action)

  try {
    const network_id = store.getState().network.networkId
    if (network_id) {

      const active_network = constants.ID_TO_NETWORK[network_id]
      console.log("from loadgamedata, network id is", network_id);
      const network = active_network;
      const data = require(`../gamedata/gamedata.json`)
      const deployData = require(`../gamedata/deploy.${network}.json`)
      const levelsIn = data.levels;
      const levelsOut = [];
      for (let i = 0; i < levelsIn.length; i++) {
        const level = levelsIn[i];
        level.deployedAddress = deployData[level.deployId]
        level.idx = i;
        levelsOut.push(level);
      }
      action.ethernautAddress = deployData.ethernaut
      action.levels = levelsOut;
    } else {
      console.log("Network ID is not set until now!")
    }
    // Load levels and add a bit of post processing...

  } catch (e) {
    window.alert(strings.noLevelsDataMessage)
  }

  next(action)
}

export default loadGameData
