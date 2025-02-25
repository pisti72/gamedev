WIDTH = innerWidth
HEIGHT = innerHeight
FOV = WIDTH / 2
canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.width = WIDTH
canvas.height = HEIGHT
ctx = canvas.getContext("2d")
sections = []
mycar = {
    x: 0, y: 100, z: 0, speed: 10

}

for (i = 0; i < 500; i++) {
    add_section(0, 0, 500*40-i * 40, 500, 60, 0)
    if(i%10>5){
        add_section(0, 0, 500*40-i * 40, 50, 60, 255)
    }
}




update()
function update() {
    ctx.fillStyle = "#eee"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    for (i = 0; i < sections.length; i++) {
        let section = sections[i]
        diff = section.z - mycar.z
        if (diff > 0) {
            c = clamp(0, 230, diff / 10)
            ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")"
            f = FOV / diff
            x = (section.x - section.width / 2 - mycar.x) * f + WIDTH / 2
            y = HEIGHT / 2 - (section.y - section.height / 2 - mycar.y) * f
            ctx.fillRect(x, y, section.width * f, section.height * f)
        }
    }


    mycar.z += mycar.speed
    requestAnimationFrame(update)
}

function add_section(x, y, z, width, height, color) {
    let section = {
        x: x, y: y, z: z, width: width, height: height, color: color
    }
    sections.push(section)
}

function clamp(from, to, number) {
    if (number < from) {
        number = from
    } else if (number > to) {
        number = to
    }
    return number
}
