const { sendMessage } = require('../comunication/emulatorNotifier');
const RANDOM_COMMANDS = ['u', 'd', 'l', 'r', 'a', 'b', 'st'];
const RANDOM_COMMAND_INTERVAL = 1000; // 1 second
let randomCommandInterval = null;

function start() {
  if (randomCommandInterval) return;

  randomCommandInterval = setInterval(() => {
    const randomCommand =
      RANDOM_COMMANDS[Math.floor(Math.random() * RANDOM_COMMANDS.length)];
    const commandMessage = {
      username: process.env.TWITCH_USERNAME,
      text: randomCommand,
      timestamp: new Date().toLocaleTimeString(),
    };

    sendMessage(commandMessage);
    console.log(`Sent random command: ${randomCommand}`);
  }, RANDOM_COMMAND_INTERVAL);
}

function stop() {
  if (randomCommandInterval) {
    clearInterval(randomCommandInterval);
    randomCommandInterval = null;
  }
}

module.exports = {
  start,
  stop,
};
