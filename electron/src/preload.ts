import { contextBridge } from "electron";

// Add any exposed APIs here
contextBridge.exposeInMainWorld("electron", {
  // Add your API methods here
});
