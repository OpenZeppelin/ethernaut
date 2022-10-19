/* eslint-disable no-underscore-dangle */

import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
//import { browserHistory } from 'react-router';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';

import loadEthernautContract from './middlewares/loadEthernautContract'
import loadGamedata from './middlewares/loadGamedata'
import loadLevelInstance from './middlewares/loadLevelInstance'
import submitLevelInstance from './middlewares/submitLevelInstance'
import activateLevel from './middlewares/activateLevel'
import setPlayerAddress from './middlewares/setPlayerAddress'
import setNetwork from './middlewares/setNetwork'
import syncPlayerProgress from './middlewares/syncPlayerProgress'
import collectStats from './middlewares/collectStats'
import setLanguage from './middlewares/setLanguage';
import { createBrowserHistory } from 'history';
import * as constants from '../src/constants';

export const history = createBrowserHistory();

const middlewares = [
  loadGamedata,
  loadEthernautContract,
  loadLevelInstance,
  submitLevelInstance,
  activateLevel,
  setPlayerAddress,
  setNetwork,
  syncPlayerProgress,
  collectStats,
  setLanguage,
  thunkMiddleware,
  routerMiddleware(history)
];
if(constants.DEBUG_REDUX) {
  middlewares.splice( 0, 0, createLogger({collapsed: true}) )
}

// Store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

/* eslint-enable */