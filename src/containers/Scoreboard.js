import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import _ from 'lodash';
import logo from '../../public/imgs/loader.svg'

import '../styles/page.css';

class Scoreboard extends React.Component {

  constructor() {
    super()
    this.state = {
      playerFilter: ''
    }    
  }

  componentDidMount() {
    this.props.collectScoreboard();
  }

  filter(player) {
    if (this.state.playerFilter === '' || player === '') return true;
  
    return this.state.playerFilter.test(player);
  }

  render() {
    if (!this.props.isLoaded) {
      return (<div className="page-container" style={{ display: 'flex', justifyContent: 'center' }}><img src={logo} alt="loading..."/></div>);
    }

    return (
      <div className="page-container">

        {/* FILTERS */}
        <div className="well">
          <form>
            <label>Filters</label>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="player address"
                onChange={(evt) => this.setState({ playerFilter: new RegExp(evt.target.value, "i") })}
              />
            </div>
          </form>
        </div>

        {/* ACTIONS */}
        <div style={{margin: '0 0 20px 0'}}>
          <button
            type="button"
            className="btn btn-xs btn-primary"
            onClick={() => {
              this.props.collectScoreboard();
            }}
          >
            Refresh
          </button>
        </div>

        {/* SCOREBOARD */}
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {
                _.map(this.props.scoreBoard, (item, index) => {
                  if (!this.filter(item.player) && !this.filter(item.alias)) return;
                  return (
                    <tr style={{ 'backgroundColor': item.player == this.props.playerAddress ? '#e5f2fb' : 'white' }} key={index}>
                      <td><small>{index + 1}</small></td>
                      <td><small>{item.alias}</small></td>
                      <td><small>{item.score}</small></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    scoreBoard: state.scoreBoard.scoreBoard,
    playerAddress: state.player.address,
    isLoaded: state.scoreBoard.isLoaded
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    collectScoreboard: actions.collectScoreboard
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scoreboard)