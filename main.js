require('dotenv').config(); // Carga las variables de entorno

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const auth = require('./src/auth/auth'); // Asegúrate de que esto exporta lo correcto

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true, // Habilita las herramientas de desarrollo
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  auth.startServer(); // Asegúrate de que startServer está exportado desde auth.js

  ipcMain.handle('get-access-token', async () => {
    return auth.getAccessToken(); // Asegúrate de que getAccessToken está exportado desde auth.js
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
