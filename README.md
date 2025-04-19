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

An application has already been registered for authentication, but if you wish, you can register a new one by following the process at [ Register Application (https://dev.twitch.tv/docs/authentication/register-app/)](https://dev.twitch.tv/docs/authentication/register-app/)

The callback used by default is: http://localhost:3000/auth/twitch/callback

### Configuration

Environment variables are no longer needed. Instead, the configuration is now handled through a settings.json file located in the src/settings folder. This file contains the following keys:

The default aplication is listening at http://localhost:3000 with its own client_id.

```
"client_id": {client-id obtained when creating the application in the Twitch development portal}
"redirect_uri": http://localhost:3000
"port": 3000

```

If you have created your own application you can change de "redirect_uri" and "port" according to your Twitch APP configuration.

**Important:**

This app is waiting the callback at **/auth/twitch/callback** so if you have your own application this is the path that must register.

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
