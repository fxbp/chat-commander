-- Initial configuration
comm.socketServerSetTimeout(1)
comm.socketServerSend("Game Starting!")



-- Default input table
local defaultInput = {
    A = false,
    B = false,
    Down = false,
    L = false,
    Left = false,
    R = false,
    Right = false,
    Select = false,
    Start = false,
    Up = false
}

-- Mapping of commands to buttons
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

-- Function to copy a table
local function tableCopy(original)
    local copy = {}
    for k, v in pairs(original) do
        copy[k] = v
    end
    return copy
end

-- Function to update and send the game state
local function handleInput(command)
    print("handleInput")
    print(command)
    -- Create a copy of the default input table
    local input = tableCopy(defaultInput)
    
    -- Update the input according to the command
    local button = commandToButton[command]
    print("button")
    print(button)
    if button then
        input[button] = "True"
        print("input")
        print(input)
        joypad.set(input) -- Activate the key
        emu.frameadvance() -- Advance a frame to process the input
        
        -- Deactivate the key
        input[button] = "False"
        joypad.set(input)
        emu.frameadvance() -- Advance another frame to ensure the input is processed
        
        -- Confirm the command was received
        comm.socketServerSend(command:upper() .. " Received")
    else
        comm.socketServerSend("Error: Unknown command: " .. command)
    end
end

print(joypad.get())

-- Main loop
while true do
   
    -- Attempt to receive a response from the socket server
    local success, line = pcall(comm.socketServerResponse)
    print(line)
    local isNotEmpty = line and line:match("%S") 
    if (isNotEmpty) then
        print("inside if")
        -- Handle the valid message
        handleInput(line:lower())
    end
    emu.frameadvance()
   
    -- Introduce a delay by advancing frames (adjust the number if needed)
    
end

print("Script finished")
