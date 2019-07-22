import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border-bottom: 1px solid #d8d8d8;
  padding-bottom: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 500;
`;

export const PageTitle = ({ children }) => (
  <Container>
    <Title>{children}</Title>
  </Container>
);
