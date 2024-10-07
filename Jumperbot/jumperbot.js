var canvas;
var ctx;
var img;
var w, h;
window.onload = function () {
    canvas = f('c');
    level = 0;
    img = f('tiles');
    engine.init(canvas, img);
    engine.createActors(levels[level].data);
    document.addEventListener('keydown', function (e) {
        //console.log(e.key);
        if (e.key == 'd' || e.key == 'ArrowRight') {
            var player = engine.getActorByName('P')
            player.xforce = 1.5
            player.flip = true
        } else if (e.key == 'a' || e.key == 'ArrowLeft') {
            var player = engine.getActorByName('P')
            player.xforce = -1.5
            player.flip = false
        }
        if (e.key == ' ' || e.key == 'w' || e.key == 'ArrowUp') {
            engine.getActorByName('P').mustJump = true;
        }
        if (e.key == 'o') {
            engine.nextBlock();
        }
        if (e.key == 'u') {
            engine.putBlock();
        }
        if (e.key == 'l') {
            engine.moveRight();
        } else if (e.key == 'j') {
            engine.moveLeft();
        }
        if (e.key == 'i') {
            engine.moveUp();
        } else if (e.key == 'k') {
            engine.moveDown();
        }
    });
    document.addEventListener('keyup', function (e) {
        if (e.key == 'a' || e.key == 'd' || e.key == 'ArrowRight' || e.key == 'ArrowLeft') {
            engine.getActorByName('P').xforce = 0;
        }
        if (e.key == ' ' || e.key == 'w' || e.key == 'ArrowUp') {
            engine.getActorByName('P').mustJump = false;
        }
    })
    requestAnimationFrame(update);
}
function update() {

    if (engine.isDone) {
        engine.createActors(levels[++level].data);
    }
    engine.update();
    requestAnimationFrame(update);
}
function f(n) {
    return document.getElementById(n);
}
