// electron/electron.js
const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')

const isDev = process.env.IS_DEV == 'true' ? true : false

Menu.setApplicationMenu(null)

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minHeight: 480,
    minWidth: 800,
    title: "美团商家",
    resizable: false,
    icon: path.join(__dirname, '../assets/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../dist/index.html')}`)
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: ('undocked')
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
