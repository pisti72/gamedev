WIDTH = innerWidth
HEIGHT = innerHeight
FOV = WIDTH / 2
FOG_BEGINS = 500
FOG_ENDS = 4000
WHEEL_SENSITIVITY = .02
ENGINE_POWER = .3
canvas = document.createElement("canvas")
document.body.appendChild(canvas)
canvas.width = WIDTH
canvas.height = HEIGHT
ctx = canvas.getContext("2d")
is_left_pressed = false
is_right_pressed = false
is_up_pressed = false
is_down_pressed = false
sections = []
mycar = {
    x: 0, y: 100, z: 0, speed: 0, xd: 0
}
h = 20
for (i = 0; i < 500; i++) {
    add_section(0, 0, 500 * 40 - i * 40, 500, h, 80 + (10-i)%10)
    if (i % 30 > 15) {
        add_section(0, 2, 500 * 40 - i * 40, 20, h, 240)
    }
    add_section(-200, 2, 500 * 40 - i * 40, 30, h, 220)
    add_section(200, 2, 500 * 40 - i * 40, 30, h, 220)
}

document.addEventListener('keydown', function (e) {
    //console.log(e.key);
    if (e.key == 'd' || e.key == 'ArrowRight') {
        is_right_pressed = true
    }
    if (e.key == 'a' || e.key == 'ArrowLeft') {
        is_left_pressed = true
    }
    if (e.key == ' ' || e.key == 'w' || e.key == 'ArrowUp') {
        is_up_pressed = true
    }
    if (e.key == 's' || e.key == 'ArrowDown') {
        is_down_pressed = true
    }
})

document.addEventListener('keyup', function (e) {
    //console.log(e.key);
    if (e.key == 'd' || e.key == 'ArrowRight') {
        is_right_pressed = false
    }
    if (e.key == 'a' || e.key == 'ArrowLeft') {
        is_left_pressed = false
    }
    if (e.key == ' ' || e.key == 'w' || e.key == 'ArrowUp') {
        is_up_pressed = false
    }
    if (e.key == 's' || e.key == 'ArrowDown') {
        is_down_pressed = false
    }
})

update()
function update() {
    if(is_right_pressed){
        mycar.xd+=WHEEL_SENSITIVITY
    }
    if(is_left_pressed){
        mycar.xd-=WHEEL_SENSITIVITY
    }
    if(is_up_pressed){
        mycar.speed+=ENGINE_POWER
    }
    if(is_down_pressed){
        mycar.speed *= .98
    }
    mycar.x += mycar.xd * mycar.speed
    mycar.z += mycar.speed
    mycar.xd *= .95
    mycar.speed *= .99
    ctx.fillStyle = "#eee"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    for (i = 0; i < sections.length; i++) {
        let section = sections[i]
        diff = section.z - mycar.z
        if (diff > 0 && diff < FOG_ENDS) {
            color_with_fog = section.color
            c = clamp(0, 255, color_with_fog)
            ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")"
            f = FOV / diff
            x = (section.x - section.width / 2 - mycar.x) * f + WIDTH / 2
            y = HEIGHT / 2 - (section.y - section.height / 2 - mycar.y) * f
            ctx.fillRect(x, y, section.width * f, section.height * f)
        }
    }


    
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
