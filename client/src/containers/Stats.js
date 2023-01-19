import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import '../styles/page.css'
import * as actions from '../actions';
import { getLevelsSolvedByPlayer, checkIfPlayerExist, getTotalCompleted, getTotalFailures, getTotalCreated, getTotalPlayers } from '../utils/statsContract'
import { validateAddress } from '../utils/ethutil'
import Statistic from '../components/Statistic';
import StatisticPanel from '../components/Panel';
import Footer from '../components/Footer';

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
    if (this.props.web3 && prevProps.web3 !== this.props.web3) {
      this.collectsGlobalStats();
    }
  }

  async collectsGlobalStats() {
    const [completed, created, failures, totalPlayers] = await Promise.all([
      getTotalCompleted(this.state.chainId),
      getTotalCreated(this.state.chainId),
      getTotalFailures(this.state.chainId),
      getTotalPlayers(this.state.chainId)
    ])
    this.setState({
      totalCompleted: completed ? completed.toNumber() : 0,
      totalCreated: created ? created.toNumber() : 0,
      totalFailures: failures ? failures.toNumber() : 0,
      totalPlayers: totalPlayers ? totalPlayers.toNumber() : 0,
    })
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
      // sort the levels and display in acending level of difficulty
      // woth noting that the sort is 'inplace'
      stats?.levelsSolved.sort((a, b) => +a.difficulty - +b.difficulty)
      this.setState({
        ...this.state.solvedLevels,
        solvedLevels: stats?.levelsSolved
      })
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
           <div className="stats-input-container form-group">
             <input
               type="text"
               className="stats-input form-control"
               placeholder="Player address"
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
       {/* footer */}
       <Footer></Footer>
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