function love.load()
    TITLE_TEXT = "UNTITLED GAME"
    ITEMS_VERTICAL = 15
    
    TITLE = 0
    CREDITS = 1
    EDITOR = 2
    GAME = 3
    
    
    
    
    state = TITLE
    local flags = {fullscreen=true, resizable=true, vsync=false, minwidth=400, minheight=300}
    w, h = love.window.getDesktopDimensions(flags.display)
    local success = love.window.setMode(w, h, flags )
    c=0
    love.graphics.setDefaultFilter( 'nearest', 'nearest',1)
    local font = love.graphics.newImageFont( 'assets/zxfont_8x8.png', ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.,!?@' )
    love.graphics.setFont(font)
    Tileset = love.graphics.newImage('assets/tiles_16x16.png')
    local tilesetW, tilesetH = Tileset:getWidth(), Tileset:getHeight()
    TileW = 16
    Quads = {
        love.graphics.newQuad(0, 0, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(16, 0, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(32, 0, TileW, TileW, tilesetW, tilesetH),
    }
    pixel = h/ITEMS_VERTICAL/TileW;
    grid = TileW * pixel
    
    
    --https://www.bfxr.net/
    snd_click = love.audio.newSource('snd/click.wav','static')
    snd_powerup = love.audio.newSource('snd/powerUp.wav','static')
    
    
    
    map.loadFrom("assets/map.txt")
    actor.add("PLAYER",1,10,3)
end

function love.update(dt)
    --w = w + 1
    --h = h + 1
    --pixel=pixel*1.001
    actor.update(dt)
end

function love.draw()
  love.graphics.setColor(.5, .5, .5)
  love.graphics.rectangle("fill", 0, 0, w, h)
  
  
  map.draw()
  actor.draw()
  
  if state == TITLE then
    drawTitle()
    menu.items={"PLAY","EDITOR","CREDITS","EXIT"}
    menu.draw()
  elseif state == EDITOR then
    cursor.draw()
  end
end

function love.keypressed(key,scancode,isrepeat)
  if state == TITLE then
    if key == "down" then
        menu.move(1)
        snd_click:play()
    elseif key == "up" then
        menu.move(-1)
        snd_click:play()
    elseif key == "return" then
        snd_powerup:play()
        if menu.getText() == "PLAY" then
            state = GAME
        elseif menu.getText() == "EDITOR" then
            cursor.position(0,0)
            state = EDITOR
        elseif menu.getText() == "CREDITS" then
            state = CREDITS
        elseif menu.getText() == "EXIT" then
            love.event.quit()
        end
    end
  elseif state == EDITOR then
    if key == "down" then
        cursor.move(0,1)
    elseif key == "up" then
        cursor.move(0,-1)
    elseif key == "left" then
        cursor.move(-1,0)
    elseif key == "right" then
        cursor.move(1,0)
    elseif key == "return" then
        map.set("B",cursor.x,cursor.y)
    elseif key == "delete" then
        map.set(" ",cursor.x,cursor.y)
    end
  elseif state == GAME then
    if key == "down" then
        --player.move(0,1)
    elseif key == "up" then
        actor.jump("PLAYER")
    end
    
    if key == "left" then
        actor.left("PLAYER")
    elseif key == "right" then
        actor.right("PLAYER")
    end
    
    if key == "return" then
        --map.set("B",cursor.x,cursor.y)
    end
  end
  
  if key == "escape" then
    if state == CREDITS or state == EDITOR or state == GAME then
        state = TITLE
    else
        love.event.quit()
    end
  end
end

function love.keyreleased(key,scancode,isrepeat)
    if state == GAME then
        if key == "left" or key == "right" then
            actor.stop("PLAYER")
        end
    end
end

function drawTitle(items)
    love.graphics.setColor(1, 1, 0)
   love.graphics.print(TITLE_TEXT, w/3, h/2+(-1)*TileW*pixel, 0 , pixel)
end
