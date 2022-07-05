import React from "react";
import Mosaic from "./Mosaic";
import Header from "./Header";
import ReactGA from "react-ga";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import parse from "html-react-parser";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
    this.props.history.push(`${constants.PATH_LEVEL_ROOT}${target}`);
  }

  render() {
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);
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
        <footer
          className="footer"
          dangerouslySetInnerHTML={{ __html: strings.footer }}
        ></footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
