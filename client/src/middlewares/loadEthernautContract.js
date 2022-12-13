import * as ethutil from '../utils/ethutil'
import EthernautABI from 'contracts/build/contracts/Ethernaut.sol/Ethernaut.json'
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const loadEthernautContract = store => next => action => {
  if (action.type !== actions.LOAD_ETHERNAUT_CONTRACT) return next(action)
  if (action.contract !== undefined) return next(action)

  const state = store.getState()
  if (
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

      console.info(`=> ${strings.ethernautAddressMessage}\n${instance.address}`)

      // for player interaction via the browser's console
      window.ethernaut = instance

      action.contract = instance

      // Get game data
      store.dispatch(actions.syncPlayerProgress())

      // Auto-restore previoius instance
      if (state.gamedata.activeLevel)
        store.dispatch(actions.loadLevelInstance(state.gamedata.activeLevel, true, false))

      next(action)
    })
    .catch((err) => {
      console.log({err})
      console.error(`@bad ${strings.ethernautNotFoundMessage}`)
    })
}

export default loadEthernautContract