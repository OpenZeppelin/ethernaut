import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CodeComponent from '../components/Code';
import Author from '../components/Author';
import MarkdownComponent from '../components/Markdown';
import * as actions from '../actions';
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'
import Header from './Header';
import { Link } from 'react-router-dom'
import getlevelsdata from '../utils/getlevelsdata';

class Level extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requestedInstance: false,
      submittedIntance: false,
      dropwDownOpened: false,
    }
  }

  componentDidMount() {
    this.props.activateLevel(this.props.match.params.address)
  }

  componentWillUnmount() {
    if(this.props.activateLevel) {
      this.props.deactivateLevel(this.props.activateLevel);
    }
  }

  componentDidUpdate() {
    if (this.props.level.deployedAddress !== this.props.match.params.address) {
      this.props.activateLevel(this.props.match.params.address);
    }
  }


  // toggleDropdown() {
  //   const boxes = document.querySelectorAll('.level-selector-dropdown-content');
  //   if(this.state.dropwDownOpened) {
  //     boxes.forEach(box => {
  //       box.style.display = 'none';
  //       this.setState({
  //         ...this.state,
  //         dropwDownOpened: false
  //       })
  //     });
  //   } else {
  //     boxes.forEach(box => {
  //       box.style.display = 'block';
  //       box.style.position = 'absolute';
  //       box.style.zIndex = '1';
  //       box.style.margin = '0%';
  //       box.style.width = '50%';
  //       box.style.marginTop = '0.5%';
  //       box.style.backgroundColor = box.parentNode.style.backgroundColor;
  //     });
  //     this.setState({
  //       ...this.state,
  //       dropwDownOpened: true
  //     })
  // }
  // }


  render() {
    const {
      requestedInstance,
      submittedIntance,
    } = this.state;

    const {
      level,
      levelCompleted
    } = this.props;

    var [levelData,selectedLevel] = getlevelsdata(this.props);

    if(!level) return null
    const showCode = levelCompleted || level.revealCode
    const showCompletedDescription = constants.SHOW_ALL_COMPLETE_DESCRIPTIONS || levelCompleted

    let description = null
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)

    let isDescriptionMissingTranslation = false;

    try { 
      description = require(`../gamedata/${language}/descriptions/levels/${level.description}`) 
    } catch(e){ 
      //FIX-ME: If language selected is english then "language" variable is null and not "en"
      if(language) isDescriptionMissingTranslation = true; // Only set it if language is not null (i.e. some language different from english)
      description = require(`../gamedata/en/descriptions/levels/${level.description}`)
    }
    let completedDescription = null

    let isCompleteDescriptionMissingTranslation = false;
    if(showCompletedDescription && level.completedDescription) {
      try { 
        completedDescription = require(`../gamedata/${language}/descriptions/levels/${level.completedDescription}`) 
      } catch(e){
        isCompleteDescriptionMissingTranslation = true;
        completedDescription = require(`../gamedata/en/descriptions/levels/${level.completedDescription}`) 
      }
    }
    
    let poweredBy = level.poweredBy?.src && level.poweredBy?.href ? level.poweredBy : null

    let sourcesFile = null
    try { sourcesFile = require(`contracts/contracts/levels/${level.instanceContract}`) } catch(e){ console.log(e) }

    const nextLevelId = findNextLevelId(this.props.level, this.props.levels)

    return (
      <div>
        {/* Two lines above */}
        <div className="lines">
          <center><hr className="top" /></center>
          <center><hr className="top" /></center>
        </div>
        <Header></Header>
        <div className="lines">
        </div>
        <main>
          {
            (
              isDescriptionMissingTranslation || 
              isCompleteDescriptionMissingTranslation
            ) && (
              <div>
                <p>{strings.levelNotTranslated}<a href="https://github.com/openzeppelin/ethernaut#adding-new-languages">{strings.contributeTranslation}</a></p>
              </div>
            )
          }

          <div className="level-selector-nav">

          <div className="dropdown-menu-bar">

              <p key={level.difficulty}>{selectedLevel.difficulty}</p>
              <p key={level.name}>{level.name}</p>

            <div className="dropdown-menu-bar-button">

                <button className="dropdownbutton"> 
                  <i className="fa fa-caret-down"></i>
                </button>

            </div>
            <div className="level-selector-dropdown-content">
              {levelData.map((level) => {
                    return (
                      <Link key={level.name} to={`${constants.PATH_LEVEL_ROOT}${level.deployedAddress}`}>
                        <div className="level-selector-dropdown-content-item">
                        <p key={level.name}>{ level.completed === true && <span className='label label-default'>✔</span>} {level.name}</p>
                          <p key={level.difficulty}>{level.difficulty}</p>
                        </div>
                      </Link>
                    )
                })}
            </div>
          </div>

          </div>

          <section>
              <img alt='' className="level-img-view" src={selectedLevel.src}/>
              <div> 
                  <center><h1>{selectedLevel.name}</h1></center>
              </div>
          </section>
        

          <div className="page-header row">
            {/* TITLE + INFO */}
            <div className="level-title col-sm-6">          
              {poweredBy && <p>{strings.poweredBy} <a href={poweredBy.href}><img alt="" style={{width: '80px', height: '80px'}} src={poweredBy.src}/></a></p>}
              <h2> </h2>
            </div>
          </div>


          <section className="descriptors">
              <div className="boxes">
                {/* DESCRIPTION */}
                { description && !showCompletedDescription && <MarkdownComponent target={description}/> }

                {/* COMPLETED DESCRIPTION */}
                { showCompletedDescription &&
                <div style={{marginTop: '40px', marginBottom: '40px'}}>
                  { completedDescription && <div className='well'><MarkdownComponent target={completedDescription}/></div> }
                </div>
                }
              </div>
          </section>

          <section className="descriptors">
            <div className="boxes">
              {/* CODE */}
              { showCode && sourcesFile &&
              <div>
                <div className='page-header'><h3>{strings.sources}</h3></div>
                <CodeComponent target={sourcesFile}/>
              </div>
              }
              {/* BUTTONS */}
              <div className="" style={{marginTop: '5px'}}>
                { level.levelContract &&
                <div className="">

                  {/* CREATE */}
                  <button
                    type="button"
                    // className='btn btn-primary'
                    onClick={evt => {
                      if (!requestedInstance) {
                        this.props.loadLevelInstance(level, false, true);
                        this.setState({ requestedInstance: true });
                        setTimeout(() => this.setState({ requestedInstance: false }), 2000);
                      }
                    }}
                  >
                    {strings.getNewInstance}
                  </button>

                  {/* SUBMIT */}
                  { this.props.levelEmitted &&
                  <button
                    type="button"
                    disabled = { this.props.levelCompleted }
                    // className = { !this.props.levelCompleted ?  'btn btn-warning' : 'btn disabled'}
                    onClick={evt => {
                      if (!submittedIntance && nextLevelId) {
                        this.props.submitLevelInstance(level);
                        this.setState({ submittedIntance: true });
                        setTimeout(() => this.setState({ submittedIntance: false }), 2000);
                      }
                    }}
                  >
                    {strings.submitInstance}
                  </button>
                  }

                  {/* NEXT LEVEL */}
                  { levelCompleted && nextLevelId &&
                  <button
                    type="button"
                    // className='btn btn-info'
                    onClick={evt => this.props.history.push(`${constants.PATH_LEVEL_ROOT}${nextLevelId}`)}
                  >
                    {strings.nextLevel}
                  </button>
                  }

                </div>
                }
                </div>
            </div>
          </section>

          <section className="descriptors">
            <div className="boxes">
              {/* AUTHOR */}
              { level.author && 
                <Author author={level.author}/>
              }
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer dangerouslySetInnerHTML={{ __html: strings.footer }}>
        </footer>
      </div>
    );
  }
}

function findNextLevelId(level, list) {
  for(let i = 0; i < list.length; i++) {
    const otherLevel = list[i]
    if(level.deployedAddress === otherLevel.deployedAddress) {
      if(i < list.length - 1) {
        return list[i+1].deployedAddress
      }
      else return list[0].deployedAddress
    }
  }
}

function mapStateToProps(state) {
  const level = state.gamedata.activeLevel

  return {
    level: level,
    activeLevel: level,
    player: state.player,
    levels: state.gamedata.levels,
    levelCompleted: level && state.player.completedLevels[level.deployedAddress] > 0,
    levelEmitted: level && state.contracts.levels[level.deployedAddress] !== undefined
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    activateLevel: actions.activateLevel,
    deactivateLevel: actions.deactivateLevel,
    loadLevelInstance: actions.loadLevelInstance,
    submitLevelInstance: actions.submitLevelInstance,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Level);
