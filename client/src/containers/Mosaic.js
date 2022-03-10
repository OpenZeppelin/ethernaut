import React from 'react';
import { Link } from 'react-router-dom'
import * as constants from '../constants';

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
              difficulty: difficulty
          }

          levelData.push(object);
      }

      return (
        <section className="Game">
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
                        {/* <span style={linkStyle}>
                        {`${idx}. ${level.name}${levelComplete ? ' ✔' : ''}`}
                        </span>
                        { ago < 14 &&
                        <img style={{width: '20px', height: '20px'}} src='../../imgs/new.png' alt='new'/>
                        } */}
                    </Link>

                )
            })}
        </section>
      );
    }
  }
  
  export default Mosaic
  