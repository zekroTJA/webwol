import styled from "styled-components";

export const Container = styled.div`
  color: ${(p) => p.theme.text};
  width: 100%;
  border-radius: 10px;
  margin-bottom: 1em;
  height: 5em;
  cursor: pointer;

  @media screen and (min-width: 52em) {
    max-width: 25em;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
`;
