import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import CodeComponent from '../components/Code';
import Author from '../components/Author';
import MarkdownComponent from '../components/Markdown';
import Difficulty from '../components/Difficulty';
import * as actions from '../actions';
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

class Level extends React.Component {
  constructor() {
    super()
    this.state = {
      requestedInstance: false,
      submittedIntance: false,
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

  render() {
    const {
      requestedInstance,
      submittedIntance,
    } = this.state;

    const {
      level,
      levelCompleted
    } = this.props;

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
    
    let poweredBy = level.poweredBy.src && level.poweredBy.href ? level.poweredBy : null

    let sourcesFile = null
    try { sourcesFile = require(`contracts/contracts/levels/${level.instanceContract}`) } catch(e){ console.log(e) }

    const nextLevelId = findNextLevelId(this.props.level, this.props.levels)

    return (
      <div className="page-container">
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

        <div className="page-header row">
          {/* TITLE + INFO */}
          <div className="level-title col-sm-6">          
            <h2 className="title no-margin">
              {level.name}
            </h2>
            {poweredBy && <p>{strings.poweredBy} <a href={poweredBy.href}><img alt="" style={{width: '80px', height: '80px'}} src={poweredBy.src}/></a></p>}
            <h2> </h2>
            { levelCompleted === true && <span className='label label-default'>{strings.levelCompleted}</span>}
          </div>
          <div className="difficulty col-sm-6 right">
            <Difficulty level={parseInt(level.difficulty, 10)}/>
          </div>
          <div className="clearfix"/>
        </div>

        {/* DESCRIPTION */}
        { description && !showCompletedDescription && <MarkdownComponent target={description}/> }

        {/* COMPLETED DESCRIPTION */}
        { showCompletedDescription &&
        <div style={{marginTop: '40px', marginBottom: '40px'}}>
          { completedDescription && <div className='well'><MarkdownComponent target={completedDescription}/></div> }
        </div>
        }

        {/* BUTTONS */}
        <div className="" style={{marginTop: '5px'}}>

          { level.levelContract &&
          <div className="">

            {/* CREATE */}
            <button
              type="button"
              className='btn btn-primary'
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
              className = { !this.props.levelCompleted ?  'btn btn-warning' : 'btn disabled'}
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
              className='btn btn-info'
              onClick={evt => this.props.history.push(`${constants.PATH_LEVEL_ROOT}${nextLevelId}`)}
            >
              {strings.nextLevel}
            </button>
            }

          </div>
          }
        </div>

        {/* CODE */}
        { showCode && sourcesFile &&
        <div style={{marginTop: '50px'}}>
          <div className='page-header'><h3>{strings.sources}</h3></div>
          <CodeComponent target={sourcesFile}/>
        </div>
        }

        {/* AUTHOR */}
        { level.author && 
          <Author author={level.author}/>
        }

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
