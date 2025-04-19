const { ipcRenderer } = require('electron');

// Load user info (e.g., username) from token validation
async function loadUserInfo() {
  const result = await ipcRenderer.invoke('validate-token');
  document.getElementById('username').textContent = `${result.login}`;
}

// Call loadUserInfo on startup
loadUserInfo();

document.getElementById('startButton').addEventListener('click', async () => {
  try {
    await ipcRenderer.invoke('start-chat');
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
  } catch (error) {
    console.error('Error starting chat:', error);
  }
});

document.getElementById('stopButton').addEventListener('click', async () => {
  try {
    await ipcRenderer.invoke('stop-chat');
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
  } catch (error) {
    console.error('Error stopping chat:', error);
  }
});

document.getElementById('logoutButton').addEventListener('click', () => {
  ipcRenderer.invoke('logout');
  window.location.href = 'login.html'; // Redirect to the login page after logout
});

// Handler to receive chat messages from the main process
ipcRenderer.on('chat-message', (event, message) => {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.textContent = `${message.timestamp} - ${message.username}: ${message.text}`;
  chatBox.appendChild(messageElement);

  if (chatBox.children.length > 10) {
    chatBox.removeChild(chatBox.firstChild);
  }
});

// Apply Options Button logic
document.getElementById('applyOptionsButton').addEventListener('click', () => {
  const autoActionsEnabled = document.getElementById(
    'autoActionsCheckbox'
  ).checked;
  let options = { generateActions: autoActionsEnabled };
  // Send the new setting to the main process
  ipcRenderer.send('send-options', options);
  alert('Options applied');
});
