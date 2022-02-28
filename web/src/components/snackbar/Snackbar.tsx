import styled from "styled-components";
import { SnackbarType } from "../../hooks/useSnackbar";
import { useStore } from "../../services/store";

const Container = styled.div<{ type?: SnackbarType; show?: boolean }>`
  display: block;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1em;
  color: ${(p) => p.theme.text};
  pointer-events: none;
  transition: all 0.3s ease-in-out;

  background-color: ${(p) => {
    switch (p.type) {
      case "error":
        return p.theme.error;
      case "success":
        return p.theme.success;
      case "warning":
        return p.theme.warning;
      default:
        return p.theme.info;
    }
  }};

  opacity: ${(p) => (p.show ? 1 : 0)};
  transform: translateY(${(p) => (p.show ? 0 : 3)}em);
`;

export const Snackbar: React.FC = () => {
  const state = useStore((s) => s.snackBar);

  return <Container {...state}>{wrapPayload(state.payload!)}</Container>;
};

function wrapPayload(pl: string | JSX.Element): JSX.Element {
  return typeof pl === "string" ? <>{pl}</> : pl;
}
