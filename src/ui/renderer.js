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
