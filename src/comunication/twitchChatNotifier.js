let subscribers = [];

// Función para que los observadores se suscriban
function subscribe(subscriber) {
  subscribers.push(subscriber);
}

// Función para que los observadores se desuscriban
function unsubscribe(subscriber) {
  subscribers = subscribers.filter((sub) => sub !== subscriber);
}

// Función para notificar a todos los observadores
function notify(message) {
  subscribers.forEach((subscriber) => subscriber(message));
}

module.exports = {
  subscribe,
  unsubscribe,
  notify,
};
