const { sendToChat } = require('../services/twitchChat');

// Function that will act as a subscriber
function sendToInactiveChat(message) {
  sendToChat(message);
}

module.exports = sendToInactiveChat;
