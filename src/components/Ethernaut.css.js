import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Wrapper = styled.div`
  background-color: #f8f8fa;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
`;

export const Main = styled.div`
  padding: 0 30px 0 80px;
  width: 100%;
  background-color: white;

  @media (min-width: 961px) {
    padding: 0 30px 0;
  }
`;
export const Content = styled.div``;
