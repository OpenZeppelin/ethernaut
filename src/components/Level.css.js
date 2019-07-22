import styled from 'styled-components';

export const PageHeader = styled.div`
  /* padding: 0 30px; */
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:first-child {
    flex: 1;
  }
  > *:last-child {
    flex: 0;
  }

  border-bottom: 1px solid #d8d8d8;
  padding-bottom: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
`;

export const Label = styled.small`
  padding: 0 30px;
`;

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

export const LevelContract = styled.div`
  margin: 25px 0;
`;
