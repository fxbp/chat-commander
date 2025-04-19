const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'settings.json');

function getConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error('Missing config.json');
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  console.log(raw);
  return JSON.parse(raw);
}

module.exports = {
  getConfig,
};
