const { sendMessage } = require('../comunication/inactiveChatNotifier');
const tokenStore = require('../auth/tokenStore');
const { use } = require('express/lib/router');

let usernameToResetTimer = '';
let username = '';
const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes

let inactivityTimer = null;
let currentCommandGenerator = null; // Store the current command generator function

// Set the strategy for the command generator
function setCommandGenerator(generator) {
  currentCommandGenerator = generator;
}

// Function to send a message to the chat
function sendStartMessage() {
  const startMessage = {
    username: username, // Adjust this if needed
    text: 'Command generator has started!',
    timestamp: new Date().toLocaleTimeString(),
  };

  sendMessage(startMessage);
  console.log('Sent start message to chat.');
}

// Function to send a message to the chat
function sendStopMessage() {
  const startMessage = {
    username: username, // Adjust this if needed
    text: 'Command generator has stopped!',
    timestamp: new Date().toLocaleTimeString(),
  };

  sendMessage(startMessage);
  console.log('Sent Stop message to chat.');
}

// Start sending commands using the current strategy
function startInactivityTimer() {
  username = tokenStore.loadToken().username;
  usernameToResetTimer = username;
  inactivityTimer = setTimeout(() => {
    if (currentCommandGenerator) {
      sendStartMessage();
      currentCommandGenerator.start();
    }
  }, INACTIVITY_TIMEOUT);
}

// Stop sending commands and clear the inactivity timer
function stopInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }

  if (currentCommandGenerator) {
    if (currentCommandGenerator.isActive()) {
      sendStopMessage();
    }
    currentCommandGenerator.stop();
  }
}

// Reset the inactivity timer
function resetInactivityTimer(username) {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // If the message is not from the specific user, set a new timer
  if (username !== usernameToResetTimer) {
    startInactivityTimer();
  }
}

// Handle message activity
function handleMessage(username) {
  if (username === usernameToResetTimer) {
    return; // Ignore messages from the specific user, don't reset the timer
  } else {
    // Reset the inactivity timer and stop the command generator
    resetInactivityTimer(username);
    if (currentCommandGenerator) {
      if (currentCommandGenerator.isActive()) {
        sendStopMessage();
      }
      currentCommandGenerator.stop();
    }
  }
}

module.exports = {
  handleMessage,
  setCommandGenerator,
  startInactivityTimer,
  stopInactivityTimer,
};
