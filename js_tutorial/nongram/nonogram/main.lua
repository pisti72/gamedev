function love.load()
    title = "Nonogram"
    width, height, flags = love.window.getMode()
    love.window.setTitle(title)
    imagedata = love.image.newImageData('pictures.png')
    image     = love.graphics.newImage(imagedata)
    font      = love.graphics.newFont(18)
    love.graphics.setFont(font)
end

function update()

end

function love.draw()
    love.graphics.setColor(0.8, 0.8, 0.8)
    love.graphics.rectangle("fill", 0, 0, width, height)
    love.graphics.setColor(0, 0, 0)
    love.graphics.print("Hello World!", 400, 300)
    for j = -3, 13 do
        for i = 0, 14 + 3 do
            if i <= 13 and j >= 0 then
                local r, g, b = imagedata:getPixel(i, j)
                if r < 0.5 then
                    love.graphics.setColor(0, 0, 0)
                else
                    love.graphics.setColor(0.5, 0.5, 0.5)
                end
                love.graphics.rectangle("fill", 10 + i * 22, 100 + j * 22, 20, 20)
            elseif j < 0 and i <= 13 then
                love.graphics.setColor(0, 0, 0)
                love.graphics.print("7", 10 + i * 22, 100 + j * 22)
            elseif j >= 0 and i > 13 then
                love.graphics.setColor(0, 0, 0)
                love.graphics.print("7", 10 + i * 22, 100 + j * 22)
            end
        end
    end
end
