require('dotenv').config();

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const auth = require('./src/auth/auth');
const { startServer } = require('./src/auth/auth');
const { validateToken } = require('./src/services/twitchAPI');
const tokenStore = require('./src/auth/tokenStore');
const { startChat, closeChatConnection } = require('./src/services/twitchChat');
const {
  startServer: startSocketServer,
} = require('./src/services/emulatorSocketServer');
const {
  initializeSubscriptions,
  unsubscribeAll,
} = require('./src/comunication/subscriptionManager');

const {
  initializeActivityMonitor,
  stopActivityMonitor,
} = require('./src/services/activityMonitorService');

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
  startSocketServer();

  ipcMain.handle('get-access-token', async () => {
    return auth.getAccessToken();
  });

  // Handler to validate the token read from tokenStore
  ipcMain.handle('validate-token', async () => {
    const token = tokenStore.loadToken(); // Read the token from tokenStore
    if (!token) {
      throw new Error('No token found');
    }
    return await validateToken(token.access_token);
  });

  ipcMain.handle('start-chat', async () => {
    await startChat(); // Call the Twitch chat service
    initializeSubscriptions();
    setTimeout(() => {
      initializeActivityMonitor(true);
    }, 2000);
  });

  ipcMain.handle('stop-chat', async () => {
    closeChatConnection(); // Call the Twitch chat service
    unsubscribeAll();
    stopActivityMonitor();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Check if the Express server is listening
  console.log('App is ready and server should be running');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
