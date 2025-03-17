WIDTH = innerWidth
HEIGHT = innerHeight
canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.width = WIDTH
canvas.height = HEIGHT
ctx = canvas.getContext("2d")
PIXEL = Math.floor(WIDTH / 64)
SPRING = .2
mouse = {
    x: 0,
    y: 0
}
ball = {
    x: PIXEL * 32,
    y: PIXEL * 12,
    width: PIXEL,
    height: PIXEL
}
pad = {
    x: PIXEL * 3,
    y: PIXEL * 5,
    x_force: 0,
    x_v: 0,
    width: PIXEL,
    height: PIXEL * 5,
    color: "grey"
}
init()
n = 0

update()

function init() {
    document.addEventListener("mousemove", function (e) {
        mouse.x = e.pageX
        mouse.y = e.pageY
    })
}

function update() {
    cls("lightgrey")

    update_pad()
    update_ball()
    physic()
    n++
    debug("N is " + mouse.x)
    requestAnimationFrame(update)
}

function physic() {
    
}

function cls(color) {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function update_ball() {
    ctx.fillStyle = ball.color
    ctx.fillRect(ball.x - ball.width / 2, ball.y - ball.height / 2, ball.width, ball.height)
}

function update_pad() {
    ctx.fillStyle = pad.color
    pad.x_v = (mouse.x - pad.x) * SPRING
    pad.y_v = (mouse.y - pad.y) * SPRING

    pad.x += pad.x_v
    pad.y += pad.y_v
    ctx.fillRect(pad.x - pad.width / 2, pad.y - pad.height / 2, pad.width, pad.height)
}

function debug(n) {
    ctx.fillStyle = "grey"
    ctx.font = "50px Arial";
    ctx.fillText(n, 10, 60);
}
