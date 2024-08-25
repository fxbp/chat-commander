## Project Summary

This project is an Electron and JavaScript application designed to connect to the Twitch API to retrieve chat messages in real-time. The application integrates Twitch chat functionality with a game emulator, enabling chat messages to be converted into automated inputs within the emulator.

### Key Features

- **Twitch API Integration:** Utilizes Twitch authentication credentials to connect to the API and subscribe to chat messages in specific channels.
- **Message Retrieval:** Implements a real-time listening system to capture chat messages and process them as needed.
- **Emulator Integration:** Translates chat messages into commands or inputs that are sent to the game emulator, allowing dynamic interaction between Twitch users and the game.
- **User Interface (UI):** Includes an Electron-based interface for configuring Twitch connections, selecting the game emulator, and managing the integration between both.

This project offers an innovative solution to enhance interactivity during Twitch streams by allowing viewers to directly influence the gaming experience through their chat messages.

### Requirements

- Basic knowledge of JavaScript and Node.js
- Familiarity with the Twitch API
- Experience with Electron for desktop applications
- Understanding of game emulator integration and input handling

This project is ideal for developers interested in creating interactive applications and integrating live streaming platforms with customized gaming experiences.

## Conexion con Twitch

Se requiere integracion con Twitch, para hacerlo se utiliza la API.

Es necesario registrar una aplicacion nueva para poder autorizar mediante Oauth la aplicacion Electron con el usuario de twitch [Registrar aplicacion](https://dev.twitch.tv/docs/authentication/register-app/)

Con esto se obtiene el client-id y el secret-id que esta usando la aplicacion electron para conectarse a la api de twitch.

### Configuración

Actualmente se usa el archivo .env en el root del proyecto con las siguientes claves:

```
CLIENT_ID={client-id obtenido al crear la aplicacion en el portal de desarrollo de twitch}
CLIENT_SECRET={client-secret obtenido al crear la applicacion en el portarl de desarrollo de twitch}
REDIRECT_URI=http://localhost:3000
TWITCH_USERNAME={nombre_usuario_twitch}

```

## Integracion con emulador

En esta version se utiliza scripting mediante lenguaje LUA, para enviar las "pulsaciones" de las teclas de la aplicacion electron al emulador seleccionado.
El emulador debe permitir la opcion de scripting LUA.

Es necesario tener LUA instalado en el sistema, ademas de incluirlo en el PATH para poder ejecutar correctamente los scripts.

### Emulador

El emulador usado como prueba es el BizHawk (2.9.1) que permite la ejecucion de scripts LUA. El emulador ya tiene Lua instalado

### Sockets

Para la comunicacion de las teclas, la opcion mas viable con el emulador encendido es usar sockets. Con sockets el emulador sera cliente, ecuchando en un puerto determinado y la aplicacion Electron sera el servidor, ira enviado los botones a pulsar.

Para poder usar los sockets en el emulador hay que iniciar el emulador indicandole la ip y el puerto al que tiene que escuchar:

```
EmuHawk.exe --socket_ip=127.0.0.1 --socket_port=55355
```

### Script

El script de lua se puede encontrar en el directorio "emulator". Para usarlo se debe arrancar el emulador y cargar el juego. Luego ir al menú: Tools > Lua Console.
Se abrirá la consola Lua. Aqui tenemos que cargar el script lua que usa los sockets para recibir la siguiente tecla a pulsar.

De momento solo se permite una pulsacion de tecla cada vez. El script es **simple-bizhawk-control.lua**
