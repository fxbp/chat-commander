require('dotenv').config(); // Carga las variables de entorno

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const auth = require('./src/auth/auth');
const { startServer } = require('./src/auth/auth');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/ui/renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  startServer(); // Asegúrate de que el servidor se inicie aquí

  ipcMain.handle('get-access-token', async () => {
    return auth.getAccessToken();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Verifica si el servidor Express está escuchando
  console.log('App is ready and server should be running');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
