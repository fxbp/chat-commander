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

// ===== User dropdown logic =====
const userButton = document.getElementById('userButton');
const dropdownMenu = document.getElementById('dropdownMenu');
userButton.addEventListener('click', () => {
  dropdownMenu.classList.toggle('hidden');
});

// ===== Settings modal logic =====
const settingsModal = document.getElementById('settingsModal');
const settingsButton = document.getElementById('settingsButton');
const closeSettingsModal = document.getElementById('closeSettingsModal');

settingsButton.addEventListener('click', () => {
  dropdownMenu.classList.add('hidden');
  settingsModal.classList.remove('hidden');
  loadSettings();
});

closeSettingsModal.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    settingsModal.classList.add('hidden');
  }
  // Close the dropdown menu if clicked outside
  if (
    !userButton.contains(event.target) &&
    !dropdownMenu.contains(event.target)
  ) {
    dropdownMenu.classList.add('hidden');
  }
});

// SETTINGS

const resetSettingsButton = document.getElementById('resetSettingsButton');
const saveSettingsButton = document.getElementById('saveSettingsButton');
const clientIdInput = document.getElementById('client_id');
const portInput = document.getElementById('port');

resetSettingsButton.addEventListener('click', () => {
  ipcRenderer.send('reset-settings');
  alert('Settings have been reset to default.');
  loadSettings();
});

saveSettingsButton.addEventListener('click', () => {
  const settings = {
    client_id: clientIdInput.value,
    port: parseInt(portInput.value, 10),
  };

  ipcRenderer.send('save-settings', settings);
  alert('Settings have been saved.');
  loadSettings();
});

function loadSettings() {
  ipcRenderer.send('load-custom-settings');
}

ipcRenderer.on('settings-loaded', (event, settings) => {
  clientIdInput.value = settings.client_id || '';
  portInput.value = settings.port || '';
});
