const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs/promises')
const { autoUpdater } = require('electron-updater')
const { URL } = require('url')
// Force development mode when running with electron:dev script
const isDev = !app.isPackaged || process.env.NODE_ENV === 'development'

let mainWindow

// Configure auto updater
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false, // Allow loading local video files
      devTools: isDev
    }
  })

  // Set app icon
  try {
    if (process.platform === 'win32') {
      const iconPath = path.join(__dirname, '../public/icon.ico');
      if (require('fs').existsSync(iconPath)) {
        mainWindow.setIcon(iconPath);
      }
    } else if (process.platform === 'darwin') {
      const iconPath = path.join(__dirname, '../public/icon.icns');
      if (require('fs').existsSync(iconPath)) {
        mainWindow.setIcon(iconPath);
      }
    } else {
      const iconPath = path.join(__dirname, '../public/icon.png');
      if (require('fs').existsSync(iconPath)) {
        mainWindow.setIcon(iconPath);
      }
    }
  } catch (error) {
    console.warn('Failed to set application icon:', error.message);
  }

  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173')
    console.log('Loading from Vite dev server at http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // In production, load from the built files
    console.log('Loading from production build at', path.join(__dirname, '../dist/index.html'))
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
  
  // Check for updates after window is created (only in production)
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.', info)
})

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.', info)
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater.', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`
  sendStatusToWindow('Download progress', { message, progressObj })
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded', info)
})

// Helper function to send status to renderer
function sendStatusToWindow(status, data = null) {
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { status, data })
  }
}

// IPC handlers for auto-updater
ipcMain.handle('update:checkForUpdates', () => {
  if (isDev) {
    sendStatusToWindow('Dev mode - no updates checked')
    return { success: false, message: 'In development mode - updates disabled' }
  }
  
  try {
    autoUpdater.checkForUpdates()
    return { success: true }
  } catch (error) {
    console.error('Error checking for updates:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('update:downloadUpdate', () => {
  if (isDev) {
    return { success: false, message: 'In development mode - updates disabled' }
  }
  
  try {
    autoUpdater.downloadUpdate()
    return { success: true }
  } catch (error) {
    console.error('Error downloading update:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('update:quitAndInstall', () => {
  autoUpdater.quitAndInstall()
})

// File system operations
ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  return result.filePaths[0]
})

ipcMain.handle('fs:readDirectory', async (_, path) => {
  try {
    const entries = await fs.readdir(path, { withFileTypes: true })
    return entries.map(entry => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile()
    }))
  } catch (error) {
    console.error('Error reading directory:', error)
    throw error
  }
})

// Video playback operations
ipcMain.handle('video:getFileUrl', async (_, filePath) => {
  try {
    // Check if file exists
    await fs.access(filePath)
    
    // Convert the file path to a URL format that can be used in the video element
    return new URL(`file://${filePath}`).href
  } catch (error) {
    console.error('Error accessing video file:', error)
    throw error
  }
})

// System operations
ipcMain.handle('system:openFileLocation', async (_, filePath) => {
  try {
    shell.showItemInFolder(filePath)
    return true
  } catch (error) {
    console.error('Error opening file location:', error)
    throw error
  }
})

ipcMain.handle('system:openExternalUrl', (_, url) => shell.openExternal(url))

ipcMain.handle('fs:readFile', async (_, path) => {
  try {
    const content = await fs.readFile(path, 'utf8')
    return content
  } catch (error) {
    console.error('Error reading file:', error)
    throw error
  }
})

ipcMain.handle('fs:fileExists', async (_, path) => {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
})

ipcMain.handle('fs:readImage', async (_, path) => {
  try {
    const buffer = await fs.readFile(path)
    return `data:image/jpeg;base64,${buffer.toString('base64')}`
  } catch (error) {
    console.error('Error reading image:', error)
    throw error
  }
})
