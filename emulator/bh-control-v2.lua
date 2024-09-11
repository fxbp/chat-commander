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

local function waitMs(ms, input)
    local fps = 30
    local framesToWait = math.floor(ms/ (1000/fps))
    for i = 1, framesToWait do
        joypad.set(input) -- Activate the key
        emu.frameadvance()
    end
    
end


-- Function to update and send the game state
local function handleInput(command)

    -- Extract command and duration from the input
    local splitResult = bizstring.split(command, ":")
    local innerCommand = splitResult[1]
    local duration = splitResult[2] and tonumber(splitResult[2]) or 300 -- Default duration to 300ms if not provided
        
    if (not innerCommand or not duration) then
        comm.socketServerSend("Error: Invalid command format: " .. command)
        return
    end

    -- Create a copy of the default input table
    local input = tableCopy(defaultInput)
    
    -- Update the input according to the command
    local button = commandToButton[innerCommand]
    if button then
        input[button] = "True"
        emu.frameadvance()
        waitMs(duration, input)
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
    local isNotEmpty = line and line:match("%S") 
    if (isNotEmpty) then
        -- Handle the valid message
        handleInput(line:lower())
    end
    
    emu.frameadvance()
   
    
end



print("Script finished")
