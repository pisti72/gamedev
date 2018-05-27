--[[
This is my lua game
]]--

function love.load()
    SILENT = false

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
    
    GFX_BRICK = 1
    GFX_KNIGHT = 2
    GFX_CASE = 3
    GFX_FLOOR = 4
    GFX_SKELETON = 5
    --GFX_BRICKSIDE = 5
    GFX_FIRE = 6
    --GFX_BALL = 7
    
    FAST = 6
    SLOW = 4
    
    NOTFOUND = 'notfound'
    
    WHITE = 0
    YELLOW = 1
    ORANGE = 2
    RED = 3
    BLUE = 4
    GREEN = 5
    PINK = 6
    DARKGRAY = 7
    BLACK = 8
    
    LASER = 0
    BULLET = 1
    FLAME = 2
    WAVE = 3
    
    STATE_TITLE = 0
    STATE_INGAME = 1
    STATE_NEXTSTAGE = 2
    STATE_GAMEOVER = 3
    
    state = STATE_INGAME
    music = love.audio.newSource('snd/title.ogg','stream')
    --https://www.bfxr.net/
    sndExplosion = love.audio.newSource('snd/Explosion5.wav','static')
    sndHit = love.audio.newSource('snd/Hit_Hurt4.wav','static')
    sndShoot = love.audio.newSource('snd/Laser_Shoot2.wav','static')
    sndPowerup = love.audio.newSource('snd/Powerup4.wav','static')
    music:play()
    if SILENT then
        music:setVolume(0) 
        sndExplosion:setVolume(0)
        sndHit:setVolume(0) 
        sndShoot:setVolume(0)
        sndPowerup:setVolume(0) 
    else
        music:setVolume(0.5) 
        sndExplosion:setVolume(0.9)
        sndHit:setVolume(0.3)
        sndShoot:setVolume(0.3)
        sndPowerup:setVolume(0.3) 
    end
    
    love.graphics.setDefaultFilter( 'nearest', 'nearest',1)
    
    love.graphics.setNewFont('res/I-pixel-u.ttf', 80)
    Tileset = love.graphics.newImage('res/tiles16x16zx.png')
    local tilesetW, tilesetH = Tileset:getWidth(), Tileset:getHeight()
    TileW = 16
    camera = {y=0,shaking=0}
  
    Quads = {
        love.graphics.newQuad(16, 0, TileW, TileW, tilesetW, tilesetH), -- 1 = GFX_BRICK
        love.graphics.newQuad(0, 0, TileW, TileW, tilesetW, tilesetH), -- 2 = GFX_KNIGHT
        love.graphics.newQuad(48, 16, TileW, TileW, tilesetW, tilesetH), -- 3 = GFX_CASE
        love.graphics.newQuad(48, 0, TileW, TileW, tilesetW, tilesetH),  -- 4 = GFX_FLOOR
        love.graphics.newQuad(32, 16, TileW, TileW, tilesetW, tilesetH),  -- 5 = GFX_SKELETON
        love.graphics.newQuad(0, 16, TileW, TileW, tilesetW, tilesetH),  -- 6 = GFX_FIRE
    }
    wallsHeight = 51
    stage = 1
	local flags = {fullscreen=false, resizable=true, vsync=false, minwidth=400, minheight=300}
	joysticks = love.joystick.getJoysticks()
    joystick1 = joysticks[1]
    joystick2 = joysticks[2]
    debug1 = ""
    debug2 = ""
	
    w, h = love.window.getDesktopDimensions(flags.display)
    local success = love.window.setMode( w, h, flags )
    grid = math.floor(h/wallsHeight/2)*2
    gridHalf = grid/2
    wallsWidth = math.floor(w/grid)
    love.graphics.setNewFont('res/I-pixel-u.ttf', gridHalf)
    actors = {}
	walls = {}
	bullets = {}
    particles = {}
    createFirstStage()
    --createActor(id,typ,gfx,speed,x,y)
    createActor("p1",PLAYER,GFX_KNIGHT,10,FAST,math.floor(wallsWidth/2)+2,math.floor(wallsHeight/2))
    createActor("p2",PLAYER,GFX_KNIGHT,10,FAST,math.floor(wallsWidth/2)-2,math.floor(wallsHeight/2))
    
    createActor("e1",ENEMY1,GFX_SKELETON,3,SLOW,1,1)
    createActor("e2",ENEMY1,GFX_SKELETON,3,SLOW,wallsWidth-2,wallsHeight-2)
