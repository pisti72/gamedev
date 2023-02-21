actor={
    GRAVITY = .04,
    SPEED = 2,
    items={},
    add = function(name,id,x,y)
        local item = {
            name = name,
            id = id,
            x = x,
            y = y,
            xd = 0,
            yd = 0,
            flip = false,
            live = true,
        }
        table.insert(actor.items, item)
    end,
    draw = function()
        love.graphics.setColor(1, 1, 1)
        for i,v  in pairs(actor.items) do
            if v.flip then
                love.graphics.draw(Tileset, Quads[3], grid * v.x + grid, grid * v.y, 0, -pixel, pixel)
            else
                love.graphics.draw(Tileset, Quads[3], grid * v.x, grid * v.y, 0, pixel, pixel)
            end
        end
    end,
    left = function(name)
        local a = actor.get(name)
        a.xd = -actor.SPEED
        a.flip = true
    end,
    right = function(name)
        local a = actor.get(name)
        a.xd = actor.SPEED
        a.flip = false
    end,
    jump = function(name)
        local a = actor.get(name)
        if map.get(a.x, a.y+1) == "B" then
            a.yd = -4*actor.SPEED
            a.y = a.y - 0.01
        end
    end,
    stop = function(name)
        actor.get(name).xd = 0
    end,
    get = function(name)
        for i,v in pairs(actor.items) do
            if v.name == name then
                return v
            end
        end
    end,
    update = function(dt)
        for i,v  in pairs(actor.items) do
            --forces
            v.yd = v.yd + actor.GRAVITY
            --collitions
            if map.get(v.x,v.y+1) == "B" then
                v.yd = 0
            end
            v.x = v.x + v.xd * dt
            v.y = v.y + v.yd * dt
            
        end
    end
}


menu={
    items={"FIRST","SECOND","THIRD"},
    cursor=0,
    move = function (n)
        menu.cursor = menu.cursor + n
        menu.cursor = menu.cursor % #menu.items
    end,
    draw = function ()
        love.graphics.setColor(1, 1, 1)
        for i,v  in pairs(menu.items) do
            local text=v
            if menu.cursor == i-1 then
                text="."..text
            end
            love.graphics.print(text, w/3, h/2+(i-1)*grid, 0 , pixel)
        end
    end,
    getText = function ()
        return menu.items[menu.cursor+1]
    end
}

map={
    data = {},
    quads = "BCDEFGHIJKL",
    w = 0,
    h = 0,
    loadFrom = function(filename)
        map.data = {}
        map.h = 0
        for line in love.filesystem.lines(filename) do
          local row={}
          local line_length = string.len(line)
          if line_length > map.w then
            map.w = line_length
          end
          for i=0,line_length do
            table.insert(row,string.sub(line,i+1,i+1))
          end
          table.insert(map.data, row)
          map.h = map.h + 1
        end
        --normalizing
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
        
    end,
    get = function (x,y)
        return map.data[math.floor(y+1)][math.floor(x+1)]
    end,
    set = function (id,x,y)
        --local row = map.data[y+1]
        --row[x+1] = id
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
        local y = 0
        for i,v  in pairs(map.data) do
            local row = v
            local x = 0
            for i,v  in pairs(row) do
                local quad_id = string.find(map.quads, v)
                if not (quad_id == nil) then
                    love.graphics.draw(Tileset, Quads[quad_id], grid * x, grid * y, 0, pixel, pixel)
                end
                x = x + 1
            end
            y = y + 1
        end
    end
}

cursor={
    x=0,
    y=0,
    position = function(x,y)
        cursor.x = x
        cursor.y = y
    end,
    move = function(xd,yd)
        cursor.x = cursor.x + xd
        cursor.y = cursor.y + yd
    end,
    draw = function ()
        love.graphics.setColor(.5, .5, 1, .5)
        love.graphics.rectangle("fill", cursor.x * grid, cursor.y * grid, grid, grid)
    end
}