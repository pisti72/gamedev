console.log('Started');
document.onmousemove = onMouseMove;
document.onclick = onClick;
//document.onmousedown = onMousePressed;
//document.onmouseup = onMouseReleased;
document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;
document.body.onload = function (e) {
    init();
    //gameloop();
}
var mouse = { x: 0, y: 0 }
var ctx = f('display').getContext('2d');
f('display').width = 800;//document.body.clientWidth;
f('display').height = 400;//document.body.clientHeight;
var textbox = false;
//console.log('Display: ' + w + ' x ' + h);

function init() {
    //img_pointer.src = 'gfx/hand.png';
    bitmap.init();
    bitmap.draw(ctx);
    
}

function gameloop() {
    //ctx.clearRect(0, 0, w, h);
    bitmap.draw(ctx);
    //console.log('gameloop');
    requestAnimationFrame(gameloop);
}

function onMouseMove(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function onClick(e){
    bitmap.put(e.pageX,e.pageY);
    bitmap.draw(ctx);
    f('export').innerHTML=bitmap.export();
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
        //export to text defb
    } else if (e.key == 'e') {
        textbox = !textbox;
        f('export').innerHTML = map.toString();
        if(textbox){
            show('export');
        }else{
            hide('export');
        }
    }
}

function onKeyUp(e) {

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

