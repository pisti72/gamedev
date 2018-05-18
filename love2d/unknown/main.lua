--[[
This is my lua game
]]--

function love.load()
    love.graphics.setDefaultFilter( 'nearest', 'nearest',1)
    Tileset = love.graphics.newImage('res/countryside.png')
    local tilesetW, tilesetH = Tileset:getWidth(), Tileset:getHeight()
    TileW, TileH = 32,32
  
    Quads = {
        love.graphics.newQuad(0,   0, TileW, TileH, tilesetW, tilesetH), -- 1 = grass
        love.graphics.newQuad(32,  0, TileW, TileH, tilesetW, tilesetH), -- 2 = box
        love.graphics.newQuad(0,  32, TileW, TileH, tilesetW, tilesetH), -- 3 = flowers
        love.graphics.newQuad(32, 32, TileW, TileH, tilesetW, tilesetH)  -- 4 = boxtop
    }
    wallsHeight = 21
    stage = 1
	local flags = {fullscreen=false, resizable=true, vsync=false, minwidth=400, minheight=300}
	joysticks = love.joystick.getJoysticks()
    joystick1 = joysticks[1]
    joystick2 = joysticks[2]
    debug1 = ""
    debug2 = ""
	
    w, h = love.window.getDesktopDimensions(flags.display)
    local success = love.window.setMode( w, h, flags )
    grid = math.floor(h/wallsHeight)
    grid4 = math.floor(grid/4)
    wallsWidth = math.floor(w/grid)
	enemies = {}
    players = {}
	walls = {}
	bullets = {}
    particles = {}
    speed = grid * 8
    createFirstStage()
    createPlayer("p1",math.floor(wallsWidth/2),math.floor(wallsHeight/2))
    createEnemy("e1",1,1)
    createEnemy("e2",wallsWidth-2,wallsHeight-2)
    --wallFrame(2,2,3,3,1)
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end
    local p1 = players["p1"]
    if key == "left" then
        p1.want = "left"
    elseif key == "right" then
        p1.want = "right"
    elseif key == "up" then
        p1.want = "up"
    elseif key == "down" then
        p1.want = "down"
    end
    if key == "ctrl" then
        addBullet(p1.x, p1.y, p1.xi, p1.yi)
    end
end

function updateJoystick()
    local p1 = players["p1"]
    if joystick1 then
        debug2 = joystick1:getAxis(0)
        if joystick1:getAxis(1) == -1 then
            p1.want = "left"
        elseif joystick1:getAxis(1) == 1 then
            p1.want = "right"
        elseif joystick1:getAxis(2) == -1 then
            p1.want = "up"
        elseif joystick1:getAxis(2) == 1 then
            p1.want = "down"
        end
    end
    if joystick2 then
        --debug2 = joystick2:getName()
    end
    
   
end

function love.joystickpressed( joystick, button )

    debug1 = "joybutton"
    if joystick then
        --debug2 = "joy"
    end
end

function love.gamepadpressed( joystick, button )

    debug2 = "gamepad"
end

function updatePlayers(dt)
    local p1 = players["p1"]
    --local d = speed * dt
    local d = grid/16
    --want move
	if p1.want == "left" then
        if notWall(p1.x - d, p1.y, grid, grid) then
            p1.direction = "left"
        end
    elseif p1.want == "right" then
        if notWall(p1.x + d, p1.y, grid, grid) then
            p1.direction = "right"
        end
    elseif p1.want == "up" then
        if notWall(p1.x, p1.y - d, grid, grid) then
            p1.direction = "up"
        end
    elseif p1.want == "down" then
        if notWall(p1.x, p1.y + d, grid, grid) then
            p1.direction = "down"
        end
    end
    --direction
    if p1.direction == "left" then
        if notWall(p1.x - d, p1.y, grid, grid) then
            p1.xd = - d
        else
            p1.xd = 0
        end
        p1.yd = 0
    elseif p1.direction == "right" then
        if notWall(p1.x + d, p1.y, grid, grid) then
            p1.xd = d
        else
            p1.xd = 0
        end
        p1.yd = 0
    elseif p1.direction == "up" then
        if notWall(p1.x, p1.y - d, grid, grid) then
            p1.yd = -d
        else
            p1.yd = 0
        end
        p1.xd = 0
    elseif p1.direction == "down" then
        if notWall(p1.x, p1.y + d, grid, grid) then
            p1.yd = d
        else
            p1.yd = 0
        end
        p1.xd = 0
    end
    p1.x = p1.x + p1.xd
    p1.y = p1.y + p1.yd
    
    if getWallPixel(p1.x+grid/2,p1.y+grid/2) == 2 then
        setWallPixel(p1.x+grid/2,p1.y+grid/2,0)
    end
end

