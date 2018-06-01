--[[
This is my lua game
]]--

function love.load()
    SILENT = false
    DEBUG = false

    EMPTY = 0
    WALL = 1
    GEM = 2
    DOOR = 3
    
    NONE = 0
    VERTICAL = 1
    HORIZONTAL =2
    
    NORTH = 1
    SOUTH = 2
    WEST = 3
    EAST = 4
    
    PLAYER = 0
    ENEMY1 = 1
    FLAME = 2
    NOBODY = 99
    
    GFX_BRICK_CYN       = 1
    GFX_KNIGHT          = 2
    GFX_CASE            = 3
    GFX_FLOOR_YEL       = 4
    GFX_SKELETON        = 5
    GFX_FIRE            = 6
    GFX_KNIGHT_BLUE     = 7
    GFX_FIRE_V          = 8
    GFX_HEART_EMPTY     = 9
    GFX_HEART_FULL      = 10
    GFX_BRICKSIDE_CYN   = 11
    GFX_BALL            = 12
    GFX_BRICK_MGN       = 13
    GFX_BRICKSIDE_MGN   = 14
    GFX_BRICK_WHT       = 15
    GFX_BRICKSIDE_WHT   = 16
    GFX_FLOOR_RED       = 17
    GFX_DOOR_CLOSED     = 18
    GFX_DOOR_OPEN       = 19
    GFX_STAIRS_CLOSED   = 20
    GFX_STAIRS_OPEN     = 21
    GFX_BRICK_RED       = 22
    GFX_BRICKSIDE_RED   = 23
    GFX_FLOOR_BLU       = 24
    
    BULLET_SPEED = 18
    FAST = 6
    SLOW = 4
    VERYSLOW = 1
    
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
    
    STATE_TITLE = 0
    STATE_INGAME = 1
    STATE_NEXTSTAGE = 2
    STATE_GAMEOVER = 3
    
    state = STATE_TITLE
    music = love.audio.newSource('snd/title.ogg','stream')
    music:setLooping(true)
    --https://www.bfxr.net/
    sndExplosion = love.audio.newSource('snd/Explosion5.wav','static')
    sndHit = love.audio.newSource('snd/Hit_Hurt4.wav','static')
    sndShoot = love.audio.newSource('snd/Laser_Shoot2.wav','static')
    sndPowerup = love.audio.newSource('snd/Powerup4.wav','static')
    sndGems = love.audio.newSource('snd/Powerup4.wav','static')
    music:play()
    if SILENT then
        music:setVolume(0) 
        sndExplosion:setVolume(0)
        sndHit:setVolume(0) 
        sndShoot:setVolume(0)
        sndPowerup:setVolume(0) 
    else
        music:setVolume(0.3) 
        sndExplosion:setVolume(0.9)
        sndHit:setVolume(0.5)
        sndShoot:setVolume(0.3)
        sndPowerup:setVolume(0.3) 
    end
    
    love.graphics.setDefaultFilter( 'nearest', 'nearest',1)
    local font = love.graphics.newImageFont( 'res/zxfont_8x8.png', ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.,!?@' )
    love.graphics.setFont(font)
    Tileset = love.graphics.newImage('res/tiles16x16zx.png')
    local tilesetW, tilesetH = Tileset:getWidth(), Tileset:getHeight()
    TileW = 16
    HeartW = 7
    HeartH = 6
    camera = {y=0,shaking=0}
  
    Quads = {
        love.graphics.newQuad(16, 0, TileW, TileW, tilesetW, tilesetH), -- 1 = GFX_BRICK_CYN
        love.graphics.newQuad(0, 0, TileW, TileW, tilesetW, tilesetH),  -- 2 = GFX_KNIGHT
        love.graphics.newQuad(48, 16, TileW, TileW, tilesetW, tilesetH),-- 3 = GFX_CASE
        love.graphics.newQuad(48, 0, TileW, TileW, tilesetW, tilesetH), -- 4 = GFX_FLOOR_YEL
        love.graphics.newQuad(32, 16, TileW, TileW, tilesetW, tilesetH),-- 5 = GFX_SKELETON
        love.graphics.newQuad(0, 16, TileW, TileW, tilesetW, tilesetH), -- 6 = GFX_FIRE
        love.graphics.newQuad(32, 32, TileW, TileW, tilesetW, tilesetH),    -- 7 = GFX_KNIGHT_BLUE
        love.graphics.newQuad(0, 32, TileW, TileW, tilesetW, tilesetH), -- 8 = GFX_FIRE_V
        love.graphics.newQuad(16, 32, HeartW, HeartH, tilesetW, tilesetH),        -- 9 = GFX_HEART_EMPTY
        love.graphics.newQuad(25, 32, HeartW, HeartH, tilesetW, tilesetH),        -- 10 = GFX_HEART_FULL
        love.graphics.newQuad(32,  0, TileW, TileW, tilesetW, tilesetH), -- 11 = GFX_BRICKSIDE_CYN
        love.graphics.newQuad(16, 16, TileW, TileW, tilesetW, tilesetH),    -- 12 = GFX_BALL
        love.graphics.newQuad(16, 48, TileW, TileW, tilesetW, tilesetH),    -- 13 = GFX_BRICK_MGN
        love.graphics.newQuad(32, 48, TileW, TileW, tilesetW, tilesetH),    -- 14 = GFX_BRICKSIDE_MGN
        love.graphics.newQuad(48, 48, TileW, TileW, tilesetW, tilesetH),    -- 15 = GFX_BRICK_WHT
        love.graphics.newQuad(64, 48, TileW, TileW, tilesetW, tilesetH),    -- 16 = GFX_BRICKSIDE_WHT
        love.graphics.newQuad(64,  0, TileW, TileW, tilesetW, tilesetH),    -- 17 = GFX_FLOOR_RED
        love.graphics.newQuad(64, 16, TileW, TileW, tilesetW, tilesetH),    -- 18 = GFX_DOOR_CLOSED
        love.graphics.newQuad(80, 16, TileW, TileW, tilesetW, tilesetH),    -- 19 = GFX_DOOR_OPEN
        love.graphics.newQuad(64, 32, TileW, TileW, tilesetW, tilesetH),    -- 20 = GFX_STAIRS_CLOSED
        love.graphics.newQuad(80, 32, TileW, TileW, tilesetW, tilesetH),    -- 21 = GFX_STAIRS_OPEN
        love.graphics.newQuad(80, 48, TileW, TileW, tilesetW, tilesetH),    -- 22 = GFX_BRICK_RED
        love.graphics.newQuad(96, 48, TileW, TileW, tilesetW, tilesetH),    -- 23 = GFX_BRICKSIDE_RED
        love.graphics.newQuad(80,  0, TileW, TileW, tilesetW, tilesetH),    -- 24 = GFX_FLOOR_BLU
    }
    wallsHeight = 17
    stage = 1
    gemsAll = 0
    gems = 0
    
    joysticks = love.joystick.getJoysticks()
    joystick1 = joysticks[1]
    joystick2 = joysticks[2]
    debug1 = ""
    debug2 = ""
    
    local flags = {fullscreen=false, resizable=true, vsync=false, minwidth=400, minheight=300}
    w, h = love.window.getDesktopDimensions(flags.display)
    local success = love.window.setMode( w, h, flags )
    
    grid = math.floor(h/wallsHeight/2)*2
    gridHalf = grid/2
    sx = grid/TileW
    pixel = math.floor(sx)
    --debug1 = pixel
    wallsWidth = math.floor(w/grid)
    --love.graphics.setNewFont('res/I-pixel-u.ttf', gridHalf)
    actors = {}
    walls = {}
    particles = {}
    
    --createFourthStage()
    --createFifthStage()
    createFirstStage()
end

function love.keypressed(key)
    if state == STATE_TITLE then
        if key == "escape" then
            love.event.quit()
        elseif key == "rctrl" or key == "lctrl" then
           firePressed({})
        end
    elseif state == STATE_INGAME then
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
                firePressed(actor)
            end
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
                firePressed(actor)
            end
        end
        
        if key == "escape" then
            state = STATE_TITLE
        end
    elseif state == STATE_NEXTSTAGE or state == STATE_GAMEOVER then
        if key == "escape" then
            state = STATE_TITLE
        elseif key == "rctrl" or key == "lctrl" then
           firePressed({})
        end
    end
end

function updateJoystick()
    if state == STATE_INGAME then
        local actor = getActorById('p1')
        if joystick1 and not(actor == NOTFOUND) then
            --debug2 = joystick1:getAxis(0)
            if joystick1:getAxis(1) == -1 then
                actor.want = WEST
            elseif joystick1:getAxis(1) == 1 then
                actor.want = EAST
            elseif joystick1:getAxis(2) == -1 then
                actor.want = NORTH
            elseif joystick1:getAxis(2) == 1 then
                actor.want = SOUTH
            end
            
        end
        
        local actor = getActorById('p2')
        if joystick2 and not(actor == NOTFOUND) then
            if joystick2:getAxis(1) == -1 then
                actor.want = WEST
            elseif joystick2:getAxis(1) == 1 then
                actor.want = EAST
            elseif joystick2:getAxis(2) == -1 then
                actor.want = NORTH
            elseif joystick2:getAxis(2) == 1 then
                actor.want = SOUTH
            end
            
        end
    end
end

function love.joystickpressed( joystick, button )
    if state == STATE_INGAME then
        local actor = getActorById('p1')
        if joystick1 and joystick1:isDown(1,2,3,4) and not(actor == NOTFOUND) then
            firePressed(actor)
        end
        
        local actor = getActorById('p2')
        if joystick2 and joystick2:isDown(1,2,3,4) and not(actor == NOTFOUND) then
            firePressed(actor)
        end
    else
        firePressed({})
    end
end

function firePressed(actor)
    sndShoot:play()
    if state == STATE_TITLE then
        inicStage()
    elseif state == STATE_NEXTSTAGE then
        state = STATE_INGAME
    elseif state == STATE_GAMEOVER then
        state = STATE_TITLE
    elseif state == STATE_INGAME then
        createBullet(actor)
    end
end

function inicStage()
    state = STATE_NEXTSTAGE
    --stage = stage + 1
    actors = {}
	walls = {}
    particles = {}
    gems = 0
    if stage == 1 then
        createFirstStage()
    elseif stage == 2 then
        createSecondStage()
    elseif stage == 3 then
        createThirdStage()
    elseif stage == 4 then
        createFourthStage()
    elseif stage == 5 then
        createFifthStage()
    else
        stage = 1
        createFirstStage()
    end
    gemsAll = countGems()
end

function updateActors(dt)
    for k,v in pairs(actors) do
        local speed = v.speed * dt
        if v.typ == PLAYER or v.typ == ENEMY1 then
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
        elseif v.typ == FLAME then
            if v.direction == NORTH or v.direction == WEST then
                v.v = -speed
            else
                v.v = speed
            end
            
            if v.direction == WEST then
                v.mirrorx = 1
            elseif v.direction == EAST then
                v.mirrorx = -1
            end
        end
        --checks whether gem collected by players
        if v.typ == PLAYER then
            --checks whether gem collected by players
            if getWallPixel(v.x, v.y) == GEM then
                sndPowerup:play()
                setWallPixel(v.x, v.y, EMPTY)
                createParticles(5,YELLOW,10,v.x+grid/2,v.y+grid/2,1)
                createParticles(5,WHITE,10,v.x+grid/2,v.y+grid/2,1)
                gems = gems + 1
            end
            --checks collition with door
            if gems == gemsAll and getWallPixel(v.x, v.y) == DOOR then
                stage = stage + 1
                inicStage()
            end
            --checks collition with enemies
            for key,value in pairs(actors) do
                if value.typ == ENEMY1 and isOverlap(v,value) and v.protected == 0 then
                    actorInjured(v,k,dt)
                end
            end
        end
        --protected
        if v.protected > 0 then
            v.protected = v.protected - 1
        end
        --fire
        if v.typ == FLAME then
            --checks whether the fire hit the wall
            if getWallPixel(v.x,v.y)==WALL then
                createParticles(20,RED,60,v.x,v.y,10)
                createParticles(10,WHITE,40,v.x,v.y,10)
                sndExplosion:play()
                table.remove(actors,k)
            end
            --checks collition with flames
            for key,value in pairs(actors) do
                if not(value.typ == FLAME) and not(v.owner == value.id) and isOverlap(value,v) and value.protected == 0 then
                    --remove flame
                    table.remove(actors,k)
                    actorInjured(value,key,dt)
                end
            end
            
        end
    end
    debug1 = dt
end

function actorInjured(actor,key,dt)
    actor.hit = actor.hit - 1
    if actor.hit == 0 then
        --die
        table.remove(actors,key)
        createParticles(30,RED,100,actor.x,actor.y,8)
        createParticles(30,ORANGE,80,actor.x,actor.y,8)
        sndExplosion:play()
        if allPlayersDied() then
            state = STATE_GAMEOVER
            stage = 1
        end
    else
        --hit
        actor.protected = love.timer.getFPS() * 2
        createParticles(30,YELLOW,60,actor.x,actor.y,8)
        sndHit:play()
    end
end

function moveActors()
    for k,v in pairs(actors) do
        if not(v.v == 0) then
            if not(v.typ == FLAME) then
                createParticles(1, BLACK, 20, v.x,v.y + gridHalf,1)
            end
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
            --local p = getActorById('p1')
            local p = getNearestPlayer(v)
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
            end
            if isPlayerAhead(p,v) then
                --createBullet(v)
            end
         end
    end
end

function isPlayerAhead(actor1,actor2)
    return ((actor1.x == actor2.x) or (actor1.y == actor2.y)) and math.random(100) > 98
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

function allPlayersDied()
    for k,v in pairs(actors) do
        if v.typ == PLAYER then
            return false
        end
    end
    return true 
end

function countPlayers()
    local n = 0
    for k,v in pairs(actors) do
        if v.typ == PLAYER then
            n = n + 1
        end
    end
    return n
end

function love.update(dt)
    updateJoystick()
    if state == STATE_INGAME then
        aiEnemies()
        updateActors(dt)
        updateParticles(dt)
        moveActors()
    elseif state == STATE_NEXTSTAGE then
        updateParticles(dt)
    elseif state == STATE_GAMEOVER then
        updateParticles(dt)
    end
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
    if state == STATE_TITLE then
        drawWalls()
        drawTitle()
        drawPressFire()
    elseif state == STATE_NEXTSTAGE then
        drawWalls()
        drawActors()
        drawNextStage()
        drawPressFire()
    elseif state == STATE_INGAME then
        drawWalls()
        drawActors()
        drawParticles()
    elseif state == STATE_GAMEOVER then
        drawWalls()
        drawActors()
        drawParticles()
        drawGameOver()
        drawPressFire()
    end
    if DEBUG then 
        drawDebug()
    end
end

function drawTitle()
    love.graphics.printf('GAME OF THRONES',0,h*0.4,w/sx/3,"center",0,sx*3)
    love.graphics.printf('PROGRAMMED BY ISTVAN.SZALONTAI12@GMAIL.COM 2018',0,h*0.8,w/sx,"center",0,sx)
end

function drawNextStage()
    love.graphics.printf('NEXT STAGE',0,h*0.5,w/sx,"center",0,sx)
end

function drawGameOver()
    love.graphics.printf('GAME OVER',0,h*0.5,w/sx,"center",0,sx)
end

function drawPressFire()
    coloredtext = {'PRESS FIRE TO START'}
    love.graphics.printf(coloredtext,0,h*0.60,w/sx,"center",0,sx)
end

function drawActors()
    for i,v in pairs(actors) do
        drawSprite(v)
    end
end

function drawSprite(actor)
    if actor.protected%4 < 2 then
        if actor.mirrorx == -1 then
            if actor.mirrory == 1 then
                love.graphics.draw(Tileset, Quads[actor.gfx], actor.x - gridHalf, actor.y - gridHalf,0,sx,sx)
            else
                love.graphics.draw(Tileset, Quads[actor.gfx], actor.x - gridHalf, actor.y - gridHalf + grid,0,sx,-sx)
            end
        else
            if actor.mirrory == 1 then
                love.graphics.draw(Tileset, Quads[actor.gfx], actor.x - gridHalf + grid, actor.y - gridHalf,0,-sx,sx)
            else
                love.graphics.draw(Tileset, Quads[actor.gfx], actor.x - gridHalf + grid, actor.y - gridHalf + grid,0,-sx,-sx)
            end
        end
        if actor.protected > 0 then
            for i=0,actor.hitmax-1 do
                if i<actor.hit then
                    love.graphics.draw(Tileset, Quads[GFX_HEART_FULL], actor.x - gridHalf + i*HeartW*sx, actor.y - grid,0,sx,sx)
                else
                    love.graphics.draw(Tileset, Quads[GFX_HEART_EMPTY], actor.x - gridHalf + i*HeartW*sx, actor.y - grid,0,sx,sx)
                end
            end
        end
    end
    
end

function drawParticles()
    for i,v in pairs(particles) do
        local size = math.floor(v.life/grid)*4+4
        love.graphics.rectangle("fill",v.x-size/2,v.y-size/2,size,size)
    end
end

function drawDebug()
    love.graphics.print("FPS : " .. love.timer.getFPS(), 10, gridHalf)
    love.graphics.print("DEBUG 1 : " .. debug1, 10, grid)
    love.graphics.print("DEBUG 2 : " .. debug2, 10, grid + gridHalf)
end

function fillWalls(w,h,n)
    for i=1,w*h do
        walls[i]=n
    end
end

function fillWallsNM(w,h,n,a,b)
    for i=1,w*h do
        if i%a == 0 or i%b==0 then walls[i]=n end
    end
end

function drawWalls()
    debug2 = sx
    for i=1,#walls do
        local x = ((i-1)%wallsWidth)*grid
        local y = math.floor((i-1)/wallsWidth)*grid
            
        if not (walls[i] == WALL) then
            if stage%3 == 0 then
                love.graphics.draw(Tileset, Quads[GFX_FLOOR_YEL], x, y,0,sx,sx)
            elseif stage%3 == 1 then
                love.graphics.draw(Tileset, Quads[GFX_FLOOR_RED], x, y,0,sx,sx)
            else
                love.graphics.draw(Tileset, Quads[GFX_FLOOR_BLU], x, y,0,sx,sx)
            end
        end
        
        if walls[i] == WALL then
            if getWallSouth(i) == WALL then
                if stage%4 == 0 then
                    love.graphics.draw(Tileset, Quads[GFX_BRICK_CYN], x, y,0,sx,sx)
                elseif stage%4 == 1 then
                    love.graphics.draw(Tileset, Quads[GFX_BRICK_MGN], x, y,0,sx,sx)
                elseif stage%4 == 2 then
                    love.graphics.draw(Tileset, Quads[GFX_BRICK_WHT], x, y,0,sx,sx)
                else
                    love.graphics.draw(Tileset, Quads[GFX_BRICK_RED], x, y,0,sx,sx)
                end
            else
                if stage%4 == 0 then
                    love.graphics.draw(Tileset, Quads[GFX_BRICKSIDE_CYN], x, y,0,sx,sx)
                elseif stage%4 == 1 then
                    love.graphics.draw(Tileset, Quads[GFX_BRICKSIDE_MGN], x, y,0,sx,sx)
                elseif stage%4 == 2 then
                    love.graphics.draw(Tileset, Quads[GFX_BRICKSIDE_WHT], x, y,0,sx,sx)
                else
                    love.graphics.draw(Tileset, Quads[GFX_BRICKSIDE_RED], x, y,0,sx,sx)
                end
            end
        elseif walls[i] == GEM then
            love.graphics.draw(Tileset, Quads[GFX_CASE], x, y,0,sx,sx)
        elseif walls[i] == DOOR then
            if gems == gemsAll then
                if stage%3 <2 then
                    love.graphics.draw(Tileset, Quads[GFX_DOOR_OPEN], x, y,0,sx,sx)
                else
                    love.graphics.draw(Tileset, Quads[GFX_STAIRS_OPEN], x, y,0,sx,sx)
                end
            else
                if stage%3 <2 then
                    love.graphics.draw(Tileset, Quads[GFX_DOOR_CLOSED], x, y,0,sx,sx)
                else
                    love.graphics.draw(Tileset, Quads[GFX_STAIRS_CLOSED], x, y,0,sx,sx)
                end
            end
        end
    end
end

function getWallSouth(i)
    local j = i + wallsWidth
    if j <= #walls then
        return walls[j]
    else
        return WALL
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
        setWall(x,i,n)
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
        hitmax=hit,
        mirrorx=1,
        mirrory=1,
        protected=0,
        x=x*grid + gridHalf,
        y=y*grid + gridHalf,
        speed=speed * grid,
        v=0,
        acc=0,
        axis=HORIZONTAL,
        want=NONE,
        direction=NONE}
    table.insert(actors,actor)
