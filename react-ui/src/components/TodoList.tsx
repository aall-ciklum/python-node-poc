import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Paper, Typography, Divider, Alert, Snackbar } from "@mui/material";
import { todoService, Todo } from "../services/todoService";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      console.log("Fetching todos from API...");
      const data = await todoService.getAllTodos();
      console.log("Todos received:", data);
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to load todos. Please ensure your API server is running at the correct address.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (title: string, description: string) => {
    try {
      setLoading(true);
      const newTodo = await todoService.createTodo({ title, description });
      setTodos([...todos, newTodo]);
      showSnackbar("Todo added successfully!", "success");
    } catch (err) {
      console.error("Error adding todo:", err);
      showSnackbar("Failed to add todo. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      console.log(`Attempting to toggle status for todo ${id}`);
      const updatedTodo = await todoService.toggleTodoStatus(id, completed);
      console.log("Toggle successful, updated todo:", updatedTodo);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      showSnackbar(`Todo marked as ${updatedTodo.completed ? "completed" : "incomplete"}`, "success");
    } catch (err: any) {
      console.error("Error toggling todo status:", err);
      let errorMessage = "Failed to update todo status. ";

      // Add more detailed error information
      if (err.response) {
        errorMessage += `Server error: ${err.response.status} ${err.response.statusText}`;
        if (err.response.data && err.response.data.message) {
          errorMessage += ` - ${err.response.data.message}`;
        }
      } else if (err.request) {
        errorMessage += "No response from server. Check your API connection.";
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }

      showSnackbar(errorMessage, "error");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
      showSnackbar("Todo deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting todo:", err);
      showSnackbar("Failed to delete todo. Please try again.", "error");
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Todos
      </Typography>

      <AddTodo onAddTodo={handleAddTodo} />

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : todos.length > 0 ? (
          todos.map((todo, index) => (
            <React.Fragment key={todo.id}>
              {index > 0 && <Divider />}
              <TodoItem todo={todo} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
            </React.Fragment>
          ))
        ) : (
          <Typography align="center" color="textSecondary" p={3}>
            No todos found. Add a new one to get started!
          </Typography>
        )}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TodoList;
