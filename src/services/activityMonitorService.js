const activityMonitor = require('../gameControl/activityMonitor');
const randomCommandGenerator = require('../gameControl/commandGenerator');
const probabilityCommandGenerator = require('../gameControl/probabilityCommandGenerator');
const { sendMessage } = require('../communication/inactiveChatNotifier');

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

// Function to set the command generator strategy
function setCommandGeneratorStrategy(useProbabilityStrategy) {
  if (useProbabilityStrategy) {
    activityMonitor.setCommandGenerator({
      start: probabilityCommandGenerator.start,
      stop: probabilityCommandGenerator.stop,
    });
  } else {
    activityMonitor.setCommandGenerator({
      start: randomCommandGenerator.start,
      stop: randomCommandGenerator.stop,
    });
  }
}

// Function to initialize the activity monitor
function initializeActivityMonitor(useProbabilityStrategy) {
  setCommandGeneratorStrategy(useProbabilityStrategy);
  startActivityMonitor();
}

// Function to start the activity monitor
function startActivityMonitor() {
  sendStartMessage();
  activityMonitor.startInactivityTimer();
}

// Function to stop the activity monitor
function stopActivityMonitor() {
  activityMonitor.stopInactivityTimer();
}

module.exports = {
  initializeActivityMonitor,
  startActivityMonitor,
  stopActivityMonitor,
};
