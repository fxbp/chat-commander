const express = require('express');
const tokenStore = require('./tokenStore');

const app = express();

const { getConfig } = require('../settings/config');

// Leer configuración desde config.json
const config = getConfig();
const { client_id, redirect_uri, port } = config;

let resolveToken;

const complete_redirect_uri = `${redirect_uri}/auth/twitch/callback`;

app.use(express.json());

// Ruta callback que entrega HTML para extraer el token
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
app.post('/token', (req, res) => {
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
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Flujo principal
async function getAccessToken() {
  const open = (await import('open')).default;
  return new Promise((resolve) => {
    resolveToken = resolve;

    const scopes = ['chat:read', 'chat:edit'];
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=${complete_redirect_uri}&response_type=token&scope=${scopes.join(
      '+'
    )}`;

    open(authUrl);
  });
}

function startServer() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

module.exports = {
  startServer,
  getAccessToken,
};
