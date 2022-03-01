import { useLocation, useNavigate, useResolvedPath } from "react-router";
import styled from "styled-components";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../services/store";

import { ReactComponent as BackIcon } from "../../assets/back.svg";
import { ReactComponent as LogoutIcon } from "../../assets/logout.svg";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";

interface Props {
  onRefresh?: () => void;
}

const StyledHeader = styled.header`
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(p) => p.theme.accentGrad};
  box-shadow: 0 -1.2em 3em 0 ${(p) => p.theme.accent};
`;

const Section = styled.section`
  svg {
    height: 2.5em;
    cursor: pointer;
    margin-right: 1em;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export const Header: React.FC<Props> = ({ onRefresh }) => {
  const loggedIn = useStore((s) => s.loggedIn);
  const { logout } = useAuth(false);
  const nav = useNavigate();
  const loc = useLocation();

  const _refresh = () => {
    if (!onRefresh) return;
    onRefresh();
  };

  const _isHome = loc.pathname === "/";

  return loggedIn ? (
    <StyledHeader>
      <Section>{_isHome || <BackIcon onClick={() => nav(-1)} />}</Section>
      <Section>
        {!!onRefresh && <RefreshIcon onClick={_refresh} />}
        <LogoutIcon onClick={logout} />
      </Section>
    </StyledHeader>
  ) : (
    <></>
  );
};
