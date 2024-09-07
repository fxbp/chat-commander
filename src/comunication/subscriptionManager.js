const { subscribe } = require('./twitchChatNotifier');
const sendToBrowser = require('./browserSubscriber');
const sendToEmulator = require('./emulatorSubscriber');

// Function to manage subscriptions
function initializeSubscriptions() {
  subscribe(sendToBrowser);
  subscribe(sendToEmulator);
}

module.exports = {
  initializeSubscriptions,
};
