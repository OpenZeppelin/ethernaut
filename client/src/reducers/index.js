import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import networkReducer from './networkReducer'
import gamedataReducer from './gamedataReducer'
import playerReducer from './playerReducer'
import contractsReducer from './contractsReducer'
import statsReducer from './statsReducer'
import languageReducer from './languageReducer'

const reducer = combineReducers({
  routing: routerReducer,
  network: networkReducer,
  gamedata: gamedataReducer,
  player: playerReducer,
  contracts: contractsReducer,
  stats: statsReducer,
  lang: languageReducer,
});

export default reducer;