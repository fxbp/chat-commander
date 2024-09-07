const { sendMessage } = require('../comunication/inactiveChatNotifier');
const RANDOM_COMMANDS = ['u', 'd', 'l', 'r', 'a', 'b', 'st'];
const USERNAME_TO_RESET_TIMER = process.env.TWITCH_USERNAME;
const INACTIVITY_TIMEOUT = 1 * 60 * 1000; // 5 minutes
const RANDOM_COMMAND_INTERVAL = 3 * 1000; // 3  second

let inactivityTimer = null;
let randomCommandInterval = null;

// Reset the inactivity timer
function resetInactivityTimer(username) {
  // If there's an existing inactivity timer, clear it
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // If the message is not from the specific user, set a new timer
  if (username !== USERNAME_TO_RESET_TIMER) {
    inactivityTimer = setTimeout(() => {
      // Start sending random commands every second
      startSendingRandomCommands();
    }, INACTIVITY_TIMEOUT);
  }
}

// Start sending random commands every second
function startSendingRandomCommands() {
  // If random command interval is already active, do nothing
  if (randomCommandInterval) return;

  // Send a random command every second
  randomCommandInterval = setInterval(() => {
    const randomCommand =
      RANDOM_COMMANDS[Math.floor(Math.random() * RANDOM_COMMANDS.length)];
    const commandMessage = {
      username: USERNAME_TO_RESET_TIMER, // Send the message as if it were from the specific user
      text: randomCommand,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Send the message to the chat through the inactiveChatNotifier
    sendMessage(commandMessage);

    console.log(`Sent random command: ${randomCommand}`);
  }, RANDOM_COMMAND_INTERVAL);
}

// Stop sending random commands
function stopSendingRandomCommands() {
  if (randomCommandInterval) {
    clearInterval(randomCommandInterval);
    randomCommandInterval = null;
  }
}

// Function to be called when a new message is received in the chat
function handleMessage(username) {
  // If the message is from the specific user, continue sending random commands
  if (username === USERNAME_TO_RESET_TIMER) {
    // If random commands are already being sent, do nothing
    if (!randomCommandInterval) {
      startSendingRandomCommands();
    }
  } else {
    // Reset the inactivity timer
    resetInactivityTimer(username);
    // Stop sending random commands if there is an active interval
    stopSendingRandomCommands();
  }
}

// Start the inactivity timer when the app starts
function startInactivityTimer() {
  inactivityTimer = setTimeout(() => {
    // Start sending random commands every second
    startSendingRandomCommands();
  }, INACTIVITY_TIMEOUT);
}

// Call this function when the app starts to ensure inactivity timer is active
startInactivityTimer();

module.exports = {
  handleMessage,
};
