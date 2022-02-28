import { useParams } from "react-router";
import styled from "styled-components";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import Select from "../components/Select";
import { SkeletonTile } from "../components/skeleton";
import useDevice from "../hooks/useDevice";

const Section = styled.section`
  margin-bottom: 1em;
`;

const ControlSection = styled(Section)`
  margin-top: 2em;
`;

const WideButton = styled(Button)`
  width: 100%;
`;

const DeleteButton = styled(WideButton)`
  margin-top: 1em;
  background: ${(p) => p.theme.redGrad};
`;

export const DeviceRoute: React.FC = () => {
  const { uid } = useParams();
  const { device, update, commit, remove } = useDevice(uid!);

  const name =
    n(device.name) ??
    n(device.ip_address) ??
    n(device.mac_address) ??
    "New Device";

  const _isNew = uid !== "new";

  return !!device ? (
    <>
      <h1>{name}</h1>
      <Section>
        <Label htmlFor="i-displayname">Display Name</Label>
        <Input
          id="i-displayname"
          value={device.name}
          onInput={(e) => update({ name: e.currentTarget.value })}
        />
      </Section>
      <Section>
        <Label htmlFor="i-type">Type</Label>
        <Select
          value={device.type?.toString() ?? "1"}
          onChange={(e) => update({ type: parseInt(e.currentTarget.value) })}
        >
          <option value="1">PC</option>
          <option value="2">Server</option>
          <option value="3">IoT Device</option>
          <option value="4">Mobile Device</option>
        </Select>
      </Section>
      <Section>
        <Label htmlFor="i-mac">MAC Address</Label>
        <Input
          id="i-mac"
          value={device.mac_address}
          onInput={(e) => update({ mac_address: e.currentTarget.value })}
        />
      </Section>
      <Section>
        <Label htmlFor="i-ip">IP Address</Label>
        <Input
          id="i-ip"
          value={device.ip_address}
          onInput={(e) => update({ ip_address: e.currentTarget.value })}
        />
      </Section>
      <ControlSection>
        <WideButton onClick={() => commit()}>Save</WideButton>
        {_isNew && <DeleteButton onClick={() => remove()}>Delete</DeleteButton>}
      </ControlSection>
    </>
  ) : (
    <>
      <SkeletonTile width="100%" height="2em" delay={0} />
      <SkeletonTile width="100%" height="2em" delay={1} margin="1em 0 0 0" />
      <SkeletonTile width="100%" height="2em" delay={2} margin="1em 0 0 0" />
      <SkeletonTile width="100%" height="2em" delay={3} margin="1em 0 0 0" />
    </>
  );
};

function n(s: string): string | null {
  if (!s) return null;
  return s;
}