end

function love.keypressed(key)
    if key == "escape" then
        love.event.quit()
    end
    local actor = getActorById('p1')
    if not(actor == NOTFOUND) then
        if key == "left" then
            actor.want = WEST
        elseif key == "right" then
            actor.want = EAST
        elseif key == "up" then
            actor.want = NORTH
        elseif key == "down" then
            actor.want = SOUTH
        end
        if key == "rctrl" then
            createBullet(LASER, actor)
            --debug2 = 'hi'
        end
    else
        debug1 = "BASZOD"
    end
    
    local actor = getActorById('p2')
    if not(actor == NOTFOUND) then
        if key == "a" then
            actor.want = WEST
        elseif key == "d" then
            actor.want = EAST
        elseif key == "w" then
            actor.want = NORTH
        elseif key == "s" then
            actor.want = SOUTH
        end
        if key == "lctrl" then
            createBullet(LASER, actor)
            --debug2 = 'hi'
        end
    else
        debug1 = "BASZOD"
    end
end

function updateJoystick()
    local p1 = getActorById('p1')
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
        if v.want == WEST and not(getWallPixel(v.x - speed - gridHalf, v.y) == WALL) then
            v.v = -speed
            v.axis = HORIZONTAL
            v.y = math.floor(v.y / grid) * grid + gridHalf
            v.mirrorx = 1
            v.direction = WEST
        elseif v.want == NORTH and not(getWallPixel(v.x, v.y - speed - gridHalf) == WALL) then
            v.v = -speed
            v.axis = VERTICAL
            v.x = math.floor(v.x / grid) * grid + gridHalf
            v.direction = NORTH
        elseif v.want == SOUTH and not(getWallPixel(v.x, v.y + speed + gridHalf) == WALL) then
            v.v = speed
            v.axis = VERTICAL
            v.x = math.floor(v.x / grid) * grid + gridHalf
            v.direction = SOUTH
        elseif v.want == EAST and not(getWallPixel(math.floor(v.x + speed) + gridHalf, v.y) == WALL) then
            v.v = speed
            v.axis = HORIZONTAL
            v.y = math.floor(v.y / grid) * grid + gridHalf
            v.mirrorx = -1
            v.direction = EAST
        elseif v.direction == WEST and  not(getWallPixel(v.x - speed - gridHalf, v.y) == WALL) then
            --do nothing
        elseif v.direction == NORTH and not(getWallPixel(v.x, v.y - speed - gridHalf) == WALL) then
            --do nothing
        elseif v.direction == SOUTH and not(getWallPixel(v.x, v.y + speed + gridHalf) == WALL) then
            --do nothing
        elseif v.direction == EAST and not(getWallPixel(math.floor(v.x + speed) + gridHalf, v.y) == WALL) then
            --do nothing
        else
            v.v = 0
            v.x = math.floor(v.x / grid) * grid + gridHalf
            v.y = math.floor(v.y / grid) * grid + gridHalf
        end
        --checks whether gem collected
        if v.typ == PLAYER then
            if getWallPixel(v.x, v.y) == GEM then
                sndPowerup:play()
                setWallPixel(v.x, v.y, EMPTY)
                createParticles(5,YELLOW,10,v.x+grid/2,v.y+grid/2,1)
                createParticles(5,WHITE,10,v.x+grid/2,v.y+grid/2,1)
            end
        end
        --protected
        if v.protected > 0 then
            v.protected = v.protected - 1
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
        if not(v.v == 0) then
            createParticles(1, BLACK, 20, v.x,v.y + gridHalf,1)
            if v.axis == HORIZONTAL then
                v.x = v.x + v.v
            else
                v.y = v.y + v.v
            end
        end
    end
end

