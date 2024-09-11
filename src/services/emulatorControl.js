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

function parseCommand(input) {
  const commandPattern = /^([a-z]+)(\d+)(ms|s)$/i;
  const match = input.match(commandPattern);

  if (!match) {
    return { command: input, duration: 300 }; // Default duration is 300ms if not specified
  }

  const [, command, durationValue, timeUnit] = match;
  const duration =
    timeUnit === 'ms'
      ? parseInt(durationValue, 10)
      : parseInt(durationValue, 10) * 1000; // Convert seconds to milliseconds

  // Enforce a maximum duration of 10 seconds (10,000 ms)
  if (duration > 10000) {
    duration = 10000; // Cap the duration at 10,000 ms
  }
  return { command, duration };
}

function interpretAndSendCommands(messages) {
  messages.forEach((message) => {
    const parsedCommand = parseCommand(message.text.toLowerCase());
    const command = `${commandMap[parsedCommand.command]}:${
      parsedCommand.duration
    }`;
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
