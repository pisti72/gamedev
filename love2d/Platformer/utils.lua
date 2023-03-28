flr = math.floor
abs = math.abs
ITEMS_VERTICAL = 20
--DEBUG = false
MAX_PIXEL = 8



local flags = {fullscreen=true, resizable=true, vsync=true, minwidth=400, minheight=300}
w, h = love.window.getDesktopDimensions(flags.display)
local success = love.window.setMode(w, h, flags )
love.graphics.setDefaultFilter( 'nearest', 'nearest',1)
local font = love.graphics.newImageFont( 'assets/retro_font.png', ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.,!?@>-' )
love.graphics.setFont(font)
Tileset = love.graphics.newImage('assets/tiles_16x16.png')
--[https://www.dafont.com/de/chomsky.font?text=Taste+My+Sword]
title_gfx = love.graphics.newImage('assets/title_240x40.png')
local tilesetW, tilesetH = Tileset:getWidth(), Tileset:getHeight()
TileW = 16
pixel = flr(h/ITEMS_VERTICAL/TileW);
grid = TileW * pixel

Blocks={
}

Quads = {
        love.graphics.newQuad(TileW * 0, TileW * 0, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 1, TileW * 0, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 2, TileW * 0, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 3, TileW * 0, TileW, TileW, tilesetW, tilesetH),
        
        love.graphics.newQuad(TileW * 4, TileW * 1, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 5, TileW * 1, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 6, TileW * 1, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 7, TileW * 1, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 8, TileW * 1, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 9, TileW * 1, TileW, TileW, tilesetW, tilesetH),
        
        love.graphics.newQuad(TileW * 4, TileW * 2, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 5, TileW * 2, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 6, TileW * 2, TileW, TileW, tilesetW, tilesetH),
        love.graphics.newQuad(TileW * 7, TileW * 2, TileW, TileW, tilesetW, tilesetH),
    }
    

actor={
    NOT_FIXED = false,
    FIXED = true,
    --GRAVITY = 1.2,
    GRAVITY = .2,
    --JUMPFORCE = 180,
    JUMPFORCE = 4.1,
    RUNFORCE = .1,
    --SPEED = 100,
    SPEED = 2.5,
    FALL_LIMIT = 3,
    items={},
    add = function(name,id,x,y,fixed)
        local item = {
            name = name,
            id = id,
            x = x * TileW,
            y = y * TileW,
            xd = 0,
            yd = 0,
            counter = 0,
            friction = .95,
            xforce = 0,
            flip = false,
            live = true,
            fixed = fixed,
            onthefloor = false,
            left_pressed = false,
            right_pressed = false,
            up_pressed = false,
            down_pressed = false,
            fire_pressed = false,
            isonground = false,
            snd_jump = {},
            idle = {},
            left = 0,
            runforce = actor.RUNFORCE,
            jumpforce = actor.JUMPFORCE
        }
        table.insert(actor.items, item)
    end,
    draw = function()
        love.graphics.setColor(1, 1, 1)
        for i,v  in pairs(actor.items) do
            v.counter = v.counter + 1
            local x = pixel * flr(v.x - camera.x)
            local y = pixel * flr(v.y - camera.y)
            local quad = v.idle[flr(v.counter/6)%#v.idle + 1]
            if abs(v.xd)>0.1 then
                quad = v.running[flr(v.counter/4)%#v.running + 1]
            end
            if v.flip then
                love.graphics.draw(Tileset, Quads[quad], x + grid, y, 0, -pixel, pixel)
            else
                love.graphics.draw(Tileset, Quads[quad], x, y, 0, pixel, pixel)
            end
            
            if debug_display.on then
                love.graphics.print(flr(v.x/TileW)..","..flr(v.y/TileW), x, y-TileW*pixel/2, 0 , pixel)
                if v.overlapped then
                    love.graphics.setColor(1, .5, .5, .5)
                    love.graphics.rectangle("fill", x, y, grid, grid)
                end
            end
        end
    end,
    left = function(name)
        actor.get(name).left_pressed = true
    end,
    right = function(name)
        actor.get(name).right_pressed = true
    end,
    up = function(name)
        actor.get(name).up_pressed = true
    end,
    down = function(name)
        actor.get(name).down_pressed = true
    end,
    get = function(name)
        for i,v in pairs(actor.items) do
            if v.name == name then
                return v
            end
        end
    end,
    update = function(dt)
        dt = 1
        for i,v  in pairs(actor.items) do
            --v.onthefloor = false
            v.overlapped = false
            --forces
            v.xforce = 0
            if v.left_pressed then
                --v.xd = -actor.SPEED
                v.xforce = -v.runforce
                v.flip = true
            elseif v.right_pressed then
                v.xforce = v.runforce
                --v.xd = actor.SPEED
                v.flip = false
            end
            
            if v.up_pressed and v.isonground then
                v.yd = -v.jumpforce
                --v.overlapped = true
                snd_jump:play()
            end
            
            v.yd = v.yd + actor.GRAVITY
            v.xd = v.xd + v.xforce
            v.xd = v.xd * v.friction
            if v.xd > actor.SPEED then
                v.xd = actor.SPEED
            end
            
            if v.xd < -actor.SPEED then
                v.xd = -actor.SPEED
            end
            
            if v.yd > actor.FALL_LIMIT then
                v.yd = actor.FALL_LIMIT
            end
            
            if v.xd>0 then
                v.flip = false
            end
            
            if v.xd<0 then
                v.flip = true
            end
            --moves
            if not v.fixed then
                v.x = v.x + dt * v.xd
                v.y = v.y + dt * v.yd
                --v.x = v.x + v.xd
                --v.y = v.y + v.yd
                
                
            end
            --collition with map
            
            if map.get(flr((v.x+v.left)/TileW),flr((v.y+TileW-4)/TileW)) == "B" and v.xd<0 then
                v.x = v.x - dt * v.xd
                --v.x = v.x - v.xd
                v.xd = 0 --Bug
            end
            
            if map.get(flr((v.x+v.right)/TileW),flr((v.y+TileW-4)/TileW)) == "B" and v.xd>0 then
                v.x = v.x - dt * v.xd
                --v.x = v.x - v.xd
                v.xd = 0 --Bug
            end
            
            
            v.isonground = false
            if (map.get(flr((v.x+v.left)/TileW),flr((v.y+TileW-1)/TileW)) == "B" or map.get(flr((v.x+v.right)/TileW),flr((v.y+TileW-1)/TileW))== "B") and v.yd>0 then
                v.y = v.y - dt * v.yd
                --v.y = v.y - v.yd
                v.yd = 0 --Bug
                v.isonground = true
            end
            
            if (map.get(flr((v.x+TileW/2)/TileW),flr((v.y+4)/TileW)) == "B") and v.yd<0 then
                v.y = v.y - dt * v.yd
                --v.y = v.y - v.yd
                v.yd = 0 --Bug
            end
            
            
            
            
            --collitions with other actors
            for j,v2 in pairs(actor.items) do
                if not(i==j) then
                    if overlap(v,v2) then
                        --move them out
                        --v.overlapped = true
                        local xdiff = abs(v.x-v2.x)
                        local ydiff = abs(v.y-v2.y)
                        if xdiff>ydiff then
                            
                            --side collition
                            if v.x<v2.x then
                                v.x = v2.x - 1
                            else
                                v.x = v2.x + 1
                            end
                        else
                            --above or below collition
                            if v.y<v2.y then
                                v.y = v2.y - 1
                            else   
                                v.y = v2.y + 1
                            end
                        end
                    end
                end
            end
        end
    end
}

function overlap(a,b)
    local xdist = abs(a.x - b.x)
    local ydist = abs(a.y - b.y)
    return (xdist<1 and ydist<1)
end

function overlapOnlySides(a,b,dt)
    local xdist = abs(a.x + a.xd - b.x - b.xd)
    return (xdist<1)
end

function overlapOnlyAboveAndBelow(a,b,dt)
    local xdist = abs(a.x - b.x)
    local ydist = abs(a.y + a.yd - b.y - b.yd)
    return (xdist<1 and ydist<1)
end

menu={
    items={"FIRST","SECOND","THIRD"},
    cursor=0,
    move = function (n)
        menu.cursor = menu.cursor + n
        menu.cursor = menu.cursor % #menu.items
    end,
    draw = function ()
        love.graphics.setColor(1, 1, 1)
        for i=1,#menu.items do
            local text = " "..menu.items[i]
            if menu.cursor == i-1 then
                text=">"..menu.items[i]
            end
            love.graphics.print(text, w/3, h/2+(i-1)*grid, 0 , pixel)
        end
    end,
    getText = function ()
        return menu.items[menu.cursor+1]
    end,
    getId = function ()
        return menu.cursor+1
    end
}

map={
    data = {},
    quads = "BCDE",
    w = 0,
    h = 0,
    loadFrom = function(filename)
        map.data = {}
        local y=0
        for line in love.filesystem.lines(filename) do
          local row={}
          local line_length = string.len(line)
          if line_length > map.w then
            map.w = line_length
          end
          local x=0
          for i=0,line_length-1 do
            --actor.add("BLOCK",1,x,y,true)
            x=x+1
            table.insert(row,string.sub(line,i+1,i+1))
          end
          y=y+1
          table.insert(map.data, row)
        end
        map.normalizing()
        map.h = #map.data
    end,
    normalizing = function()
        for i,v  in pairs(map.data) do
            local row = v
            if #row < map.w then
                for i=0,map.w-#row do
                    table.insert(row," ")
                end
            end
        end
    end,
    saveTo = function(filename)
        local data = ""
        for j=0,map.h-1 do
            for i=0,map.w-1 do
                data = data..map.get(i,j)
            end
            if j<map.h-1 then
                data = data.."\n"
            end
        end
        local file = love.filesystem.newFile(filename)
        local success, message =love.filesystem.write( filename, data)
    end,
    get = function (x,y)
        if x<0 or x>map.w-1 or y>map.h-1 then
            return "B"
        elseif y<0 then
            return " "
        end
        return map.data[math.floor(y+1)][math.floor(x+1)]
    end,
    set = function (id,x,y)
        local x = flr(x)
        local y = flr(y)
        if x < 0 then
            return
        elseif x > map.w + 1 then
            map.w = x
            map.normalizing()
        end
        if y < 0 then
            return
        elseif y > #map.data-1 then
            for i=1,y-#map.data+1 do
                local row = {}
                for j=1,map.w+1 do
                    table.insert(row," ")
                end
                table.insert(map.data,row)
            end
            map.h = #map.data
        end
        --local row = map.data[y+1]
        --row[x+1] = id
        --TBD or add actor
        map.data[y+1][x+1] = id
    end,
    getWidth = function()
        return map.w
    end,
    getHight = function()
        return map.h
    end,
    draw = function()
        love.graphics.setColor(1, 1, 1)
        for j=0,map.h-1 do
            for i=0,map.w-1 do
                local item = map.get(i,j)
                local item_above = map.get(i,j-1)
                local item_below = map.get(i,j+1)
                local quad_id = string.find(map.quads, item)
                --if not (quad_id == nil) then
                if item == "B" then
                    local quad = Quads[2]
                    if not(item_above=="B") then
                        quad = Quads[1]
                    elseif not(item_below=="B") then
                        quad = Quads[4]
                    end
                    love.graphics.draw(Tileset, quad, grid * i - camera.get().x * pixel, grid * j - camera.get().y * pixel, 0, pixel, pixel)
                end
            end
        end
    end
    
}

camera={
    x=0,
    y=0,
    actor={x=0,y=0},
    update = function(dt)
        camera.x = camera.actor.x - flr(w/pixel/2)
        camera.y = camera.actor.y - flr(h/pixel/2)
    end,
    get = function()
        return {x = flr(camera.x), y = flr(camera.y)}
    end
}

cursor={
    x=0,
    y=0,
    update = function(dt)
        if love.mouse.isDown(1) then
            cursor.put()
        end
    end,
    quad_id = 1,
    next_item = function()
        cursor.quad_id = cursor.quad_id + 1
        if cursor.quad_id > string.len(map.quads) then
            cursor.quad_id = string.len(map.quads)
        end
    end,
    previous_item = function()
        cursor.quad_id = cursor.quad_id - 1
        if cursor.quad_id < 1 then
            cursor.quad_id = 1
        end
    end,
    position = function(x,y)
        cursor.x = x
        cursor.y = y
    end,
    move = function(xd,yd)
        cursor.x = cursor.x + xd
        cursor.y = cursor.y + yd
    end,
    put = function()
        map.set(string.sub(map.quads,cursor.quad_id,cursor.quad_id), cursor.x, cursor.y)
    end,
    delete = function()
        map.set(" ",cursor.x,cursor.y)
    end,
    draw = function ()
        local x, y = love.mouse.getPosition() -- get the position of the mouse
        cursor.x = flr(x/grid + camera.get().x/TileW)
        cursor.y = flr(y/grid + camera.get().y/TileW)
        x = cursor.x * grid - camera.get().x * pixel
        y = cursor.y * grid - camera.get().y * pixel
        love.graphics.setColor(1, 1, 1)
        love.graphics.draw(Tileset, Quads[cursor.quad_id], x, y, 0, pixel, pixel)
        love.graphics.setColor(.5, .5, 1, .5)
        love.graphics.rectangle("fill", x, y, grid, grid)
    end
}

debug_display = {
    on = false,
    draw = function(pairs_of_values)
        if debug_display.on then
            local pixel=2
            local font_height=9
            for i=1,#pairs_of_values do
                love.graphics.print(pairs_of_values[i][1]..":"..tostring(pairs_of_values[i][2]), 8 * pixel, font_height * pixel * i, 0, pixel)
            end
        end
    end
}