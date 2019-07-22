import styled from 'styled-components';

export const Root = styled.div`
  color: #282846;
  border-top: 1px solid #d8d8d8;
  padding: 25px 0;
`;

export const Headline = styled.div`
  font-size: 1.2em;
  margin-bottom: 20px;
`;

export const AuthorBox = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.9em;
`;

export const AuthorItem = styled.span`
  display: flex-item;
  font-weight: bold;
  padding-right: 7px;
  margin-right: 7px;
  border-right: 2px solid #282745;

  &:last-child {
    border: none;
  }

  > a {
    color: inherit;
  }
`;

export const Description = styled.p``;
export const Donate = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #4e5ee4;
`;
