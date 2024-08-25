local socket = require("socket")

-- Configure the socket server
local server = assert(socket.bind("127.0.0.1", 30800))
server:settimeout(0)  -- No bloquear mientras espera conexiones

function pressButton(button)
    local buttons = {
        A = {A=true},
        B = {B=true},
        Start = {Start=true},
        Select = {Select=true},
        Up = {Up=true},
        Down = {Down=true},
        Left = {Left=true},
        Right = {Right=true},
        L = {L=true},   
        R = {R=true}
    }
    joypad.set(1, buttons[button])
end

function releaseButtons()
    joypad.set(1, {
        A=false, B=false, Start=false, Select=false,
        Up=false, Down=false, Left=false, Right=false, Left=false, Right=false
    })
end

while true do
    local client = server:accept()
    if client then
        client:settimeout(10)  -- Esperar hasta 10 segundos para recibir un comando
        local buttonToPress, err = client:receive()

        if not err then
            pressButton(buttonToPress)
            emu.frameadvance()  -- Avanza un frame
            releaseButtons()
        end

        client:close()
    end

    emu.frameadvance()  -- Avanza un frame para mantener la ejecución del emulador
end