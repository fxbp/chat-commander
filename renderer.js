const axios = require('axios');
const { ipcRenderer } = require('electron');
const twitchAPI = require('./src/api/twitchAPI');

async function fetchPolls() {
  try {
    const accessToken = await ipcRenderer.invoke('get-access-token');
    const polls = await twitchAPI.getPolls(accessToken);

    const pollsContainer = document.getElementById('polls');
    pollsContainer.innerHTML = '<h2>Encuestas Activas:</h2>';

    if (polls.length === 0) {
      pollsContainer.innerHTML += '<p>No hay encuestas activas.</p>';
    } else {
      polls.forEach((poll) => {
        pollsContainer.innerHTML += `<p>Encuesta ID: ${poll.id}, Estado: ${poll.status}</p>`;
      });
    }
  } catch (error) {
    console.error('Error al obtener las encuestas:', error);
  }
}

document.getElementById('fetchPolls').addEventListener('click', fetchPolls);
document.getElementById('login').addEventListener('click', () => {
  window.open('http://localhost:3000', '_blank');
});
