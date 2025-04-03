import { app, BrowserWindow } from "electron";
import * as path from "path";
import { spawn, ChildProcess } from "child_process";

import * as fs from "fs";

let backendProcess: ChildProcess | null = null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }
}

function startBackend() {
  const isDev = process.env.NODE_ENV === "development";

  const backendPath = isDev
    ? path.join(__dirname, "../build/python-api/main") // dev path
    : path.join(process.resourcesPath, "app.asar.unpacked", "build/python-api/main"); // prod path after packaging

  const backendExecutable = process.platform === "win32" ? `${backendPath}.exe` : backendPath;

  // Optional: Log backend output in production
  const out = fs.openSync(path.join(app.getPath("userData"), "backend-out.log"), "a");
  const err = fs.openSync(path.join(app.getPath("userData"), "backend-err.log"), "a");

  backendProcess = spawn(backendExecutable, [], {
    cwd: path.dirname(backendExecutable),
    detached: true,
    stdio: ["ignore", out, err],
  });

  backendProcess.unref();
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Optional: Gracefully kill backend on quit (only needed if not detached)
app.on("before-quit", () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
});
