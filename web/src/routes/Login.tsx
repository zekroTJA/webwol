import styled from "styled-components";
import { Init } from "../components/init";
import { Login } from "../components/login";
import { SkeletonTile } from "../components/skeleton";
import useAuth from "../hooks/useAuth";

interface Props {}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  > section {
    width: 100%;
    max-width: 20em;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  height: fit-content;
  border-radius: 10px;
  background-color: ${(p) => p.theme.backgtroundDark};
  padding: 1em;
`;

export const LoginRoute: React.FC<Props> = ({}) => {
  const { isInitialized, init, login } = useAuth();

  return (
    <Container>
      <section>
        {(isInitialized === null && <SkeletonTile height="6em" />) || (
          <FormContainer>
            {(isInitialized && <Login onSubmit={login} />) || (
              <Init onSubmit={init} />
            )}
          </FormContainer>
        )}
      </section>
    </Container>
  );
};
