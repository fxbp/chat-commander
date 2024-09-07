let subscribers = [];

function subscribe(subscriber) {
  subscribers.push(subscriber);
}

function unsubscribe(subscriber) {
  subscribers = subscribers.filter((sub) => sub !== subscriber);
}

function notify(message) {
  subscribers.forEach((subscriber) => subscriber(message));
}
function sendMessage(message) {
  notify(message);
}

module.exports = {
  subscribe,
  unsubscribe,
  sendMessage,
};
