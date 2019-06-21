import React from 'react';
import styled from 'styled-components';

const Root = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #282846;
  color: white;
  text-align: center;
  line-height: 40px;
  height: 40px;
  width: 100%;
  justify-content: center;
  font-size: 0.9rem;
  letter-spacing: 0.2px;
  z-index: 3;
`;

export const Footer = () => (
  <Root>developed with X and X by the OpenZeppelin team</Root>
);
