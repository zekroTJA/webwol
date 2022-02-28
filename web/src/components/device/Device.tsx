import styled from "styled-components";
import { Device, DeviceType } from "../../api/models";
import { Pingstate } from "../pingstate";
import usePing from "../../hooks/usePing";
import Button from "../Button";
import { useState } from "react";
import { Container } from "./Container";

import { ReactComponent as PCIcon } from "../../assets/pc.svg";
import { ReactComponent as MobileIcon } from "../../assets/mobile.svg";
import { ReactComponent as ServerIcon } from "../../assets/server.svg";
import { ReactComponent as IOTIcon } from "../../assets/bulb.svg";

interface Props {
  device: Device;
  onWakeUp: () => Promise<any>;
  onEdit: () => void;
}

const Heading = styled.h3`
  margin: 0;
`;

const DeviceContainer = styled(Container)`
  display: flex;
  svg {
    height: 4em;
    margin-right: 0.5em;
  }
  background-color: ${(p) => p.theme.backgtroundDark};
  padding: 0.5em;
`;

const Smol = styled.span`
  font-size: 0.9em;
  opacity: 0.75;
`;

const Controls = styled.div`
  margin-left: auto;
  align-items: center;
`;

export const DeviceElement: React.FC<Props> = ({
  device,
  onWakeUp,
  onEdit,
}) => {
  const { state, refresh } = usePing(device);
  const [wakeupDisabled, setWakeupDisabled] = useState(false);

  const typeLogo = (() => {
    switch (device.type) {
      case DeviceType.MOBILE:
        return <MobileIcon />;
      case DeviceType.SERVER:
        return <ServerIcon />;
      case DeviceType.IOT:
        return <IOTIcon />;
      default:
        return <PCIcon />;
    }
  })();

  const _onWakeUp = () => {
    setWakeupDisabled(true);
    onWakeUp()
      .then(() => refresh(5000))
      .finally(() => setWakeupDisabled(false));
  };

  const _onEdit: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).id === "wakeup-button") return;
    onEdit();
  };

  return (
    <DeviceContainer onClick={_onEdit}>
      <div>{typeLogo}</div>
      <div>
        <Heading>
          {device.name ?? device.ip_address ?? device.mac_address}
        </Heading>
        <Smol>{device.mac_address}</Smol>
        <Smol>{device.ip_address && <Pingstate online={state} />}</Smol>
      </div>
      <Controls>
        {state !== true && (
          <Button
            id="wakeup-button"
            disabled={wakeupDisabled}
            onClick={_onWakeUp}
          >
            Wake up
          </Button>
        )}
      </Controls>
    </DeviceContainer>
  );
};
