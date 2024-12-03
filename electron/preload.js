const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // File system operations
  selectDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  readDirectory: (path) => ipcRenderer.invoke('fs:readDirectory', path),
  readFile: (path) => ipcRenderer.invoke('fs:readFile', path),
  fileExists: (path) => ipcRenderer.invoke('fs:fileExists', path),
  readImage: (path) => ipcRenderer.invoke('fs:readImage', path),
})
