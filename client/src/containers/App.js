import React from "react";
import Mosaic from "./Mosaic";
import Footer from "../components/common/Footer";
import ReactGA from "react-ga";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import parse from "html-react-parser";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "../hoc/withRouter";
import { randGoodIcon, randBadIcon } from "../utils/^^";
import { deployAdminContracts } from "../utils/deploycontract";
import {
  networkOnDeprecationOrDeprecated,
  isDeprecatedNetwork,
  deprecationStatus,
  deprecationDate,
} from "../utils/networkDeprecation";
import { store } from "./../store";
import * as actions from "../../src/actions";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      chainId: 0,
    };
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_chainId" }).then((id) => {
        this.setState({ chainId: Number(id) });
      });
    }

    // Analytics
    ReactGA.initialize(constants.GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.childrenElement.parentElement.scrollTop = 0;
    }
  }

  navigateToFirstIncompleteLevel() {
    // Find first incomplete level
    let target = this.props.levels[0].deployedAddress;
    for (let i = 0; i < this.props.levels.length; i++) {
      const level = this.props.levels[i];
      if (!level.deployedAddress) {
        return this.props.navigate(`${constants.PATH_LEVEL_ROOT}${i}`);
      }
      const completed = this.props.completedLevels[level.deployedAddress];
      if (!completed) {
        target = level.deployedAddress;
        break;
      }
    }

    // Navigate to first incomplete level
    this.props.navigate(`${constants.PATH_LEVEL_ROOT}${target}`);
  }

  async continueAnyway() {
    const deployWindow = document.querySelectorAll(".deploy-window-bg");
    deployWindow[0].style.display = "none";
  }

  async continueInReadOnly() {
    store.dispatch(actions.loadGamedata());
    store.dispatch(actions.setGameReadOnly(true));
    const accountConnectionWindow = document.querySelectorAll(
      ".account-connection-window-bg"
    );
    accountConnectionWindow[0].style.display = "none";
  }

  async displayConnectionWindow() {
    const accountConnectionWindow = document.querySelectorAll(
      ".account-connection-window-bg"
    );
    accountConnectionWindow[0].style.display = "block";
  }

  async requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accountConnectionWindow = document.querySelectorAll(
      ".account-connection-window-bg"
    );
    accountConnectionWindow[0].style.display = "none";
  }

  render() {
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);
    const supportedNetworks = Object.keys(constants.NETWORKS).filter(
      (key) => key !== "LOCAL" && key !== "UNDEFINED"
    );

    // change the network to Sepolia network
    async function switchToSepolia() {
      let elements = document.querySelectorAll(".progress-bar-wrapper");
      const deployWindow = document.querySelectorAll(".deploy-window-bg");
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${Number(constants.NETWORKS.SEPOLIA.id).toString(
                16
              )}`,
            },
          ], //if on wrong network giving option to switch to sepolia network.
        });
        deployWindow[0].style.display = "none";
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: [
                    {
                      chainId: `0x${Number(
                        constants.NETWORKS.SEPOLIA.id
                      ).toString(16)}`,
                    },
                  ],
                },
              ],
            });
            deployWindow[0].style.display = "none";
          } catch (addError) {
            if (addError.code === 4001) {
              //User has rejected changing the request
              elements[0].style.display = "none";
            }
            console.error("Can't add nor switch to the selected network");
          }
        } else if (switchError.code === 4001) {
          //User has rejected changing the request
          if (elements[0]) elements[0].style.display = "none";
        }
      }
    }

    return (
      <div className="appcontainer">
        {/* Parent container */}
        <main>
          {/* Main title and buttons */}
          <section className="titles">
            <a href={constants.PATH_ROOT}>
              <img
                id="the-ethernaut"
                src="../../imgs/the-ethernaut.svg"
                alt="The-Ethernaut"
                className="the-ethernaut"
              />
            </a>
            <img
              src="../../imgs/arrow.svg"
              id="arrow"
              alt="arrows"
              className="arrow"
            />
            <ul>
              <button
                onClick={() => {
                  if (!store.getState().gamedata.readOnly) {
                    this.navigateToFirstIncompleteLevel();
                  } else {
                    this.displayConnectionWindow();
                  }
                }}
                className="buttons"
              >
                {strings.playNow}
              </button>
            </ul>
          </section>
          {/*not Account Connected window*/}
          <div className="account-connection-window-bg">
            <div className="account-connection-window">
              <button
                className="account-connection-close-x fas fa-x "
                onClick={this.continueInReadOnly}
              >
              </button>
              <h1>{randBadIcon()}</h1>
              <br />
              <h2>{strings.accountNotConnectedTitle}</h2>
              <br />
              <p>{strings.accountNotConnectedMessage}</p>
              <br />
              <div className="choice-buttons">
                <button
                  className="buttons"
                  onClick={async () => {
                    await this.requestAccounts();
                    window.location.reload();
                  }}
                >
                  {strings.connectAccount}
                </button>
              </div>
            </div>
          </div>
          {/*not Deployed window*/}
          <div className="deploy-window-bg">
            {!networkOnDeprecationOrDeprecated(this.state.chainId) ? (
              <div className="deploy-window">
                {/*deploy window*/}
                <h1>{randGoodIcon()}</h1>
                <h2>{strings.deployMessageTitle}</h2>
                {strings.deployMessage}
                {supportedNetworksList(supportedNetworks)}
                <p className="deploy-note">{strings.deployConfirmation}</p>
                <div className="choice-buttons">
                  <button className="buttons" onClick={deployAdminContracts}>
                    {strings.deployGame}
                  </button>
                  <button className="buttons" onClick={switchToSepolia}>
                    {strings.switchToSepolia}
                  </button>
                </div>
                <p className="deploy-note">{strings.deployNote}</p>
              </div>
            ) : (
              <div className="deploy-window">
                {/*deprecation window*/}
                <h1>{randBadIcon()}</h1>
                <h2>
                  {isDeprecatedNetwork(this.state.chainId)
                    ? strings.deprecatedNetwork
                    : strings.networkBeingDeprecated}
                </h2>
                <br />
                {strings.deployMessage}
                {supportedNetworksList(supportedNetworks)}
                <div className="choice-buttons">
                  <button className="buttons" onClick={switchToSepolia}>
                    {strings.switchToSepolia}
                  </button>
                  {!isDeprecatedNetwork(this.state.chainId) && (
                    <button className="buttons" onClick={this.continueAnyway}>
                      {strings.continueAnyway}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Levels */}
          <Mosaic></Mosaic>
          {/* Game description */}
          <section className="Description">
            <center>
              <hr />
            </center>
            {parse(strings.info)}
          </section>
        </main>
        {/* Footer */}
        <Footer></Footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    levels: state.gamedata.levels,
    completedLevels: state.player.completedLevels,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function supportedNetworksList(_supportedNetworks) {
  return (
    <ul>
      {_supportedNetworks.map((network, idx) => (
        <li key={idx}>
          {network}
          {networkOnDeprecationOrDeprecated(constants.NETWORKS[network].id) &&
            " (" +
              deprecationStatus(constants.NETWORKS[network].id) +
              " on " +
              deprecationDate(constants.NETWORKS[network].id) +
              ")"}
        </li>
      ))}
    </ul>
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
