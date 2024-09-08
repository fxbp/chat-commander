const { sendMessage } = require('../comunication/inactiveChatNotifier');

const RANDOM_COMMAND_INTERVAL = 2 * 1000; // 1 second

// Define the available commands and their corresponding probabilities
const COMMANDS = [
  { command: 'up', probability: 0.3 },
  { command: 'down', probability: 0.3 },
  { command: 'left', probability: 0.2 },
  { command: 'right', probability: 0.2 },
  { command: 'a', probability: 0.15 },
  { command: 'b', probability: 0.05 },
  { command: 'start', probability: 0.1 },
  { command: 'select', probability: 0.05 },
];

// Calculate cumulative probabilities for easier selection
const cumulativeProbabilities = COMMANDS.reduce((acc, curr) => {
  const last = acc.length ? acc[acc.length - 1] : 0;
  return [...acc, last + curr.probability];
}, []);

function getRandomCommand() {
  const random = Math.random();
  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (random <= cumulativeProbabilities[i]) {
      return COMMANDS[i].command;
    }
  }
  return COMMANDS[COMMANDS.length - 1].command; // Fallback
}

let probabilityCommandInterval = null;

function start() {
  if (probabilityCommandInterval) return;

  probabilityCommandInterval = setInterval(() => {
    const randomCommand = getRandomCommand();
    const commandMessage = {
      username: process.env.TWITCH_USERNAME,
      text: randomCommand,
      timestamp: new Date().toLocaleTimeString(),
    };

    sendMessage(commandMessage);
    console.log(`Sent command: ${randomCommand}`);
  }, RANDOM_COMMAND_INTERVAL);
}

function stop() {
  if (probabilityCommandInterval) {
    clearInterval(probabilityCommandInterval);
    probabilityCommandInterval = null;
  }
}

module.exports = {
  start,
  stop,
};
