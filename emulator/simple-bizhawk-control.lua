-- Configuración inicial
comm.socketServerSetTimeout(1)
comm.socketServerSend("Game Starting!")

-- Tabla de entradas por defecto
local defaultInput = {
    A = false,
    B = false,
    Down = false,
    L = false,
    Left = false,
    Power = false,
    R = false,
    Right = false,
    Select = false,
    Start = false,
    Up = false
}

-- Mapeo de comandos a botones
local commandToButton = {
    up = 'Up',
    down = 'Down',
    left = 'Left',
    right = 'Right',
    a = 'A',
    b = 'B',
    select = 'Select',
    start = 'Start',
    lb = 'L',
    rb = 'R'
}

-- Función para copiar una tabla
local function tableCopy(original)
    local copy = {}
    for k, v in pairs(original) do
        copy[k] = v
    end
    return copy
end

-- Función para actualizar y enviar el estado del juego
local function handleInput(command)
    -- Crear una copia de la tabla de entradas por defecto
    local input = tableCopy(defaultInput)
    
    -- Actualizar la entrada según el comando
    local button = commandToButton[command]
    if button then
        input[button] = true
        joypad.set(input) -- Activar la tecla
        emu.frameadvance() -- Avanzar un frame para procesar la entrada
        
        -- Desactivar la tecla
        input[button] = false
        joypad.set(input)
        emu.frameadvance() -- Avanzar otro frame para asegurar que la entrada sea procesada
        
        -- Confirmar recepción del comando
        comm.socketServerSend(command:upper() .. " Received")
    else
        comm.socketServerSend("Error: Comando desconocido: " .. command)
    end
end

-- Bucle principal
while true do
    -- Intentar recibir una respuesta del servidor de sockets
    local success, line = pcall(comm.socketServerResponse)
    if success then
        -- Verificar si los datos recibidos no están vacíos
        if line and line:match("%S") then
            -- Limpiar la línea de posibles espacios en blanco y convertir a minúsculas
            line = line:match("^%s*(.-)%s*$"):lower()
            
            -- Registro de datos recibidos
            print("Recibido: " .. line)
            
            -- Manejar la entrada solo si el comando es válido
            handleInput(line)
        end
    else
        comm.socketServerSend("Error: No se pudo recibir datos del socket")
    end
    emu.frameadvance()
end

print("Script finalizado")