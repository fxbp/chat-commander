const { subscribe, unsubscribe } = require('./twitchChatNotifier');
const sendToBrowser = require('./browserSubscriber');
const sendToEmulator = require('./emulatorSubscriber');
const sendToActivityMonitor = require('./activityMonitorSubscriber');
const {
  subscribe: subscribeInactive,
  unsubscribe: unsubscribeInteractive,
} = require('../comunication/inactiveChatNotifier');
const sendToInactiveChat = require('./chatInactiveSubscriber');
const {
  subscribe: subscribeEmulator,
  unsubscribe: unsubscribeEmulator,
} = require('./emulatorNotifier');
// Function to manage subscriptions
function initializeSubscriptions() {
  unsubscribeAll();

  subscribeAllChatNotifier();
  // To avoid circular calls between subscribers and publishers, they are separated into submissions to the chat, submissions from the chat and submissions to the emulator.
  subscribeAllInteractive();
  subscribeAllEmulator();
}

function unsubscribeAll() {
  unsubscribe(sendToBrowser);
  unsubscribe(sendToEmulator);
  unsubscribe(sendToActivityMonitor);

  unsubscribeInteractive(sendToInactiveChat);

  unsubscribeEmulator(sendToEmulator);
}

function subscribeAllChatNotifier() {
  subscribe(sendToBrowser);
  subscribe(sendToEmulator);
  subscribe(sendToActivityMonitor);
}

function subscribeAllInteractive() {
  subscribeInactive(sendToInactiveChat);
}

function subscribeAllEmulator() {
  subscribeEmulator(sendToEmulator);
}

module.exports = {
  initializeSubscriptions,
  unsubscribeAll,
};
