--[[
This is my lua game
]]--

function love.load()
    wallsHeight = 21
    stage = 1
	local flags = {fullscreen=true, resizable=true, vsync=false, minwidth=400, minheight=300}
	local joysticks = love.joystick.getJoysticks()
    joystick = joysticks[1]
	w, h = love.window.getDesktopDimensions(flags.display)
	local success = love.window.setMode( w, h, flags )
	love.graphics.setDefaultFilter( 'nearest', 'nearest', 1 )
    unit = math.floor(h/wallsHeight)
    wallsWidth = math.floor(w/unit)
	actors = {}
    players = {}
	walls = {}
	listOfBullets = {}
    listOfParticles = {}
    speed = 120
	addActor("hero",10,12)
    --p1 = {x=unit*15,y=unit*8,xd=0,yd=0,xi=0,yi=0}
    fillWalls(wallsWidth,wallsHeight,0)
    --wallBox(2,2,3,2)
    --setWall(0,0)
    --setWall(0,1)
    --setWall(0,2)
    --setWall(0,3)
    createFirstStage()
    createPlayer("p1",10,10)
    --wallFrame(2,2,3,3,1)
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end
    local p1 = players["p1"]
    if key == "left" then
        p1.xi = -1
        p1.yi = 0
    elseif key == "right" then
        p1.xi = 1
        p1.yi = 0
    end
    if key == "up" then
        p1.yi = -1
        p1.xi = 0
    elseif key == "down" then
        p1.yi = 1
        p1.xi = 0
    end
    if key == "ctrl" then
        addBullet(p1.x, p1.y, p1.xi, p1.yi)
    end
end

function love.joystickpressed(joystick,button)
   --player:jumping()
   if not joystick then return end
   
end

function love.update(dt)
    local p1 = players["p1"]
	if p1.xi == -1 then
        p1.xd = -dt * speed
    end
    if p1.xi == 1 then
        p1.xd = dt * speed
    end
    if p1.yi == -1 then
        p1.yd = -dt * speed
    end
    if p1.yi == 1 then
        p1.yd = dt * speed
    end
    if notWall(p1.x + p1.xd, p1.y + p1.yd) then
        p1.x = p1.x + p1.xd
        p1.y = p1.y + p1.yd
    end
end

function notWall(x,y)
    return true
end

function love.draw()
	--https://love2d.org/wiki/GamepadButton
	--https://love2d.org/wiki/Joystick
	--if Joystick:isGamepadDown('dpleft') then
		--p1.xi = -1
	--end
    
	love.graphics.clear(1,0.9,0,1,true,true)
    drawPlayers()
    drawDebug(#walls)
	love.graphics.setColor(1,0,0)
	--love.graphics.rectangle("fill",0,0,w,10)
    drawWalls()
end

function drawPlayers()
    for i,v in pairs(players) do
        love.graphics.setColor(0,0,1)
        love.graphics.rectangle("fill", v.x, v.y, unit, unit)
    end
end

function drawDebug(n)
    love.graphics.setColor(0,0,0)
    love.graphics.print("Debug : " .. n, 10, 10)
end

function fillWalls(w,h,n)
    for i=1,w*h do
        walls[i]=n
    end
end

function drawWalls()
    love.graphics.setColor(1,0,1)
    for i=1,#walls do
        if walls[i] == 1 then
            love.graphics.rectangle("fill", ((i-1)%wallsWidth)*unit, math.floor((i-1)/wallsWidth)*unit,unit,unit)
        end
    end
end

function wallBox(x,y,w,h)
    for j=x,x+w-1 do
        for i=y,y+h-1 do
            setWall(j,i)
        end
    end
end

function wallFrame(x,y,w,h,n)
    wallHorizontal(x,y,w,n)
    wallHorizontal(x,y+h-1,w,n)
    wallVertical(x,y,h,n)
    wallVertical(x+w-1,y,h,n)
end

function wallHorizontal(x,y,w,n)
    for i=x,x+w-1 do
        setWall(i,y,n)
    end
end

function wallVertical(x,y,h,n)
    for i=y,y+h-1 do
        setWall(x,i,n,n)
    end
end

function setWall(x,y,n)
    walls[x+1+y*wallsWidth] = n
end

function getWall(x,y)
    return walls[x+1+y*wallsWidth]
end

function getWallPixel(x,y)
    return
end

function addActor(id,x,y)
	local actor = {x=x,y=y}
	actors[id] = actor
end

function createPlayer(n,x,y)
    local p={x=unit*x,y=unit*y,xd=0,yd=0,xi=0,yi=0}
    players[n] = p
end

function createFirstStage()
    for i=0,math.floor(wallsHeight/4)-1 do
        wallFrame(i*2,i*2,wallsWidth-i*4,wallsHeight-i*4,1)
    end
    wallHorizontal(1,10,wallsWidth-2,0)
end
    
function addBullet(x, y, xd, yd)
end
