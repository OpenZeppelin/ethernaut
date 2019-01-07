import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as constants from "../constants";

class Home extends React.Component {
  navigateToFirstIncompleteLevel() {
    // Find first incomplete level
    let target = this.props.levels[0].deployedAddress;
    for (let i = 0; i < this.props.levels.length; i++) {
      const level = this.props.levels[i];
      const completed = this.props.completedLevels[level.deployedAddress];
      if (!completed) {
        target = level.deployedAddress;
        break;
      }
    }

    // Navigate to first incomplete level
    this.props.router.push(`${constants.PATH_LEVEL_ROOT}${target}`);
  }

  render() {
    return (
      <div
        className="row"
        style={{
          paddingLeft: "40px",
          paddingRight: "40px"
        }}
      >
        <div className="col-sm-12">
          <h2 className="title">The Ethernaut</h2>
          <p>
            c The Ethernaut is a Web3/Solidity based wargame, played on the
            Ethereum Virtual Machine (EVM). Each level is a smart contract that
            assess the developer's ability to write smart contracts.
          </p>
          <p>
            The DLT team at <a href="https://blog.gds-gov.tech/">GovTech GDS</a>{" "}
            is also recruiting top scorers at the game. If you are interested in
            Distributed Ledger Technologies (DLT) and would like to work on
            products that improves the lives of our citzen, we are hiring. To be
            contacted by our hiring manager, please{" "}
            <a href="/register">
              associate your address with your contact information
            </a>
            .
          </p>
          <h2 className="title">The Token & Leaderboard</h2>
          <p>
            On completion of each level, you will be awarded the native
            ScoreToken.
          </p>
          <p>
            The token contract on Ropsten is at{" "}
            <a href="https://ropsten.etherscan.io/token/0x08242e37b08029ca3159bf2088b34c7cf3a01970">
              0x08242e37b08029ca3159bf2088b34c7cf3a01970
            </a>
            .
          </p>
          <p>
            The leaderboard for the game can also be viewed on{" "}
            <a href="https://ropsten.etherscan.io/token/0x08242e37b08029ca3159bf2088b34c7cf3a01970#balances">
              Etherscan
            </a>
            .
          </p>
          <h2 className="title">Origin of the Game</h2>
          <p>
            The original game is created by Zeppelin. The source code has since
            been upgraded to use web3 v1.0 and solidity v0.5.
          </p>

          <p>
            Are you interested in smart contract development or security? Does
            securing the world’s blockchain infrastructure sound exciting to
            you?{" "}
            <a
              href="https://zeppelin.solutions/jobs"
              target="_blank"
              rel="noopener noreferred"
            >
              <strong style={{ color: "#eb5424", fontWeight: 600 }}>
                We are hiring!
              </strong>
            </a>
          </p>
          <button
            style={{ marginTop: "10px" }}
            className="btn btn-primary"
            onClick={() => this.navigateToFirstIncompleteLevel()}
          >
            Play now!
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    levels: state.gamedata.levels,
    completedLevels: state.player.completedLevels
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

Home.propTypes = {
  levels: PropTypes.array,
  completedLevels: PropTypes.array,
  router: PropTypes.object
};
