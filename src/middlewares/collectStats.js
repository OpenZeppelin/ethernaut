import * as actions from '../actions'

let queuedAction;

export default store => next => action => {
  if(action.type !== actions.COLLECT_STATS) {
    if(queuedAction && action.type === actions.LOAD_ETHERNAUT_CONTRACT && action.contract) {
      // console.log(`RETRIGGER`)
      next(action)
      store.dispatch(queuedAction)
      queuedAction = null
      return
    }
    return next(action)
  }

  const state = store.getState()
  // console.log(`TRY COLLECT_STATS >`, state.contracts.ethernaut !== undefined)
  if(
    !state.network.web3 ||
    !state.contracts.ethernaut
  ) {
    if(!queuedAction) queuedAction = action
    return
  }

  const query = {
    filter: {},
    range: {
      fromBlock: 0,
      toBlock: state.network.blockNum || 'latest'
    }
  }
  // console.log(`query`, query)

  // Get Level created
  if(!action.createdInstanceLogs) {
    const instanceCreatedLog = state.contracts.ethernaut.LevelInstanceCreatedLog(query.filter, query.range)
    instanceCreatedLog.get((error, result) => {
      if(error) return console.log(error)
      // console.log(`instance log result`, result, error)
      action.createdInstanceLogs = result
      store.dispatch(action)
    })
  }

  // Level completed
  if(!action.completedLevelLogs) {
    const levelCompletedLog = state.contracts.ethernaut.LevelCompletedLog(query.filter, query.range)
    levelCompletedLog.get((error, result) => {
      if(error) return console.log(error)
      // console.log(`completed log result:`, result, error)
      action.completedLevelLogs = result
      store.dispatch(action)
    })
  }

  next(action)
}