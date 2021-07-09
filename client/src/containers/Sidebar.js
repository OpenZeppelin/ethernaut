import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router-dom'
import moment from 'moment'
import * as constants from '../constants';
import { loadTranslations } from '../utils/translations'

class Sidebar extends React.Component {
  render() {
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)

    return (
      <div style={{
        padding: '15px 10px'
      }}>

        {/* TITLE */}
        <h4 className="levels-list-title">{strings.uLevels}</h4>

        {/* LIST */}
        <div className="levels-list">
          {this.props.levels.map((level, idx) => {

            // Style
            let linkStyle = {}
            if(this.props.activeLevel) {
              if(this.props.activeLevel.deployedAddress === level.deployedAddress) {
                linkStyle.textDecoration = 'underline'
              }
            }

            // Level completed
            const levelComplete = this.props.player.completedLevels[level.deployedAddress] > 0

            // Created
            const creationDate = moment(level.created)
            const ago = moment.duration(moment().diff(creationDate)).asDays() || 0

            return (
              <div key={idx}>
                <Link to={`${constants.PATH_LEVEL_ROOT}${level.deployedAddress}`}>
                  <span style={linkStyle}>
                    {`${idx}. ${level.name}${levelComplete ? ' ✔' : ''}`}
                  </span>
                  { ago < 14 &&
                    <img style={{width: '20px', height: '20px'}} src='../../imgs/new.png' alt='new'/>
                  }
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    levels: state.gamedata.levels,
    player: state.player,
    activeLevel: state.gamedata.activeLevel
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
