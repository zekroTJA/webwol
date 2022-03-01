import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainRoute } from "./routes/Main";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { LoginRoute } from "./routes/Login";
import { DefaultTheme } from "./theme/theme";
import { Snackbar } from "./components/snackbar";
import { DeviceRoute } from "./routes/Device";
import { Header } from "./components/header";
import { EventEmitter } from "events";
import { useRef } from "react";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(p) => p.theme.background};
    color: ${(p) => p.theme.text};
    
    * {
      box-sizing: border-box;
    }

    h1 {
      margin: 0 0 1em 0;
    }
  }
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const RouterOutlet = styled.div`
  padding: 2em 1em 0em 1em;
  overflow-y: auto;
  height: 100%;
`;

const App: React.FC = () => {
  const emitterRef = useRef(new EventEmitter());

  return (
    <>
      <ThemeProvider theme={DefaultTheme}>
        <Container>
          <BrowserRouter>
            <Header onRefresh={() => emitterRef.current.emit("refresh")} />
            <RouterOutlet>
              <Routes>
                <Route
                  index
                  element={<MainRoute refreshEmitter={emitterRef.current} />}
                />
                <Route path=":uid" element={<DeviceRoute />} />
                <Route path="login" element={<LoginRoute />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </RouterOutlet>
          </BrowserRouter>
          <Snackbar />
          <GlobalStyle />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
