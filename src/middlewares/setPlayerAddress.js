import * as actions from '../actions'
import * as ethutil from '../utils/ethutil'

export default store => next => action => {
  if(action.type !== actions.SET_PLAYER_ADDRESS) return next(action)

  const state = store.getState()

  // Full reload if player existed and is changing
  if(state.player.address) {
    document.location.reload()
  }

  if(!action.address) {
    console.error(`@bad No player address detected! Make sure that 1) You've installed the metamask browser extension and 2) that it's unlocked.`)
    return
  }

  window.player = action.address
  console.info(`=> Player address\n${action.address}`)

  // Warn about 0 balance
  ethutil.getBalance(action.address)
    .then(balance => {
      if(balance === '0') {
        console.warn(`@bad Yikes, you have no ether! Get some at https://faucet.metamask.io/`)
      }
    })

  next(action)
}