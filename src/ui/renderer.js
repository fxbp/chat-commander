const { ipcRenderer } = require('electron');

document.getElementById('loginButton').addEventListener('click', async () => {
  try {
    const token = await ipcRenderer.invoke('get-access-token');
    console.log('Access Token:', token);
    // Aquí puedes hacer algo con el token, como mostrar un mensaje o iniciar otra función
  } catch (error) {
    console.error('Error during authentication:', error);
  }
});

document
  .getElementById('validateTokenButton')
  .addEventListener('click', async () => {
    try {
      // Llama al proceso principal para validar el token almacenado
      const result = await ipcRenderer.invoke('validate-token');
      if (result) {
        alert('El token es válido. Usuario: ' + result.login);
      } else {
        alert('El token no es válido.');
      }
    } catch (error) {
      console.error('Error during token validation:', error);
    }
  });

document.getElementById('startButton').addEventListener('click', async () => {
  try {
    await ipcRenderer.invoke('start-chat');
  } catch (error) {
    console.error('Error starting chat:', error);
  }
});

// Manejador para recibir mensajes de chat desde el proceso principal
ipcRenderer.on('chat-message', (event, message) => {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.textContent = `${message.timestamp} - ${message.username}: ${message.text}`;
  chatBox.appendChild(messageElement);

  // Mantener solo los últimos 10 mensajes
  if (chatBox.children.length > 10) {
    chatBox.removeChild(chatBox.firstChild);
  }
});
