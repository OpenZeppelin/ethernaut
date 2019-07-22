import styled from 'styled-components';

export const Button = styled.a`
  display: inline-block;
  background: #4e5ee4;
  box-shadow: 0 4px 5px 0 rgba(203, 203, 203, 0.81);
  border-radius: 6px;
  font-size: 0.9rem;
  color: #ffffff;
  letter-spacing: 0.6px;
  text-align: center;
  text-transform: uppercase;
  padding-left: 25px;
  padding-right: 25px;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  letter-spacing: 1.5px;
  margin: 1r0px 0;
  margin-right: 10px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4755cc;
    cursor: pointer;
  }
`;
