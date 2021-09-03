const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

process.env.NODE_ENV = 'production';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1024, height: 768,frame: true,backgroundColor: '#2e2c29',webPreferences: { nodeIntegration: true },});
  mainWindow.setMenu(null);
  //mainWindow.setFullScreen(true);
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }

});

app.on('getDb', function (event, arg) {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    event.returnValue = 'pong'
});
