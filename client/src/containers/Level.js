import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CodeComponent from "../components/Code";
import Author from "../components/Author";
import MarkdownComponent from "../components/Markdown";
import * as actions from "../actions";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import { Link } from "react-router-dom";
import getlevelsdata from "../utils/getlevelsdata";

class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestedInstance: false,
      submittedIntance: false,
      dropwDownOpened: false,
    };
  }

  componentDidMount() {
    this.props.activateLevel(this.props.match.params.address);
  }

  componentWillUnmount() {
    if (this.props.activateLevel) {
      this.props.deactivateLevel(this.props.activateLevel);
    }
  }

  componentDidUpdate() {
    if (this.props.level.deployedAddress !== this.props.match.params.address) {
      this.props.activateLevel(this.props.match.params.address);
    }
    var codeElement = document.getElementsByClassName("hljs")[0];
    var black = getComputedStyle(document.documentElement).getPropertyValue(
      "--black"
    );
    if (codeElement && codeElement.style.background !== black)
      codeElement.style.background = black;
  }

  render() {
    const { requestedInstance, submittedIntance } = this.state;

    const { level, levelCompleted } = this.props;

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
      sourcesFile = require(`contracts/contracts/levels/${level.instanceContract}`);
    } catch (e) {
      console.log(e);
    }

    const nextLevelId = findNextLevelId(this.props.level, this.props.levels);

    return (
      <div>
        <div className="lines"></div>
        <main>
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

          <div className="level-selector-nav">
            <div className="dropdown-menu-bar">
              <p key={level.difficulty}>{selectedLevel.difficulty}</p>
              <p key={level.name}>{level.name}</p>

              <div className="dropdown-menu-bar-button">
                <button className="dropdown-button">
                  <i className="fa fa-caret-down"></i>
                </button>
              </div>
            </div>
            <div className="level-selector-dropdown-content">
              {levelData.map((level) => {
                return (
                  <Link
                    key={level.name}
                    to={`${constants.PATH_LEVEL_ROOT}${level.deployedAddress}`}
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

          <section>
            <img
              alt=""
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
          <section className="descriptors button-sequence">
            {level.levelContract && (
              <div>
                {/* NEXT LEVEL */}
                {levelCompleted && nextLevelId && (
                  <button
                    type="button"
                    className="button-actions"
                    onClick={(evt) =>
                      this.props.history.push(
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

                {/* CREATE */}
                <button
                  type="button"
                  className="button-actions"
                  onClick={(evt) => {
                    if (!requestedInstance) {
                      this.props.loadLevelInstance(level, false, true);
                      this.setState({ requestedInstance: true });
                      setTimeout(
                        () => this.setState({ requestedInstance: false }),
                        2000
                      );
                    }
                  }}
                >
                  {strings.getNewInstance}
                </button>
              </div>
            )}
          </section>

          <section className="descriptors">
            <div className="boxes">
              {/* AUTHOR */}
              {level.author && <Author author={level.author} />}
            </div>
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

function findNextLevelId(level, list) {
  for (let i = 0; i < list.length; i++) {
    const otherLevel = list[i];
    if (level.deployedAddress === otherLevel.deployedAddress) {
      if (i < list.length - 1) {
        return list[i + 1].deployedAddress;
      } else return list[0].deployedAddress;
    }
  }
}

function mapStateToProps(state) {
  const level = state.gamedata.activeLevel;

  return {
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
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Level);
