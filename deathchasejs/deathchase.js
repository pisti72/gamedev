/**
 * 
 * Prototype of Deathchase
 * 
 */
const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const FORWARD = 3;
const BACKWARD = 4;
var w = h = 0;
var counter = 0;
var ts = [];
var p = {};
var t = {};
var canvas = document.getElementById('c');
console.log(canvas);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
init();
setInterval('update()', 50);
function init() {
    t.x = 100;
    t.y = 100;
    p.x = 0;
    p.y = 0;
    p.rad = 0;
    p.s = 10;
    p.xd = NONE;
    p.yd = NONE;
}

function update() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0f0';
    player_update();
    var proj = calc();
    ctx.fillRect(proj.x, proj.y, 10, 10);
}

function player_update() {
    if (p.xd == LEFT) {
        p.x -= p.s;
    } else if (p.xd == RIGHT) {
        p.x += p.s;
    }
    if (p.yd == FORWARD) {
        p.y -= p.s;
    } else if (p.yd == BACKWARD) {
        p.y += p.s;
    }
}

function calc() {
    var x2 = {};
    x2 = { x: t.x - p.x, y: t.y - p.y };
    return x2
}

function keyDown(event) {
    if (event.key == 'w') {
        p.yd = FORWARD;
    } else if (event.key == 's') {
        p.yd = BACKWARD;
    } else if (event.key == 'a') {
        p.xd = LEFT;
    } else if (event.key == 'd') {
        p.xd = RIGHT;
    }
}
function keyUp(event) {
    if (event.key == 'w') {
        p.yd = NONE;
    } else if (event.key == 's') {
        p.yd = NONE;
    } else if (event.key == 'a') {
        p.xd = NONE;
    } else if (event.key == 'd') {
        p.xd = NONE;
    }
}

