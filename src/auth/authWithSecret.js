const express = require('express');
const axios = require('axios');
const { URLSearchParams } = require('url');
const tokenStore = require('./tokenStore');

const app = express();
const port = process.env.PORT || 3000;

async function getAccessToken() {
  const open = (await import('open')).default;

  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('CLIENT_ID or CLIENT_SECRET are not defined');
    }

    const redirectUri = `http://localhost:${port}/auth/twitch/callback`;

    // Configure the authorization URL with the appropriate scopes
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=chat:read+chat:edit`;

    await open(authUrl);

    return new Promise((resolve, reject) => {
      // Callback route in Express
      app.get('/auth/twitch/callback', async (req, res) => {
        const authCode = req.query.code;

        if (!authCode) {
          reject('Authorization code not received');
          res.send('Authentication failed.');
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
          const tokenData = tokenResponse.data;

          // Save the entire token object using tokenStore
          tokenStore.saveToken(tokenData);

          resolve(tokenData.access_token);
          res.send('Authentication successful. You can close this window.');
        } catch (error) {
          reject('Failed to obtain access token');
          res.send('Authentication failed.');
        }
      });
    });
  } catch (error) {
    console.error('Error during authentication:', error);
    throw new Error('Authentication failed');
  }
}

// Function to refresh the token
async function refreshAccessToken() {
  const tokenData = tokenStore.loadToken();

  if (!tokenData || !tokenData.refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', tokenData.refresh_token);

    const tokenUrl = 'https://id.twitch.tv/oauth2/token';
    const response = await axios.post(tokenUrl, params);
    const newTokenData = response.data;

    // Save the new token data
    tokenStore.saveToken(newTokenData);
    console.log('Refreshed Token');
    return newTokenData.access_token;
  } catch (error) {
    console.error('Error refreshing the access token:', error);
    throw new Error('Token refresh failed');
  }
}

function startServer() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`); // Log to confirm the server is listening
  });
}

module.exports = {
  startServer,
  getAccessToken,
  refreshAccessToken,
};
