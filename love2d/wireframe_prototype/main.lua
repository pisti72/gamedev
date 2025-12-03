require("Vazul/vazul")

function love.load()
    Vazul.init()
    left = false
    right = false
    up = false
    down = false
end

function love.draw()
    if left then
        Vazul.turn_left()
    end
    if right then
        Vazul.turn_right()
    end
    if up then
        Vazul.move_forward()
    end
    if down then
        Vazul.move_backward()
    end
    Vazul.draw()
end

function love.keypressed(key, scancode, isrepeat)
    if key == "left" then
        left = true
    end
    if key == "right" then
        right = true
    end
    if key == "up" then
        up = true
    end
    if key == "down" then
        down = true
    end
    if key == "escape" then
        print("Bye!")
        love.event.quit()
    end
end

function love.keyreleased(key, scancode, isrepeat)
    if key == "left" then
        left = false
    end
    if key == "right" then
        right = false
    end
    if key == "up" then
        up = false
    end
    if key == "down" then
        down = false
    end
end