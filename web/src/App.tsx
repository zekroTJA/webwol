import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainRoute } from "./routes/Main";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { LoginRoute } from "./routes/Login";
import { DefaultTheme } from "./theme/theme";
import { Snackbar } from "./components/snackbar";
import { DeviceRoute } from "./routes/Device";

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
`;

const RouterOutlet = styled.div`
  padding: 1em;
  height: 100%;
  overflow-y: auto;
`;

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={DefaultTheme}>
        <Container>
          <RouterOutlet>
            <BrowserRouter>
              <Routes>
                <Route index element={<MainRoute />} />
                <Route path=":uid" element={<DeviceRoute />} />
                <Route path="login" element={<LoginRoute />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </RouterOutlet>
          <Snackbar />
          <GlobalStyle />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
