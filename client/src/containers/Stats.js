import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import '../styles/page.css'
import * as actions from '../actions';
import { getLevelsSolvedByPlayer, checkIfPlayerExist, getTotalCompleted, getTotalFailures, getTotalCreated, getTotalPlayers } from '../utils/statsContract'
import { validateAddress } from '../utils/ethutil'
import Statistic from '../components/Statistic';
import StatisticPanel from '../components/Panel';

class Stats extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      playerFilter: '',
      levelFilter: '',
      solvedLevels: [],
      totalCompleted: 0,
      totalCreated: 0,
      totalFailures: 0,
      totalPlayers: 0,
      collectedGlobals: false,
      chainId: 0,
      lang: localStorage.getItem("lang"),
    }

    if (this.props.web3) {
      window.ethereum.request({ method: 'eth_chainId' }).then((id) => {
        this.setState({ chainId: Number(id) });
      });
    }

  }

  componentDidUpdate(prevProps, prevState ) {
    // if(!this.state.chainId) return;
    if (this.props.web3 && prevProps.web3 !== this.props.web3) {
      this.collectsGlobalStats();
    }
  }

  async collectsGlobalStats() {
    
    var completed = await getTotalCompleted(this.state.chainId);
    if(completed) this.setState({totalCompleted: completed.toNumber()});

    var created = await getTotalCreated(this.state.chainId);
    if(created) this.setState({totalCreated: created.toNumber()});

    var failures = await getTotalFailures(this.state.chainId);
    if(failures) this.setState({totalFailures: failures.toNumber()});

    var totalPlayers = await getTotalPlayers(this.state.chainId);
    if(totalPlayers) this.setState({totalPlayers: totalPlayers.toNumber()});
    this.setState({collectedGlobals: true});

  }

  async collectPlayerStats(playerAddress) {
    var itExists = await checkIfPlayerExist(playerAddress, this.state.chainId)
      if(itExists) {
        var levels = await getLevelsSolvedByPlayer(playerAddress, this.state.chainId)
        
        //loader off
        const elements = document.querySelectorAll('.progress-bar-wrapper');
        elements[0].style.display = 'none';
        
        // Resolve address of levels with name
        // Resolve number of levels solved

        //Show solved levels
        return {
          playerExists: true,
          levelsSolved: levels
        }
      } else {
        // loader off
        const elements = document.querySelectorAll('.progress-bar-wrapper');
        elements[0].style.display = 'none';
        //Show player doesn't exist
        return {
          playerExists: false,
          levelsSolved: []
        }
      }

  }

  async updatePlayerStats(playerAddress) {
    if(validateAddress(playerAddress)) {
      //loader on
      var progressBar = document.querySelectorAll('.progress-bar-wrapper')[0];
      progressBar.style.display = 'flex';

      this.setState({playerFilter: playerAddress});

      var stats = await this.collectPlayerStats(playerAddress);
      this.setState({...this.state.solvedLevels = stats?.levelsSolved})
    }
  }

  render() {
      return <div className="stats-page page-container">
      <div className="row text-center">
        <div className="col">
          <div className="counter">
            <i className="fa fa-code fa-2x"></i>
            <h2 className="timer count-title count-number" data-to={this.state.totalPlayers ? this.state.totalPlayers : 0}></h2>
            <p className="count-text ">Total number of players </p>
          </div>
        </div>
      </div>
      <div className='stats-header'>
        <Statistic heading="Total number of players" value={this.state.totalPlayers} />
        <Statistic heading="Total number of instances created" value={this.state.totalCreated} />
        <Statistic heading="Total number of instances solved" value={this.state.totalCompleted} />
        <Statistic heading="Total number of instances failed" value={this.state.totalFailures} />
      </div>
       <div>
        <form>
           <div className="stats-input-container form-group">
             <input
               type="text"
               className="stats-input form-control"
               placeholder="Player address"
               onChange={async(evt) => {
                 await this.updatePlayerStats(evt.target.value);
               }}
             />
           </div>
        </form>

        <div className="stats-content">
          <StatisticPanel show={this.state.solvedLevels.length} title="Levels Completed">
            <div className="player-stats-results">
                {
                  this.state.solvedLevels.map(
                    (level) => (
                      <div key={level.name}>
                        <span>{level.name}</span>
                        <span>{level.difficultyCircles}</span>
                      </div>
                    )
                  )
                }
            </div>
          </StatisticPanel>
        </div>
       </div>
     </div> 

}}

function mapStateToProps(state) {
  return {
    web3: state.network.web3,
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