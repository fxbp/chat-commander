const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'settings.json');

const customConfigPath = path.join(__dirname, 'customSettings.json');

function getDefaultSettings() {
  if (!fs.existsSync(configPath)) {
    throw new Error('Missing config.json');
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw);
}

function getSettings() {
  if (!fs.existsSync(customConfigPath)) {
    throw new Error('Missing config.json');
  }

  const raw = fs.readFileSync(customConfigPath, 'utf-8');
  return JSON.parse(raw);
}

function saveSettings(newSettings) {
  fs.writeFileSync(customConfigPath, JSON.stringify(newSettings, null, 2));
}

module.exports = {
  getDefaultSettings,
  getSettings,
  saveSettings,
};
