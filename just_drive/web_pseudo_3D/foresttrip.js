WIDTH = 800
HEIGHT = 480
canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.width = WIDTH
canvas.height = HEIGHT
ctx = canvas.getContext("2d")

mycar = {
    x: 0, y: 0

}
update()
function update() {
    ctx.fillStyle = "blue"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = "red"
    ctx.fillRect(mycar.x, 10, 20, 20)
    mycar.x++
    requestAnimationFrame(update)
}
