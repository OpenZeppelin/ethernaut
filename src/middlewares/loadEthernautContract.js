import * as ethutil from '../utils/ethutil'
import * as actions from '../actions'
import EthernautABI from '../../build/contracts/Ethernaut.sol/Ethernaut.json'

export default store => next => action => {
  if(action.type !== actions.LOAD_ETHERNAUT_CONTRACT) return next(action)
  if(action.contract !== undefined) return next(action)

  const state = store.getState()
  if(
    !state.network.web3 ||
    !state.player.address ||
    !state.gamedata.ethernautAddress
  ) {
    // console.log(`UNABLE TO LOAD ETHERNAUT`)
    return next(action)
  }
  // console.log(`GETTING ETHERNAUT...`, state.gamedata.ethernautAddress)

  // Get contract template
  const Ethernaut = ethutil.getTruffleContract(
    EthernautABI,
    {
      from: state.player.address,
      gasPrice: state.network.gasPrice
    }
  )

  // Get deployed instance
  Ethernaut.at(state.gamedata.ethernautAddress)
    .then(instance => {

      console.info(`=> Ethernaut address\n${instance.address}`)

      // for player interaction via the browser's console
      window.ethernaut = instance

      action.contract = instance
      next(action)

      // Get game data
      store.dispatch(actions.syncLevelProgress())

      // Auto-restore previoius instance
      if(state.gamedata.activeLevel)
        store.dispatch(actions.loadLevelInstance(state.gamedata.activeLevel, true))
    })
    .catch(() => {
      console.error(`@bad Ethernaut contract not found in the current network. Please make sure (1) that you are using metamask, (2) that it's on the rinkeby testnet, (3) that it is unlocked, (4 optional) From November 2 you can turn ON privacy mode (OFF by default) in Metamask settings if you don't want to expose your info by default. (5 optional) If privacy mode is turn ON you have to authorized metamask to use this page. and (6) then refresh.`)
    })
}
