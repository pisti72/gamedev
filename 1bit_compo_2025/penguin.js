var canvas = document.getElementById("penguin")
var display = {
    width: 800,
    height: 600
}
canvas.width = display.width
canvas.height = display.height
var ctx = canvas.getContext("2d")
var penguin = {
    x: 0,
    y: 0
}

update()
function update() {
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.beginPath();
    ctx.arc(penguin.x, 50, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    penguin.x++
    requestAnimationFrame(update)
}