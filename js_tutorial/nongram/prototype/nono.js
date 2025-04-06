canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.width = 600
canvas.height = 600
ctx = canvas.getContext("2d")
pictures = new Image()
pictures.src = "pictures.png"
console.log(pictures.width)
pictures.addEventListener("load", function () {

})

GRID = 20
GAP = 2

console.log("draw finished")

function init() {
    ctx.drawImage(pictures, 0, 0)
    data = ctx.getImageData(2, 2, 10, 10)
    pixels = data.data
    console.log(pixels.length / 12 / 4)
    k = 0
    for (j = 0; j < 10; j++) {
        for (i = 0; i < 10; i++) {
            let p = pixels[k]
            color = "yellow"
            if (p == 0) {
                color = "black"
            }
            k += 4
            ctx.fillStyle = color
            ctx.fillRect(10 + i * (GRID + GAP), 10 + j * (GRID + GAP), GRID, GRID)
        }
    }
    console.log("loaded")
}