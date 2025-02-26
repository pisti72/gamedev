WIDTH = innerWidth
HEIGHT = innerHeight
FOV = WIDTH / 2
HEIGHT_HALF = HEIGHT / 2
FOG_BEGINS = 1000
FOG_ENDS = 2000
FAREST = 10000
BACKGROUND_COLOR = "black"
SEGMENT_DISTANCE = 30
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
slices = []
mycar = {
    x: 0, y: 100, z: 0, speed: 0, xd: 0
}
h = SEGMENT_DISTANCE
let far = FAREST / SEGMENT_DISTANCE
for (i = 0; i < far; i++) {
    //left field
    for (j = 0; j < 60; j++) {
        let crop = rnd(0, 20) + 50 + 50
        add_section(-250 - rnd(0, 1400) - 1400, crop, FAREST - i * SEGMENT_DISTANCE, 4, crop, 150 + rnd(0, 70))
        add_section(+250 + rnd(0, 1400) + 1400, crop, FAREST - i * SEGMENT_DISTANCE, 4, crop, 150 + rnd(0, 70))
    }
    for (j = 0; j < 14; j++) {
        add_section(-250 - 1350 + j * 100, 2, FAREST - i * SEGMENT_DISTANCE, 100, h, 80 + rnd(0, 70))
        add_section(+250 + 1350 - j * 100, 2, FAREST - i * SEGMENT_DISTANCE, 100, h, 80 + rnd(0, 70))
    }
    add_section(0, 0, FAREST - i * SEGMENT_DISTANCE, 500, h, 80 + (10 - i) % 10)
    if (i % 30 > 15) {
        add_section(0, 2, FAREST - i * SEGMENT_DISTANCE, 20, h, 240)
    }
    //side lanes
    add_section(-200, 2, FAREST - i * SEGMENT_DISTANCE, 30, h, 220)
    add_section(200, 2, FAREST - i * SEGMENT_DISTANCE, 30, h, 220)

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
    if (is_right_pressed) {
        mycar.xd += WHEEL_SENSITIVITY
    }
    if (is_left_pressed) {
        mycar.xd -= WHEEL_SENSITIVITY
    }
    if (is_up_pressed) {
        mycar.speed += ENGINE_POWER
    }
    if (is_down_pressed) {
        mycar.speed *= .96
    }
    mycar.x += mycar.xd * mycar.speed
    mycar.z += mycar.speed
    mycar.xd *= .95
    mycar.speed *= .99
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    for (i = 0; i < sections.length; i++) {
        let section = sections[i]
        diff = section.z - mycar.z
        if (diff > 0 && diff < FOG_ENDS) {
            let delta = FOG_BEGINS - FOG_ENDS
            let color_with_fog = (clamp(FOG_BEGINS, FOG_ENDS, diff) - FOG_BEGINS) / delta + 1
            color_with_fog = section.color * color_with_fog
            c = clamp(0, 255, color_with_fog)
            ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")"
            f = FOV / diff
            x = (section.x - section.width / 2 - mycar.x) * f + FOV
            y = HEIGHT_HALF - (section.y - section.height / 2 - mycar.y) * f
            ctx.fillRect(x, y, section.width * f, section.height * f)
        }
    }
    requestAnimationFrame(update)
}

function add_slice(x, y, z) {
    let slice = { x: x, y: y, z: z }
    slices.push(slice)
}

function add_rectangle(x, y, width, height, color) {
    let slice = slices[slices.length]
    let rectangle = { x: x, y: y, width: width, height: height, color: color }
    slice.push(rectangle)
}

function add_section(x, y, z, width, height, color) {
    let section = {
        x: x, y: y, z: z, width: width, height: height, color: color
    }
    sections.push(section)
}

function rnd(from, to) {
    return Math.floor(Math.random() * (from - to)) + from
}

function clamp(from, to, number) {
    if (number < from) {
        number = from
    } else if (number > to) {
        number = to
    }
    return number
}
