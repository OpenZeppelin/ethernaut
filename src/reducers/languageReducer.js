import * as actions from '../actions'

const initialState = {
    lang: 'en'
}

export default function(state = initialState, action) {
  switch(action.type) {

    case actions.SET_LANG:
      return { ...state, lang: action.lang }

    default:
      return state;
  }
}