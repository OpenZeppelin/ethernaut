import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import '../styles/page.css'
import * as actions from '../actions';
import { getLevelsSolvedByPlayer, checkIfPlayerExist, getTotalCompleted, getTotalFailures, getTotalCreated, getTotalPlayers } from '../utils/statsContract'
import { validateAddress } from '../utils/ethutil'

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

  componentDidUpdate() {
    setTimeout(()=>{
      if(!this.state.collectedGlobals) this.collectsGlobalStats()
    }, 3000)
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
      <div className='stats-header'>
        <Statistic heading="Total number of players" value={this.state.totalPlayers} />
        <Statistic heading="Total number of instances created" value={this.state.totalCreated} />
        <Statistic heading="Total number of instances solved" value={this.state.totalCompleted} />
        <Statistic heading="Total number of instances failed" value={this.state.totalFailures} />
      </div>
       <div>
        <form>
           <label>Search player</label>
           <div className="form-group">
             <input
               type="text"
               className="form-control"
               placeholder="player address"
               onChange={async(evt) => {
                 evt.preventDefault();
                 await this.updatePlayerStats(evt.target.value);
               }}
               onKeyDown={async(evt) => {
                if(evt.key === "Enter") evt.preventDefault();
               }}
             />
           </div>
        </form>
       </div>
       <div className="player-stats-results">
          {
            this.state.solvedLevels.map(
              (level) => (
                <div key={level}>
                  {level}
                </div>
              )
            )
          }
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