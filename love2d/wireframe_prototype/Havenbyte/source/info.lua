local gfx <const> = playdate.graphics

local VERSION = playdate.metadata.version
local BUILD_NUMBER = playdate.metadata.buildNumber
local WHITE = playdate.graphics.kColorWhite
local BLACK = playdate.graphics.kColorBlack
local y = 0
local yd = 2

Info = {}

Info.draw = function()
    Info.cls()
    Info.line()
    
    Info.draw_horizon(horizon)
    Info.render()
    Info.print()
end

Info.render = function()
    playdate.graphics.setColor(BLACK)
    playdate.graphics.setLineWidth(3)
    local lines = Vazul.get_render()
    for i=1, #lines do
        local line = lines[i]
        playdate.graphics.drawLine(line.x1, line.y1, line.x2, line.y2)
    end
end

Info.draw_horizon = function()
    local horizon = Vazul.get_horizon()
    playdate.graphics.setColor(BLACK)
    playdate.graphics.setLineWidth(3)
    playdate.graphics.drawLine(horizon.x1, horizon.y1, horizon.x2, horizon.y2)
end

Info.cls = function()
    playdate.graphics.setColor(WHITE)
    playdate.graphics.fillRect(0, 0, 400, 240)
end

Info.line = function()
    playdate.graphics.setColor(BLACK)
    playdate.graphics.setLineWidth(4)
    playdate.graphics.drawLine(0, y, 400, 240+y)
    y=y+yd
    if y>240 then
        yd = -2
    end
    if y<-240 then
        yd = 2
    end
end

Info.print = function()
    playdate.graphics.setFontFamily("bold")
    playdate.graphics.setColor(BLACK)
    playdate.graphics.drawText(Vazul.hello("Istvan"), 20, 20)
end
