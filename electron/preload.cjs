const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // File system operations
  selectDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  readDirectory: (path) => ipcRenderer.invoke('fs:readDirectory', path),
  readFile: (path) => ipcRenderer.invoke('fs:readFile', path),
  fileExists: (path) => ipcRenderer.invoke('fs:fileExists', path),
  readImage: (path) => ipcRenderer.invoke('fs:readImage', path),
  getVideoFileUrl: (path) => ipcRenderer.invoke('video:getFileUrl', path),
  openFileLocation: (path) => ipcRenderer.invoke('system:openFileLocation', path),
  openExternalUrl: (url) => ipcRenderer.invoke('system:openExternalUrl', url),
  
  // Auto-update functionality
  checkForUpdates: () => ipcRenderer.invoke('update:checkForUpdates'),
  downloadUpdate: () => ipcRenderer.invoke('update:downloadUpdate'),
  quitAndInstall: () => ipcRenderer.invoke('update:quitAndInstall'),
  
  // Event listeners
  onUpdateStatus: (callback) => {
    const updateStatusListener = (_, data) => callback(data);
    ipcRenderer.on('update-status', updateStatusListener);
    return () => {
      ipcRenderer.removeListener('update-status', updateStatusListener);
    };
  }
})
