import * as actions from '../actions'
import * as constants from '../constants'

export default store => next => action => {
    if(action.type !== actions.LOAD_GAME_DATA) return next(action)

    try {

      // Load levels and add a bit of post processing...
      // console.log(`NETWORK NAME:`, constants.ACTIVE_NETWORK.name)
      // console.log(`LEVELS URL:`, `../../levels/levels-${constants.ACTIVE_NETWORK.name}.json`)
      const data = require(`../../gamedata/gamedata.json`)
      const levelsIn = data.ethernaut.levels;
      // console.log(`LEVELS DATA:`, levelsIn)
      const levelsOut = [];
      for(let i = 0; i < levelsIn.length; i++) {
        const level = levelsIn[i];
        level.deployedAddress = level[`deployed_${constants.ACTIVE_NETWORK.name}`][0]
        level.idx = i;
        levelsOut.push(level);
      }
      action.ethernautAddress = data.ethernaut[`deployed_${constants.ACTIVE_NETWORK.name}`][0]
      action.levels = levelsOut;
      // console.log(`LEVELS DATA (out):`, levelsOut, data.ethernautAddress)
    } catch(e) {
      window.alert('cannot find levels data')
    }

    next(action)
}