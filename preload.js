// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
  onAddMovie: (listner) => ipcRenderer.on("onAddMovie", (event, url) => listner(event, url)),
  onSkipRequest: (listner) => ipcRenderer.on("onSkipRequest", (event) => listner(event)),
  onPlayRequest: (listner) => ipcRenderer.on("onPlayRequest", (event) => listner(event)),
  onPauseRequest: (listner) => ipcRenderer.on("onPauseRequest", (event) => listner(event)),
  onTimebackRequest: (listner) => ipcRenderer.on("onTimebackRequest", (event, time) => listner(event, time)),
  onTimegoRequest: (listner) => ipcRenderer.on("onTimegoRequest", (event, time) => listner(event, time)),
})
