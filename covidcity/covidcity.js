window.onload = function () {
    var canvas = f("c");
    var w = canvas.width = window.innerWidth;
    var h = canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    var img = f("i");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0,
        64, 64,
        Math.floor((w - 64 * 4) / 2), Math.floor((h - 64 * 4) / 2),
        64 * 4, 64 * 4);
};

function f(n) {
    return document.getElementById(n);
}