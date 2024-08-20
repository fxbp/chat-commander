require('dotenv').config(); // Carga las variables de entorno

const axios = require('axios');

async function getPolls(accessToken) {
  try {
    const response = await axios.get('https://api.twitch.tv/helix/polls', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error al obtener encuestas de Twitch:', error);
    throw error;
  }
}

module.exports = { getPolls };
