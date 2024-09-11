const { sendMessage } = require('../comunication/emulatorNotifier');
const {
  sendMessage: sentToChat,
} = require('../comunication/inactiveChatNotifier');

const RANDOM_COMMAND_INTERVAL = 2 * 1000; // 1 second

// Define the available commands and their corresponding probabilities
const COMMANDS = [
  { command: 'u', probability: 0.15 },
  { command: 'd', probability: 0.15 },
  { command: 'l', probability: 0.15 },
  { command: 'r', probability: 0.15 },
  { command: 'a', probability: 0.3 },
  { command: 'b', probability: 0.1 },
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
let active = false;

function start() {
  if (probabilityCommandInterval) return;
  active = true;
  probabilityCommandInterval = setInterval(() => {
    const randomCommand = getRandomCommand();
    const commandMessage = {
      username: process.env.TWITCH_USERNAME,
      text: randomCommand,
      timestamp: new Date().toLocaleTimeString(),
    };

    const commandChatMessage = {
      username: process.env.TWITCH_USERNAME,
      text: `(Generated command): ${randomCommand}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    sendMessage(commandMessage);
    sentToChat(commandChatMessage);
    console.log(`Sent command: ${randomCommand}`);
  }, RANDOM_COMMAND_INTERVAL);
}

function stop() {
  if (probabilityCommandInterval) {
    clearInterval(probabilityCommandInterval);
    probabilityCommandInterval = null;
    active = false;
  }
}

function isActive() {
  return active;
}

module.exports = {
  start,
  stop,
  isActive,
};
