const { ipcRenderer } = require('electron');

document.getElementById('loginButton').addEventListener('click', async () => {
  try {
    await ipcRenderer.invoke('get-access-token');
    window.location.href = 'main.html'; // Redirect to the main page after successful login
  } catch (error) {
    console.error('Error during login:', error);
  }
});