function aiEnemies()
    for k,v in pairs(actors) do
        if v.typ == ENEMY1 then
            --get nearest player
            local p = getActorById('p1')
            if not(p == NOTFOUND) then
                if v.x + gridHalf < p.x then
                    v.want = EAST
                elseif v.x - gridHalf > p.x then
                    v.want = WEST
                elseif v.y + gridHalf < p.y then
                    v.want = SOUTH
                elseif v.y - gridHalf > p.y then
                    v.want = NORTH
                else
                    v.want = NONE
                end
            else
                debug1 = "FUCK"
            end
         end
    end
end

function updateParticles(dt)
    for k,v in pairs(particles) do
        v.yd = v.yd + grid/8 --small gravity
        v.x = v.x + v.xd * dt
        v.y = v.y + v.yd * dt
        v.life = v.life - 1
        if v.life<0 then
            table.remove(particles,k)
        end
    end
end

function updateBullets(dt)
    for k,v in pairs(bullets) do
        if v.axis == HORIZONTAL then
            v.x = v.x + v.v * dt
        else
            v.y = v.y + v.v * dt
        end
        if getWallPixel(v.x,v.y)==WALL then
            --(n,color,life,x,y,speed)
            createParticles(20,RED,60,v.x,v.y,10)
            createParticles(10,WHITE,40,v.x,v.y,10)
            sndExplosion:play()
            table.remove(bullets,k)
        end
        for key,value in pairs(actors) do
            if not(v.owner == value.id) and isOverlap(value.x,value.y,v.x,v.y) and value.protected == 0 then
                table.remove(bullets,k)
                value.hit = value.hit - 1
                if value.hit == 0 then
                    --die
                    table.remove(actors,key)
                    createParticles(30,RED,100,v.x,v.y,8)
                    createParticles(30,ORANGE,80,v.x,v.y,8)
                    sndExplosion:play()
                else
                    --hit
                    value.protected = 200
                    createParticles(30,YELLOW,60,v.x,v.y,8)
                    sndHit:play()
                end
                
            end
        end
    end
end

function love.update(dt)
    updateJoystick()
    aiEnemies()
    updateActors(dt)
    updateParticles(dt)
    updateBullets(dt)
    --updateBullets(dt)
    moveActors()
end

function notWallAhead(actor)
    if actor.axis == HORIZONTAL then
        if actor.v > 0 then
            return not(getWallPixel(actor.x + actor.v + grid/2, actor.y) == WALL)
        else
            return not(getWallPixel(actor.x + actor.v - grid/2, actor.y) == WALL)
        end
    else
        if actor.v > 0 then
            return not(getWallPixel(actor.x, actor.y + actor.v + grid/2) == WALL)
        else
            return not(getWallPixel(actor.x, actor.y + actor.v - grid/2) == WALL)
        end
    end
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
    drawWalls()
    drawActors()
    drawParticles()
    drawBullets()
    drawDebug()
end

function cls()
    setColor(YELLOW)
    love.graphics.rectangle("fill", 0, 0, w, h)
end

function drawActors()
    setColor(WHITE)
    for i,v in pairs(actors) do
        drawSprite(v)
    end
end

function drawSprite(actor)
    if actor.protected%8 < 4 then
        if actor.mirrorx == -1 then
            love.graphics.draw(Tileset, Quads[actor.gfx], actor.x - gridHalf, actor.y - gridHalf,0,grid/TileW,grid/TileW)
        else
            love.graphics.draw(Tileset, Quads[actor.gfx], actor.x - gridHalf + grid, actor.y - gridHalf,0,-grid/TileW,grid/TileW)
        end
    end
end

function drawParticles()
    for i,v in pairs(particles) do
        setColor(v.color)
        local size = math.floor(v.life/grid)*4+4
        love.graphics.rectangle("fill",v.x-size/2,v.y-size/2,size,size)
    end
end

function drawBullets()
    setColor(WHITE)
    for i,v in pairs(bullets) do
        if v.typ == LASER then
            local rotate=0
            if v.axis == HORIZONTAL then
                if v.v > 0 then
                    rotate = 0
                else
                    rotate = 3.14
                end
            else
                if v.v > 0 then
                    rotate = 3.14 * 0.5
                else
                    rotate = 3.14 * 1.5
                end
            end
            --love.graphics.draw( drawable, x, y, r, sx, sy, ox, oy, kx, ky )
            --love.graphics.draw( texture, quad, x, y, r, sx, sy, ox, oy, kx, ky )
            love.graphics.draw(Tileset, Quads[GFX_FIRE], v.x, v.y, rotate,grid/TileW,grid/TileW, grid/4, grid/4)
            --else
            --    love.graphics.rectangle("fill",v.x-grid/8+grid/2,v.y,grid/4,grid)
            --end
        end
    end
