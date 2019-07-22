import React from 'react';
import styled from 'styled-components';

export const Root = styled.div`
  width: 60px;
  height: 45px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;
  transform: scale(0.4);

  span {
    display: block;
    position: absolute;
    height: 9px;
    width: 100%;
    background: #51516a;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }

  > span:nth-child(1) {
    top: 0px;
  }

  span:nth-child(2),
  span:nth-child(3) {
    top: 18px;
  }

  span:nth-child(4) {
    top: 36px;
  }

  ${(props) =>
    props.show &&
    `
		span:nth-child(1) {
			top: 18px;
			width: 0%;
			left: 50%;
		}

		span:nth-child(2) {
    	transform: rotate(45deg);
		}

		span:nth-child(3) {
   		transform: rotate(-45deg);
		}

		span:nth-child(4) {
			width: 0%;
			top: 18px;
			left: 50%;
		}
	`}
`;

export const Hamburger = ({ show }) => (
  <Root show={show}>
    <span />
    <span />
    <span />
    <span />
  </Root>
);