end

function createBullet(shooter)
    local gfx = 0
    local mirrory = 0
    if shooter.axis == HORIZONTAL then 
        gfx = GFX_FIRE
    else
        gfx = GFX_FIRE_V
        if shooter.direction == NORTH then 
            mirrory = 1
        else
            mirrory = -1
        end
    end
    
    local actor={
        id='',
        typ=FLAME,
        gfx=gfx,
        owner=shooter.id,
        mirrorx=1,
        mirrory=mirrory,
        protected=0,
        x=shooter.x,
        y=shooter.y,
        speed=BULLET_SPEED * grid,
        v=0,
        acc=0,
        axis=shooter.axis,
        want=shooter.direction,
        direction=shooter.direction}
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

function getNearestPlayer(actor)
    local distance = 9999999
    local p = NOTFOUND
    for k,v in pairs(actors) do
        if v.typ == PLAYER then
            if distance > getDistance(actor,v) then
                distance = getDistance(actor,v)
                p = v
            end
        end
    end
    return p
end

function getDistance(actor1,actor2)
    return math.abs(actor1.x - actor2.x) + math.abs(actor1.y - actor2.y)
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
            xd=xv,
            yd=yv
        }
        table.insert(particles,particle)
    end
end

--https://www.romanzolotarev.com/pico-8-color-palette/

