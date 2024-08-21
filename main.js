require('dotenv').config(); // Carga las variables de entorno

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const auth = require('./src/auth/auth');
const { startServer } = require('./src/auth/auth');
const { validateToken } = require('./src/services/twitchAPI');
const tokenStore = require('./src/auth/tokenStore'); // Importa el tokenStore

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
  startServer();

  ipcMain.handle('get-access-token', async () => {
    return auth.getAccessToken();
  });

  // Manejador para validar el token leído desde tokenStore
  ipcMain.handle('validate-token', async () => {
    const token = tokenStore.loadToken(); // Lee el token desde tokenStore
    if (!token) {
      throw new Error('No se encontró ningún token');
    }
    return await validateToken(token);
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
