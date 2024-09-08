const { subscribe } = require('./twitchChatNotifier');
const sendToBrowser = require('./browserSubscriber');
const sendToEmulator = require('./emulatorSubscriber');
const sendToActivityMonitor = require('./activityMonitorSubscriber');
const {
  subscribe: subscribeInactive,
} = require('../comunication/inactiveChatNotifier');
const sendToInactiveChat = require('./chatInactiveSubscriber');
const { subscribe: subscribeEmulator } = require('./emulatorNotifier');
// Function to manage subscriptions
function initializeSubscriptions() {
  subscribe(sendToBrowser);
  subscribe(sendToEmulator);
  subscribe(sendToActivityMonitor);
  subscribeInactive(sendToInactiveChat);
  // To avoid circular calls between subscribers and publishers, they are separated into submissions to the chat, submissions from the chat and submissions to the emulator.

  subscribeEmulator(sendToEmulator);
}

module.exports = {
  initializeSubscriptions,
};
