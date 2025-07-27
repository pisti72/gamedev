Vazul = {
    VERSION = "0.01",
    WHITE = {0.7,0.7,0.7},
    BLACK = {0.1,0.1,0.1},
    LINE_WIDTH = 4,
    DEBUG = true,
    FULLSCREEN = false,
    GRID = 400,
    ROT_Z_SPEED = 1,
    XY_SPEED = 1,
    GRID = 100,
    width = 0,
    height = 0,
    player = {},
    world = {},
    objects = {
        {
            name = "triangle",
            points = {{-1,0,0},{1,0,0},{0,1.7,0},{0,0.8,3}},
            edges = {{1,2},{1,3},{2,3},{1,4},{2,4},{3,4}}
        },
        {
            name = "cube",
            points = {{0,0,0},{1,0,0},{1,1,0},{0,1,0},{0,0,1},{1,0,1},{1,1,1},{0,1,1}},
            edges = {{1,2},{2,3},{3,4},{1,4},{5,6},{6,7},{7,8},{5,8},{1,5},{2,6},{3,7},{4,8}}
        }
    },
    room = {
        {"triangle",0,0,0},
        {"triangle",1,0,0},
        {"cube"    ,2,0,0},
        {"triangle",10,10,0},
        {"triangle",10,15,0},
        {"triangle",10,20,0},
        {"triangle",10,25,0},
        {"triangle",10,30,0},
    },
    
    hello = function(name)
        return "Hello "..name.."! I am Vazul!" 
    end,
    version = function()
        return Vazul.VERSION
    end,
    init = function()
        --https://www.love2d.org/wiki/love.window.setMode
        local flags = {fullscreen=false, resizable=true, vsync=false, minwidth=400, minheight=300}
        Vazul.width, Vazul.height = love.window.getDesktopDimensions(flags.display)
        print(Vazul.width.."x"..Vazul.height)
        local success = love.window.setMode( Vazul.width, Vazul.height, flags )
        --local font = love.graphics.newFont("Vazul/Volter__28Goldfish_29.ttf", 20)
        local font = love.graphics.newFont("Vazul/zx-spectrum.ttf", 3 * 7)
        Vazul.player = {x=0, y=-1000, z=20, rot_z=0, sin=0, cos=1, move_x = 0, move_y = Vazul.XY_SPEED}
        love.graphics.setFont(font)
        love.graphics.setLineWidth( Vazul.LINE_WIDTH )
        love.graphics.setLineStyle( "rough" )
    end,
    draw = function()
        love.graphics.clear(Vazul.WHITE)
        love.graphics.setColor(Vazul.BLACK)
        Vazul.draw_world()
        
        Vazul.draw_debug()
    end,
    calculate_2dpoints = function(p3d,translate)
        local half_width = Vazul.width/2
        local half_height = Vazul.height/2
        local x = p3d[1]*20 - Vazul.player.x + translate.x * Vazul.GRID
        local y = p3d[2]*20 - Vazul.player.y + translate.y * Vazul.GRID
        local z = p3d[3]*20 - Vazul.player.z + translate.z * Vazul.GRID
        local x2 = x * Vazul.player.cos - y * Vazul.player.sin
        local y2 = y * Vazul.player.cos + x * Vazul.player.sin
        local x3 = 0
        local y3 = 0
        local front = false
        if y2 > 0 then
            x3 = half_width*x2/y2
            y3 = half_width*z/y2
            front = true
        end
        x = x3 + half_width
        y = half_height - y3
        return {x = x, y = y, front = front}
    end,
    get_object_by_name = function(name)
        for i = 1, #Vazul.objects do
            local object = Vazul.objects[i]
            if object.name == name then
                return object
            end
        end    
    end,
    draw_world = function()
        for i = 1, #Vazul.room do
            local room = Vazul.room[i]
            local translate={x=room[2],y=room[3],z=room[4]}
            local object = Vazul.get_object_by_name(room[1])
            local points2d = {}
            for i = 1, #object.points do
                local p3d = object.points[i]
                local p2d = Vazul.calculate_2dpoints(p3d,translate)
                table.insert(points2d, p2d)
            end
            for i = 1,#object.edges do
                local e = object.edges[i]
                local point_idx1 = e[1]
                local point_idx2 = e[2]
                local point1 = points2d[point_idx1]
                local point2 = points2d[point_idx2]
                if point1.front and point2.front then 
                    love.graphics.line( 
                        point1.x, 
                        point1.y, 
                        point2.x, 
                        point2.y)
                end
            end
        end
    end,
    draw_debug = function()
        if Vazul.DEBUG then
            local move_x = Vazul.round(Vazul.player.move_x,2)
            local move_y = Vazul.round(Vazul.player.move_y,2)
            local pos_x = Vazul.round(Vazul.player.x,2)
            local pos_y = Vazul.round(Vazul.player.y,2)
            local text = "Vazul 3D engine ©2025"..
            "\nDisplay:"..Vazul.width.."x"..Vazul.height..
            "\nrot_z:"..Vazul.player.rot_z..
            "\nmove:"..move_x..","..move_y..
            "\nposition:"..pos_x..","..pos_y
            love.graphics.print(text,10,10)
        end
    end,
    add_cube = function(name,x,y,z,size)
        --TBD
    end,
    add_sphere = function(name,x,y,z,size)
        --TBD
    end,
    set_player = function(x,y,z)
    end,
    turn_left = function()
        Vazul.player.rot_z = Vazul.player.rot_z - Vazul.ROT_Z_SPEED
        Vazul.player.rot_z = Vazul.infinity(Vazul.player.rot_z, 0 , 360)
        Vazul.calculate_move_xy()
    end,
    turn_right = function()
        Vazul.player.rot_z = Vazul.player.rot_z + Vazul.ROT_Z_SPEED
        Vazul.player.rot_z = Vazul.infinity(Vazul.player.rot_z, 0 , 360)
        Vazul.calculate_move_xy()
    end,
    move_forward = function()
        Vazul.player.x = Vazul.player.x + Vazul.player.move_x
        Vazul.player.y = Vazul.player.y + Vazul.player.move_y
    end,
    move_backward = function()
        Vazul.player.x = Vazul.player.x - Vazul.player.move_x
        Vazul.player.y = Vazul.player.y - Vazul.player.move_y
    end,
    calculate_move_xy = function()
        local radian = Vazul.player.rot_z * math.pi / 180
        Vazul.player.sin = math.sin(radian)
        Vazul.player.cos = math.cos(radian)
        Vazul.player.move_x = Vazul.XY_SPEED * Vazul.player.sin
        Vazul.player.move_y = Vazul.XY_SPEED * Vazul.player.cos
    end,
    infinity = function(n, lowest, highest)
        if n < lowest then
            n = n + (highest - lowest)
        elseif n > highest then
            n = n - (highest - lowest)
        end
        return n
    end,
    round = function(num, decimals)
        local multiplier = 10^decimals
        return math.floor(num * multiplier + 0.5) / multiplier
    end
}