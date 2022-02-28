import { useState } from "react";
import styled from "styled-components";
import Button from "../Button";
import Input from "../Input";
import Label from "../Label";

interface Props {
  onSubmit: (password: string) => void;
}

const Section = styled.section`
  margin-top: 1em;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 1em;
`;

export const Login: React.FC<Props> = ({ onSubmit }) => {
  const [password, setPassword] = useState("");

  const valid = !!password;

  return (
    <>
      <h1>Login</h1>
      <Section>
        <Label htmlFor="i-password">Password</Label>
        <Input
          id="i-password"
          type="password"
          value={password}
          onInput={(e) => setPassword(e.currentTarget.value)}
          onKeyPress={(e) => e.code === "Enter" && onSubmit(password)}
        />
      </Section>
      <Section>
        <StyledButton disabled={!valid} onClick={() => onSubmit(password)}>
          Login
        </StyledButton>
      </Section>
    </>
  );
};