end

function drawDebug()
    setColor(WHITE)
    love.graphics.print("DEBUG 1 : " .. debug1, 10, gridHalf)
    love.graphics.print("DEBUG 2 : " .. debug2, 10, grid)
end

function fillWalls(w,h,n)
    for i=1,w*h do
        walls[i]=n
    end
end

function drawWalls()
    setColor(WHITE)
    for i=1,#walls do
        local x = ((i-1)%wallsWidth)*grid
        local y = math.floor((i-1)/wallsWidth)*grid
            
        if walls[i] == EMPTY or walls[i] == GEM then
            love.graphics.draw(Tileset, Quads[GFX_FLOOR], x, y,0,grid/TileW,grid/TileW)
        end
        
        if walls[i] == WALL then
            love.graphics.draw(Tileset, Quads[GFX_BRICK], x, y,0,grid/TileW,grid/TileW)
        elseif walls[i] == GEM then
            love.graphics.draw(Tileset, Quads[GFX_CASE], x, y,0,grid/TileW,grid/TileW)
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
    return walls[x+y*wallsWidth+1]
end

function getWallPixel(x,y)
    return getWall(math.floor(x/grid),math.floor(y/grid))
end

function setWallPixel(x,y,n)
    setWall(math.floor(x/grid),math.floor(y/grid),n)
end

function createActor(id,typ,gfx,hit,speed,x,y)
    local actor={
        id=id,
        typ=typ,
        gfx=gfx,
        hit=hit,
        mirrorx=1,
        protected=0,
        x=x*grid + gridHalf,
        y=y*grid + gridHalf,
        speed=speed * grid,
        v=0,
        acc=0,
        axis=HORIZONTAL,
        want=NONE,
        direction=NONE}
    --actors[id] = actor
    table.insert(actors,actor)
end

function getActorById(id)
    for k,v in pairs(actors) do
        if v.id == id then
            return v
        end
    end
    return NOTFOUND
end

function createParticles(n,color,life,x,y,speed)
    for i=1,n do
        local r = math.random()*2*math.pi
        local s = (math.random(20) + speed) * grid/4
        local xv = math.sin(r) * s
        local yv = math.cos(r) * s
        local particle = {
            x=x,
            y=y,
            color=color,
            life=math.random(life),
            --xd=math.random(-grid,grid)*speed,
            --yd=math.random(-grid,grid)*speed
            xd=xv,
            yd=yv
        }
        table.insert(particles,particle)
    end
end

--https://www.romanzolotarev.com/pico-8-color-palette/
function setColor(color)
    local r,g,b=0,0,0
    if color==WHITE then
        r,g,b = 1,241/255,232/255
    elseif color==BLACK then
        r,g,b = 0,0,0
    elseif color==YELLOW then
        r,g,b = 1,236/255,39/255
    elseif color==ORANGE then
        r,g,b = 1,163/255,0
    elseif color==GREEN then
        r,g,b = 0,228/255,54/255
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

function notActorHere(actor)
    for k,v in pairs(actors) do
        if not (actor.id == v.id) and isOverlap(actor.x, actor.y, v.x, v.y)then
            return false
        end
    end
    return true
end

function isOverlap(x1,y1,x2,y2)
    return math.abs(x1-x2)<grid and math.abs(y1-y2)<grid
end
    
function createBullet(typ, actor)
    sndShoot:play()
    local speed = 0
    if typ == LASER then
        if actor.v>0 then
            speed = grid * FAST * 4
        else
            speed = - grid * FAST * 4
        end
    end
    
    local bullet = {
            x=actor.x,
            y=actor.y,
            typ=typ,
            v=speed,
            axis=actor.axis,
            owner=actor.id
        }
    table.insert(bullets,bullet)
end
