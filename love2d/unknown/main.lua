--[[
This is my lua game
]]--

function love.load()
    EMPTY = 0
    WALL = 1
    GEM = 2
    
    NONE = 0
    VERTICAL = 1
    HORIZONTAL =2
    
    NORTH = 1
    SOUTH = 2
    WEST = 3
    EAST = 4
    
    PLAYER = 0
    ENEMY1 = 1
    
    BRICK = 1
    HUMAN = 2
    GOLD = 3
    
    FAST = 200
    SLOW = 150
    
    WHITE = 0
    YELLOW = 1
    ORANGE = 2
    RED = 3
    BLUE = 4
    GREEN = 5
    PINK = 6
    DARKGRAY = 7
    love.graphics.setDefaultFilter( 'nearest', 'nearest',1)
    Tileset = love.graphics.newImage('res/tiles8x8.png')
    local tilesetW, tilesetH = Tileset:getWidth(), Tileset:getHeight()
    TileW, TileH = 8,8
  
    Quads = {
        love.graphics.newQuad(0, 0, TileW, TileH, tilesetW, tilesetH), -- 1 = brick
        love.graphics.newQuad(8, 0, TileW, TileH, tilesetW, tilesetH), -- 2 = human
        love.graphics.newQuad(0, 8, TileW, TileH, tilesetW, tilesetH), -- 3 = gold
        love.graphics.newQuad(8, 8, TileW, TileH, tilesetW, tilesetH)  -- 4 = boxtop
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
    wallsWidth = math.floor(w/grid)
    actors = {}
	walls = {}
	bullets = {}
    particles = {}
    createFirstStage()
    createActor("p1",PLAYER,BLUE,FAST,math.floor(wallsWidth/2),math.floor(wallsHeight/2))
    --createActor("e1",ENEMY1,RED,SLOW,1,1)
    createActor("e2",ENEMY1,RED,SLOW,wallsWidth-2,wallsHeight-2)
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end
    local p1 = actors["p1"]
    if key == "left" then
        p1.want = WEST
    elseif key == "right" then
        p1.want = EAST
    elseif key == "up" then
        p1.want = NORTH
    elseif key == "down" then
        p1.want = SOUTH
    end
    if key == "ctrl" then
        addBullet(p1.x, p1.y, p1.xi, p1.yi)
    end
end

function updateJoystick()
    local p1 = actors["p1"]
    if joystick1 then
        debug2 = joystick1:getAxis(0)
        if joystick1:getAxis(1) == -1 then
            p1.want = WEST
        elseif joystick1:getAxis(1) == 1 then
            p1.want = EAST
        elseif joystick1:getAxis(2) == -1 then
            p1.want = NORTH
        elseif joystick1:getAxis(2) == 1 then
            p1.want = SOUTH
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

function updateActors(dt)
    for k,v in pairs(actors) do
        local speed = v.speed * dt
        --want move
        --akkor valtunk tengelyt ha ott vagyunk a vonalon vagy a kozeleben vagyunk
        if v.want == WEST and onHorizontalGrid(v) then
            snapToHorizontalGrid(v)
            v.v = -speed
            v.axis = HORIZONTAL
        elseif v.want == EAST and onHorizontalGrid(v) then
            snapToHorizontalGrid(v)
            v.v = speed
            v.axis = HORIZONTAL
        elseif v.want == NORTH and onVerticalGrid(v) then
            snapToVerticalGrid(v)
            v.v = -speed
            v.axis = VERTICAL
        elseif v.want == SOUTH and onVerticalGrid(v) then
            snapToVerticalGrid(v)
            v.v = speed
            v.axis = VERTICAL
        elseif v.want == NONE then
            snapToVerticalGrid(v)
            snapToHorizontalGrid(v)
            v.v = 0
        end
        --checks gem collected
        if getWallPixel(v.x+grid/2,v.y+grid/2) == GEM then
            setWallPixel(v.x+grid/2,v.y+grid/2,EMPTY)
            createParticles(10,YELLOW,10,v.x+grid/2,v.y+grid/2)
        end
    end
end

function snapToHorizontalGrid(actor)
    local mod = math.floor(actor.y)%grid
    if mod <= grid/2 then
        actor.y = math.floor(actor.y/grid) * grid
    else
        actor.y = math.ceil(actor.y/grid) * grid
    end
end

function snapToVerticalGrid(actor)
    local mod = math.floor(actor.x)%grid
    if mod <= grid/2 then
        actor.x = math.floor(actor.x/grid) * grid
    else
        actor.x = math.ceil(actor.x/grid) * grid
    end
end

function onHorizontalGrid(actor)
    local mod = math.floor(actor.y)%grid
    if mod <= grid * 0.25 then
        return true
    elseif mod >= grid * 0.75 then
        return true
    else
        return false
    end
end

function onVerticalGrid(actor)
    local mod = math.floor(actor.x)%grid
    if mod <= grid * 0.25 then
        return true
    elseif mod >= grid * 0.75 then
        return true
    else
        return false
    end
end

function moveActors()
    for k,v in pairs(actors) do
        if notWall2(v) and not (v.axis == NONE) then
            createParticles(1,v.color,20,v.x+grid/2,v.y+grid)
            if v.axis == HORIZONTAL then
                v.x = v.x + v.v
            else
                v.y = v.y + v.v
            end
        else
            snapToVerticalGrid(v)
            snapToHorizontalGrid(v)
        end
    end
end

function updateEnemies()
    for k,v in pairs(actors) do
        if v.typ == ENEMY1 then
            --get nearest player
            local p = actors["p1"]
            --if math.floor(v.x/grid) < math.floor(p.x/grid) then
            --    v.want = EAST
            if math.floor(v.x/grid) >= math.floor(p.x/grid) then
                v.want = WEST
                debug1 = "west"
            else
                v.want = NONE
                debug1 = "none"
            end
         end
    end
end

function updateParticles(dt)
    for k,v in pairs(particles) do
        v.x = v.x + v.xd * dt
        v.y = v.y + v.yd * dt
        v.life = v.life - 1
        if v.life<0 then
            table.remove(particles,k)
        end
    end
end

function love.update(dt)
    updateJoystick()
    updateEnemies()
    updateActors(dt)
    updateParticles(dt)
    --updatePlayers()
    moveActors()
    --
end

function notWall2(actor)
    if actor.axis == HORIZONTAL then
        return notWall(actor.x + actor.v, actor.y, grid, grid)
    else
        return notWall(actor.x, actor.y + actor.v, grid, grid)
    end
end

function notWall(x,y,w,h)
    return not(getWallPixel(x,y)==WALL) and not(getWallPixel(x+w-1,y)==WALL) and not(getWallPixel(x,y+h-1)==WALL) and not(getWallPixel(x+w-1,y+h-1)==WALL)
end

function love.draw()
	--https://love2d.org/wiki/GamepadButton
	--https://love2d.org/wiki/Joystick
	--if Joystick:isGamepadDown('dpleft') then
		--p1.xi = -1
	--end
    
    --cls()
    drawWalls()
    drawActors()
    drawParticles()
    drawDebug()
end

function cls()
    setColor(YELLOW)
    love.graphics.rectangle("fill", 0, 0, w, h)
end

function drawActors()
    for i,v in pairs(actors) do
        setColor(v.color)
        love.graphics.draw(Tileset, Quads[HUMAN], v.x, v.y,0,grid/TileW,grid/TileH)
    end
end

function drawParticles()
    --if particles then
        for i,v in pairs(particles) do
            setColor(v.color)
            love.graphics.rectangle("fill",v.x-2,v.y-2,4,4)
        end
    --end
end

function drawDebug()
    setColor(WHITE)
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
            
        if walls[i] == EMPTY or walls[i] == GEM then 
            setColor(DARKGRAY)
            love.graphics.rectangle("fill", x, y,grid,grid)
        end
        if walls[i] == WALL then
            setColor(ORANGE)
            love.graphics.draw(Tileset, Quads[BRICK], x, y,0,grid/TileW,grid/TileH)
        elseif walls[i] == GEM then
            setColor(YELLOW)
            love.graphics.draw(Tileset, Quads[GOLD], x, y,0,grid/TileW,grid/TileH)
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

function createActor(id,typ,color,speed,x,y)
    local p={
        id=id,
        typ=typ,
        color=color,
        x=x*grid,
        y=y*grid,
        speed=speed,
        v=0,
        acc=0,
        axis=HORIZONTAL,
        want=NONE,
        direction=NONE}
    actors[id] = p
end

function createParticles(n,color,life,x,y)
    for i=1,n do
        local particle = {
            x=x,
            y=y,
            color=color,
            life=math.random(life),
            xd=math.random(-grid,grid),
            yd=math.random(-grid,grid)
        }
        table.insert(particles,particle)
    end
end

--https://www.romanzolotarev.com/pico-8-color-palette/
function setColor(color)
    local r,g,b=0
    if color==WHITE then
        r,g,b = 1,241/255,232/255
    elseif color==YELLOW then
        r,g,b = 1,236/255,39/255
    elseif color==ORANGE then
        r,g,b = 1,163/255,0
    elseif color==RED then
        r,g,b = 1,0,77/255
    elseif color==BLUE then
        r,g,b = 41/255,173/255,1
    elseif color==DARKGRAY then
        r,g,b = 95/255,87/255,79/255
    end
    love.graphics.setColor(r,g,b)
end

function createFirstStage()
    fillWalls(wallsWidth,wallsHeight,EMPTY)
    fillWalls(wallsWidth,wallsHeight,GEM)--gems
    for i=0,math.floor(wallsHeight/4)-1 do
        wallFrame(i*2,i*2,wallsWidth-i*4,wallsHeight-i*4,WALL)
    end
    wallHorizontal(1,math.floor(wallsHeight/2),wallsWidth-2,EMPTY)
    wallVertical(math.floor(wallsWidth/2),1,wallsHeight-2,EMPTY)
end

function notActorHere(id,x,y)
    for k,v in pairs(actors) do
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
