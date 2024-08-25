const net = require('net');

// Crea y configura el servidor de sockets
const server = net.createServer((socket) => {
  console.log('Cliente conectado.');

  socket.on('data', (data) => {
    console.log('Recibido:', data.toString());
    // Aquí podrías manejar los comandos y enviar respuestas si es necesario
    // Por ejemplo, podrías enviar un comando al emulador aquí
    // socket.write('Comando enviado al emulador');
  });

  socket.on('end', () => {
    console.log('Cliente desconectado.');
  });

  socket.on('error', (err) => {
    console.error('Error:', err.message);
  });
});

const PORT = 55355;

// Función para iniciar el servidor de sockets
function startServer() {
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

// Función para enviar comandos al emulador (ejemplo)
function sendCommandToEmulator(command) {
  // Enviar el comando al emulador usando el socket
  // Aquí necesitarías manejar la lógica para conectarte y enviar comandos
  console.log(`Comando enviado al emulador: ${command}`);
}

module.exports = {
  startServer,
  sendCommandToEmulator,
};
