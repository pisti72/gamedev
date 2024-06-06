const BOMBER_SPEED = 4;
const BOMB_SPEED = 6;
const NOWHERE = -1000;
const COLORS = ["#E88", "#8E8", "#88E", "#EE8", "#8EE", "#E8E"];
const MAX_BUILD_HEIGHT = 12;

let paused = false;

let blocks = [];

let columns = 0;
let bomber_svg = document.getElementById("bomber");
let bomb_svg = document.getElementById("bomb");
let block_svg = document.getElementById("block");

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    columns = Math.floor(w / block_svg.width);
    bomber = {
        x: -bomber_svg.width * 4,
        y: 10,
        score: 0,
        hiscore: 0,
        img: bomber_svg,
        width: bomber_svg.width,
        height: bomber_svg.height,
        addScore: function (n) {
            this.score += n;
            if (this.score > this.hiscore) {
                this.hiscore = this.score;
            }
        },
        update: function () {
            this.x += BOMBER_SPEED;
            if (this.x > w) {
                this.x = -this.width;
                this.y += this.height;
                if (this.y + this.height > h) {
                    resetGame();
                }
            }
            this.img.style.left = this.x + "px";
            this.img.style.top = this.y + "px";
        },
        reset: function () {
            this.x = -bomber_svg.width * 4;
            this.y = 10;
            this.score = 0;
        }
    }

    bomb = {
        x: NOWHERE,
        y: 0,
        falling: false,
        img: bomb_svg,
        width: bomb_svg.width,
        height: bomb_svg.height,
        drop: function (obj) {
            if (!this.falling) {
                this.x = obj.x + (obj.width - this.width) / 2;
                this.y = obj.y + obj.height / 2;
                this.falling = true;
            }
        },
        update: function () {
            if (this.falling) {
                this.y += BOMB_SPEED;
                if (this.y > h) {
                    this.falling = false;
                }
            } else {
                this.x = bomber.x + (bomber.width - this.width) / 2;
                this.y = bomber.y + bomber.height / 2;
            }
            this.img.style.left = this.x + "px";
            this.img.style.top = this.y + "px";
        },
        reset: function () {
            this.falling = false;
        }
    }

    createBlocks(MAX_BUILD_HEIGHT * columns);
    buildCity();
    update();
}

document.addEventListener('keydown', function (event) {
    bomb.drop(bomber);
    if (event.code == "KeyP") {
        paused = !paused;
    }
});

document.addEventListener('mousedown', function (event) {
    bomb.drop(bomber);
});

function createBlocks(n) {
    for (let i = 0; i < n; i++) {
        let tmp_svg = block_svg.cloneNode();
        console.log(tmp_svg.height);
        let block = {
            x: NOWHERE,
            y: 0,
            img: tmp_svg,
            width: block_svg.width,
            height: block_svg.height,
            update: function () {
                if (bomb.falling && overlapped(this, bomb)) {
                    bomber.addScore(1);
                    this.x = NOWHERE;
                }
                if (overlapped(this, bomber)) {
                    resetGame();
                }
                this.img.style.left = this.x + "px";
                this.img.style.top = this.y + "px";
            }
        }
        block.update();
        blocks.push(block);
        document.body.appendChild(tmp_svg);
    }
    block_svg.style.backgroundColor = "red";
    block_svg.remove();
}

function resetGame() {
    bomber.reset();
    bomb.reset();
    buildCity();
}

function buildCity() {
    let n = 0;
    for (let i = 0; i < columns; i++) {
        let height = rnd(6) + MAX_BUILD_HEIGHT - 6;
        for (let j = 0; j < height; j++) {
            let block = blocks[n++];
            block.x = i * block.img.width;
            block.y = h - j * block.img.height;
            block.img.style.backgroundColor = COLORS[i % COLORS.length];
        }
    }
}

function updateBlocks() {
    let n = 0
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].update();
        if (blocks[i].x != NOWHERE) {
            n++;
        }
    }
    if (n == 1) {
        buildCity();
        bomber.x = -bomber_svg.width * 4;
        bomber.y = 10;
        bomb.reset();
    }
}

function update() {
    if (!paused) {
        bomber.update();
        bomb.update();
        updateBlocks();
    }
    document.getElementById("score").innerHTML = bomber.score;
    document.getElementById("hiscore").innerHTML = "HI: " + bomber.hiscore;

    window.requestAnimationFrame(update);
}

function overlapped(a, b) {
    return (Math.abs((a.x + a.width / 2) - (b.x + b.width / 2)) < (a.width + b.width) / 2)
        && (Math.abs((a.y + a.height / 2) - (b.y + b.height / 2)) < (a.height + b.height) / 2);
}

function rnd(n) {
    return Math.floor(Math.random() * n);
}
