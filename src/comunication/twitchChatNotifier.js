const { createPubSub } = require('./pubsub');

const twitchChatNotifier = createPubSub();

module.exports = {
  subscribe: twitchChatNotifier.subscribe.bind(twitchChatNotifier),
  unsubscribe: twitchChatNotifier.unsubscribe.bind(twitchChatNotifier),
  notify: twitchChatNotifier.notify.bind(twitchChatNotifier),
};
