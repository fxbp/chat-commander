const { handleMessage } = require('../services/activityMonitor');

// Function that will act as a subscriber
function sendToActivityMonitor(message) {
  handleMessage(message.username);
}

module.exports = sendToActivityMonitor;
