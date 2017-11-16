import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../actions'
import _ from 'lodash'

import '../styles/page.css'

class Stats extends React.Component {

  constructor() {
    super()
    this.state = {
      playerFilter: '',
      levelFilter: '',
    }
  }

  componentWillMount() {
    this.props.collectStats()
  }

  filter(player, level) {
    if(this.state.playerFilter !== '' && player !== '') {
      if(player !== this.state.playerFilter) return false
    }
    if(this.state.levelFilter !== '' && level !== '') {
      if(level !== this.state.levelFilter) return false
    }
    return true
  }

  getLevelName(address) {
    const level = _.find(this.props.levels, l => l.deployedAddress === address)
    return level.name
  }

  compactAddress(address) {
    return `${address.substring(0, 10)}...`
  }

  getNumPlayers() {
    const players = _.uniq(_.map(this.props.createdInstances, 'args.player'))
    // console.log(`players:`, players)
    return players.length
  }

  render() {
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
                onChange={(evt) => this.setState({playerFilter: evt.target.value})}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="level address"
                onChange={(evt) => this.setState({levelFilter: evt.target.value})}
              />
            </div>
          </form>
        </div>

        {/* ACTIONS */}
        <div style={{margin: '0 0 20px 0'}}>
          <button
            type="button"
            className="btn btn-xs btn-primary"
            onClick={() => this.props.collectStats()}
          >
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div>
          <h3>Stats</h3>
          <ul>
            <li><strong># completed: {this.props.completedLevels.length}</strong></li>
            <li><strong># created: {this.props.createdInstances.length}</strong></li>
            <li><strong># players: {this.getNumPlayers()}</strong></li>
          </ul>
        </div>

        {/* COMPLETED */}
        <div>
          <h3>Completed</h3>
          <strong># completed: {this.props.completedLevels.length}</strong>
          <table className="table">
            <thead>
            <tr>
              <th>Player</th>
              <th>Level name</th>
              <th>Level address</th>
              <th>Block num</th>
            </tr>
            </thead>
            <tbody>
            {_.map(this.props.completedLevels, item => {
              if(!this.filter(item.args.player, item.args.level)) return
              return (
                <tr key={item.transactionHash}>
                  <td><small>{item.args.player}</small></td>
                  <td><small>{this.getLevelName(item.args.level)}</small></td>
                  <td><small>{this.compactAddress(item.args.level)}</small></td>
                  <td><small>{item.blockNumber}</small></td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>

        {/* CREATED */}
        <div>
          <h3>Created</h3>
          <strong># created: {this.props.createdInstances.length}</strong>
          <table className="table">
            <thead>
            <tr>
              <th>Player</th>
              <th>Instance</th>
            </tr>
            </thead>
            <tbody>
            {_.map(this.props.createdInstances, item => {
              if(!this.filter(item.args.player, '')) return
              return (
                <tr key={item.transactionHash}>
                  <td><small>{item.args.player}</small></td>
                  <td><small>{this.compactAddress(item.args.instance)}</small></td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    createdInstances: state.stats.createdInstanceLogs,
    completedLevels: state.stats.completedLevelLogs,
    levels: state.gamedata.levels
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    collectStats: actions.collectStats
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats)