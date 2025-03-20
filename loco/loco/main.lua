local tileSize = 120 -- A tile mérete
local WE = 1

local train = {
    x = tileSize / 2 + tileSize, -- Vonat kezdeti x pozíciója
    y = tileSize / 2,            -- Vonat kezdeti y pozíciója
    speed = tileSize,
    direction = 0
}

local tilemap = {
    { 2, 1, 1, 2 },
    { 1, 0, 0, 1 },
    { 1, 0, 0, 1 },
    { 2, 1, 1, 2 }
}

-- Segédfüggvény: Normalizálja az irányt 0 és 2π között
local function normalizeDirection(direction)
    return direction % (2 * math.pi)
end

function love.update(dt)
    -- A vonat pozíciójának frissítése az irány alapján
    train.x = train.x + math.cos(train.direction) * train.speed * dt
    train.y = train.y + math.sin(train.direction) * train.speed * dt

    -- A vonat irányának frissítése a tilemap alapján
    local tileX = math.floor(train.x / tileSize) + 1
    local tileY = math.floor(train.y / tileSize) + 1

    if tileY >= 1 and tileY <= #tilemap and tileX >= 1 and tileX <= #tilemap[tileY] then
        local currentTile = tilemap[tileY][tileX]
        if currentTile == 2 then
            -- Fordító tilén van: fokozatosan változtatjuk az irányt
            train.targetDirection = normalizeDirection(train.targetDirection + math.pi / 2) -- 90 fokos fordulat
        else
            -- Nem fordító tilén van: a tile irányához igazítjuk a vonat irányát
            if currentTile == 1 then
                -- Vízszintes tile: irány vízszintes (0 vagy π)
                if math.cos(train.direction) > 0 then
                    train.targetDirection = 0
                else
                    train.targetDirection = math.pi
                end
            elseif currentTile == 2 then
                -- Függőleges tile: irány függőleges (π/2 vagy 3π/2)
                if math.sin(train.direction) > 0 then
                    train.targetDirection = math.pi / 2
                else
                    train.targetDirection = 3 * math.pi / 2
                end
            end
        end
    end


    -- Fokozatos irányváltoztatás
    local directionDifference = normalizeDirection(train.targetDirection - train.direction)
    if directionDifference > math.pi then
        directionDifference = directionDifference - 2 * math.pi
    end

    local rotationSpeed = 10  -- Forgási sebesség (radián/másodperc)
    if directionDifference > 0 then
        train.direction = normalizeDirection(train.direction + rotationSpeed * dt)
    elseif directionDifference < 0 then
        train.direction = normalizeDirection(train.direction - rotationSpeed * dt)
    end
end

function love.draw()
    -- Tilemap kirajzolása
    for y, row in ipairs(tilemap) do
        for x, tile in ipairs(row) do
            if tile ~= 0 then
                love.graphics.rectangle("line", (x - 1) * tileSize, (y - 1) * tileSize, tileSize, tileSize)
            end
        end
    end

    -- Vonat kirajzolása
    love.graphics.rectangle("fill", train.x - tileSize / 2, train.y - tileSize / 2, tileSize, tileSize)
end
