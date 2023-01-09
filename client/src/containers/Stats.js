import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'lodash'
import '../styles/page.css'
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'

class Stats extends React.Component {

  constructor() {
    super()
    this.state = {
      playerFilter: '',
      levelFilter: '',
    }
  }

  componentDidMount() {
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
    return players.length
  }

  render() {
    let language = localStorage.getItem('lang')
    let strings = loadTranslations(language)
    
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
            {strings.refresh}
          </button>
        </div>

        {/* STATS */}
        <div>
          <h3>{strings.stats}</h3>
          <ul>
            <li><strong>{strings.numberOf} {strings.lLevels} {strings.lCompleted}: {this.props.completedLevels.length}</strong></li>
            <li><strong>{strings.numberOf} {strings.lLevels} {strings.lCreated}: {this.props.createdInstances.length}</strong></li>
            <li><strong>{strings.numberOf} {strings.players}: {this.getNumPlayers()}</strong></li>
          </ul>
        </div>

        {/* COMPLETED */}
        <div>
          <h3>{strings.uCompleted}</h3>
          <strong>{strings.lCompleted}: {this.props.completedLevels.length}</strong>
          <table className="table">
            <thead>
            <tr>
              <th>{strings.player}</th>
              <th>{strings.levelName}</th>
              <th>{strings.levelAddress}</th>
              <th>{strings.blockNum}</th>
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
          <h3>{strings.uCreated}</h3>
          <strong>{strings.lCreated}: {this.props.createdInstances.length}</strong>
          <table className="table">
            <thead>
            <tr>
              <th>{strings.player}</th>
              <th>{strings.instance}</th>
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