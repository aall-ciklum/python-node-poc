import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ApiStatus from "./ApiStatus";
import config from "../config";

const TodoAppBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <TaskAltIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {config.app.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ApiStatus />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TodoAppBar;
