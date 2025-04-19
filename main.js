const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const auth = require('./src/auth/auth');
const { startServer, restartServer } = require('./src/auth/auth');
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

const {
  getDefaultSettings,
  saveSettings,
  getSettings,
} = require('./src/settings/config');
const { set } = require('express/lib/application');

let win;

let options = { generateActions: false };

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/ui/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
    autoHideMenuBar: true,
  });

  checkTokenAndLoad();
  Menu.setApplicationMenu(null);
}

// Check if token is valid, and load appropriate view
async function checkTokenAndLoad() {
  const token = tokenStore.loadToken();
  if (!token || !(await validateToken(token.access_token))) {
    // Load the login view if the token is not valid
    win.loadFile('login.html');
  } else {
    // Load the main view if the token is valid
    win.loadFile('main.html');
  }
}

app.whenReady().then(() => {
  createWindow();
  const config = getSettings();
  startServer(config);
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
    const validationResult = await validateToken(token.access_token);
    const newToken = { ...token, username: validationResult.login };
    tokenStore.saveToken(newToken);
    return validationResult;
  });

  ipcMain.handle('start-chat', async () => {
    await startChat(); // Call the Twitch chat service
    initializeSubscriptions();
  });

  ipcMain.handle('stop-chat', async () => {
    closeChatConnection(); // Call the Twitch chat service
    unsubscribeAll();
    stopActivityMonitor();
  });

  ipcMain.handle('logout', async () => {
    tokenStore.deleteToken();
    closeChatConnection();
    stopActivityMonitor();
    win.loadFile('login.html');
  });

  ipcMain.on('send-options', (event, newOptions) => {
    options.generateActions = newOptions.generateActions;
    stopActivityMonitor();

    if (options.generateActions) {
      setTimeout(() => {
        initializeActivityMonitor(true);
      }, 2000);
    }
  });

  ipcMain.on('reset-settings', (event) => {
    const defaultSettings = getDefaultSettings();
    saveSettings(defaultSettings);
    restartServer(defaultSettings);
    event.sender.send('settings-reset', defaultSettings);
  });

  ipcMain.on('save-settings', (event, settings) => {
    try {
      saveSettings(settings);
      restartServer(settings);
      event.sender.send('settings-saved');
    } catch (err) {
      console.error('Error saving settings:', err);
      event.sender.send('settings-save-error', err.message);
    }
  });

  ipcMain.on('load-custom-settings', (event) => {
    const customSettings = getSettings();
    event.sender.send('settings-loaded', customSettings);
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
