draw = function()
        love.graphics.setColor(1, 1, 1)
        local y = 0
        for i,v  in pairs(map.data) do
            local x = 0
            for i,v  in pairs(v) do
                local quad_id = string.find(map.quads, v)
                if not (quad_id == nil) then
                    love.graphics.draw(Tileset, Quads[quad_id], grid * x - camera.get().x, grid * y - - camera.get().y, 0, pixel, pixel)
                end
                x = x + 1
            end
            y = y + 1
        end
    end,