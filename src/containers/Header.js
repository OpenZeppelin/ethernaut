import * as constants from '../constants';

import { Item, Menu, Root } from '../components/ui/Header.css';
import { Link, withRouter } from 'react-router';

import ConsoleDetect from '../components/ConsoleDetect';
import { Logo } from '../components/ui/Logo';
import React from 'react';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    return (
      <Root>
        <Link to="/">
          <Logo />
        </Link>

        <Menu>
          <Item>
            <Link to="/">Forum</Link>
          </Item>
          <Item>
            <Link to="/">About</Link>
          </Item>
          <Item>
            <Link to="/help">Help</Link>
          </Item>
          <Item>
            {constants.SHOW_VERSION && <Link>{`v${constants.VERSION}`}</Link>}
          </Item>
          <Item>
            <Link>
              <ConsoleDetect />
            </Link>
          </Item>
        </Menu>
      </Root>
    );
  }
}

function mapStateToProps(state) {
  return { allLevelsCompleted: state.player.allLevelsCompleted };
}

export default withRouter(connect(mapStateToProps)(Header));
