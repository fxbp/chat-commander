const axios = require('axios');

// Configuración base para la API de Twitch
const API_URL = 'https://id.twitch.tv/oauth2';
const VALIDATE_TOKEN_URL = `${API_URL}/validate`;

// Función para validar un token de acceso
async function validateToken(accessToken) {
  try {
    const response = await axios.get(VALIDATE_TOKEN_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Si la respuesta es exitosa, el token es válido
    return response.data;
  } catch (error) {
    // Si ocurre un error (por ejemplo, token inválido), retorna null o un mensaje de error
    console.error(
      'Error al validar el token:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

module.exports = {
  validateToken,
};
