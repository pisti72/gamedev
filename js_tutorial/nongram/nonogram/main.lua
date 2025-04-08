function love.load()
    NONE = 1
    GRID = 26
    MARGIN = 2
    grid = GRID + MARGIN
    title = "Nonogram"
    width, height = 1024, 600
    success = love.window.setMode(width, height)
    --width, height, flags = love.window.getMode()
    love.window.setTitle(title)
    imagedata = love.image.newImageData('pictures.png')
    image     = love.graphics.newImage(imagedata)
    font      = love.graphics.newFont(GRID)
    love.graphics.setFont(font)
    offset_x = math.floor((width - 14 * grid) / 2)
    offset_y = math.floor((height - 13 * grid) / 2)
    tiles = {}
    for j = 0, 13 do
        for i = 0, 14 do
            local r, g, b = imagedata:getPixel(i, j)
            local color = 0
            if r < 0.5 then
                color = 1
            end
            local tile = {
                img = 1,
                value = color,
                x = i,
                y = j,
                state = NONE
            }
            table.insert(tiles, tile)
        end
    end
    --counting rows
    for j = 0, 13 do
        local counter = 0
        local n = 0
        for i = 0, 14 do
            local tile = get_tile(i, j)
            if tile.value == 1 then
                counter = counter + 1
            else
                if counter > 0 then
                    n = n + 1
                    local digit = {
                        img = 2,
                        value = counter,
                        x = 14 + n,
                        y = j,
                        state = NONE
                    }
                    table.insert(tiles, digit)
                    counter = 0
                end
            end
        end
    end
    --counting columns
    for i = 0, 14 do
        local counter = 0
        local n = 0
        for j = 13, 0, -1 do
            local tile = get_tile(i, j)
            if tile.value == 1 then
                counter = counter + 1
            else
                if counter > 0 then
                    n = n + 1
                    local digit = {
                        img = 2,
                        value = counter,
                        x = i,
                        y = -n,
                        state = NONE
                    }
                    table.insert(tiles, digit)
                    counter = 0
                end
            end
        end
    end
end

function get_tile(x, y)
    for i = 1, #tiles do
        local tile = tiles[i]
        if tile.x == x and tile.y == y then
            return tile
        end
    end
end

function update()

end

function love.draw()
    love.graphics.setColor(0.8, 0.8, 0.8)
    love.graphics.rectangle("fill", 0, 0, width, height)
    love.graphics.setColor(0, 0, 0)
    --love.graphics.print("Hello World! " .. love.mouse.getX() .. "," .. love.mouse.getY(), 400, 300)
    --love.graphics.print("Tiles: " .. #tiles, 400, 320)
    for i = 1, #tiles do
        local tile = tiles[i]
        local x = tile.x * grid + offset_x
        local y = tile.y * grid + offset_y
        if tile.img == 1 then
            if tile.value == 1 then
                love.graphics.setColor(0, 0, 0)
            else
                love.graphics.setColor(0.5, 0.5, 0.5)
            end
            local xm = love.mouse.getX()
            local ym = love.mouse.getY()
            if xm > x and xm <= x + grid and ym > y and ym <= y + grid then
                love.graphics.setColor(0.7, 0.7, 0.5)
            end
            love.graphics.rectangle("fill", x, y, GRID, GRID)
        elseif tile.img == 2 then
            love.graphics.setColor(0, 0, 0)
            love.graphics.print(tile.value, x, y)
        end
    end
end

function love.keypressed(key, scancode, isrepeat)
    if key == "escape" then
        love.event.quit()
    end
end
