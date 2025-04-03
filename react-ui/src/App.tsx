import React, { useEffect, useState } from "react";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectToApi = async () => {
      // Simulate API connection attempt
      return new Promise((resolve, reject) => {
        const success = Math.random() > 0.5; // Simulate 50% success rate
        setTimeout(() => {
          success ? resolve("Connected") : reject("Failed to connect");
        }, 1000);
      });
    };

    const retryConnection = async (retries: number) => {
      for (let i = 0; i < retries; i++) {
        try {
          console.log("Connecting to API");
          await connectToApi();
          return;
        } catch (err) {
          console.log(`Attempt ${i + 1} failed. Retrying in 10 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }
      setError("Failed to connect to API after 5 attempts.");
    };

    retryConnection(5);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodoAppBar />
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        {error ? <div style={{ color: "red" }}>{error}</div> : <TodoList />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
