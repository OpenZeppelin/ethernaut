import * as actions from '../actions';
import * as constants from '../constants';
import { isLocalDeployed, restoreContract } from '../utils/contractutil';
import { loadTranslations } from '../utils/translations'
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

const getDeployData = (networkId) => {
  const active_network = constants.ID_TO_NETWORK[networkId];
  const network = active_network;
  let gameData = {};

  try {
    // try importing the game data file
    gameData = require(`../gamedata/deploy.${network}.json`);
  } catch (err) {
    // if there's an error then check localstorage if data exists for this chain
    if(!isLocalDeployed(networkId)) throw new Error();
    gameData = restoreContract(networkId);
  }

  return gameData;
};

export default loadGameData