function createFirstStage()
    fillWalls(wallsWidth, wallsHeight, EMPTY)
    wallFrame(math.floor(wallsWidth/4),math.floor(wallsHeight/4),math.floor(wallsWidth/2),math.floor(wallsHeight/2),GEM)
    fillWallsNM(wallsWidth, wallsHeight, EMPTY,7,3)
    wallFrame(0,0,wallsWidth,wallsHeight,WALL)
    createActor("p1",PLAYER,GFX_KNIGHT,3,FAST,2,2)
    createActor("p2",PLAYER,GFX_KNIGHT_BLUE,3,FAST,wallsWidth-3,wallsHeight-3)
    setWall(math.floor(wallsWidth/2),math.floor(wallsHeight/2),DOOR)
end

function createSecondStage()
    fillWalls(wallsWidth, wallsHeight, EMPTY)
    fillWallsNM(wallsWidth, wallsHeight, GEM,7,9)
    for i=0,math.floor(wallsHeight/4)-1 do
        wallFrame(i*2,i*2,wallsWidth-i*4,wallsHeight-i*4,WALL)
    end
    wallHorizontal(1,math.floor(wallsHeight/2),wallsWidth-2,EMPTY)
    wallVertical(math.floor(wallsWidth/2),1,wallsHeight-2,EMPTY)
    setWall(wallsWidth-3,math.floor(wallsHeight/2),DOOR)
    
    createActor("p1",PLAYER,GFX_KNIGHT,3,FAST,math.floor(wallsWidth/2)+2,math.floor(wallsHeight/2))
    createActor("p2",PLAYER,GFX_KNIGHT_BLUE,3,FAST,math.floor(wallsWidth/2)-2,math.floor(wallsHeight/2))
    
    createActor("e1",ENEMY1,GFX_SKELETON,3,SLOW,1,1)
    createActor("e2",ENEMY1,GFX_SKELETON,3,SLOW,wallsWidth-2,wallsHeight-2)
