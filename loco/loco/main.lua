local tileSize = 120 -- A tile mérete
local WE = 1
local INVALID = -1


local train = {
    x = tileSize / 2 + tileSize * 2, -- Vonat kezdeti x pozíciója
    y = tileSize / 2 + tileSize,   -- Vonat kezdeti y pozíciója
    speed = 2,
    direction = 0,
    turning = 0,
}

local tilemap = {
    { 0, 0, 0, 0, 0, 0 },
    { 0, 2, 1, 1, 2, 0 },
    { 0, 1, 0, 0, 1, 0 },
    { 0, 1, 0, 0, 1, 0 },
    { 0, 2, 1, 1, 2, 0 },
    { 0, 0, 0, 0, 0, 0 },
}

function love.load()
    love.window.setTitle("Train")
    success = love.window.setMode(1240, 600, { fullscreen = false, centered = true })
end

function love.update()
    -- A vonat pozíciójának frissítése az irány alapján
    train.x = train.x + math.cos(train.direction) * train.speed
    train.y = train.y + math.sin(train.direction) * train.speed

    -- A vonat irányának frissítése a tilemap alapján
    local currentTile = getTile(train.x, train.y)
    if not (currentTile == INVALID) then
        if train.turning == 0 then
            if currentTile == 2 then
                train.turning = 48
            end
        else
            if train.turning > 2 then
                train.direction = train.direction + math.pi / 2 / 46
            end
            train.turning = train.turning - 1
        end
    end
end

function getTile(x, y)
    local tileX = math.floor(x / tileSize) + 1
    local tileY = math.floor(y / tileSize) + 1

    if tileY >= 1 and tileY <= #tilemap and tileX >= 1 and tileX <= #tilemap[tileY] then
        return tilemap[tileY][tileX]
    else
        return INVALID
    end
end

function love.draw()
    love.graphics.clear({ .5, .5, .5, 1 })
    -- Tilemap kirajzolása
    for y, row in ipairs(tilemap) do
        for x, tile in ipairs(row) do
            if tile ~= 0 then
                love.graphics.rectangle("line", (x - 1) * tileSize, (y - 1) * tileSize, tileSize, tileSize)
            end
        end
    end

    -- Vonat kirajzolása
    love.graphics.setColor(1, 0, 0)
    love.graphics.rectangle("fill", train.x - tileSize / 2, train.y - tileSize / 2, tileSize, tileSize)
end
