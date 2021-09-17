import * as actions from '../actions';
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const loadGameData = store => next => action => {
  if(action.type !== actions.LOAD_GAME_DATA) return next(action)

  try {

    // Load levels and add a bit of post processing...
    const network = constants.ACTIVE_NETWORK.name;
    const data = require(`../gamedata/gamedata.json`)
    const deployData = require(`../gamedata/deploy.${network}.json`)
    const levelsIn = data.levels;
    const levelsOut = [];
    for(let i = 0; i < levelsIn.length; i++) {
      const level = levelsIn[i];
      level.deployedAddress = deployData[level.deployId]
      level.idx = i;
      levelsOut.push(level);
    }
    action.ethernautAddress = deployData.ethernaut
    action.levels = levelsOut;
  } catch(e) {
    window.alert(strings.noLevelsDataMessage)
  }

  next(action)
}

export default loadGameData
