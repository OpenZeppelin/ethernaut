require('./utils/^^');
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { Router, Route, IndexRoute } from 'react-router';

import * as ethutil from './utils/ethutil'
import * as actions from './actions'
import * as constants from './constants'

import App from './containers/App';
import Home from './containers/Home';
import Level from './containers/Level';
import Help from './containers/Help';
import Stats from './containers/Stats';
import NotFound404 from './components/NotFound404';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './styles/app.css';

// Initial actions
store.dispatch(actions.loadGamedata())

// View entry point.
ReactDOM.render(
  <Provider store={store}>
    <Router history={syncHistoryWithStore(browserHistory, store)}>
      <Route path={constants.PATH_ROOT} component={App}>
        <IndexRoute component={Home}/>
        <Route path={constants.PATH_HELP} component={Help}/>
        <Route path={constants.PATH_LEVEL} component={Level}/>
        <Route path={constants.PATH_STATS} component={Stats}/>
        <Route path='*' exact={true} component={NotFound404}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// Post-load actions.
window.addEventListener('load', async() => {

  if (window.ethereum) {
    window.web3 = new constants.Web3(window.ethereum)
    try {
      await window.ethereum.enable()
    } catch (error) {
      console.error(error)
      console.error(`Refresh the page to approve/reject again`)
      window.web3 = null
    }
  } else if(window.web3) {
    window.web3 = new constants.Web3(window.web3.currentProvider)
  }

  if(window.web3) {

    ethutil.setWeb3(window.web3)
    ethutil.attachLogger()

    // Initial web3 related actions
    store.dispatch(actions.connectWeb3(window.web3))
    window.web3.eth.getAccounts(function (error, accounts) {
      let player;
      if(accounts.length !== 0 && !error) player = accounts[0]
      store.dispatch(actions.setPlayerAddress(player))
      store.dispatch(actions.loadEthernautContract())
      ethutil.watchAccountChanges(acct => {
        store.dispatch(actions.setPlayerAddress(acct))
      }, player)
      ethutil.watchNetwork({
        gasPrice: price => store.dispatch(actions.setGasPrice(Math.floor(price * 1.1))),
        networkId: id => {
          checkWrongNetwork(id)
          if(id !== store.getState().network.networkId)
            store.dispatch(actions.setNetworkId(id))
        },
        blockNum: num => {
          if(num !== store.getState().network.blockNum)
            store.dispatch(actions.setBlockNum(num))
        }
      })
    })
  }
});

function checkWrongNetwork(id) {
  let onWrongNetwork = false
  if(constants.ACTIVE_NETWORK.id === constants.NETWORKS.LOCAL.id) {
    onWrongNetwork = parseInt(id, 10) < 1000
  }
  else {
    onWrongNetwork = parseInt(constants.ACTIVE_NETWORK.id) !== parseInt(id)
  }

  if(onWrongNetwork) {
    console.error(`Heads up, you're on the wrong network!! @bad Please switch to the << ${constants.ACTIVE_NETWORK.name.toUpperCase()} >> network.`)
    console.error(`1) From November 2 you can turn on privacy mode (off by default) in settings if you don't want to expose your info by default. 2) If privacy mode is turn on you have to authorized metamask to use this page. 3) then refresh.`)
  }

  return onWrongNetwork
}
