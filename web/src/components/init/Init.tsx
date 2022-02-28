import { useState } from "react";
import styled from "styled-components";
import Button from "../Button";
import Input from "../Input";
import Label from "../Label";

interface Props {
  onSubmit: (key: string, password: string) => void;
}

const Section = styled.section`
  margin-top: 1em;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 1em;
`;

export const Init: React.FC<Props> = ({ onSubmit }) => {
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRep, setpasswordRep] = useState("");

  const valid = !!key && !!password && password === passwordRep;

  return (
    <>
      <h1>Initialization</h1>
      <p>
        The app needs to be initialized. Therefore, enter the key which is
        displayed in the log output of the backend application as well as a
        password you want to use to log in.
      </p>
      <Section>
        <Label htmlFor="i-key">Initialization Key</Label>
        <Input
          id="i-key"
          type="password"
          value={key}
          onInput={(e) => setKey(e.currentTarget.value)}
        />
      </Section>
      <Section>
        <Label htmlFor="i-password">Password</Label>
        <Input
          id="i-password"
          type="password"
          value={password}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />
      </Section>
      <Section>
        <Label htmlFor="i-passwordrep">Password Repeat</Label>
        <Input
          id="i-passwordrep"
          type="password"
          value={passwordRep}
          onInput={(e) => setpasswordRep(e.currentTarget.value)}
        />
      </Section>
      <Section>
        <StyledButton disabled={!valid} onClick={() => onSubmit(key, password)}>
          Initialize
        </StyledButton>
      </Section>
    </>
  );
};
