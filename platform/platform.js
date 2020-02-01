console.log('Started');
document.onmousemove = onMouseMove;
//document.onmousedown = onMousePressed;
//document.onmouseup = onMouseReleased;
document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;
document.body.onload = function (e) {
    init();
    gameloop();
}
var img_pointer = new Image();
var img_tiles = new Image();
var mouse = { x: 0, y: 0 }
var ctx = f('display').getContext('2d');
var w = f('display').width = document.body.clientWidth;
var h = f('display').height = document.body.clientHeight;
var textbox = false;
console.log('Display: ' + w + ' x ' + h);

function init() {
    //img_pointer.src = 'gfx/hand.png';
    img_tiles.src = 'gfx/tileset_32x32.png';
    map.test();
    map.init('gfx/tileset_32x32.png');
    map.fill('M', 20, 20);
    map.box(' ',1,1,18,18);
    console.log('map: ' + map.width + ' x ' + map.height);
    actors.test();
}

function gameloop() {
    ctx.clearRect(0, 0, w, h);
    map.x = mouse.x;
    map.y = mouse.y;
    map.draw(ctx);

    //console.log('gameloop');
    requestAnimationFrame(gameloop);
}

function onMouseMove(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function onKeyDown(e) {
    console.log(e.key);
    if (e.key == 'ArrowUp') {
        map.cursor.y--;
    } else if (e.key == 'ArrowDown') {
        map.cursor.y++;
    } else if (e.key == 'ArrowLeft') {
        map.cursor.x--;
    } else if (e.key == 'ArrowRight') {
        map.cursor.x++;
    } else if (e.key == ' ') {
        map.set(map.cursor.block, map.cursor.x, map.cursor.y);
    } else if (e.key == 'c') {
        map.cursorCopy();
    } else if (e.key == 'e') {
        textbox = !textbox;
        f('map').innerHTML = map.toString();
        if(textbox){
            show('map');
        }else{
            hide('map');
        }
    }
}

function onKeyUp(e) {

}

//cursor
function drawCursor() {
    ctx.drawImage(img_tiles, 0, 96, 64, 32, Math.floor(mouse.x / tilew) * tilew, Math.floor(mouse.y / tileh) * tileh - shake, 64, 32);
}

function drawTile(n, i, z) {
    ctx.drawImage(img_tiles, n * 64, 0, 64, 128, (i % period) * tilew, Math.floor(i / period) * tileh - 96 - z, 64, 128);
}

function f(i) {
    return document.getElementById(i);
}

function show(i) {
    f(i).style.display = 'block';
}

function hide(i) {
    f(i).style.display = 'none';
}

