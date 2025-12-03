const SPEED = 2;
const NOWHERE = -1000;
const TILE = 100;
const MAX_RAILS = 100;

let rails = [];

let loco_right_svg = document.getElementById("loco_right");
let rail_EW_svg = document.getElementById("rail_EW");
let rail_NS_svg = document.getElementById("rail_NS");

function onload() {
    
    w = document.body.clientWidth;
    h = document.body.clientHeight;

    player = {
        x: w / 2,
        y: h / 2,
        xd: SPEED,
        yd: 0,
        dots: 0,
        score: 0,
        hiscore: 0,
        imgs: [loco_right_svg,],
        width: 100,
        height: 100,
        addScore: function (n) {
            this.score += n;
            if (this.score > this.hiscore) {
                this.hiscore = this.score;
            }
        },
        move: function () {
            this.x += this.xd;
            this.y += this.yd;
        },
        reset: function () {
            this.x = w / 2;
            this.y = h / 2;
            this.xd = SPEED;
            this.yd = 0;
            this.score = 0;
        },
        update: function () {
            this.imgs[0].style.left = this.x + "px";
            this.imgs[0].style.top = this.y + "px";
        }
    }

    createRails();
    update();
}

function createRails() {
    for (let i = 0; i < MAX_RAILS; i++) {
        let rail = {
            x: NOWHERE,
            y: 0,
            index: 0
        }

        let temp_svg = rail_EW_svg.cloneNode();
        document.body.appendChild(temp_svg);

        temp_svg.style.zIndex = MAX_RAILS - i;

        rail.img = temp_svg;
        rail.img.style.left = rail.x + "px";
        rail.img.style.top = rail.y + "px";
        rails.push(rail);
    }
    rail_EW_svg.remove();
}

function resetGame() {
    player.reset();
    for (let i = 0; i < rails.length; i++) {
        let rail = rails[i];
        rail.img.style.left = NOWHERE + "px";
    }
}

function update() {
    player.move();
    player.update();
    window.requestAnimationFrame(update);
}


function overlapped(obj) {
    return (Math.abs(player.x - obj.x) < player.width * OVERLAP_FACTOR) &&
        (Math.abs(player.y - obj.y) < player.height * OVERLAP_FACTOR);
}

function rnd(n) {
    return Math.floor(Math.random() * n);
}





















