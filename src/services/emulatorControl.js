const { sendCommandToEmulator } = require('./emulatorSocketServer'); // Import the function to send commands

const commandMap = {
  '!u': 'MOVE_UP',
  '!d': 'MOVE_DOWN',
  '!l': 'MOVE_LEFT',
  '!r': 'MOVE_RIGHT',
  '!a': 'BUTTON_A',
  '!b': 'BUTTON_B',
  '!st': 'BUTTON_START',
  '!sl': 'BUTTON_SELECT',
  '!lb': 'BUTTON_L',
  '!rb': 'BUTTON_R',
};

function sendCommand(command) {
  // Calls the function to send the command to the emulator
  sendCommandToEmulator(command);
}

function interpretAndSendCommands(messages) {
  messages.forEach((message) => {
    const command = commandMap[message.text];
    if (command) {
      sendCommand(command);
    } else {
      console.log(`Chat Commander - Unrecognized command: ${message.text}`);
    }
  });
}

module.exports = {
  interpretAndSendCommands,
};
