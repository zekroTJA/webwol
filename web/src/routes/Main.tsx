import { useNavigate } from "react-router";
import styled from "styled-components";
import { DeviceElement, NewDevice } from "../components/device";
import useDevices from "../hooks/useDevices";

interface Props {}

const Container = styled.div`
  width: 100%;
  @media screen and (min-width: 52em) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const MainRoute: React.FC<Props> = ({}) => {
  const { devices, wakeUp } = useDevices();
  const nav = useNavigate();

  const _onEdit = (uid: string) => {
    nav("/" + uid);
  };

  const deviceElements = devices.map((d) => (
    <DeviceElement
      key={d.uid}
      device={d}
      onEdit={() => _onEdit(d.uid)}
      onWakeUp={() => wakeUp(d)}
    />
  ));
  deviceElements.push(
    <NewDevice key="new-device" onClick={() => _onEdit("new")} />
  );

  return <Container>{deviceElements}</Container>;
};
