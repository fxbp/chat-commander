// src/auth/tokenStore.js

const fs = require('fs');
const path = require('path');

const tokenPath = path.join(__dirname, 'token.json');

function saveToken(token) {
  // Save the entire token object
  fs.writeFileSync(tokenPath, JSON.stringify(token), 'utf-8');
}

function loadToken() {
  if (fs.existsSync(tokenPath)) {
    const data = fs.readFileSync(tokenPath, 'utf-8');
    return JSON.parse(data);
  }
  return null;
}

function deleteToken() {
  if (fs.existsSync(tokenPath)) {
    fs.unlinkSync(tokenPath);
  }
}

module.exports = {
  saveToken,
  loadToken,
  deleteToken,
};
