import * as ethutil from '../utils/ethutil'
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

export default store => next => action => {
  if(action.type !== actions.SET_PLAYER_ADDRESS) return next(action)

  const state = store.getState()

  // Full reload if player existed and is changing
  if(state.player.address) {
    document.location.reload()
  }

  if(!action.address) {
    console.error(`@bad ${strings.noPlayerAddressMessage}`)
    return
  }

  window.player = action.address
  console.info(`${strings.playerAddressMessage}\n${action.address}`)

  // Warn about 0 balance
  ethutil.getBalance(action.address)
    .then(balance => {
      if(balance === '0') {
        console.warn(`@bad ${strings.noEthersMessage}`)
      }
    })

  next(action)
}
