const TITLE = 0;
const GAME = 1;
const GAMEOVER = 2;
const START = 3;
var tw = 60, hw = 40;//tile width 12*5=60px  , hero width 8*5=40px
//egy sorba csak egy x-et lehet tenni!!!
//48x100-as p�lya

var rqstars = [2, 8, 14, 20, 22, 35, 48, 71, 72];
var minstar = 0;
var mw = map[0].length, mh = map.length, ww = 550, wh = 400, wt = 150;
var counter = 0;//counter;
var pressed = 0;//timer for button image
var ox = oy = 0;//scroll offset
var introy = -tw - 50, introx = 360;
var hx, hy, hxv = 0, hyv = 0, ms = 6, star = 0;
var anim = [0, 1, 2, 1, 3, 4, 5, 4];
var d = .25;
var x = -40;
var hero = { x: 0, y: 0, xv: 0, yv: 0 }
var state = TITLE;

function redraw() {
    var offset;
    var f = 0;//korrekci�s faktor
    var a = '';
    //draw tiles
    var y = Math.floor(-oy / tw);
    for (var j = y; j < y + 8; j++) {
        var x = Math.floor(-ox / tw);
        for (var i = x; i < x + 10; i++) {
            var tile = map[j].charAt(i);
            if (tile == 'G')//solid
            {
                var tileabove = map[j - 1].charAt(i);
                var level = Math.floor((mh - j) / (mh / 4));
                if (tileabove != 'G') { offset = 0 + level * 2; } else { offset = level * 2 + 1; }//0-1,2-3,4-5,6-7
            }
            if (tile == '-') offset = 8;//star
            if (tile == 'X') offset = 9;//gate
            if (tile == 'L') offset = 12;//lady
            if (tile != ' ' && tile != 'P') {
                a += '<div style="position:relative;left:' + (ox + i * tw) + 'px;top:' + (oy + j * tw - f) + 'px;width:' + tw + 'px;height:' + tw + 'px;background:url(gfx/tiles.png) -' + (offset * tw) + 'px 0px;" ></div>';
                f += tw;
            }
        }
    }
    //draw me/hero
    var k = 0;
    if (d > 0) k = 4;
    offset = anim[Math.floor(counter / 4) % 4 + k];
    hero.y += ms;//are we in the air?
    if (!isHit()) {
        if (d > 0) { offset = 7; } else { offset = 6; }
    }
    hero.y -= ms;
    if (counter < 200) offset = 3;
    a += '<div style="position:relative;left:' + (ox + hero.x) + 'px;top:' + (oy + hero.y - f) + 'px;width:' + hw + 'px;height:' + hw + 'px;background:url(gfx/hero.png) -' + (offset * hw) + 'px 0px;" ></div>';
    f += hw;
    //intro animation
    if (counter < 120) {
        offset = 10 + Math.floor(counter / 8) % 2;//�rd�g
        a += '<div style="position:relative;left:' + introx + 'px;top:' + (introy - f) + 'px;width:' + tw + 'px;height:' + tw + 'px;background:url(gfx/tiles.png) -' + (offset * tw) + 'px 0px;" ></div>';
        f += tw;
        offset = 12;//csajszi
        a += '<div style="position:relative;left:' + introx + 'px;top:' + (190 - f) + 'px;width:' + tw + 'px;height:' + tw + 'px;background:url(gfx/tiles.png) -' + (offset * tw) + 'px 0px;" ></div>';
        introy += 2;
    }
    if (counter > 120 && counter < 250) {
        offset = 10 + Math.floor(counter / 8) % 2;//�rd�g
        a += '<div style="position:relative;left:' + introx + 'px;top:' + (introy - f) + 'px;width:' + tw + 'px;height:' + tw + 'px;background:url(gfx/tiles.png) -' + (offset * tw) + 'px 0px;" ></div>';
        f += tw;
        offset = 12 + Math.floor(counter / 8) % 2;;//csajszi
        a += '<div style="position:relative;left:' + introx + 'px;top:' + (introy + tw - f) + 'px;width:' + tw + 'px;height:' + tw + 'px;background:url(gfx/tiles.png) -' + (offset * tw) + 'px 0px;" ></div>';
        introy -= 3;
    }
    //update display
    document.getElementById('b').innerHTML = a;
    //update button
    if (pressed == 1) document.getElementById('button').style.backgroundImage = 'url(gfx/button.png)';
}

function counterUpdater() {
    counter++;
    pressed--;
    if (pressed < 0) pressed = 0;
}

