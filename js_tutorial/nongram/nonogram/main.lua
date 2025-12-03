require("levels")
local current_level = {}

function love.load()
    START_LEVEL = 1

    NONE = 1
    FLAGGED = 2
    CROSS = 3

    OFF = 0
    ON = 1

    DEBUG = OFF

    ACTIVATED = 2

    MAX_DIGITS_IN_ROW = 8

    EMPTY = 0
    FILLED = 1

    GRID = 24
    MARGIN = 2

    PICTURE = 1
    DIGIT = 2

    TITLE = 0
    INGAME = 1
    SOLVED = 2

    YELLOW = { 0.8, 0.8, 0.5, 0.5 }
    RED = { 0.8, 0.0, 0.0 }
    LIGHTGREY = { 0.7, 0.7, 0.7 }
    GREEN = { 0.0, 0.5, 0.0 }
    LIGHTGREEN = { 0.1, 0.7, 0.1 }
    BLACK = { 0.2, 0.2, 0.2 }


    grid = GRID + MARGIN
    title = "Nonogram"
    width, height = 1024, 800
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
    load_level_by_id(START_LEVEL)

    game_state = INGAME
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
    return levels[1]
end

function copy_pixels()
    for j = 0, current_level.height do
        for i = 0, current_level.width do
            local r, g, b = imagedata:getPixel(i + current_level.left, j + current_level.top)
            local color = EMPTY
            if r < 0.5 then
                color = FILLED
            end
            local tile = {
                img = PICTURE,
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
    for row = 0, current_level.height do
        local counter = 0
        local n = 0
        for column = 0, current_level.width do
            local tile = get_tile(column, row)

            if tile.value == FILLED then
                counter = counter + 1
            end

            if counter > 0 and (tile.value == EMPTY or column == current_level.width) then
                n = n + 1
                local digit = {
                    img = DIGIT,
                    value = counter,
                    x = current_level.width + n,
                    y = row,
                    state = NONE
                }
                table.insert(tiles, digit)
                counter = 0
            end
        end
    end
end

function counting_columns()
    for column = 0, current_level.width do
        local counter = 0
        local n = 0
        for row = current_level.height, 0, -1 do
            local tile = get_tile(column, row)

            if tile.value == FILLED then
                counter = counter + 1
            end

            if counter > 0 and (tile.value == EMPTY or row == 0) then
                n = n + 1
                local digit = {
                    img = DIGIT,
                    value = counter,
                    x = column,
                    y = -n,
                    state = NONE
                }
                table.insert(tiles, digit)
                counter = 0
            end
        end
    end
end

function get_digits_by_column(column)
    local digits = {}
    for row = -MAX_DIGITS_IN_ROW, 0 do
        local tile = get_tile(column, row)
        if tile ~= nil and tile.img == DIGIT then
            table.insert(digits, tile)
        end
    end
    return digits
end

function color_column(column)
    local digits = get_digits_by_column(column)
    local blocks = {}
    local counter = 0
    local n = 0
    if #digits == 0 then
        return
    end
    for row = 0, current_level.height do
        local tile = get_tile(column, row)

        if tile.img == PICTURE and tile.state == FLAGGED then
            counter = counter + 1
        end

        if counter > 0 and (tile.img == PICTURE and tile.state ~= FLAGGED or row == current_level.height) then
            n = n + 1
            local digit = {
                value = counter,
            }
            table.insert(blocks, digit)
            counter = 0
        end
    end
    local state = NONE
    if #blocks == #digits then
        local is_active = true
        for i = 1, #digits do
            if digits[i].value ~= blocks[i].value then
                is_active = false
            end
        end
        if is_active then
            state = ACTIVATED
        end
    end
    for i = 1, #digits do
        digits[i].state = state
    end
end

function get_digits_by_row(row)
    local digits = {}
    for column = current_level.width, current_level.width + MAX_DIGITS_IN_ROW do
        local tile = get_tile(column, row)
        if tile ~= nil and tile.img == DIGIT then
            table.insert(digits, tile)
        end
    end
    return digits
end

function color_row(row)
    local digits = get_digits_by_row(row)
    local blocks = {}
    local counter = 0
    local n = 0
    if #digits == 0 then
        return
    end
    for column = 0, current_level.width do
        local tile = get_tile(column, row)

        if tile.img == PICTURE and tile.state == FLAGGED then
            counter = counter + 1
        end

        if counter > 0 and (tile.img == PICTURE and tile.state ~= FLAGGED or column == current_level.width) then
            n = n + 1
            local digit = {
                value = counter,
            }
            table.insert(blocks, digit)
            counter = 0
        end
    end
    local state = NONE
    if #blocks == #digits then
        local is_active = true
        for i = 1, #digits do
            if digits[i].value ~= blocks[i].value then
                is_active = false
            end
        end
        if is_active then
            state = ACTIVATED
        end
    end
    for i = 1, #digits do
        digits[i].state = state
    end
end

function color_digits(column, row)
    color_row(row)
    color_column(column)
end

function is_solved()
    for i = 1, #tiles do
        local tile = tiles[i]
        if tile.img == PICTURE then
            if tile.value == FILLED and tile.state ~= FLAGGED then
                return false
            end
            if tile.value == EMPTY and tile.state == FLAGGED then
                return false
            end
        end
    end
    return true
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

function draw_quiz()
    for i = 1, #tiles do
        local tile = tiles[i]
        local x = tile.x * grid + current_level.offset_x
        local y = tile.y * grid + current_level.offset_y
        if tile.img == PICTURE then
            if tile.state == NONE then
                love.graphics.setColor(LIGHTGREY)
                love.graphics.rectangle("fill", x, y, GRID, GRID)
            elseif tile.state == FLAGGED then
                love.graphics.setColor(GREEN)
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
                            tile.state = FLAGGED
                        elseif tile.state == FLAGGED then
                            tile.state = CROSS
                        else
                            tile.state = NONE
                        end
                    end
                    color_digits(tile.x, tile.y)
                    if is_solved() then
                        game_state = SOLVED
                    end
                else
                    is_mouse_down = false
                end
            end
            if DEBUG == ON and tile.value == FILLED then
                love.graphics.setColor(BLACK)
                love.graphics.rectangle("fill", x, y, GRID, GRID)
            end
        elseif tile.img == DIGIT then
            local color = BLACK
            if tile.state == ACTIVATED then
                color = GREEN
            end
            love.graphics.setColor(color)
            love.graphics.print(tile.value, x, y)
        end
    end
end

function draw_solved()
    for i = 1, #tiles do
        local tile = tiles[i]
        local x = tile.x * grid + current_level.offset_x
        local y = tile.y * grid + current_level.offset_y
        if tile.img == PICTURE then
            if tile.value == FILLED then
                love.graphics.setColor(LIGHTGREEN)
                love.graphics.rectangle("fill", x, y, GRID, GRID)
            end
        end
    end
end

function love.draw()
    love.graphics.setColor(0.8, 0.8, 0.8)
    love.graphics.rectangle("fill", 0, 0, width, height)
    love.graphics.setColor(0, 0, 0)
    --love.graphics.print("Hello World! " .. love.mouse.getX() .. "," .. love.mouse.getY(), 400, 300)
    --love.graphics.print("Tiles: " .. #tiles, 400, 320)

    if game_state == INGAME then
        draw_quiz()
    elseif game_state == SOLVED then
        draw_solved()
        love.graphics.setColor(BLACK)
        love.graphics.print("SOLVED", 20, 20)
    end

    love.graphics.setColor(BLACK)
    love.graphics.print(current_level.name, 20, 40)
end

function love.keypressed(key, scancode, isrepeat)
    if key == "escape" then
        love.event.quit()
    end
end

function love.mousepressed(x, y, button, istouch, presses)
    local tile = get_tile_by_coord(x, y)
end