function updateEnemies(dt)
    for k,e in pairs(enemies) do
        --local e = enemies[k]
        local p = players["p1"]
        local d = grid/32
        if p.x<e.x and notWall(e.x - d, e.y, grid, grid) and notEnemy(e.id,e.x - d,e.y) then
            e.direction = "left"
        elseif p.x>e.x and notWall(e.x + d, e.y, grid, grid) and notEnemy(e.id,e.x + d,e.y) then
            e.direction = "right"
        elseif p.y<e.y and notWall(e.x, e.y - d, grid, grid) and notEnemy(e.id,e.x,e.y - d) then
            e.direction = "up"
        elseif p.y>e.y and notWall(e.x, e.y + d, grid, grid) and notEnemy(e.id,e.x,e.y + d) then
            e.direction = "down"
        else
            e.direction = "none"
        end
        --local d = speed * dt
       
        --direction
        if e.direction == "left" then
            e.xd = - d
            e.yd = 0
        elseif e.direction == "right" then
            e.xd = d
            e.yd = 0
        elseif e.direction == "up" then
            e.yd = -d
            e.xd = 0
        elseif e.direction == "down" then
            e.yd = d
            e.xd = 0
        end
        e.x = e.x + e.xd
        e.y = e.y + e.yd
    end
end

function love.update(dt)
    updateJoystick()
    updatePlayers(dt)
    updateEnemies(dt)
end

function notWall(x,y,w,h)
    return not(getWallPixel(x,y)==1) and not(getWallPixel(x+w-1,y)==1) and not(getWallPixel(x,y+h-1)==1) and not(getWallPixel(x+w-1,y+h-1)==1)
end

function love.draw()
	--https://love2d.org/wiki/GamepadButton
	--https://love2d.org/wiki/Joystick
	--if Joystick:isGamepadDown('dpleft') then
		--p1.xi = -1
	--end
    
    cls()
    drawWalls()
    drawPlayers()
    drawEnemies()
    drawDebug()
end

function cls()
    love.graphics.setColor(192,192,0)
    love.graphics.rectangle("fill", 0, 0, w, h)
end

function drawPlayers()
    for i,v in pairs(players) do
        love.graphics.setColor(0,0,192)
        love.graphics.rectangle("fill", v.x, v.y, grid, grid)
    end
end

function drawEnemies()
    for i,v in pairs(enemies) do
        love.graphics.setColor(192,0,0)
        love.graphics.rectangle("fill", v.x, v.y, grid, grid)
    end
end

function drawDebug()
    love.graphics.setColor(0,0,0)
    love.graphics.print("Debug1 : " .. debug1, 10, 10)
    love.graphics.print("Debug2 : " .. debug2, 10, 20)
end

function fillWalls(w,h,n)
    for i=1,w*h do
        walls[i]=n
    end
end

function drawWalls()
    
    for i=1,#walls do
        local x = ((i-1)%wallsWidth)*grid
        local y = math.floor((i-1)/wallsWidth)*grid
        if false then
            if walls[i] == 1 then
                love.graphics.setColor(192,0,192)
                love.graphics.rectangle("fill", x, y,grid,grid)
            elseif walls[i] == 2 then
                love.graphics.setColor(0,0,0)
                love.graphics.rectangle("fill", x+grid/8*3, y+grid/8*3,grid/4,grid/4)
            end
        elseif true then
            love.graphics.setColor(255,255,255)
            
            if walls[i] == 1 then
                love.graphics.draw(Tileset, Quads[2], x, y,0,grid/TileW,grid/TileH)
            elseif walls[i] == 2 then
                love.graphics.setColor(0,0,0)
                love.graphics.rectangle("fill", x+grid/8*3, y+grid/8*3,grid/4,grid/4)
            end
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
    return getWall(math.floor(x/grid),math.floor(y/grid))
end

function setWallPixel(x,y,n)
    setWall(math.floor(x/grid),math.floor(y/grid),n)
end

function addActor(id,x,y)
	local actor = {x=x,y=y}
	actors[id] = actor
end

function createPlayer(n,x,y)
    local p={x=grid*x,y=grid*y,xd=0,yd=0,want="none",direction="none"}
    players[n] = p
end

function createEnemy(n,x,y)
    local p={id=n,x=grid*x,y=grid*y,xd=0,yd=0,want="none",direction="none"}
    enemies[n] = p
end

function createFirstStage()
    fillWalls(wallsWidth,wallsHeight,0)
    fillWalls(wallsWidth,wallsHeight,2)--gems
    for i=0,math.floor(wallsHeight/4)-1 do
        wallFrame(i*2,i*2,wallsWidth-i*4,wallsHeight-i*4,1)
    end
    wallHorizontal(1,math.floor(wallsHeight/2),wallsWidth-2,0)
    wallVertical(math.floor(wallsWidth/2),1,wallsHeight-2,0)
end

function notEnemy(id,x,y)
    for k,v in pairs(enemies) do
        if not id == v.id and isOverlap(x,y,v.x,v.y)then
            return false
        end
    end
    return true
end

function isOverlap(x1,y1,x2,y2)
    return math.abs(x1-x2)<grid and math.abs(y1-y2)<grid
end
    
function addBullet(x, y, xd, yd)
end