function clicked() {
    document.getElementById('button').style.backgroundImage = 'url(gfx/button_pressed.png)';
    pressed = 10;
    hero.y += ms;
    if (isHit()) hero.yv = -15;
    hero.y -= ms;
}

function keyPressed(event) {
    if (event.key == 'z' || event.key == 'y' || event.keyCode == 37) {
        //moveleft();
    }
    if (event.key == 'x' || event.key == 'c' || event.keyCode == 39) {
        //moveright();
    }
    //if (state == START && event.key == ' ') {
    //initGame();
    //}
    //if (state == GAMEOVER && event.key == ' ') {
    //initTitle();
    //}
    if (event.key == ' ') {
        clicked();
    }
}

function moveHero() {
    //gravity
    hero.yv += .7;
    if (hero.yv > ms * 3) hero.yv = ms * 3;//maxim�ljuk
    hero.y += hero.yv;
    if (isHit()) { hero.y -= hero.yv; hero.yv = 0; }//m�g pattog is!!!
    //oldal mozg�s
    hero.xv += d;
    if (hero.xv > ms) hero.xv = ms;//maxim�ljuk
    if (hero.xv < -ms) hero.xv = -ms;
    hero.x += hero.xv;
    if (isHit()) { hero.x -= hero.xv; hero.xv = 0; d = -d; }
}

function starHero() {
    //left-bottom corner
    var j = Math.floor((hero.y + hw / 2) / tw);
    var i = Math.floor((hero.x + hw / 2) / tw);
    if (map[j].charAt(i) == '-') {
        map[j] = map[j].substr(0, i) + ' ' + map[j].substr(i + 1);
        star++;
        gateOpener();
    }
}

function gateOpener() {
    //find first Gate from bottom
    if (star >= rqstars[minstar]) {
        minstar++;
        var i = mh;
        do {
            i--;
            //alert(i);
        } while (i > 0 && map[i].search('X') == -1)
        if (map[i].search('X') != -1) { map[i] = map[i].replace('X', ' '); }
    }
}

function followHero() {
    if (hero.x + hw + ox > ww - wt) ox -= ms;
    if (hero.x + ox < wt) ox += ms;
    if (hero.y + hw + oy > wh - wt) oy -= ms;
    if (hero.y + oy < wt) oy += ms;
    if (ox > 0) ox = 0;
    if (ox < -tw * mw + ww) ox = -tw * mw + ww;
    if (oy > 0) oy = 0;
    if (oy < -tw * mh + wh) oy = -tw * mh + wh;
}

function isHit() {
    var hit = false;
    //p�ly�n bel�l vagyunk?
    if (Math.floor((hero.y + hw - 1) / tw) < 0 || Math.floor((hero.y + hw - 1) / tw) > mh - 1) hit = true;
    if (Math.floor(hero.x / tw) < 0 || Math.floor(hero.x / tw) > mw - 1) hit = true;
    if (Math.floor((hero.x + hw - 1) / tw) < 0 || Math.floor((hero.x + hw - 1) / tw) > mw - 1) hit = true;
    if (hit == false) {
        //bal als� pontja
        var t = map[Math.floor((hero.y + hw - 1) / tw)].charAt(Math.floor(hero.x / tw));
        if (isSolid(t)) hit = true;//not empty
        //jobb als� pontja
        var t = map[Math.floor((hero.y + hw - 1) / tw)].charAt(Math.floor((hero.x + hw - 1) / tw));
        if (isSolid(t)) hit = true;//not empty
    }
    return hit;
}
function isSolid(p) {
    var i = false;
    if (p == 'G' || p == 'X') i = true;
    return i;
}
function setPlayer() {
    var i = 0;
    do {
        i++;
    } while (i < mh && map[i].search('P') == -1)
    //alert(i);
    hero.x = map[i].search('P') * tw;
    hero.y = i * tw + tw - hw;
    ox = -hero.x + ww - 300;
    oy = -hero.y + wh - 100;
}
function winHero() {
    var j = Math.floor((hero.y + hw / 2) / tw);
    var i = Math.floor((hero.x + hw / 2) / tw);
    if (map[j].charAt(i) == 'L') {
        alert('GRATULÁLOK!!! Megmentetted Helénát!!!');
        map[j] = map[j].replace('L', ' ');
    }
}
function gameLoop() {
    counterUpdater();
    if (counter > 200) moveHero();//ide 200 kell
    starHero();
    winHero();
    followHero();
    redraw();
    window.setTimeout("gameLoop();", 20);//friss�t�s 1sec=1000 30frame/sec = 33
}
function init() {
    setPlayer();
    gameLoop();
}
