// Configuration for the application
// You can modify these values to match your environment

const config = {
  // API configuration
  api: {
    // Base URL for the API
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:8000",

    // API timeout in milliseconds
    timeout: 10000,

    // Whether to include credentials in API requests
    withCredentials: false,
  },

  // Application configuration
  app: {
    // Application name
    name: "Todo Application",

    // Application version
    version: "1.0.0",
  },
};

export default config;
