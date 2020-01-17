console.log('main loaded');
//document.onmousemove = onMouseMove;
document.onkeydown = function (e) {
    if (e.key == 'w') {
        Wire3d.playerForward();
    } else if (e.key == 's') {
        Wire3d.playerBackward();
    }
    if (e.key == 'a') {
        Wire3d.playerLeft();
    } else if (e.key == 'd') {
        Wire3d.playerRight();
    }
}
document.onkeyup = function (e) {
    if (e.key == 'w' || e.key == 's') {
        Wire3d.playerNotForward();
    }
    if (e.key == 'a' || e.key == 'd') {
        Wire3d.playerDoNotRot();
    }
}
document.body.onload = function (e) {
    Wire3d.init();
    init();
    //update();
    setInterval(() => {
        update();
    }, 50);
}

function init() {
    Wire3d.addCube(100, 0, 0, 0);
    console.log(Wire3d.getMeshByName('cube').points[1]);
}

function update() {
    Wire3d.render();
    Wire3d.debug('speed: ' + Wire3d.getPlayerSpeed(), 40);
    Wire3d.debug('rotation: ' + Wire3d.getPlayerRot(), 80);
    //requestAnimationFrame(update);
}
