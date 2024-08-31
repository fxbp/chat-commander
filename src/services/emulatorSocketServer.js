const net = require('net');

const PORT = 55355;
let clients = []; // Maintain a list of connected clients

// Create and configure the socket server
const server = net.createServer((socket) => {
  console.log('Commander - Client connected.');
  clients.push(socket); // Add the client to the list of clients

  socket.on('data', (data) => {
    console.log('Commander - Received:', data.toString());
    // Here you could handle the emulator's input if needed
  });

  socket.on('end', () => {
    console.log('Client disconnected.');
    // Remove the client from the list
    clients = clients.filter((client) => client !== socket);
  });

  socket.on('error', (err) => {
    console.error('Error:', err.message);
  });
});

// Function to start the socket server
function startServer() {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Function to send commands to the emulator
function sendCommandToEmulator(command) {
  // Send the command to all connected clients
  clients.forEach((client) => {
    try {
      const message = `${command}`;
      const messageLength = message.length;
      const formattedMessage = `${messageLength} ${message}`;
      console.log('Sending', formattedMessage);
      client.write(formattedMessage);
    } catch (error) {
      console.error('Failed to send command:', error.message);
    }
  });
}

module.exports = {
  startServer,
  sendCommandToEmulator,
};
