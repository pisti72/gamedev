local flags = {fullscreen=true, resizable=true, vsync=true, minwidth=400, minheight=300}
w, h = love.window.getDesktopDimensions(flags.display)
local success = love.window.setMode(w, h, flags )
--love.graphics.setDefaultFilter( 'nearest', 'nearest',1)

bg_img = love.graphics.newImage('assets/stars.png')
spaceman_img = love.graphics.newImage('assets/spaceman_red.png')

planet_green = love.graphics.newImage('assets/planet_green.png')
planet_yellow = love.graphics.newImage('assets/planet_yellow.png')
planet_red = love.graphics.newImage('assets/planet_red.png')
planet_blue = love.graphics.newImage('assets/planet_blue.png')

spaceman_idle_quad = love.graphics.newQuad(10, 65, 48, 72, spaceman_img)

actor={
    data={},
    add=function(x,y,r)
        local p={
            x=x,
            y=y,
            xd=0,
            yd=0,
            r=r,
            rot=0,
            rot_d=.002
        }
        table.insert(actor.data,p)
    end,
    draw=function()
        for i=1,#actor.data do
            local p=actor.data[i]
            love.graphics.draw(spaceman_img,spaceman_idle_quad,p.x,p.y,p.rot,p.r/24,p.r/24,48/2,72/2)
        end
    end,
    update=function()
        for i=1,#actor.data do
            local p=actor.data[i]
            p.rot = p.rot + p.rot_d
            p.x = p.x + p.xd
            p.y = p.y + p.yd
        end
    end
}

planet={
    data={},
    images={planet_green,planet_yellow,planet_red,planet_blue},
    add=function(x,y,r)
        local p={
            x=x,
            y=y,
            r=r,
            rot=0,
            rot_d=0
        }
        table.insert(planet.data,p)
    end,
    draw=function()
        for i=1,#planet.data do
            local p=planet.data[i]
            love.graphics.draw(planet.images[i%#planet.images+1],p.x,p.y,p.rot,p.r/100,p.r/100,100,100)
        end
    end,
    getClosestByObject=function(obj)
        local closest_obj = planet.data[1]
        local closest_distance = getSurfaceDistance(closest_obj,obj)
        for i=1,#planet.data do
            local p=planet.data[i]
            local distance = getSurfaceDistance(p,obj)
            if distance<closest_distance then
                closest_obj = p
                closest_distance = distance
            end
        end
        return closest_obj
    end,
    update=function()
        for i=1,#planet.data do
            local p=planet.data[i]
            p.rot = p.rot + p.rot_d
        end
    end
}

planet.add(900,700,300)
planet.add(300,300,200)
actor.add(1500,700,20)
--actor.add(-100,300,100)

function getDistance(a,b)
    return math.sqrt(math.pow(a.x-b.x,2)+math.pow(a.y-b.y,2))
end

function getSurfaceDistance(a,b)
    return getDistance(a,b)-a.r-b.r
end

function physics()
    GRAVITY = 0.2
    for i=1,#actor.data do
        --apply forces
        local a=actor.data[i]
        local p=planet.getClosestByObject(a)
        local length = getDistance(a,p)
        
        local g={
            x=(p.x-a.x)/length,
            y=(p.y-a.y)/length
        }
        a.xd = a.xd + g.x * GRAVITY
        a.yd = a.yd + g.y * GRAVITY
        a.rad = math.atan(g.x,g.y)
        --collitions
        for j=1,#planet.data do
            local p = planet.data[j]
            if getSurfaceDistance(a,p)<0 then
                a.xd = 0
                a.yd = 0
            end
        end
        -- keyboard
        local side={
            x=-g.y,
            y=g.x
        }
        if love.keyboard.isDown("left") then
            a.xd = a.xd + side.x *4
            a.yd = a.yd + side.y*4 
        end
        if love.keyboard.isDown("right") then
            a.xd = a.xd - side.x *4
            a.yd = a.yd - side.y*4 
        end
    end
    
    
end

function love.update()
    physics()
    planet.update()
    actor.update()
end

function love.draw()
    love.graphics.setColor(1, 1, 1)
    love.graphics.draw(bg_img,0,0,0,4,4)
    planet.draw()
    actor.draw()
end

function love.keypressed(key,scancode,isrepeat)
    if key == "escape" then
    --if state == CREDITS or state == GAME or state == EDITOR then
      --  if state == EDITOR then
        --    map.saveTo("map2.txt")
        --end
        --state = TITLE
    --else
        love.event.quit()
    end
end