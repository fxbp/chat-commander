const { sendCommandToEmulator } = require('./emulatorSocketServer'); // Import the function to send commands

const commandMap = {
  u: 'Up',
  d: 'Down',
  l: 'Left',
  r: 'Right',
  a: 'A',
  b: 'B',
  st: 'Start',
  sl: 'Select',
  lb: 'L',
  rb: 'R',
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
