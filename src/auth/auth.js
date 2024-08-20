require('dotenv').config(); // Carga las variables de entorno

const express = require('express');
const axios = require('axios');
const { URLSearchParams } = require('url');

const app = express();
const port = 3000;

let accessToken = null;

async function startServer() {
  // Usar import() para cargar el módulo `open`
  const open = (await import('open')).default;

  app.listen(port, () => {
    console.log(`Servidor de autenticación en http://localhost:${port}`);
    const authURL = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=channel:read:polls`;
    open(authURL);
  });
}

app.get('/auth/twitch/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.send('Error: No code received');
    return;
  }

  try {
    const response = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;
    res.send('Autenticación completa. Puedes cerrar esta ventana.');
  } catch (error) {
    res.send('Error durante la autenticación.');
    console.error('Error:', error);
  }
});

function getAccessToken() {
  return accessToken;
}

module.exports = { startServer, getAccessToken };
