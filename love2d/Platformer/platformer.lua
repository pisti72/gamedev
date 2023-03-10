function love.load()
    TITLE_TEXT = "TASTE MY SWORD"
    
    
    TITLE = 0
    CREDITS = 1
    EDITOR = 2
    GAME = 3
    
    
    
    
    state = TITLE
    
    c1=0
    c2=0
    
    
    
    
    --https://www.bfxr.net/
    --https://sfxr.me/
    snd_click = love.audio.newSource('snd/click.wav','static')
    snd_powerup = love.audio.newSource('snd/powerUp.wav','static')
    snd_jump = love.audio.newSource('snd/jump.wav','static')
    
    --love.window.setVSync( 1 )
    local exists = love.filesystem.getInfo( "map2.txt" )
    if exists then
        map.loadFrom("map2.txt")
    else
        map.loadFrom("assets/map.txt")
    end
    
    actor.add("PLAYER", 3, 10, 3, actor.NOT_FIXED)
    local player = actor.get("PLAYER")
    player.debug = true
    player.left = 3
    player.right = 13
    player.idle = {5,6,7,8,9,10}
    player.running = {11,12,13,14}
    --actor.snd_jump = snd_jump    
    camera.actor = player
    --actor.add("BLOCK",1,10,6,true)
    --actor.get("BLOCK").debug = true;
    --actor.GRAVITY = 0
end

function love.update(dt)
    c1=c1+1
    camera.update(dt)
    actor.update(dt)
    if state == EDITOR then
        cursor.update()
    end
end

function love.draw()
  c2 = c2 + 1
  love.graphics.setColor(.5, .5, .5)
  love.graphics.rectangle("fill", 0, 0, w, h)
  
  map.draw()
  actor.draw()
  debug_display.draw({{"FPS",love.timer.getFPS( )},{"COUNTER",c1},{"YD",actor.get("PLAYER").yd}})
  
  if state == TITLE then
    drawTitle()
    menu.items={"PLAY","EDITOR","PIXEL: "..pixel,"CREDITS","EXIT"}
    menu.draw()
  elseif state == EDITOR then
    cursor.draw()
  elseif state == CREDITS then
    local credits={
        "--- C R E D I T S ---",
        "",
        "     PROGRAMMING",
        "  ISTVAN SZALONTAI",
        "",
        " ARTWORK AND LEVELS",
        " SZABOLCS SZALONTAI"}
    for i=1,#credits do
        love.graphics.print(credits[i], w/3, h/3+(i-1)*grid, 0 , pixel)
    end
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
    elseif key == "left" then
        if menu.getId() == 3 then
            pixel = pixel - .1
            if pixel < 1 then
                pixel = 1
            end
            grid = TileW * pixel
        end
    elseif key == "right" then
        if menu.getId() == 3 then
            pixel = pixel + .1
            if pixel > MAX_PIXEL then
                pixel = MAX_PIXEL
            end
            grid = TileW * pixel
        end
    elseif key == "return" then
        snd_powerup:play()
        if menu.getText() == "PLAY" then
            state = GAME
        elseif menu.getText() == "EDITOR" then
            state = EDITOR
        elseif menu.getText() == "CREDITS" then
            state = CREDITS
        elseif menu.getText() == "EXIT" then
            love.event.quit()
        end
    end
  elseif state == EDITOR then
    if key == "a" then
        cursor.previous_item()
    elseif key == "d" then
        cursor.next_item()
    elseif key == "return" then
        cursor.put()
    elseif key == "delete" then
        cursor.delete()
    end
  elseif state == CREDITS then
    if key == "return" then
        snd_powerup:play()
        state = TITLE
    end
  end
  
  if state == GAME or state == EDITOR then
    if key == "down" then
        actor.get("PLAYER").down_pressed = true
    end
    if key == "up" then
        actor.get("PLAYER").up_pressed = true
    end
    
    if key == "left" then
        actor.get("PLAYER").left_pressed = true
    end
    if key == "right" then
        actor.get("PLAYER").right_pressed = true
    end
    
    if key == "return" then
        actor.get("PLAYER").fire_pressed = true
    end
  end
  
  
  
  if key == "escape" then
    if state == CREDITS or state == GAME or state == EDITOR then
        if state == EDITOR then
            map.saveTo("map2.txt")
        end
        state = TITLE
    else
        --print ('Exiting')
        love.event.quit()
    end
  end
end

function love.keyreleased(key,scancode,isrepeat)
    if state == GAME or state == EDITOR then
        if key == "left" then
            actor.get("PLAYER").left_pressed = false
        end
        if key == "right" then
            actor.get("PLAYER").right_pressed = false
        end
        if key == "up" then
            actor.get("PLAYER").up_pressed = false
        end
        if key == "down" then
            actor.get("PLAYER").down_pressed = false
        end
    end
end

function drawTitle(items)
   --love.graphics.setColor(1, 1, 0)
   --love.graphics.print(TITLE_TEXT, w/3, h/2+(-1)*TileW*pixel, 0 , pixel)
   love.graphics.setColor(1, 1, 1)
   --love.graphics.rectangle("fill", 40*pixel, 40*pixel, 240*pixel, 80*pixel)
   love.graphics.draw(title_gfx, 40*pixel, 40*pixel, 0, pixel, pixel)
end
