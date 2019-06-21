import * as constants from '../../constants';

import {
  Content,
  Icon,
  LevelItem,
  LevelList,
  LevelName,
  NewLabel,
  Root,
  Title,
} from './Sidebar.css';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

class Sidebar extends React.Component {
  render() {
    const { activeLevel, player, onShowMenu, showMenu } = this.props;
    return (
      <Root showMenu={showMenu}>
        <Icon show={showMenu} onShowMenu={onShowMenu} />
        <Content show={showMenu}>
          <Title>Levels</Title>
          <LevelList>
            {this.props.levels.map((level, idx) => {
              let active = false;
              if (activeLevel) {
                if (activeLevel.deployedAddress === level.deployedAddress) {
                  active = true;
                }
              }

              // Level completed
              const levelComplete =
                player.completedLevels[level.deployedAddress] > 0;

              // Created
              const creationDate = moment(level.created);
              const ago =
                moment.duration(moment().diff(creationDate)).asDays() || 0;

              return (
                <LevelItem key={idx}>
                  <LevelName
                    activeClassName={active ? 'active' : ''}
                    key={idx}
                    to={`${constants.PATH_LEVEL_ROOT}${level.deployedAddress}`}
                  >
                    {`${idx}. ${level.name}${levelComplete ? ' ✔' : ''}`}
                    {ago < 14 && <NewLabel>New!</NewLabel>}
                  </LevelName>
                </LevelItem>
              );
            })}
          </LevelList>
        </Content>
      </Root>
    );
  }
}

function mapStateToProps(state) {
  return {
    levels: state.gamedata.levels,
    player: state.player,
    activeLevel: state.gamedata.activeLevel,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
