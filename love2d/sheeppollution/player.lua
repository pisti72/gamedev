Player = Object:extend()

function Player:new()
	self.image = love.graphics.newImage("panda.png")
	self.x = 300
    self.y = 20
	self.direction = 0
    self.speed = 500
	self.width = self.image:getWidth()
end

function Player:keyPressed(key)
    --If the spacebar is pressed
    if key == "space" then
        --Put a new instance of Bullet inside listOfBullets.
        table.insert(listOfBullets, Bullet(self.x + self.width/2, self.y))
    end
	
	if key == "left" then
        self.direction = -1 
    elseif key == "right" then
        self.direction = 1
    end
		
end

function Player:keyReleased(key)
	if key == "left" or key == "right" then
		self.direction = 0
	end
end

function Player:update(dt)
    --Get the width of the window
    local window_width = love.graphics.getWidth()
	
	if self.direction == -1 then
		self.x = self.x - self.speed * dt
	elseif self.direction == 1 then
		self.x = self.x + self.speed * dt	
	end

    --If the left side is too far too the left then..
    if self.x < 0 then
        --Set x to 0
        self.x = 0

    --Else, if the right side is too far to the right then..
    elseif self.x + self.width > window_width then
        --Set the right side to the window's width.
        self.x = window_width - self.width
    end
end

function Player:draw()
    love.graphics.draw(self.image, self.x, self.y)
end