end

function createThirdStage()
    fillWalls(wallsWidth, wallsHeight, EMPTY)
    fillWallsNM(wallsWidth,wallsHeight,GEM,11,13)
    wallFrame(0,0,wallsWidth,wallsHeight,WALL)
    
    for i=2,wallsHeight-2 do
        if i%2 == 0 then
            wallHorizontal(2,i,wallsWidth-4,WALL)
        end
    end
    
    setWall(wallsWidth-2,2,DOOR)
    
    createActor("p1",PLAYER,GFX_KNIGHT,3,FAST,1,math.floor(wallsHeight/2))
    createActor("p2",PLAYER,GFX_KNIGHT_BLUE,3,FAST,wallsWidth-2,math.floor(wallsHeight/2))

    createActor("e1",ENEMY1,GFX_SKELETON,3,SLOW,1,1)
    createActor("e2",ENEMY1,GFX_SKELETON,3,SLOW,wallsWidth-2,wallsHeight-2)
    createActor("e3",ENEMY1,GFX_SKELETON,3,SLOW,1,wallsHeight-2)
    createActor("e4",ENEMY1,GFX_SKELETON,3,SLOW,wallsWidth-2,1)
end

function createFourthStage()
    fillWalls(wallsWidth, wallsHeight, EMPTY)
    for i=0, wallsWidth-1 do
        for j=0,wallsHeight-1 do
            if i==0 or j==0 or i==wallsWidth-1 or j==wallsHeight-1 or i%6<2 or j%4==0 then
                setWall(i,j,WALL)
            else
                if (i*j)%10 == 0 then
                    setWall(i,j,GEM)
                elseif (i+j)%21 == 0 then
                    createActor("oh",ENEMY1,GFX_SKELETON,2,VERYSLOW,i,j)                    
                    setWall(i,j,DOOR)
                else
                    setWall(i,j,EMPTY)
                end
            end
        end
    end
    for i=1,#walls do
        if (i%wallsWidth)%6==4 and i/wallsWidth>2 and i/wallsHeight<wallsWidth-2 then
            walls[i]=EMPTY
        end
    end
    wallHorizontal(2,math.floor(wallsHeight/3),wallsWidth-3,EMPTY)
    createActor("p1",PLAYER,GFX_KNIGHT,3,FAST,2,1)
    createActor("p2",PLAYER,GFX_KNIGHT_BLUE,3,FAST,3,1)

