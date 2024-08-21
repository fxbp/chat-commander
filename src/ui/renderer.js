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
