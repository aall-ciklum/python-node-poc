import React, { useState } from "react";
import { Box, Button, TextField, Paper, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddTodoProps {
  onAddTodo: (title: string, description: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    onAddTodo(title, description);
    setTitle("");
    setDescription("");
    setError("");
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box>
            <TextField
              fullWidth
              label="Todo Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!error}
              helperText={error}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              size="small"
              multiline
              rows={2}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
              Add Todo
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddTodo;
