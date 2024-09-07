const { BrowserWindow } = require('electron');

// Function that will act as a subscriber
function sendToBrowser(message) {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.send('chat-message', message);
  }
}

module.exports = sendToBrowser;
