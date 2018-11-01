import * as actions from '../actions'
import * as constants from '../constants'

export default store => next => action => {
    if(action.type !== actions.LOAD_GAME_DATA) return next(action)

    try {

      // Load levels and add a bit of post processing...
      const network = constants.ACTIVE_NETWORK.name;
      const data = require(`../../gamedata/gamedata.json`)
      const deployData = require(`../../gamedata/deploy.${network}.json`)
      const levelsIn = data.levels;
      const levelsOut = [];
      for(let i = 0; i < levelsIn.length; i++) {
        const level = levelsIn[i];
        level.deployedAddress = deployData[level.deployId]
        level.idx = i;
        levelsOut.push(level);
      }

      action.ethernautAddress = deployData.ethernaut;
      action.aliasAddress = deployData.alias;
      action.levels = levelsOut;
    } catch(e) {
      window.alert('cannot find levels data')
    }

    next(action)
}
