import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'
import { getDeployData } from '../utils/deploycontract'
// import { store, history } from "./../store";
let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const loadGameData = store => next => action => {
  if (action.type !== actions.LOAD_GAME_DATA) return next(action)

  try {
    const network_id = store.getState().network.networkId
    if (network_id) {
      const data = require(`../gamedata/gamedata.json`)
      const deployData = getDeployData(network_id);
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
    window.alert(strings.noLevelsDataMessage) //need to do something here more nicer to tell user
  }

  next(action)
}

export default loadGameData
