import { useNavigate } from "react-router";
import styled from "styled-components";
import { DeviceElement, NewDevice } from "../components/device";
import useDevices from "../hooks/useDevices";
import { EventEmitter } from "events";
import { useEffect } from "react";

interface Props {
  refreshEmitter: EventEmitter;
}

const Container = styled.div`
  width: 100%;
  @media screen and (min-width: 52em) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export const MainRoute: React.FC<Props> = ({ refreshEmitter }) => {
  const { devices, wakeUp, refresh } = useDevices();
  const nav = useNavigate();

  const _onEdit = (uid: string) => {
    nav("/" + uid);
  };

  useEffect(() => {
    console.log("register refresh");
    refreshEmitter.addListener("refresh", refresh);
    return () => {
      refreshEmitter.removeListener("refresh", refresh);
    };
  }, []);

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
