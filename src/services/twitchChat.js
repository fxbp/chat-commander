const WebSocket = require('ws');
const tokenStore = require('../auth/tokenStore');
const { refreshAccessToken } = require('../auth/auth');
const { notify } = require('../comunication/twitchChatNotifier');

let chatSocket = null;
let reconnectTimeout = null;

// Main function to start Twitch chat
async function startChat() {
  // Manage WebSocket connection state
  if (manageWebSocketConnection()) {
    return;
  }

  let tokenData = tokenStore.loadToken();
  const username = process.env.TWITCH_USERNAME;

  if (!tokenData || !username) {
    console.error('Access token or username not provided.');
    return;
  }

  // Check if the token is still active and refresh it if necessary
  await ensureTokenIsActive(tokenData);

  // Initialize and configure WebSocket connection
  initializeChatSocket(tokenData.access_token, username);
}

// Function to manage the WebSocket connection state
function manageWebSocketConnection() {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    console.log('Chat is already connected. Ignoring start request.');
    return true;
  }

  if (chatSocket) {
    chatSocket.close();
    chatSocket = null;
  }

  return false;
}

// Function to ensure the token is active and refresh if needed
async function ensureTokenIsActive(tokenData) {
  const tokenExpiryTime = tokenData.expires_in * 1000; // Convert to milliseconds
  const tokenAcquisitionTime = new Date().getTime();

  const currentTime = new Date().getTime();
  if (currentTime - tokenAcquisitionTime >= tokenExpiryTime - 300000) {
    // Refresh 5 minutes before expiry
    try {
      const newAccessToken = await refreshAccessToken();
      tokenData.access_token = newAccessToken;
      tokenData.expires_in = new Date().getTime() / 1000 + 3600; // Assuming new token is valid for 1 hour
      tokenStore.saveToken(tokenData); // Save the updated token data
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }
}

// Function to initialize and configure the WebSocket connection
function initializeChatSocket(accessToken, username) {
  chatSocket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  chatSocket.onopen = () => handleSocketOpen(accessToken, username);
  chatSocket.onmessage = (message) => handleSocketMessage(message);
  chatSocket.onclose = () => handleSocketClose();
  chatSocket.onerror = (error) => handleSocketError(error);
}

// Handle WebSocket open event
function handleSocketOpen(accessToken, username) {
  chatSocket.send(`PASS oauth:${accessToken}`);
  chatSocket.send(`NICK ${username}`);
  chatSocket.send(`JOIN #${username}`);
  console.log(`Connected to Twitch chat as ${username}`);
}

// Handle WebSocket message event
function handleSocketMessage(message) {
  const rawMessage = message.data;

  if (isPingMessage(rawMessage)) {
    respondToPing();
    return;
  }

  const parsedMessage = parseChatMessage(rawMessage);
  if (parsedMessage) {
    notify(parsedMessage);
  }
}

// Check if the received message is a PING message
function isPingMessage(rawMessage) {
  return rawMessage.startsWith('PING');
}

// Respond to PING message to keep the connection alive
function respondToPing() {
  chatSocket.send('PONG :tmi.twitch.tv');
  console.log('Received PING, sent PONG');
}

// Parse a Twitch chat message
function parseChatMessage(rawMessage) {
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

// Handle WebSocket close event
function handleSocketClose() {
  console.log('Disconnected from Twitch chat');
  attemptReconnect(); // Attempt to reconnect when the socket is closed
}

// Handle WebSocket error event
function handleSocketError(error) {
  console.error('Error in Twitch chat:', error);
  attemptReconnect(); // Attempt to reconnect on error
}

// Attempt to reconnect to Twitch chat after a delay
function attemptReconnect() {
  const reconnectDelay = 5000; // 5 seconds delay before attempting to reconnect
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  reconnectTimeout = setTimeout(() => {
    console.log('Attempting to reconnect to Twitch chat...');
    startChat(); // Reconnect by restarting the chat
  }, reconnectDelay);
}

module.exports = {
  startChat,
};
