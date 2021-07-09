import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

class Home extends React.Component {

  navigateToFirstIncompleteLevel() {

    // Find first incomplete level
    let target = this.props.levels[0].deployedAddress
    for(let i = 0; i < this.props.levels.length; i++) {
      const level = this.props.levels[i]
      const completed = this.props.completedLevels[level.deployedAddress]
      if(!completed) {
        target = level.deployedAddress
        break
      }
    }

    // Navigate to first incomplete level
    this.props.history.push(`${constants.PATH_LEVEL_ROOT}${target}`)
  }

  render() {
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    
    return (
      <div
        className="row"
        style={{
        paddingLeft: '40px',
        paddingRight: '40px',
      }}>

        <div className="col-sm-12">

          {/* TITLE */}
          <h2 className="title">
            {strings.title}&nbsp;
            <small style={{ fontSize: 10 }}>by</small>
            <a href='https://openzeppelin.com' target="_blank" rel="noopener noreferrer">
              <img style={{ maxWidth: '120px' }} src='../../imgs/openzeppelin-by-logo.png' alt='OpenZeppelin'/>
            </a>
          </h2>
          {/* INFO */}
          <div dangerouslySetInnerHTML={{ __html: strings.info }}></div>
          <button
            style={{marginTop: '10px'}}
            className="btn btn-primary"
            onClick={() => this.navigateToFirstIncompleteLevel()}
          >
            {strings.playNow}
          </button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    levels: state.gamedata.levels,
    completedLevels: state.player.completedLevels
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
