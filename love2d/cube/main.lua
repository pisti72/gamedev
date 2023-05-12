local flags = {fullscreen=true, resizable=true, vsync=true, minwidth=400, minheight=300}
w, h = love.window.getDesktopDimensions(flags.display)
local success = love.window.setMode(w, h, flags )
love.graphics.setDefaultFilter( 'nearest', 'nearest',1)

points={0,0,0}
edges={}



function love.draw()
    
    local vertices  = {100,100, 200,100, 200,200, 300,200, 300,300, 100,300} -- Concave "L" shape.
    --local triangles = love.math.triangulate(vertices)

    --local vertices = {100,100, 200,100, 150,200}

-- Passing the table to the function as a second argument.
    love.graphics.setColor(.5, .5, .5)
    love.graphics.rectangle("fill", 0, 0, w, h)
    love.graphics.setColor(1, .6, .6)
    love.graphics.polygon("fill", vertices)
    --love.graphics.print("Hello World", 400, 300)
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