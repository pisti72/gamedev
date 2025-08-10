import "CoreLibs/object"
import "CoreLibs/graphics"
import "CoreLibs/sprites"
import "CoreLibs/timer"
import "info"
import "vazul"
import "state"

Vazul.init()

function playdate.update()
    Info.draw()
    Vazul.update()
end

-- Button (A)

function playdate.AButtonDown()
    Vazul.btn_A_pressed()
end

function playdate.AButtonUp()
    Vazul.btn_A_released()
end

-- Button (B)

function playdate.BButtonDown()
    Vazul.btn_B_pressed()
end

function playdate.BButtonUp()
    Vazul.btn_B_released()
end

-- Button (up)

function playdate.upButtonDown()
    Vazul.btn_UP_pressed()
end

function playdate.upButtonUp()
    Vazul.btn_UP_released()
end

-- Button (down)

function playdate.downButtonDown()
    Vazul.btn_DOWN_pressed()
end

function playdate.upButtonUp()
    Vazul.btn_DOWN_released()
end

-- Button (left)

function playdate.leftButtonDown()
    Vazul.btn_LEFT_pressed()
end

function playdate.leftButtonUp()
    Vazul.btn_LEFT_released()
end

-- Button (right)

function playdate.rightButtonDown()
    Vazul.btn_RIGHT_pressed()
end

function playdate.rightButtonUp()
    Vazul.btn_RIGHT_released()
end
