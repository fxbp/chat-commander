const { sendMessage } = require('../comunication/emulatorNotifier');
const {
  sendMessage: sendToChat,
} = require('../comunication/inactiveChatNotifier');

const RANDOM_COMMANDS = ['u', 'd', 'l', 'r', 'a', 'b', 'st'];
const RANDOM_COMMAND_INTERVAL = 1000; // 1 second

let randomCommandInterval = null;
let active = false;

function start() {
  if (randomCommandInterval) return;
  active = true;
  randomCommandInterval = setInterval(() => {
    const randomCommand =
      RANDOM_COMMANDS[Math.floor(Math.random() * RANDOM_COMMANDS.length)];
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
    sendToChat(commandChatMessage);
    console.log(`Sent random command: ${randomCommand}`);
  }, RANDOM_COMMAND_INTERVAL);
}

function stop() {
  if (randomCommandInterval) {
    clearInterval(randomCommandInterval);
    randomCommandInterval = null;
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
