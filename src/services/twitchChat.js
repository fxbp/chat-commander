const WebSocket = require('ws');
const { BrowserWindow } = require('electron');
const tokenStore = require('../auth/tokenStore');
const { interpretAndSendCommands } = require('./emulatorControl');

let chatSocket = null;

function startChat() {
  const token = tokenStore.loadToken();
  const username = process.env.TWITCH_USERNAME; // Tu nombre de usuario de Twitch

  if (!token || !username) {
    console.error('Token de acceso o nombre de usuario no proporcionados.');
    return;
  }

  chatSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  chatSocket.onopen = () => {
    chatSocket.send(`PASS oauth:${token}`);
    chatSocket.send(`NICK ${username}`);
    chatSocket.send(`JOIN #${username}`);
    console.log(`Conectado al chat de Twitch como ${username}`);
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
    console.log('Desconectado del chat de Twitch');
  };

  chatSocket.onerror = (error) => {
    console.error('Error en el chat de Twitch:', error);
  };
}

function parseMessage(rawMessage) {
  const messageParts = rawMessage.split(' ');
  if (messageParts[1] === 'PRIVMSG') {
    const username = messageParts[0].split('!')[0].substring(1);
    const messageText = messageParts.slice(3).join(' ').substring(1);
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
