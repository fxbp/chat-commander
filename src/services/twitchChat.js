const WebSocket = require('ws');
const { BrowserWindow } = require('electron');
const tokenStore = require('../auth/tokenStore');
const { interpretAndSendCommands } = require('./emulatorControl');

let chatSocket = null;

async function startChat() {
  let tokenData = tokenStore.loadToken();
  const username = process.env.TWITCH_USERNAME; // Your Twitch username

  if (!tokenData || !username) {
    console.error('Access token or username not provided.');
    return;
  }

  const tokenExpiryTime = tokenData.expires_in * 1000; // convert to milliseconds
  const tokenAcquisitionTime = new Date().getTime();

  // Check if token is near expiration and refresh it
  const currentTime = new Date().getTime();
  if (currentTime - tokenAcquisitionTime >= tokenExpiryTime - 300000) {
    // Refresh 5 minutes before expiry
    try {
      const newAccessToken = await refreshAccessToken();
      tokenData.access_token = newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return;
    }
  }

  chatSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  chatSocket.onopen = () => {
    chatSocket.send(`PASS oauth:${tokenData.access_token}`);
    chatSocket.send(`NICK ${username}`);
    chatSocket.send(`JOIN #${username}`);
    console.log(`Connected to Twitch chat as ${username}`);
  };

  chatSocket.onmessage = (message) => {
    const parsedMessage = parseMessage(message.data);
    if (parsedMessage) {
      const win = BrowserWindow.getAllWindows()[0];
      if (win) {
        win.webContents.send('chat-message', parsedMessage);
      }
      interpretAndSendCommands([parsedMessage]);
    }
  };

  chatSocket.onclose = () => {
    console.log('Disconnected from Twitch chat');
  };

  chatSocket.onerror = (error) => {
    console.error('Error in Twitch chat:', error);
  };
}

function parseMessage(rawMessage) {
  const messageParts = rawMessage.split(' ');
  if (messageParts[1] === 'PRIVMSG') {
    const username = messageParts[0].split('!')[0].substring(1);
    const messageText = messageParts
      .slice(3)
      .join(' ')
      .substring(1)
      .replace(/(\r\n|\n|\r)/g, '');
    const timestamp = new Date().toLocaleTimeString();

    return {
      username,
      text: messageText,
      timestamp,
    };
  }
  return null;
}

module.exports = {
  startChat,
};
