import styled from "styled-components";
import { Container } from "./Container";

import AddIcon from "../../assets/add-white.svg";

export const NewDevice = styled(Container)`
  border: dashed 2px ${(p) => p.theme.text};
  opacity: 0.5;
  color: white;
  background-image: url("${AddIcon}");
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;
