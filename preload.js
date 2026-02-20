// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ig", {
  download: (payload) => ipcRenderer.invoke("download", payload),
  onLog: (cb) => ipcRenderer.on("download:log", (_event, chunk) => cb(chunk))
});
