const express = require('express');
const axios = require('axios');
const { URLSearchParams } = require('url');

const app = express();
const port = process.env.PORT || 3000;

async function getAccessToken() {
  const open = (await import('open')).default;

  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('CLIENT_ID o CLIENT_SECRET no están definidos');
    }

    const redirectUri = `http://localhost:${port}/auth/twitch/callback`;

    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=chat:read+chat:edit`;

    await open(authUrl);

    return new Promise((resolve, reject) => {
      // Ruta del callback en Express
      app.get('/auth/twitch/callback', async (req, res) => {
        const authCode = req.query.code;

        if (!authCode) {
          reject('No se recibió el código de autorización');
          res.send('Falló la autenticación.');
          return;
        }

        const tokenUrl = 'https://id.twitch.tv/oauth2/token';
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('code', authCode);
        params.append('grant_type', 'authorization_code');
        params.append('redirect_uri', redirectUri);

        try {
          const tokenResponse = await axios.post(tokenUrl, params);
          const accessToken = tokenResponse.data.access_token;
          resolve(accessToken);
          res.send('Autenticación exitosa. Puedes cerrar esta ventana.');
        } catch (error) {
          reject('Falló la obtención del token de acceso');
          res.send('Falló la autenticación.');
        }
      });
    });
  } catch (error) {
    console.error('Error durante la autenticación:', error);
    throw new Error('Falló la autenticación');
  }
}

function startServer() {
  app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}/`); // Log para confirmar que el servidor está escuchando
  });
}

module.exports = {
  startServer,
  getAccessToken,
};
