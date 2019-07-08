import { Item, Menu, Root } from './Header.css';

import { Link } from 'react-router';
import { Logo } from './Logo';
import React from 'react';

export const Header = () => {
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
      </Menu>
    </Root>
  );
};
