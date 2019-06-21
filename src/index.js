import './normalize.css';
import './index.css';

import * as actions from './actions';
import * as constants from './constants';
import * as ethutil from './utils/ethutil';

import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './store';

// Initial actions
store.dispatch(actions.loadGamedata());

ReactDOM.render(<App />, document.getElementById('root'));

// Post-load actions.
window.addEventListener('load', async () => {
  if (window.ethereum) {
    window.web3 = new constants.Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error(error);
      console.error(`Refresh the page to approve/reject again`);
      window.web3 = null;
    }
  } else if (window.web3) {
    window.web3 = new constants.Web3(window.web3.currentProvider);
  }

  if (window.web3) {
    ethutil.setWeb3(window.web3);
    ethutil.attachLogger();

    // Initial web3 related actions
    store.dispatch(actions.connectWeb3(window.web3));
    window.web3.eth.getAccounts(function(error, accounts) {
      let player;
      if (accounts.length !== 0 && !error) player = accounts[0];
      store.dispatch(actions.setPlayerAddress(player));
      store.dispatch(actions.loadEthernautContract());
      ethutil.watchAccountChanges((acct) => {
        store.dispatch(actions.setPlayerAddress(acct));
      }, player);
      ethutil.watchNetwork({
        gasPrice: (price) =>
          store.dispatch(actions.setGasPrice(Math.floor(price * 1.1))),
        networkId: (id) => {
          checkWrongNetwork(id);
          if (id !== store.getState().network.networkId)
            store.dispatch(actions.setNetworkId(id));
        },
        blockNum: (num) => {
          if (num !== store.getState().network.blockNum)
            store.dispatch(actions.setBlockNum(num));
        },
      });
    });
  }
});

function checkWrongNetwork(id) {
  let onWrongNetwork = false;
  if (constants.ACTIVE_NETWORK.id === constants.NETWORKS.LOCAL.id) {
    onWrongNetwork = parseInt(id, 10) < 1000;
  } else {
    onWrongNetwork = constants.ACTIVE_NETWORK.id !== id;
  }

  if (onWrongNetwork) {
    console.error(
      `Heads up, you're on the wrong network!! @bad Please switch to the << ${constants.ACTIVE_NETWORK.name.toUpperCase()} >> network.`
    );
    console.error(
      `1) From November 2 you can turn on privacy mode (off by default) in settings if you don't want to expose your info by default. 2) If privacy mode is turn on you have to authorized metamask to use this page. 3) then refresh.`
    );
  }

  return onWrongNetwork;
}
