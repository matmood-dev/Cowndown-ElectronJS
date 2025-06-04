const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,          // 🔒 Can't resize
    maximizable: false,        // 🔒 No maximize
    fullscreenable: false,     // 🔒 No fullscreen
    center: true,              // 🎯 Center on screen
    frame: false,              // 🧱 Frameless
    titleBarStyle: 'hidden',   // (for macOS, optional)
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('http://localhost:3000');

  // ⛔ Prevent maximize via double-click
  mainWindow.on('maximize', () => {
    mainWindow.unmaximize();
  });

  // 💤 Hide to tray on close
  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}


app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Work Timer');
  tray.setContextMenu(contextMenu);
});

ipcMain.on('window:minimize', () => {
  mainWindow.minimize();
});


ipcMain.on('window:close', () => {
  mainWindow.close();
});
