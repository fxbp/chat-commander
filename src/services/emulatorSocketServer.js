const net = require('net');

// Create and configure the socket server
const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    // Here you could handle commands and send responses if necessary
    // For example, you could send a command to the emulator here
    // socket.write('Command sent to the emulator');
  });

  socket.on('end', () => {
    console.log('Client disconnected.');
  });

  socket.on('error', (err) => {
    console.error('Error:', err.message);
  });
});

const PORT = 55355;

// Function to start the socket server
function startServer() {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Function to send commands to the emulator (example)
function sendCommandToEmulator(command) {
  // Send the command to the emulator using the socket
  // Here you would need to handle the logic to connect and send commands
  console.log(`Command sent to the emulator: ${command}`);
}

module.exports = {
  startServer,
  sendCommandToEmulator,
};