end

function createFifthStage()
    fillWalls(wallsWidth, wallsHeight, EMPTY)
    for i=1,#walls do
        local x = (i-1)%wallsWidth
        local y = math.floor(i/wallsWidth)
        if x == 0 or x == wallsWidth-1 or y == 0 or y == wallsHeight-1 or (x*y)%4 == 3 then
            walls[i]=WALL
        elseif (x*y)%4 == 2 then
            walls[i]=GEM
        elseif (x*y)%6 == 3 then
            walls[i]=DOOR
        else
            if (x*y)%17 == 3 then
                createActor("oh",ENEMY1,GFX_SKELETON,1,VERYSLOW,x,y)  
            end
            walls[i]=EMPTY
        end
    end
    createActor("p1",PLAYER,GFX_KNIGHT,3,FAST,1,1)
    createActor("p2",PLAYER,GFX_KNIGHT_BLUE,3,FAST,2,1)
end

function countGems()
    local n = 0
    for i=1,#walls do
        if walls[i] == GEM then
            n = n + 1
        end
    end
    return n
end

function notActorHere(actor)
    for k,v in pairs(actors) do
        if not (actor.id == v.id) and isOverlap(actor, v)then
            return false
        end
    end
    return true
end

function isOverlap(actor1,actor2)
    return math.abs(actor1.x-actor2.x)<grid and math.abs(actor1.y-actor2.y)<grid
end
    
