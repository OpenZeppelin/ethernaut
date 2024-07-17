import React, { createRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CodeComponent from "../components/levels/Code";
import Footer from "../components/common/Footer";
import Author from "../components/levels/Author";
import MarkdownComponent from "../components/common/Markdown";
import * as actions from "../actions";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import { Link } from "react-router-dom";
import getlevelsdata from "../utils/getlevelsdata";
import { withRouter } from "../hoc/withRouter";
import { getLevelKey } from "../utils/contractutil";
import { deployAndRegisterLevel } from "../utils/deploycontract";
import { svgFilter } from "../utils/svg";
import { Helmet } from 'react-helmet';

class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestedInstance: false,
      submittedIntance: false,
      dropwDownOpened: false,
    };
    this.containerRef = createRef();
  }

  componentDidMount() {
    this.props.activateLevel(this.props.params.address);
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    if (this.props.activateLevel) {
      this.props.deactivateLevel(this.props.activateLevel);
    }
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate() {
    const key = getLevelKey(this.props.params.address);
    if (this.props.level?.[key] !== this.props.params.address) {
      this.props.activateLevel(this.props.params.address);
    }
    var codeElement = document.getElementsByClassName("hljs")[0];
    var black = getComputedStyle(document.documentElement).getPropertyValue(
      "--black"
    );
    if (codeElement && codeElement.style.background !== black)
      codeElement.style.background = black;
  }

  // use arrow function to prevent this binding
  deployFactoryContract = async () => {
    const levelFactory = await deployAndRegisterLevel(this.props.level);
    if (!levelFactory) return;
    this.props.loadGameData();
    this.props.activateLevel(levelFactory.address);
  };

  createInstance = (evt) => {
    if (!this.state.requestedInstance) {
      this.props.loadLevelInstance(this.props.level, false, true);
      this.setState({ requestedInstance: true });
      setTimeout(() => this.setState({ requestedInstance: false }), 2000);
    }
  };

  toggleDropdown = () => {
    this.setState({
      dropwDownOpened: !this.state.dropwDownOpened,
    });
  };

  closeDropdown = () => {
    if (this.state.dropwDownOpened) {
      this.setState({
        dropwDownOpened: false,
      });
    }
  };

  handleClickOutside = (event) => {
    if (this.containerRef && !this.containerRef.current.contains(event.target)) {
      this.closeDropdown();
    }
  }

  handleImageLoad = () => { 
    const styles = getComputedStyle(document.documentElement);

    const bgColor = styles.getPropertyValue('--primary-color');
    const black = styles.getPropertyValue('--black');

    const isCurrentlyDarkMode = bgColor === black;

    if (isCurrentlyDarkMode) { 
      let levelTiles = document.getElementsByClassName("level-tile");
      const levelTile = levelTiles[0]
      levelTile.style.filter = svgFilter();
    }
  }

  render() {
    const { level, levelCompleted } = this.props;
    const { submittedIntance } = this.state;

    var [levelData, selectedLevel] = getlevelsdata(this.props, "levelPage");

    if (!level) return null;
    const showCode = levelCompleted || level.revealCode;
    const showCompletedDescription =
      constants.SHOW_ALL_COMPLETE_DESCRIPTIONS || levelCompleted;

    let description = null;
    let language = localStorage.getItem("lang");
    let strings = loadTranslations(language);
    let isDescriptionMissingTranslation = false;

    try {
      description = require(`../gamedata/${language}/descriptions/levels/${level.description}`);
    } catch (e) {
      //FIX-ME: If language selected is english then "language" variable is null and not "en"
      if (language) isDescriptionMissingTranslation = true; // Only set it if language is not null (i.e. some language different from english)
      description = require(`../gamedata/en/descriptions/levels/${level.description}`);
    }
    let completedDescription = null;

    let isCompleteDescriptionMissingTranslation = false;
    if (showCompletedDescription && level.completedDescription) {
      try {
        completedDescription = require(`../gamedata/${language}/descriptions/levels/${level.completedDescription}`);
      } catch (e) {
        isCompleteDescriptionMissingTranslation = true;
        completedDescription = require(`../gamedata/en/descriptions/levels/${level.completedDescription}`);
      }
    }

    let poweredBy =
      level.poweredBy?.src && level.poweredBy?.href ? level.poweredBy : null;

    let sourcesFile = null;
    try {
      sourcesFile = require(`../contracts/src/levels/${level.instanceContract}`);
    } catch (e) {
      console.log(e);
    }

    const nextLevelId = findNextLevelId(this.props.level, this.props.levels);

    return (
      <main className="main-wrapper">
        <Helmet>
        <title>{`The Ethernaut - ${level.name}`}</title>
          {/* <!-- Primary Meta Tags --> */}
          <meta name="title" content={`The Ethernaut - ${level.name}`} />
          <meta
            name="description"
            content={`Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - ${level.name}`}
          />
          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://ethernaut.openzeppelin.com/level/${level.deployedAddress || level.id}`}
          />
          <meta property="og:title" content={`The Ethernaut - ${level.name}`} />
          <meta
            property="og:description"
            content={`Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - ${level.name}`}
          />
          <meta
            property="og:image"
            content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
          />
          {/* <!-- Twitter --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@OpenZeppelin" />
          <meta name="twitter:title" content={`The Ethernaut - ${level.name}`} />
          <meta
            name="twitter:description"
            content={`Web3/Solidity based wargame played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'. - ${level.name}`}
          />
          <meta
            name="twitter:image"
            content="https://ethernaut.openzeppelin.com/imgs/metatag.png"
          />
        </Helmet>
        <main className="main-wrapper">
          {(isDescriptionMissingTranslation ||
            isCompleteDescriptionMissingTranslation) && (
              <div style={{ textAlign: "center" }}>
                <p>
                  {strings.levelNotTranslated}
                  <a href="https://github.com/openzeppelin/ethernaut#adding-new-languages">
                    {strings.contributeTranslation}
                  </a>
                </p>
              </div>
            )}

          <div ref={this.containerRef} onClick={e => e.stopPropagation()} className="level-selector-nav">
            <div onClick={this.toggleDropdown} className="dropdown-menu-bar">
              <p key={level.difficulty}>{selectedLevel.difficulty}</p>
              <p key={level.name}>{level.name}</p>

              <div className="dropdown-menu-bar-button">
                <button className="dropdown-button">
                  <i className={`fa fa-caret-${this.state.dropwDownOpened? "up" : "down"}`}></i>
                </button>
              </div>
            </div>
            <div style={{ display: this.state.dropwDownOpened ? 'block' : 'none' }} className="level-selector-dropdown-content">
              {levelData.map((level) => {
                return (
                  <Link
                    key={level.name}
                    to={`${constants.PATH_LEVEL_ROOT}${level.deployedAddress || level.id
                      }`}
                    onClick={this.closeDropdown}
                  >
                    <div className="level-selector-dropdown-content-item">
                      <p key={level.name}>
                        {level.completed === true && (
                          <span className="label label-default">✔</span>
                        )}{" "}
                        {level.name}
                      </p>
                      <p key={level.difficulty}>{level.difficulty}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <section onLoad={this.handleImageLoad}>
            <img
              alt={`${level.name} level  image`}
              className="level-tile level-img-view"
              src={selectedLevel.src}
            />
          </section>

          {/* TITLE + INFO */}
          {poweredBy && (
            <div className="powered-by">
              <p>
                {strings.poweredBy}
                <a href={poweredBy.href}>
                  <img
                    className="custom-img"
                    alt=""
                    style={{ width: "80px", height: "80px" }}
                    src={poweredBy.src}
                  />
                </a>
              </p>
              <h2> </h2>
            </div>
          )}

          <section className="descriptors">
            <div className="boxes">
              {/* DESCRIPTION */}
              {description && !showCompletedDescription && (
                <MarkdownComponent target={description} />
              )}

              {/* COMPLETED DESCRIPTION */}
              {showCompletedDescription && (
                <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                  {completedDescription && (
                    <div className="well">
                      <MarkdownComponent target={completedDescription} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="descriptors source-code">
            {/* CODE */}
            {showCode && sourcesFile && (
              <div>
                <CodeComponent target={sourcesFile} />
              </div>
            )}
          </section>
          {/* BUTTONS */}
          <section className="descriptors">
            {level.levelContract && (
              <div className=" button-sequence">
                {/* NEXT LEVEL */}
                {levelCompleted && nextLevelId && (
                  <button
                    type="button"
                    className="button-actions"
                    onClick={() =>
                      this.props.navigate(
                        `${constants.PATH_LEVEL_ROOT}${nextLevelId}`
                      )
                    }
                  >
                    {strings.nextLevel}
                  </button>
                )}

                {/* SUBMIT */}
                {this.props.levelEmitted && !levelCompleted && (
                  <button
                    type="button"
                    disabled={this.props.levelCompleted}
                    className="button-actions"
                    onClick={(evt) => {
                      if (!submittedIntance && nextLevelId) {
                        this.props.submitLevelInstance(level);
                        this.setState({ submittedIntance: true });
                        setTimeout(
                          () => this.setState({ submittedIntance: false }),
                          2000
                        );
                      }
                    }}
                  >
                    {strings.submitInstance}
                  </button>
                )}

                {/* DEPLOY OR CREATE */}
                {this.props.web3 && <button
                  type="button"
                  className="button-actions"
                  onClick={
                    level.deployedAddress
                      ? this.createInstance
                      : this.deployFactoryContract
                  }
                >
                  {level.deployedAddress
                    ? strings.getNewInstance
                    : strings.deployLevel}
                </button>}

              </div>
            )}
          </section>

          <section className="descriptors">
            <div className="boxes author-section-border">
              <div className="author-section">
                {/* AUTHOR */}
                {level.author && <Author author={level.author} />}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer></Footer>
      </main>
    );
  }
}

function findNextLevelId(level, list) {
  // check if we are a predeployed chain to know which key to use
  for (let i = 0; i < list.length; i++) {
    const otherLevel = list[i];
    if (level.deployedAddress === otherLevel.deployedAddress) {
      if (i < list.length - 1) {
        const listItem = list[i + 1];
        return listItem.deployedAddress || listItem.deployId;
      } else return list[0].deployedAddress || list[0].deployId;
    }
  }
}

function mapStateToProps(state) {
  const level = state.gamedata.activeLevel;

  return {
    web3: state.network.web3,
    networkId: state.network.networkId,
    level: level,
    activeLevel: level,
    player: state.player,
    levels: state.gamedata.levels,
    levelCompleted:
      level && state.player.completedLevels[level.deployedAddress] > 0,
    levelEmitted:
      level && state.contracts.levels[level.deployedAddress] !== undefined,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      activateLevel: actions.activateLevel,
      deactivateLevel: actions.deactivateLevel,
      loadLevelInstance: actions.loadLevelInstance,
      submitLevelInstance: actions.submitLevelInstance,
      loadGameData: actions.loadGamedata,
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Level));
