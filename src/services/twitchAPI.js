// src/services/twitchApi.js
const TokenStore = require('../auth/tokenStore'); // Asegúrate de que el path es correcto

// Función para realizar una solicitud a la API de Twitch
async function makeApiRequest(endpoint, token) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-ID': process.env.CLIENT_ID,
        Accept: 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw new Error('Error en la solicitud API');
  }
}

// Función para enviar un mensaje al chat de Twitch
async function sendMessage(channel, message, token) {
  try {
    const fetch = (await import('node-fetch')).default;
    await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-ID': process.env.CLIENT_ID,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        message: message,
      }),
    });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    throw new Error('Error al enviar el mensaje');
  }
}

module.exports = { makeApiRequest, sendMessage };
