console.log('main loaded');
//document.onmousemove = onMouseMove;
document.onkeydown = function(e) {
    if(e.key == 'w') {
        console.log('w pressed');
    }
}
document.body.onload = function (e) {
    Wire3d.init();
    init();
    update();
}

function init() {
    Wire3d.addCube(0,0,0);
    
}

function update() {
    Wire3d.render();
    Wire3d.debug('speed: ' + Wire3d.getPlayerSpeed());
    requestAnimationFrame(update);
}
