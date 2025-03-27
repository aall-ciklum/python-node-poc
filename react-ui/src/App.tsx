import React from "react";
import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import TodoList from "./components/TodoList";
import TodoAppBar from "./components/TodoAppBar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodoAppBar />
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <TodoList />
      </Container>
    </ThemeProvider>
  );
}

export default App;
