const { interpretAndSendCommands } = require('../services/emulatorControl');

// Function that will act as a subscriber
function sendToEmulator(message) {
  interpretAndSendCommands([message]);
}

module.exports = sendToEmulator;
