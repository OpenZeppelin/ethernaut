import { Hamburger } from '../ui';
import { NavLink } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

export const Root = styled.nav`
  position: fixed;
  display: flex;
  width: 60px;
  background-color: #f8f8fa;
  color: #282846;
  align-self: stretch;
  z-index: 2;
  overflow: hidden;
  transition: width 0.35s ease-in-out;
  transition-property: width, padding;
  box-shadow: 0 8px 14px 0 rgba(40, 40, 70, 0.2);
  height: 100%;
  min-height: 100vh;

  > .h-icon {
    display: block;
  }

  @media (min-width: 961px) {
    z-index: 0;
    position: relative;
    width: 200px;
    min-width: 200px;
    padding: 0 25px;
    box-shadow: none;
    > .h-icon {
      display: none;
    }
  }

  ${(props) =>
    props.showMenu &&
    `
    position: fixed;
    width: 200px;
    padding: 0 25px;
	`}
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  color: #282846;
  border-bottom: 1px solid #d8d8d8;
  padding-bottom: 25px;
  margin-bottom: 25px;
  font-weight: 400;
  height: 68px;
  line-height: 68px;
  box-sizing: border-box;
  width: 100%;
`;

export const LevelList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  padding-top: 15px;
`;

export const LevelItem = styled.li``;

export const LevelName = styled(NavLink)`
  font-weight: 600;
  color: #868699;
  margin-bottom: 15px;
  display: flex;
  transition: color 0.2s ease;
  letter-spacing: 0.2px;

  :hover {
    color: #757584;
  }

  &.${(props) => props.activeClassName} {
    color: #5969e8;
  }
`;

export const NewLabel = styled.small`
  font-weight: 600;
  color: #63d2f9;
`;

const HamburgerIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
`;

export const Icon = ({ show, onShowMenu = () => {} }) => (
  <HamburgerIcon onClick={onShowMenu} className="h-icon">
    <Hamburger show={show} />
  </HamburgerIcon>
);

export const Content = styled.div`
  width: 100%;
  display: none;

  @media (min-width: 961px) {
    display: block;
  }

  ${(props) => props.show && `display: block`};
`;
