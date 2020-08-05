import * as actions from '../actions';
import _ from 'lodash';

let queuedAction;

export default store => next => async action => {
  if (action.type !== actions.COLLECT_SCOREBOARD) {
    if (queuedAction && action.type === actions.LOAD_ALIAS_CONTRACT && action.alias) {
      next(action);
      store.dispatch(queuedAction);
      queuedAction = null;
      return;
    }
    return next(action);
  }

  if (!action.scoreBoard) {
    const state = store.getState();
    const scoreCalculation = 100;

    if (!state.network.web3 || !state.contracts.ethernaut || !state.contracts.alias) {
      if (!queuedAction) queuedAction = action;

      return;
    }    

    const query = {
      filter: {},
      range: {
        fromBlock: 0,
        toBlock: state.network.blockNum || 'latest'
      }
    }

    const logsResults = await Promise.all([getLogs(state.contracts.ethernaut.LevelCompletedLog(query.filter, query.range)),
      getLogs(state.contracts.alias.AliasSetLog(query.filter, query.range))]);

    const playerData = getPlayerData(logsResults[0], getGameData(), getPlayerAlias(logsResults[1]));

    action.scoreBoard = _.orderBy(Array.from(playerData.values()), ['score', 'lastBlock', 'firstBlock', 'player'], ['desc', 'asc', 'asc', 'asc']);
    action.isLoaded = true;
    store.dispatch(action);

    function getLogs(logFunction) {
      return new Promise(function (resolve) {
        logFunction.get((error, result) => {
          if (error) {
            console.log(error);
            return resolve(false);
          }

          return resolve(result);
        });
      });
    }

    function getPlayerAlias(aliasLogs) {
      let playerAlias = new Map();
      for (let i = 0; i < aliasLogs.length; i++) {
        let record = aliasLogs[i];
        let tempAlias = state.network.web3.toAscii(record.args.alias).replace(/\u0000/g, '');
        playerAlias.set(record.args.player, tempAlias.length > 0 ? tempAlias : record.args.player);
      }

      return playerAlias;
    }

    function getGameData() {
      let gameData = new Map();

      let levels = state.gamedata.levels;
      for (let i = 0; i < levels.length; i++) {
        if (levels[i].difficulty == 0) continue;

        gameData.set(levels[i].deployedAddress, parseInt(levels[i].difficulty) * scoreCalculation);
      }

      return gameData;
    }

    function getPlayerData(levelCompletedLogs, gameData, playerAlias) {
      let playerData = new Map();

      for (let i = 0; i < levelCompletedLogs.length; i++) {
        let record = levelCompletedLogs[i];
        let level = record.args.level;
        let player;

        // level doesn't have a score associated with it
        if (!gameData.has(level)) continue;

        // get the player
        if (playerData.has(record.args.player))
          player = playerData.get(record.args.player);
        else {
          player = { player: record.args.player, levels: new Map(), score: 0, firstBlock: record.blockNumber, lastBlock: record.blockNumber, 
            alias: playerAlias.has(record.args.player) ? playerAlias.get(record.args.player) : record.args.player };
          playerData.set(player.player, player);
        }

        // don't count duplicate levels
        if (player.levels.has(level)) continue;

        player.levels.set(level, true);

        player.score += gameData.get(level);
        player.lastBlock = record.blockNumber;
      }

      return playerData;
    }
  }

  next(action);
}