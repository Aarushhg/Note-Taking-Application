const { app, BrowserWindow, ipcMain } = require('electron');  // Added ipcMain
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,  // Make sure contextIsolation is false if you use nodeIntegration
    },
  });

  mainWindow.loadFile('index.html');

  // Uncomment for debugging
  // mainWindow.webContents.openDevTools();
});

// Listen for popout-note IPC message
ipcMain.on('popout-note', (event, noteData) => {
  const popoutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    alwaysOnTop: true,   // Keep the window on top
    frame: true,         // You can set false for frameless if you want minimal UI
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load a special popout HTML page with note content and color
  // We'll pass content & color as query parameters encoded in URL or
  // you can use ipc communication after loading

  // Encode data as base64 to pass safely in URL
  const contentBase64 = Buffer.from(noteData.content).toString('base64');
  const color = noteData.color;

  // Assuming you have a popout.html file to handle rendering the popped note
  popoutWindow.loadURL(`file://${path.join(__dirname, 'popout.html')}?content=${contentBase64}&color=${color}`);

  // Uncomment to debug
  // popoutWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
