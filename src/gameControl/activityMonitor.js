const { sendMessage } = require('../comunication/inactiveChatNotifier');

const USERNAME_TO_RESET_TIMER = process.env.TWITCH_USERNAME;
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

let inactivityTimer = null;
let currentCommandGenerator = null; // Store the current command generator function

// Set the strategy for the command generator
function setCommandGenerator(generator) {
  currentCommandGenerator = generator;
}

// Function to send a message to the chat
function sendStartMessage() {
  const startMessage = {
    username: process.env.TWITCH_USERNAME, // Adjust this if needed
    text: 'Command generator has started!',
    timestamp: new Date().toLocaleTimeString(),
  };

  sendMessage(startMessage);
  console.log('Sent start message to chat.');
}

// Function to send a message to the chat
function sendStopMessage() {
  const startMessage = {
    username: process.env.TWITCH_USERNAME, // Adjust this if needed
    text: 'Command generator has stopped!',
    timestamp: new Date().toLocaleTimeString(),
  };

  sendMessage(startMessage);
  console.log('Sent Stop message to chat.');
}

// Start sending commands using the current strategy
function startInactivityTimer() {
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
    sendStopMessage();
    currentCommandGenerator.stop();
  }
}

// Reset the inactivity timer
function resetInactivityTimer(username) {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // If the message is not from the specific user, set a new timer
  if (username !== USERNAME_TO_RESET_TIMER) {
    startInactivityTimer();
  }
}

// Handle message activity
function handleMessage(username) {
  if (username === USERNAME_TO_RESET_TIMER) {
    return; // Ignore messages from the specific user, don't reset the timer
  } else {
    // Reset the inactivity timer and stop the command generator
    resetInactivityTimer(username);
    if (currentCommandGenerator) {
      sendStopMessage();
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
