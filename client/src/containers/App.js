import React from "react";
import Mosaic from "./Mosaic";
import Footer from "../components/Footer";
import ReactGA from "react-ga";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import parse from "html-react-parser";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "../hoc/withRouter";
import { randGoodIcon } from "../utils/^^";
import { deployAdminContracts } from '../utils/deploycontract';

class App extends React.Component {
  constructor() {
    super();

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
      const completed = this.props.completedLevels[level.deployedAddress];
      if (!completed) {
        target = level.deployedAddress;
        break;
      }
    }

    // Navigate to first incomplete level
    this.props.navigate(`${constants.PATH_LEVEL_ROOT}${target}`);
  }

  render() {
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);
    const supportedNetworks = Object.keys(constants.NETWORKS).filter(
      (key) => key !== "LOCAL" && key !== "UNDEFINED"
    );

    // change the network to goreli network
    async function switchToGoerli() {
      let elements = document.querySelectorAll('.progress-bar-wrapper');
      const deployWindow = document.querySelectorAll('.deploy-window-bg');
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(constants.NETWORKS.GOERLI.id).toString(16)}` }],//if on wrong network giving option to switch to sepolia network.
        });
        deployWindow[0].style.display = 'none';
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: [{ chainId: `0x${Number(constants.NETWORKS.GOERLI.id).toString(16)}` }]
                },
              ],
            });
            deployWindow[0].style.display = 'none';
          } catch (addError) {
            if (addError.code === 4001) {
              //User has rejected changing the request
              elements[0].style.display = 'none';
            }
            console.error("Can't add nor switch to the selected network")
          }
        } else if (switchError.code === 4001) {
          //User has rejected changing the request
          if (elements[0]) elements[0].style.display = 'none';
        }
      }
    }

    return (
      <div>
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
                onClick={() => this.navigateToFirstIncompleteLevel()}
                className="buttons"
              >
                {strings.playNow}
              </button>
            </ul>
          </section>
          {/* Deploy Window */}
          <div className="deploy-window-bg">
            <div className="deploy-window">
              <h1>{randGoodIcon()}</h1>
              <h1>{strings.deployMessageTitle}</h1>
              <br />
              {strings.deployMessage}
              <ul>
                {supportedNetworks.map((network, idx) =>
                  <li key={idx}>{network}</li>
                )}
              </ul>
              <p className="deploy-note">{strings.deployConfirmation}</p>
              <div className="choice-buttons">
                <button
                  className="buttons"
                  onClick={deployAdminContracts}
                >
                  {strings.deployGame}
                </button>
                <button
                  className="buttons"
                  onClick={switchToGoerli}
                >
                  {strings.switchToGoerli}
                </button>
              </div>
              <p className="deploy-note">{strings.deployNote}</p>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
