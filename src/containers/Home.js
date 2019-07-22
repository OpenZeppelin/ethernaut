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

        <div className="col-sm-12">

          {/* TITLE */}
          <h2 className="title">
            The Ethernaut&nbsp;
            <small style={{ fontSize: 10 }}>by</small>
            <a href='https://openzeppelin.com' target="_blank" rel="noopener noreferred">
              <img style={{ maxWidth: '120px' }} src='../../imgs/openzeppelin-by-logo.png' alt='OpenZeppelin'/>
            </a>
          </h2>
          {/* INFO */}
          <p>The Ethernaut is a Web3/Solidity based wargame inspired on <a href="https://overthewire.org" target="_blank" rel="noopener noreferred">overthewire.org</a>, played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.</p>
          <p>The game is 100% open source and all levels are contributions made by other players. Do you have an interesting idea? PRs are welcome at <a href="https://github.com/OpenZeppelin/ethernaut">github.com/OpenZeppelin/ethernaut</a>.</p>
          <p>Are you interested in smart contract development or security? Does securing the world’s blockchain infrastructure sound exciting to you? <a href="https://openzeppelin.com/jobs" target="_blank" rel="noopener noreferred"><strong style={{ color: '#eb5424', fontWeight: 600 }}>We are hiring!</strong></a></p>
          <button
            style={{marginTop: '10px'}}
            className="btn btn-primary"
            onClick={() => this.navigateToFirstIncompleteLevel()}
          >
            Play now! 
          </button>
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
