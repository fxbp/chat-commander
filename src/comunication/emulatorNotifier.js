const { createPubSub } = require('./pubsub');

const emulatorNotifier = createPubSub();

module.exports = {
  subscribe: emulatorNotifier.subscribe.bind(emulatorNotifier),
  unsubscribe: emulatorNotifier.unsubscribe.bind(emulatorNotifier),
  sendMessage: emulatorNotifier.notify.bind(emulatorNotifier),
};
