const { createPubSub } = require('./pubsub');

const inactiveChatNotifier = createPubSub();

module.exports = {
  subscribe: inactiveChatNotifier.subscribe.bind(inactiveChatNotifier),
  unsubscribe: inactiveChatNotifier.unsubscribe.bind(inactiveChatNotifier),
  sendMessage: inactiveChatNotifier.notify.bind(inactiveChatNotifier),
};
