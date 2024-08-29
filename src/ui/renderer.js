const { ipcRenderer } = require('electron');

document.getElementById('loginButton').addEventListener('click', async () => {
  try {
    const token = await ipcRenderer.invoke('get-access-token');
    console.log('Access Token:', token);
    // Here you can do something with the token, like displaying a message or starting another function
  } catch (error) {
    console.error('Error during authentication:', error);
  }
});

document
  .getElementById('validateTokenButton')
  .addEventListener('click', async () => {
    try {
      // Call the main process to validate the stored token
      const result = await ipcRenderer.invoke('validate-token');
      if (result) {
        alert('The token is valid. User: ' + result.login);
      } else {
        alert('The token is not valid.');
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

// Handler to receive chat messages from the main process
ipcRenderer.on('chat-message', (event, message) => {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.textContent = `${message.timestamp} - ${message.username}: ${message.text}`;
  chatBox.appendChild(messageElement);

  // Keep only the last 10 messages
  if (chatBox.children.length > 10) {
    chatBox.removeChild(chatBox.firstChild);
  }
});
