import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as constants from '../constants'

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
    this.props.router.push(`${constants.PATH_LEVEL_ROOT}${target}`)
  }

  render() {
    return (
      <div
        className="row"
        style={{
        paddingLeft: '40px',
        paddingRight: '40px',
      }}>

        <div className="col-sm-8">

          {/* TITLE */}
          <h2 className="title">
            The Ethernaut&nbsp;
            <small style={{ fontSize: 10 }}>by</small>
            <a href='https://zeppelin.solutions' target="_blank" rel="noopener noreferred">
              <img style={{ maxWidth: '120px' }} src='../../imgs/zeppelin-by-logo.png' alt='Zeppelin'/>
            </a>
          </h2>
          {/* INFO */}
          <p>The ethernaut is a Web3/Solidity based wargame inspired on <a href="https://overthewire.org" target="_blank" rel="noopener noreferred">overthewire.org</a> and the <a href="https://en.wikipedia.org/wiki/The_Eternaut" target="_blank" rel="noopener noreferred">El Eternauta</a> comic, played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked' in order to advance.</p>
          <p>If you are looking for the CTF version released for Devcon3, please visit <a href="https://ethernaut-devcon3.zeppelin.solutions" target="_blank" rel="noopener noreferred">ethernaut-devcon3.zeppelin.solutions</a>. This version will be maintained for some time and is still 100% playable.</p>
          <p>Are you interested in smart contract development or security? Does securing the world’s blockchain infrastructure sound exciting to you? <a href="https://zeppelin.solutions/jobs" target="_blank" rel="noopener noreferred"><strong style={{ color: '#eb5424', fontWeight: 600 }}>We are hiring!</strong></a></p>
          <button
            style={{marginTop: '10px'}}
            className="btn btn-primary"
            onClick={() => this.navigateToFirstIncompleteLevel()}
          >
            Play now! 
          </button>
        </div>

        <div className="col-sm-4">
          <img style={{maxWidth: '100%', padding: '40px 0 20px 0'}} src='../../imgs/ver.jpg' alt='eternauta'/>
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
