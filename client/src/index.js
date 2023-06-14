import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store, history } from "./store";
import { syncHistoryWithStore } from "react-router-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import * as ethutil from "./utils/ethutil";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/app.css";
import * as actions from "../src/actions";
import * as constants from "../src/constants";
import "./utils/^^";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import App from "./containers/App";
import NotFound404 from "./components/not-found/NotFound404";
import Header from "./containers/Header";
import Leaderboard from "./containers/Leaderboard";

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
// store.dispatch(actions.setNetworkId(id));
store.dispatch(actions.connectWeb3(window.ethereum));
const container = document.getElementById("root");
const root = createRoot(container);
if (!window.ethereum) {
  //root.render(<h3>Hey, You dont have the supported wallet!</h3>);
  // let language = localStorage.getItem("lang");
  // let strings = loadTranslations(language);
  // store.dispatch(actions.setNetworkId(parseInt("5")));
  store.dispatch(actions.loadGamedata());
} else {
  window.ethereum.request({ method: "eth_chainId" }).then((res) => {
    store.dispatch(actions.setNetworkId(parseInt(res)));
    store.dispatch(actions.loadGamedata());
  })  
}

root.render(
  <Provider store={store}>
    <Router history={syncHistoryWithStore(history, store)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Header></Header>
        <Routes>
          <Route path={constants.PATH_HELP} element={<Help />} />
          <Route path={constants.PATH_LEVEL} element={<Level />} />
          <Route path={constants.PATH_STATS} element={<Stats />} />
          <Route path={constants.PATH_LEADERBOARD} element={<Leaderboard />} />
          <Route exact path="/" element={<App />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Suspense>
    </Router>
  </Provider>
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
          // checkWrongNetwork(id);
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

// function checkWrongNetwork(id) {
//   let onWrongNetwork = false;
//   if (constants.ACTIVE_NETWORK.id === constants.NETWORKS.LOCAL.id) {
//     onWrongNetwork = Number(id) < 1000;
//   } else {
//     onWrongNetwork =  !constants.ACTIVE_NETWORK.includes(Number(id)) ;
//   }

//   if (onWrongNetwork) {
//     console.error(
//       `Heads up, you're on the wrong network!! @bad Please switch to the << ${constants.ACTIVE_NETWORK.name.toUpperCase()} >> network.`
//     );
//     console.error(
//       `1) From November 2 you can turn on privacy mode (off by default) in settings if you don't want to expose your info by default. 2) If privacy mode is turn on you have to authorized metamask to use this page. 3) then refresh.`
//     );

//     if (id === constants.NETWORKS.ROPSTEN.id) {
//       console.error(
//         `If you want to play on Ropsten, check out https://ropsten.ethernaut.openzeppelin.com/`
//       );
//     }
//   }

//   return onWrongNetwork;
// }
