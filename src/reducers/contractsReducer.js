import * as actions from '../actions'

const initialState = {
  ethernaut: undefined,
  levels: {},
  nonce: 0
}

export default function(state = initialState, action) {
  switch(action.type) {

    case actions.LOAD_ETHERNAUT_CONTRACT:
      return {
        ...state,
        ethernaut: action.contract
      };

    case actions.LOAD_LEVEL_INSTANCE:
      return {
        ...state,
        levels: {
          ...state,
          [action.level.deployedAddress]: action.instance
        },
        nonce: state.nonce + 1
      }

    case actions.SUBMIT_LEVEL_INSTANCE:
      if(action.completed) {
        return {
          ...state,
          levels: {
            ...state,
            [action.level.deployedAddress]: undefined
          },
          nonce: state.nonce + 1
        }
      }
      else return state

    default:
      return state
  }
}