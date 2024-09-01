## Project Summary

This project is an Electron and JavaScript application designed to connect to the Twitch API to retrieve chat messages in real-time. The application integrates Twitch chat functionality with a game emulator, enabling chat messages to be converted into automated inputs within the emulator.

### Key Features

- **Twitch API Integration:** Utilizes Twitch authentication credentials to connect to the API and subscribe to chat messages in specific channels.
- **Message Retrieval:** Implements a real-time listening system to capture chat messages and process them as needed.
- **Emulator Integration:** Translates chat messages into commands or inputs that are sent to the game emulator, allowing dynamic interaction between Twitch users and the game.
- **User Interface (UI):** Includes an Electron-based interface for configuring Twitch connections, selecting the game emulator, and managing the integration between both.

This project offers an innovative solution to enhance interactivity during Twitch streams by allowing viewers to directly influence the gaming experience through their chat messages.

## Connection with Twitch

Integration with Twitch is required, and for this, the Twitch API is used.

A new application must be registered to authorize the Electron application via OAuth with the Twitch user [ Register Application (https://dev.twitch.tv/docs/authentication/register-app/)](https://dev.twitch.tv/docs/authentication/register-app/)

This provides the client-id and client-secret that the Electron application uses to connect to the Twitch API.

### Configuration

Currently, a .env file is used in the root of the project with the following keys:

```
CLIENT_ID={client-id obtained when creating the application in the Twitch development portal}
CLIENT_SECRET={client-secret obtained when creating the application in the Twitch development portal}
REDIRECT_URI=http://localhost:3000
TWITCH_USERNAME={twitch_username}

```

## Emulator Integration

In this version, scripting is done using the Lua language to send key presses from the Electron application to the selected emulator. The emulator must support the Lua scripting option.

### Emulator

The emulator used for testing is BizHawk (2.9.1), which supports the execution of Lua scripts. The emulator already has Lua installed.

### Sockets

For the communication of key presses, the most viable option with the emulator running is to use sockets. With sockets, the emulator will be the client, listening on a specific port, and the Electron application will be the server, sending the buttons to press.

To use sockets with the emulator, the emulator must be started by specifying the IP and port to listen to:

```
EmuHawk.exe --socket_ip=127.0.0.1 --socket_port=55355
```

### Script

The Lua script can be found in the "emulator" directory. To use it, start the emulator and load the game. Then go to the menu: Tools > Lua Console. The Lua console will open. Here, you need to load the Lua script that uses sockets to receive the next key press.

Currently, only one key press is allowed at a time. The script is **simple-bizhawk-control.lua**.
