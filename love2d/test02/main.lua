-- Load some default values for our rectangle.
function love.load()
    hamster = love.graphics.newImage("hamster.png")
    ork = love.graphics.newImage("ork.png")
    boss = love.graphics.newImage("boss_robot.png")
    tile = love.graphics.newImage("grass.png")
    x, y = 54, 150
    xd , yd = 0 , 0
end
 
-- Increase the size of the rectangle every frame.
function love.update(dt)
    if love.keyboard.isDown("a") then
        xd = -2
    elseif love.keyboard.isDown("d") then
        xd = 2
    else
        xd = 0
    end

    if love.keyboard.isDown("w") then
        yd = -2
    elseif love.keyboard.isDown("s") then
        yd = 2
    else
        yd = 0
    end

    x = x + xd
    y = y + yd
end
 
-- Draw a coloured rectangle.
function love.draw()
    --love.graphics.setColor(0, 100, 100)
    --love.graphics.rectangle("fill", x, y, w, h)
    love.graphics.draw(hamster, x, y, 0, 2)
    love.graphics.draw(ork, 100, 100, 0, 2)
    love.graphics.draw(boss, 200, 100, 0, 2)
    for i = 0, 10, 1
    do
        love.graphics.draw(tile, i * 32, 200, 0 , 2)
    end
    love.graphics.print(string.format("x= %02d y= %02d", x, y), 0, 30)
end