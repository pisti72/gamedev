--[[
Sample game from
http://sheepolution.com/learn/book/14
]]--

function love.load()
    Object = require "classic"
    require "player"
	require "enemy"
	require "bullet"

    player = Player()
	enemy = Enemy()
	listOfBullets = {}
	
	local flags = {resizable=true, vsync=false, minwidth=400, minheight=300}
	
	local width, height = love.window.getDesktopDimensions(flags.display)
	local success = love.window.setMode( width, height, flags )
end

function love.keypressed(key)
   if key == "escape" then
      love.event.quit()
   end
   player:keyPressed(key)
end

function love.keyreleased(key)
	player:keyReleased(key)
end

function love.update(dt)
    player:update(dt)
	enemy:update(dt)
	for i,v in ipairs(listOfBullets) do
        v:update(dt)
		--Each bullets checks if there is collision with the enemy
        v:checkCollision(enemy)
		--If the bullet has the property dead and it's true then..
        if v.dead then
            --Remove it from the list
            table.remove(listOfBullets, i)
        end
    end
	
end

function love.draw()
	for i,v in ipairs(listOfBullets) do
        v:draw()
    end
	player:draw()
	enemy:draw()
end