/**
https://opengameart.org/
*/
const GAME = 0;
const GAMEOVER = 1;
const START = 2;
const TOUCHED = 0.1;

var shield = 30;
var score = 0;
var n = 5;
var spaceship = { 
    x: 100,
    y: 100,
    xd: 0,
    yd: 0,
    speed:10,
    moveleft: function(){this.xd = -this.speed;},
    moveright: function(){this.xd = this.speed;},
    stop: function(){this.xd = 0;},
    update: function(){this.x += this.xd;}}
var asteroids = [];
var asteroid = {}
var w, h = 0;
var size = 60;
var state = START;

function init() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;

    spaceship.x = Math.floor((w - size) / 2);
    spaceship.y = Math.floor((h - size) * .85);

    for (var i = 0; i < n; i++) {
        asteroids.push(
            {
                x: 0,
                y:0,
                speed: 10,
                movedown: function() {this.y += this.speed;}
            });
    }
    
    initTitle();
    
    f('lefttouch').addEventListener("touchstart", leftTouched, false);
    f('lefttouch').addEventListener("touchend", bothReleased, false);
    f('righttouch').addEventListener("touchstart", rightTouched, false);
    f('righttouch').addEventListener("touchend", bothReleased, false);
}

function keyPressed(event) {
    if (event.key == 'z' || event.key == 'y' || event.keyCode == 37) {
        moveleft();
    }
    if (event.key == 'x' || event.key == 'c' || event.keyCode == 39) {
        moveright();
    }
    if (state == START && event.key == ' ') {
        initGame();
    }
    if (state == GAMEOVER && event.key == ' ') {
        initTitle();
    }
}

function initTitle(){
    state = START;
    show('title');
    hide('gameover');
}

function moveleft() {
    spaceship.moveleft();
}

function moveright() {
    spaceship.moveright();
}

function spaceshipstop() {
    spaceship.stop();
}

function leftTouched(){
    f('lefttouch').style.opacity = TOUCHED;
    if (state == START) {
        initGame();
    }
    if (state == GAMEOVER) {
        initTitle();
    }
    moveleft();
}

function rightTouched(){
    f('righttouch').style.opacity = TOUCHED;
    if (state == START) {
        initGame();
    }
    if (state == GAMEOVER) {
        initTitle();
    }
    moveright();
}

function bothReleased(){
    f('lefttouch').style.opacity = 0;
    f('righttouch').style.opacity = 0;
    spaceshipstop();
}

function initGame() {
    state = GAME;
    for (var i = 0; i < n; i++) {
        asteroids[i].x = rand(w);
        asteroids[i].y = Math.floor(i / 5 * h) - h - size;
    }
    hide('title');
    score = 0;
    shield = 30;
}
function keyReleased(event) {
    spaceshipstop();
}
function update() {
    f('ship').style.left = spaceship.x + 'px';
    f('ship').style.top = spaceship.y + 'px';
    if (state == GAME) {
        spaceship.update();
        if (spaceship.x < 0) {
            spaceship.x = 0;
        }
        if (spaceship.x + size > w) {
            spaceship.x = w - size;
        }
    }
    var s = 'shield:<font color=red face=arial>';
    for (var i = 0; i < shield; i++) {
        s += 'i';
    }
    s += '</font>';
    f('shield').innerHTML = s;

    for (var i = 0; i < n; i++) {
        //move asteroids
        f('asteroid' + i).style.left = asteroids[i].x + 'px';
        f('asteroid' + i).style.top = asteroids[i].y + 'px';
        asteroids[i].movedown();
        if (asteroids[i].y > h) {
            asteroids[i].y = 0 - size;
            asteroids[i].x = rand(w);
            if (state == GAME) {
                score += 10;
                f('score').innerHTML = score;
            }
        }
        //check collition
        if (state == GAME) {
            if (isOverlapped(asteroids[i], spaceship)) {
                shield--;
                if (shield <= 0) {
                    state = GAMEOVER;
                    show('gameover');
                    score = 0;
                }
            }
        }
    }
}
function isOverlapped(obj1, obj2) {
    //console.log(obj1.x - obj2.x);
    return (Math.abs(obj1.x - obj2.x) < size) && (Math.abs(obj1.y - obj2.y) < size);
}
function rand(n) {
    return Math.floor(Math.random() * n);
}
function show(n) {
    f(n).style.display = 'block';
}
function hide(n) {
    f(n).style.display = 'none';
}
function f(i) {
    return document.getElementById(i);
}
setInterval('update()', 20);