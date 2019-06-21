import * as constants from './constants';

import { applyMiddleware, compose, createStore } from 'redux';

import { BrowserRouter } from 'react-router-dom';
import activateLevel from './middlewares/activateLevel';
import collectStats from './middlewares/collectStats';
import { createLogger } from 'redux-logger';
import loadEthernautContract from './middlewares/loadEthernautContract';
import loadGamedata from './middlewares/loadGamedata';
import loadLevelInstance from './middlewares/loadLevelInstance';
import reducer from './reducers';
import { routerMiddleware } from 'react-router-redux';
import setNetwork from './middlewares/setNetwork';
import setPlayerAddress from './middlewares/setPlayerAddress';
import submitLevelInstance from './middlewares/submitLevelInstance';
import syncPlayerProgress from './middlewares/syncPlayerProgress';
import thunkMiddleware from 'redux-thunk';

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
  thunkMiddleware,
  routerMiddleware(BrowserRouter),
];
if (constants.DEBUG_REDUX) {
  middlewares.splice(0, 0, createLogger({ collapsed: true }));
}

// Store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

/* eslint-enable */
