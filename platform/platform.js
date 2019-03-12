console.log('Started');
document.onmousemove = onMouseMove;
//document.onmousedown = onMousePressed;
//document.onmouseup = onMouseReleased;
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
console.log('Display: ' + w + ' x ' + h);

function init() {
    //img_pointer.src = 'gfx/hand.png';
    img_tiles.src = 'gfx/tileset_32x32.png';
    map.test();
    map.init();
    console.log('map: ' + map.width + ' x ' + map.height);
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

