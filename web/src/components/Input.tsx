import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 0.5em 0.8em;
  font-size: 1em;
  color: ${(p) => p.theme.text};
  border: none;
  outline: solid 2px transparent;
  transition: outline 0.2s ease;

  &:focus {
    outline: solid 2px ${(p) => p.theme.accent};
  }
`;

export default Input;
