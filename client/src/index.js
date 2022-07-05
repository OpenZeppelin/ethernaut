import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import MediaQuery from "react-responsive";
import { Provider } from "react-redux";
import { store, history } from "./store";
import { syncHistoryWithStore } from "react-router-redux";
import { Router, Route, Switch } from "react-router";
import * as ethutil from "./utils/ethutil";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/app.css";
import * as actions from "../src/actions";
import * as constants from "../src/constants";
import "./utils/^^";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import App from "./containers/App";
import NotFound404 from "./components/NotFound404";
import Header from "./containers/Header";

// For bundle splitting without lazy loading.
const nonlazy = (component) => lazy(() => component);

const Level = nonlazy(import("./containers/Level"));
const Help = nonlazy(import("./containers/Help"));
const Stats = nonlazy(import("./containers/Stats"));

Sentry.init({
  dsn: constants.SENTRY_DSN,
  debug: false,
  tunnel: "/errors",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  release: constants.VERSION,
});

store.dispatch(actions.loadGamedata());

// View entry point.
ReactDOM.render(
  <Provider store={store}>
    <MediaQuery minWidth={881}>
      <Router history={syncHistoryWithStore(history, store)}>
        <Route
          path={constants.PATH_ROOT}
          children={({ location }) => (
            <Suspense location={location} fallback={<div>Loading...</div>}>
              <Header></Header>
              <Switch>
                <Route path={constants.PATH_HELP} component={Help} />
                <Route path={constants.PATH_LEVEL} component={Level} />
                <Route path={constants.PATH_STATS} component={Stats} />
                <Route exact path="/" component={App} />
                <Route path="/" component={NotFound404} />
              </Switch>
            </Suspense>
          )}
        />
      </Router>
    </MediaQuery>
    <MediaQuery maxWidth={880}>
      <div className="unfitScreenSize">
        <h3>You need a larger screen to play</h3>
        <a href={constants.PATH_ROOT}>
          <img
            id="the-ethernaut"
            src="../../imgs/the-ethernaut.svg"
            alt="The-Ethernaut"
            className="the-ethernaut"
          />
        </a>
      </div>
    </MediaQuery>
  </Provider>,
  document.getElementById("root")
);

// Post-load actions.
window.addEventListener("load", async () => {
  if (window.ethereum) {
    window.web3 = new constants.Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: `eth_requestAccounts` });
    } catch (error) {
      console.error(error);
      console.error(`Refresh the page to approve/reject again`);
      window.web3 = null;
    }
  }

  if (window.web3) {
    ethutil.setWeb3(window.web3);
    ethutil.attachLogger();

    // Initial web3 related actions
    store.dispatch(actions.connectWeb3(window.web3));
    window.web3.eth.getAccounts(function (error, accounts) {
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
    onWrongNetwork = Number(id) < 1000;
  } else {
    onWrongNetwork = Number(constants.ACTIVE_NETWORK.id) !== Number(id);
  }

  if (onWrongNetwork) {
    console.error(
      `Heads up, you're on the wrong network!! @bad Please switch to the << ${constants.ACTIVE_NETWORK.name.toUpperCase()} >> network.`
    );
    console.error(
      `1) From November 2 you can turn on privacy mode (off by default) in settings if you don't want to expose your info by default. 2) If privacy mode is turn on you have to authorized metamask to use this page. 3) then refresh.`
    );

    if (id === constants.NETWORKS.ROPSTEN.id) {
      console.error(
        `If you want to play on Ropsten, check out https://ropsten.ethernaut.openzeppelin.com/`
      );
    }
  }

  return onWrongNetwork;
}
