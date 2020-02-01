document.body.onload = function (e) {
    Wire3d.init();
    init();
    update();
    
    // setInterval(() => {
    //     update();
    // }, 50);
    
}

function init() {
    Wire3d.addCube(10, 0, 200, 0);
    Wire3d.addPyramid(12, 0, 200, 10);
    Wire3d.addPyramid(100, 0, 400, -10);
    Wire3d.addCube(10, 2000, 20, 0);
}

function update() {
    Wire3d.render();
    //Wire3d.debug('speed: ' + Wire3d.getPlayerSpeed(), 40);
    //Wire3d.debug('rotation: ' + Wire3d.getPlayerDegree(), 80);
    requestAnimationFrame(update);
}
