import React from 'react';
import { Link } from 'react-router-dom'
import * as constants from '../constants';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import moment from 'moment'

class Mosaic extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        lang: localStorage.getItem('lang')
      }
    }
  
    render() {
      var levels = require(`../gamedata/gamedata.json`).levels;

      // Array for tiles in the Mosaic
      var levelData = [];
      
      // Style
      let linkStyle = {};
      let levelComplete;
      let ago;

      for(var i = 0; i<levels.length; i++) {

          //Put as many ● as difficulty/2 (scaled from 10 to 5) and ○ as the rest up to 5
          var numberOfFullCircles = (parseInt(levels[i].difficulty) / 2);
          var numberOfEmptyCircles = 5 - numberOfFullCircles;
          var emptyCircle = '○';
          var fullCircle = '●';
          var difficulty = '';
          for(var j=0; j<numberOfFullCircles; j++) {
                difficulty+=fullCircle;
          }

          for(var k=0; k<numberOfEmptyCircles; k++) {
                difficulty+=emptyCircle;
          }

          // Each tile of the mosaic
          var object = {
              name: levels[i].name,
              src: `../../imgs/Level${levels[i].deployId}.png`,
              difficulty: difficulty,
              deployedAddress: levels[i].deployedAddress
          }

          if(this.props.activeLevel) {
            if(this.props.activeLevel.deployedAddress === levels[i].deployedAddress) {
              linkStyle.textDecoration = 'underline'
            }
          }

          // Level completed
          levelComplete = this.props.player.completedLevels[levels[i].deployedAddress] > 0

          // Created
          const creationDate = moment(levels[i].created)
          ago = moment.duration(moment().diff(creationDate)).asDays() || 0

          levelData.push(object);
      }

      return (
        <section className="game">
            {levelData.map((level) => {
                return (
                    <Link key={level.name} to={`${constants.PATH_LEVEL_ROOT}${level.deployedAddress}`}>
                        <div className="content_img">
                            <img alt="" src={level.src}/> 
                            <div>
                                {level.name}
                                <br /> {level.difficulty}
                            </div>
                        </div>
                        <span style={linkStyle}>
                        {`${levelComplete ? ' ✔' : ''}`}
                        </span>
                        { ago < 14 &&
                        <img style={{width: '20px', height: '20px'}} src='../../imgs/new.png' alt='new'/>
                        }
                    </Link>

                )
            })}
        </section>
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
  )(Mosaic);
  