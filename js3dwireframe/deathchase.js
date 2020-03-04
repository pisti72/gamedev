document.body.onload = function (e) {
    Wire3d.init();
    init();
    update();
}

function init() {
    Wire3d.ground = 'darkgreen';
    Wire3d.sky = 'cyan';
    Wire3d.debug = true;
    Wire3d.addTree(10,0);
    //Wire3d.addCube(10, 0, 200, 10);
    //Wire3d.addPyramid(12, 0, 200, 20);
    //Wire3d.addPyramid(100, 0, 400, 0);
    //Wire3d.addCube(10, 2000, 20, 10);
}

function update() {
    Wire3d.renderRectangles();
    requestAnimationFrame(update);
}
