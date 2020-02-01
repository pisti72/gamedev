document.body.onload = function (e) {
    Wire3d.init();
    init();
    update();
    
    // setInterval(() => {
    //     update();
    // }, 50);
    
}

function init() {
    Wire3d.addCube(10, 0, 200, 10);
    Wire3d.addPyramid(12, 0, 200, 20);
    Wire3d.addPyramid(100, 0, 400, 0);
    Wire3d.addCube(10, 2000, 20, 10);
}

function update() {
    Wire3d.render();
    requestAnimationFrame(update);
}
