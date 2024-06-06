const NOWHERE = -1000;
let fov = 400;

let objects = [];

let tree_img = document.getElementById("tree");

document.addEventListener('keydown', function (event) {
    if (event.code == "KeyW") {
        player.speedUp()
    } else if (event.code == "KeyS") {
        player.speedDown()
    }

    if (event.code == "KeyA") {
        player.turnLeft()
    } else if (event.code == "KeyD") {
        player.turnRight()
    }
});

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;

    fov = w / 2;

    camera = {
        x: 0,
        y: 0,
        z: -500,
        move: function (x, y, z) {
            this.x += x;
            this.y += y;
            this.z += z;
        }
    }

    player = {
        x: 0,
        y: -180,
        z: 500,
        speed: 0,
        score: 0,
        turn: 0,
        hiscore: 0,
        addScore: function (n) {
            this.score += n;
            if (this.score > this.hiscore) {
                this.hiscore = this.score;
            }
        },
        speedUp: function () {
            this.speed += 1
        },
        speedDown: function () {
            this.speed -= 2
            if (this.speed < 0) {
                this.speed = 0
            }
        },
        turnLeft: function () {
            this.turn += 1
        },
        turnRight: function () {
            this.turn -= 1
        },
        move: function (x, y, z) {
            this.x += x;
            this.y += y;
            this.z += z;
        }
    }

    createFloors();
    update();
}

function get2D(obj) {
    let x = fov * (obj.x - camera.x) / (obj.z - camera.z) + w / 2;
    let y = h / 2 - fov * (obj.y - camera.y) / (obj.z - camera.z);
    let width = fov * obj.width / (obj.z - camera.z);
    return { x: x, y: y, width: width };
}

function createFloors() {
    for (let i = 0; i < 300; i++) {
        if (i % 30 == 0) {
            addObject("tree", tree_img, -1000, 400, i * 70 + 500);
            addObject("tree", tree_img, 600, 400, i * 70 + 500);
        }
    }
    tree_img.remove();
}

function addObject(name, img, x, y, z) {
    let new_img = img.cloneNode();
    document.body.appendChild(new_img);
    let object = {
        name: name,
        x: x,
        y: y,
        z: z,
        img: new_img,
        width: new_img.width,
        update: function () {
            let tmp = get2D(this);
            this.img.style.left = tmp.x + "px";
            this.img.style.top = tmp.y + "px";
            this.img.style.width = tmp.width + "px";
            this.img.style.zIndex = 20000 - this.z;
        },
        move: function (x, y, z) {
            this.x += x
            this.y += y
            this.z += z
        }
    }
    objects.push(object);
}

function objectsUpdate() {
    for (let i = 0; i < objects.length; i++) {
        objects[i].update();
    }
}

function turn() {
    if (player.turn != 0) {
        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];
            let f = player.turn * (obj.z - camera.z) / fov - camera.x;
            obj.move(f, 0, 0)
        }
    }
}

function update() {
    objectsUpdate();
    turn()
    camera.move(0, 0, player.speed);
    window.requestAnimationFrame(update);
}

