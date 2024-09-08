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
  // If a message is sent over the socket, Twitch treats it as an echo and does not retransmit it to the socket again. Send direct message to emulator
  // Sending input messages to Twitch chat is currently disabled
  // subscribeEmulator(sendToInactiveChat);
  subscribeEmulator(sendToEmulator);
}

module.exports = {
  initializeSubscriptions,
};
