'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'



import './store'



const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth :  560,
    minHeight : 280,
    webPreferences: {
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.removeMenu()


  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

let defaultWebPreferences = {
  webSecurity: false,
  nodeIntegration: true,
  contextIsolation: false,
  enableRemoteModule: true
}

let preferencesWindow;
let colorPickerwindow;

ipcMain.on('showPreferences', function (e, data) {
  if(!preferencesWindow){
    const modalPath = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080/#/preferences'
      : `file://${__dirname}/index.html#preferences`
    preferencesWindow = new BrowserWindow({ 
      width: 800, 
      height: 400, 
      webPreferences: defaultWebPreferences,
      title: 'Music-Manager Preferences',
      parent: win,
      backgroundColor: '#222222',
    })
    //preferencesWindow.removeMenu()
    preferencesWindow.on('closed', function () { 
      preferencesWindow = null 
    });
    preferencesWindow.on('page-title-updated', function(e) {
      e.preventDefault()
    });
    preferencesWindow.loadURL(modalPath)

  }
  else {
    preferencesWindow.show()
  }
})


ipcMain.on('showColorPicker', function (e, data) {
  if(!colorPickerwindow){
    const modalPath = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080/#/color-picker'
      : `file://${__dirname}/index.html#color-picker`
    colorPickerwindow = new BrowserWindow({ 
      width: 519, 
      height: 315, 
      webPreferences: defaultWebPreferences,
      title: 'Color Picker',
      parent: preferencesWindow,
      backgroundColor: '#222222',
      //resizable: false,
    })
    //colorPickerwindow.removeMenu()
    colorPickerwindow.on('closed', function () { 
      colorPickerwindow = null 
    });
    colorPickerwindow.on('page-title-updated', function(e) {
      e.preventDefault()
    });
    colorPickerwindow.loadURL(modalPath)

  }
  else {
    colorPickerwindow.show()
  }
})

ipcMain.on('preferences-update' , (event,arg) => {
  preferencesWindow.send('preferences-update',arg)
})

ipcMain.on('vuex-update', (event, arg) => {
  win.send('vuex-update',arg);
})