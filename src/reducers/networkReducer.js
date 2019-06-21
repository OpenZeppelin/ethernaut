import * as actions from '../actions'

const initialState = {
  web3: null,
  gasPrice: 20000000,
  blockNum: null,
  networkId: null
}

export default function(state = initialState, action) {
  switch(action.type) {

    case actions.CONNECT_WEB3:
      return { ...state, web3: action.web3 }

    case actions.SET_GAS_PRICE:
      return { ...state, gasPrice: action.gasPrice }

    case actions.SET_NETWORK_ID:
      return { ...state, networkId: action.id }

    case actions.SET_BLOCK_NUM:
      return { ...state, blockNum: action.blockNum }

    default:
      return state;
  }
}