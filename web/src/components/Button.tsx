import styled from "styled-components";

const Button = styled.button`
  background: ${(p) => p.theme.accentGrad};
  color: ${(p) => p.theme.text};
  border: none;
  font-size: 1em;
  border-radius: 10px;
  padding: 0.5em 0.8em;
  cursor: pointer;
  text-transform: uppercase;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0.2em 2em 0 black;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default Button;
