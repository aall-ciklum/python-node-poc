import React from "react";
import { Box, Checkbox, IconButton, Typography, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Todo } from "../services/todoService";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const handleToggle = () => {
    onToggle(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={1}
      sx={{
        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
      }}
    >
      <Checkbox checked={todo.completed} onChange={handleToggle} color="primary" />
      <Box flexGrow={1} ml={1}>
        <Typography
          variant="body1"
          sx={{
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "text.secondary" : "text.primary",
          }}
        >
          {todo.title}
        </Typography>
        {todo.description && (
          <Typography variant="body2" color="text.secondary">
            {todo.description}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(todo.created_at).toLocaleString()}
        </Typography>
      </Box>
      <Tooltip title="Delete">
        <IconButton edge="end" onClick={handleDelete} color="error">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TodoItem;
