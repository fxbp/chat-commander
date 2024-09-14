const { sendMessage } = require('../comunication/emulatorNotifier');
const {
  sendMessage: sentToChat,
} = require('../comunication/inactiveChatNotifier');

const RANDOM_COMMAND_INTERVAL = 4 * 1000; // 1 second

// Define the available commands and their corresponding probabilities
const COMMANDS = [
  { command: 'u', probability: 0.175 },
  { command: 'd', probability: 0.175 },
  { command: 'l', probability: 0.175 },
  { command: 'r', probability: 0.175 },
  { command: 'a', probability: 0.2 },
  { command: 'b', probability: 0.1 },
];

// Calculate cumulative probabilities for easier selection
const cumulativeProbabilities = COMMANDS.reduce((acc, curr) => {
  const last = acc.length ? acc[acc.length - 1] : 0;
  return [...acc, last + curr.probability];
}, []);

// Function to get a random time component (1 to 4 seconds) formatted like "L1s", "U3s", etc.
function addRandomTime(command) {
  const time = Math.floor(Math.random() * 4) + 1; // Random number between 1 and 10
  return `${command}${time}s`;
}

function getRandomCommand() {
  const random = Math.random();
  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (random <= cumulativeProbabilities[i]) {
      const selectedCommand = COMMANDS[i].command;

      // Add a random time to the command if it's not 'a' or 'b'
      if (selectedCommand !== 'a' && selectedCommand !== 'b') {
        // 50% chance of adding time or not
        if (Math.random() < 0.8) {
          return addRandomTime(selectedCommand); // Return command with time
        }
      }
      return selectedCommand;
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
