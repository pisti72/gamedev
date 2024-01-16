/**
 * 
 * 
 * 
 */
const GRAVITY = 0.1
const SPACEMAN_X = 500
const SPACEMAN_Y = 10

const PLANETS = [{ x: 600, y: 400, d: 200, rot: -0.5 },
{ x: 300, y: 300, d: 150, rot: 1 }]

left_pressed = false
right_pressed = false
down_pressed = false
up_pressed = false
Q_pressed = false
E_pressed = false

planets = []
bullets = []

spaceman = {
    div: null,
    x: 0,
    y: 0,
    diameter: 20,
    rot: 0,
    up_x: 0,
    up_y: -1,
    right_x: 1,
    right_y: 0,
    velocity_rot: 1,
    velocity_x: 1,
    velocity_y: 0,
    inic: function (x, y, d) {
        this.x = x
        this.y = y
        this.diameter = d
        let div = document.createElement("div")
        div.style.backgroundImage = "url(assets/spaceman.png)"
        div.style.backgroundSize = this.diameter + "px"
        div.style.width = this.diameter + "px"
        div.style.height = this.diameter * 1.9 + "px"
        div.style.position = "absolute"
        //div.style.zIndex = -100
        this.div = div
        f("container").appendChild(div)
    },
    update: function () {
        this.x += this.velocity_x
        this.y += this.velocity_y
        //this.rot += this.velocity_rot
        this.div.style.transform = "rotate(" + this.rot + "rad)"
        let x = this.x - this.diameter / 2
        let y = this.y - this.diameter / 2
        this.div.style.left = x + "px"
        this.div.style.top = y + "px"
    },
    getDistanceTo(obj) {
        let xd = obj.x - this.x
        let yd = obj.y - this.y
        return Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2))
    },
    calculateAcceleration: function (obj) {
        let xd = obj.x - this.x
        let yd = obj.y - this.y
        let FORCE_X = .1
        let normal = this.getDistanceTo(obj)
        xd = xd * GRAVITY / normal
        yd = yd * GRAVITY / normal
        //this.rot = Math.atan(yd / xd)
        //xd = 0
        //yd = 0
        if(left_pressed){
            xd += -Math.cos(this.rot) * FORCE_X
            yd += -Math.sin(this.rot) * FORCE_X
        }
        if(right_pressed){
            xd += Math.cos(this.rot) * FORCE_X
            yd += Math.sin(this.rot) * FORCE_X
        }
        if(up_pressed){
            xd += Math.sin(this.rot) * FORCE_X
            yd += -Math.cos(this.rot) * FORCE_X
        }
        if(down_pressed){
            xd += -Math.sin(this.rot) * FORCE_X
            yd += Math.cos(this.rot) * FORCE_X
        }
        if(Q_pressed){
            this.rot -= .05
        }
        if(E_pressed){
            this.rot += .05
        }
        
        this.velocity_x += xd
        this.velocity_y += yd
    },
    calculateCollitions: function (objArray) {
        for (let i = 0; i < objArray.length; i++) {
            let obj = objArray[i]
            if (this.getDistanceTo(obj) - (obj.diameter + this.diameter) / 2 < 0) {
                let xd = obj.x - this.x
                let yd = obj.y - this.y
                this.velocity_x -= xd / 80
                this.velocity_y -= yd / 80
            }
        }
    },
    moveLeft: function () {
        
        this.velocity_x += xd
        this.velocity_y += yd
    },
    moveRight: function () {
        
        this.velocity_x += xd
        this.velocity_y += yd
    },
    moveNone: function () {

    },
    jump: function () {

    },
    fire: function (objArray) {

    }
}

planet = {
    div: null,
    x: 0,
    y: 0,
    diameter: 10,
    rot: 0,
    velocity_rot: 1,
    setPosition: function (x, y) {
        this.x = x
        this.y = y
    },
    setDiameter(d) {
        this.diameter = d
    },
    inic: function (x, y, d) {
        this.x = x
        this.y = y
        this.diameter = d
        let div = document.createElement("div")
        div.style.backgroundImage = "url(assets/planet_cyan.png)"
        div.style.backgroundSize = this.diameter + "px"
        div.style.width = this.diameter + "px"
        div.style.height = this.diameter + "px"
        div.style.position = "absolute"
        this.div = div
        f("container").appendChild(div)
    },
    update: function () {
        this.rot += this.velocity_rot
        this.div.style.transform = "rotate(" + this.rot + "deg)"
        let x = this.x - this.diameter / 2
        let y = this.y - this.diameter / 2
        this.div.style.left = x + "px"
        this.div.style.top = y + "px"
    }
}

f("container").style.zIndex = 9999


createPlanets()
spaceman.inic(SPACEMAN_X, SPACEMAN_Y, 50)

document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowLeft") {
        left_pressed = true
    }
    if (e.code == "ArrowRight") {
        right_pressed = true
    }
    if (e.code == "ArrowUp") {
        up_pressed = true
    }
    if (e.code == "ArrowDown") {
        down_pressed = true
    }
    if (e.code == "KeyQ") {
        Q_pressed = true
    }
    if (e.code == "KeyE") {
        E_pressed = true
    }
})

document.addEventListener("keyup", function (e) {
    if (e.code == "ArrowLeft") {
        left_pressed = false
    }
    if (e.code == "ArrowRight") {
        right_pressed = false
    }
    if (e.code == "ArrowUp") {
        up_pressed = false
    }
    if (e.code == "ArrowDown") {
        down_pressed = false
    }
    if (e.code == "KeyQ") {
        Q_pressed = false
    }
    if (e.code == "KeyE") {
        E_pressed = false
    }
})

update()

function createPlanets() {
    for (let i = 0; i < PLANETS.length; i++) {
        let item = PLANETS[i]
        let p = { ...planet } //clone or copy object
        p.inic(item.x, item.y, item.d)
        p.velocity_rot = item.rot
        planets.push(p)
    }
}

function manageSpaceman() {
    //select the nearest planet
    let currentPlanet = planets[0]
    let lowestDistance = spaceman.getDistanceTo(currentPlanet) //TODO

    for (let i = 1; i < planets.length; i++) {
        let currentDistance = spaceman.getDistanceTo(planets[i])
        if (currentDistance < lowestDistance) {
            currentPlanet = planets[i]
            lowestDistance = currentDistance
        }
    }

    spaceman.calculateAcceleration(currentPlanet)
    spaceman.calculateCollitions(planets)
}

function update() {
    manageSpaceman()
    for (let i = 0; i < planets.length; i++) {
        planets[i].update()
    }
    spaceman.update()
    requestAnimationFrame(update)
}

function f(n) {
    return document.getElementById(n)
}