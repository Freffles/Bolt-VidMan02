const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs/promises')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
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
