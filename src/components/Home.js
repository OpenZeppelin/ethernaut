import * as constants from '../../constants';

import { Button, Page, PageTitle, Paragraph } from '../ui';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

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
    this.props.history.push(`${constants.PATH_LEVEL_ROOT}${target}`);
  }

  render() {
    return (
      <Page>
        <PageTitle>The Ethernaut</PageTitle>

        <Paragraph>
          The Ethernaut is a Web3/Solidity based wargame inspired on{' '}
          <a
            href="https://overthewire.org"
            target="_blank"
            without="true"
            rel="noopener noreferrer"
          >
            overthewire.org
          </a>
          , played in the Ethereum Virtual Machine. Each level is a smart
          contract that needs to be 'hacked'.
        </Paragraph>
        <Paragraph>
          The game is 100% open source and all levels are contributions made by
          other players. Do you have an interesting idea? PRs are welcome at{' '}
          <a
            href="https://github.com/OpenZeppelin/ethernaut"
            target="_blank"
            without="true"
            rel="noopener noreferrer"
          >
            github.com/OpenZeppelin/ethernaut
          </a>
          .
        </Paragraph>
        <Paragraph>
          Are you interested in smart contract development or security? Does
          securing the world’s blockchain infrastructure sound exciting to you?{' '}
          <a
            href="https://zeppelin.solutions/jobs"
            target="_blank"
            without="true"
            rel="noopener noreferrer"
          >
            <strong>We are hiring!</strong>
          </a>
        </Paragraph>
        <Button onClick={() => this.navigateToFirstIncompleteLevel()}>
          Play now!
        </Button>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    levels: state.gamedata.levels,
    completedLevels: state.player.completedLevels,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Home));
