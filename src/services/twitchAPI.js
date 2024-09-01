const axios = require('axios');

// Base configuration for the Twitch API
const API_URL = 'https://id.twitch.tv/oauth2';
const VALIDATE_TOKEN_URL = `${API_URL}/validate`;

// Function to validate an access token
async function validateToken(accessToken) {
  try {
    const response = await axios.get(VALIDATE_TOKEN_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // If the response is successful, the token is valid
    console.log(response.data);
    return response.data;
  } catch (error) {
    // If an error occurs (e.g., invalid token), return null or an error message
    console.error(
      'Error validating the token:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

module.exports = {
  validateToken,
};
