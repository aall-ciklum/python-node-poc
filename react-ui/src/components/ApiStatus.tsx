import React, { useState, useEffect } from "react";
import { Chip, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import axios from "axios";
import config from "../config";

const ApiStatus: React.FC = () => {
  const [connected, setConnected] = useState<boolean | null>(null);

  const checkApiConnection = async () => {
    try {
      // Try multiple endpoints to check if the API is available
      try {
        await axios.get(`${config.api.baseUrl}/todos`, { timeout: 3000 });
        setConnected(true);
        return;
      } catch (err) {
        // If /todos fails, try /api/todos
        try {
          await axios.get(`${config.api.baseUrl}/api/todos`, { timeout: 3000 });
          setConnected(true);
          return;
        } catch (err2) {
          // If both fail, try a simple GET to the root which might return API docs
          await axios.get(`${config.api.baseUrl}/`, { timeout: 3000 });
          setConnected(true);
        }
      }
    } catch (err) {
      console.error("API connection check failed:", err);
      setConnected(false);
    }
  };

  useEffect(() => {
    checkApiConnection();
    const interval = setInterval(checkApiConnection, 30000); // Check every 30 seconds

    // Clean up the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  if (connected === null) {
    return (
      <Tooltip title="Checking API connection...">
        <Chip label="Checking API" color="default" size="small" sx={{ ml: 2 }} />
      </Tooltip>
    );
  }

  return connected ? (
    <Tooltip title="API is connected">
      <Chip icon={<CheckCircleIcon />} label="API Connected" color="success" size="small" sx={{ ml: 2 }} />
    </Tooltip>
  ) : (
    <Tooltip title="API connection failed. Please check your API server.">
      <Chip icon={<ErrorIcon />} label="API Disconnected" color="error" size="small" sx={{ ml: 2 }} />
    </Tooltip>
  );
};

export default ApiStatus;
