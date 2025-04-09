require("levels")
local current_level = {}

function love.load()
    NONE = 1
    BLACK = 2
    CROSS = 3
    GRID = 24
    MARGIN = 2
    YELLOW = { 0.8, 0.8, 0.5, 0.5 }
    RED = { 0.8, 0, 0 }
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

    is_mouse_down = false
    mouse_state = NONE
    tiles = {}
    load_level_by_id(6)
    --counting rows

    --counting columns
end

function load_level_by_id(id)
    local level = get_level_by_id(id)
    current_level = {
        name = level.name,
        left = level.left,
        top = level.top,
        width = level.width - 1,
        height = level.height - 1,
        offset_x = (width - level.width * grid) / 2,
        offset_y = (height - level.height * grid) / 2,
    }
    copy_pixels()
    counting_rows()
    counting_columns()
end

function get_level_by_id(id)
    for i = 1, #levels do
        local level = levels[i]
        if level.id == id then
            return level
        end
    end
end

function copy_pixels()
    for j = 0, current_level.height do
        for i =0, current_level.width do
            local r, g, b = imagedata:getPixel(i +  current_level.left, j + current_level.top)
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
end

function counting_rows()
    for j = 0, current_level.height do
        local counter = 0
        local n = 0
        for i = 0, current_level.width do
            local tile = get_tile(i, j)
            if tile.value == 1 then
                counter = counter + 1
            else
                if counter > 0 then
                    n = n + 1
                    local digit = {
                        img = 2,
                        value = counter,
                        x = current_level.width + n,
                        y = j,
                        state = NONE
                    }
                    table.insert(tiles, digit)
                    counter = 0
                end
            end
        end
    end
end

function counting_columns()
    for i = 0, current_level.width do
        local counter = 0
        local n = 0
        for j = current_level.height, 0, -1 do
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

function get_tile_by_coord(x, y)
    local x = x * grid + current_level.offset_x
    local y = y * grid + current_level.offset_y
    get_tile(x, y)
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
        local x = tile.x * grid + current_level.offset_x
        local y = tile.y * grid + current_level.offset_y
        if tile.img == 1 then
            if tile.state == NONE then
                love.graphics.setColor(0.5, 0.5, 0.5)
                love.graphics.rectangle("fill", x, y, GRID, GRID)
            elseif tile.state == BLACK then
                love.graphics.setColor(0, 0, 0)
                love.graphics.rectangle("fill", x, y, GRID, GRID)
            else
                love.graphics.setColor(RED)
                love.graphics.print("X", x, y)
            end

            local xm = love.mouse.getX()
            local ym = love.mouse.getY()
            if xm > x and xm <= x + grid and ym > y and ym <= y + grid then
                love.graphics.setColor(YELLOW)
                love.graphics.rectangle("fill", x, y, GRID, GRID)
                if love.mouse.isDown(1) then
                    if not is_mouse_down then
                        mouse_state = tile.state
                        is_mouse_down = true
                    end
                    if mouse_state == tile.state then
                        if tile.state == NONE then
                            tile.state = BLACK
                        elseif tile.state == BLACK then
                            tile.state = CROSS
                        else
                            tile.state = NONE
                        end
                    end
                else
                    is_mouse_down = false
                end
            end
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

function love.mousepressed(x, y, button, istouch, presses)
    local tile = get_tile_by_coord(x, y)
end
