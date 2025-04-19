const express = require('express');
const tokenStore = require('./tokenStore');

const app = express();

const { validateToken } = require('../services/twitchAPI');
let server;

let resolveToken;
let currentConfig = { client_id: '', redirect_uri: '', port: 3000 };

app.use(express.json());

async function restartServer(newConfig) {
  if (server) {
    await server.close(async () => {
      console.log('Server stopped.');
      await startServer(newConfig);
    });
  } else {
    await startServer(newConfig);
  }
  await getAccessToken();
}

// Flujo principal
async function getAccessToken() {
  const open = (await import('open')).default;
  const { client_id, port } = currentConfig;

  return new Promise((resolve) => {
    resolveToken = resolve;

    const scopes = ['chat:read', 'chat:edit'];
    const complete_redirect_uri = `http://localhost:${port}/auth/twitch/callback`;
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=${complete_redirect_uri}&response_type=token&scope=${scopes.join(
      '+'
    )}`;

    open(authUrl);
  });
}

function startServer(config) {
  return new Promise((resolve, reject) => {
    const { port } = config;
    currentConfig = config;
    app.use(express.json());

    app.get('/auth/twitch/callback', (req, res) => {
      const html = `
            <html>
              <body>
                <script>
                  const hash = window.location.hash.substring(1);
                  const params = new URLSearchParams(hash);
                  const token = params.get('access_token');
                  
                  if (token) {
                    fetch('/token', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token })
                    }).then(() => {
                      document.body.innerText = "Login successful. You can close this window.";
                      setTimeout(() => {
                        window.close();  // Cierra la ventana automáticamente después de 2 segundos
                      }, 2000);  // Espera 2 segundos para dar tiempo a que el mensaje se vea
                    });
                  } else {
                    document.body.innerText = "Failed to get token.";
                    setTimeout(() => {
                      window.close();  // También cerramos la ventana si falla
                    }, 2000);  // Espera 2 segundos en caso de error
                  }
                </script>
              </body>
            </html>
          `;
      res.send(html);
    });

    // Recibe token desde el navegador
    app.post('/token', async (req, res) => {
      const { token } = req.body;
      if (token && resolveToken) {
        resolveToken(token);
        resolveToken = null;
        // Guardar el token en el tokenStore

        tokenStore.saveToken({
          access_token: token,
          acquired_at: new Date().getTime(),
          expires_in: 3600,
        }); // Guarda el token con el tiempo de expiración
        const savedToken = tokenStore.loadToken();
        const validationResult = await validateToken(savedToken.access_token);
        const newToken = { ...savedToken, username: validationResult.login };
        tokenStore.saveToken(newToken);
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    });

    // Levantar el servidor en el puerto indicado
    server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
      resolve();
    });

    server.on('error', (err) => {
      console.log(err);
      reject(err);
    });
  });
}

module.exports = {
  startServer,
  getAccessToken,
  restartServer,
};
