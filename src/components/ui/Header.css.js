import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  align-items: center;
  height: 68px;
  line-height: 68px;
  border-bottom: solid 1px #d8d8d8;
  width: 100%;
  padding: 20px 1px;
  box-sizing: border-box;

  > * {
    display: flex;

    &:first-child,
    &:nth-child(1) {
      flex: 0;
    }

    &:last-child,
    &:nth-child(2) {
      flex-grow: 1;
      justify-content: flex-end;
    }
  }
`;

export const Menu = styled.ul`
  display: none;

  @media (min-width: 961px) {
    display: flex;
    flex: 1;
    flex-direction: row;
    list-style: none;
  }
`;

export const Item = styled.li`
  letter-spacing: 0.2px;
  margin-left: 30px;

  a {
    color: inherit;
  }
`;
