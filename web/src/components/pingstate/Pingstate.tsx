import styled from "styled-components";

interface Props {
  online: boolean | null;
}

const Container = styled.div`
  display: flex;
  align-items: center;

  > *:first-child {
    margin-right: 0.4em;
  }

  > span {
    padding-bottom: 0.15em;
  }
`;

const Dot = styled.div<Props>`
  width: 0.9em;
  height: 0.9em;
  border-radius: 100%;
  background-color: ${(p) => {
    if (p.online === null) return p.theme.gray;
    if (p.online) return p.theme.online;
    return p.theme.offline;
  }};
`;

export const Pingstate: React.FC<Props> = ({ online }) => {
  const desc = online === null ? "pinging ..." : online ? "online" : "offline";

  return (
    <Container>
      <Dot online={online} />
      <span>{desc}</span>
    </Container>
  );
};
