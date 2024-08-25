const { sendCommandToEmulator } = require('./emulatorSocketServer'); // Importa la función para enviar comandos

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
  // Llama a la función para enviar el comando al emulador
  sendCommandToEmulator(command);
}

function interpretAndSendCommands(messages) {
  messages.forEach((message) => {
    const command = commandMap[message.text];
    if (command) {
      sendCommand(command);
    } else {
      console.log(`Comando no reconocido: ${message.text}`);
    }
  });
}

module.exports = {
  interpretAndSendCommands,
};
