robot1_img = love.graphics.newImage('assets/robot1.png')
robot2_img = love.graphics.newImage('assets/robot2.png')
width, height, flags = love.window.getMode()
x=390 y=200 t=0

function love.draw()
    if love.keyboard.isDown("left") then x=x-1 end
    if love.keyboard.isDown("right") then x=x+1 end
    if love.keyboard.isDown("up") then y=y-1 end
    if love.keyboard.isDown("down") then y=y+1 end
    if love.keyboard.isDown("escape") then 
        love.event.quit()
    end
    
    love.graphics.setColor(0.6, 0.7, 0.8)
    love.graphics.rectangle("fill",0,0,width,height)
    love.graphics.setColor(1, 1, 1)
    img = robot1_img
    if t%30>15 then img=robot2_img end
    love.graphics.draw(img,x,y)
    love.graphics.setColor(0, 0, 0)
    love.graphics.print("HELLO WORLD!",360,360)
    t = t + 1
end
