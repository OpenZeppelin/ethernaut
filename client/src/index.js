import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, history } from './store';
import { syncHistoryWithStore } from 'react-router-redux';
//import { browserHistory } from 'react-router';
import { Router, Route, Switch } from 'react-router';
import * as ethutil from './utils/ethutil'
import 'bootstrap/dist/css/bootstrap.css';
import './styles/app.css';
import * as actions from '../src/actions';
import * as constants from '../src/constants';
import './utils/^^';

import App from './containers/App';
import Home from './containers/Home';
import NotFound404 from './components/NotFound404';

const Level = lazy(() => import('./containers/Level'));
const Help = lazy(() => import('./containers/Help'));
const Stats = lazy(() => import('./containers/Stats'));

// Initial actions
store.dispatch(actions.loadGamedata())

// View entry point.
ReactDOM.render(
  <Provider store={store}>
    <Router history={syncHistoryWithStore(history, store)}>
      <Route
        path={constants.PATH_ROOT}
        children={({ location }) => (
          <App location={location}>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route path={constants.PATH_HELP} component={Help}/>
                <Route path={constants.PATH_LEVEL} component={Level}/>
                <Route path={constants.PATH_STATS} component={Stats}/>
                <Route exact path="/" component={Home}/>
                <Route path="/" component={NotFound404}/>
              </Switch>
            </Suspense>
          </App>
        )}
      />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// Post-load actions.
window.addEventListener('load', async() => {

  if (window.ethereum) {
    window.web3 = new constants.Web3(window.ethereum)
    try {
      await window.ethereum.request({method: `eth_requestAccounts`})
    } catch (error) {
      console.error(error)
      console.error(`Refresh the page to approve/reject again`)
      window.web3 = null
    }
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
    onWrongNetwork = Number(id) < 1000
  }
  else {
    onWrongNetwork = Number(constants.ACTIVE_NETWORK.id) !== Number(id)
  }

  if(onWrongNetwork) {
    console.error(`Heads up, you're on the wrong network!! @bad Please switch to the << ${constants.ACTIVE_NETWORK.name.toUpperCase()} >> network.`)
    console.error(`1) From November 2 you can turn on privacy mode (off by default) in settings if you don't want to expose your info by default. 2) If privacy mode is turn on you have to authorized metamask to use this page. 3) then refresh.`)
    
    if(id === constants.NETWORKS.ROPSTEN.id) {
      console.error(`If you want to play on Ropsten, check out https://ropsten.ethernaut.openzeppelin.com/`)
    }
  }

  return onWrongNetwork
}
