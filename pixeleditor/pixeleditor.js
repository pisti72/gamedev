var canvasTransparent = f('transparent');
var ctxTransparent = canvasTransparent.getContext('2d');
var canvasMain = f('main');
var ctxMain = canvasMain.getContext('2d');
var canvasSmall = f('small');
var ctxSmall = canvasSmall.getContext('2d');
var size = 20;
var img = f('i');
var h = document.body.clientHeight;
var dot = Math.floor(h / size);
var pendown = false;
var pixels = [];
var index = 3;
canvasTransparent.width = canvasMain.width = dot * size;
canvasTransparent.height = canvasMain.height = dot * size;
canvasSmall.height = canvasSmall.width = size;
ctxMain.clearRect(0, 0, dot * size, dot * size);
//ctxMain.fillStyle = "red";
//ctxMain.fillRect(0, 0, dot * size, dot * size);

//ctxTransparent.fillStyle = "magenta";
//ctxTransparent.fillRect(0, 0, dot * size, dot * size);
fillTransparent();
canvasMain.addEventListener('mousemove', function (e) {
    var x = Math.floor(e.offsetX / dot);
    var y = Math.floor(e.offsetY / dot);
    if (pendown) {
        putPixel(index, x, y);
    }
});
canvasMain.addEventListener('mousedown', function (e) {
    console.log('drawing');
    pendown = true;
});
canvasMain.addEventListener('mouseup', function (e) {
    pendown = false;
});
canvasMain.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    var x = Math.floor(e.offsetX / dot);
    var y = Math.floor(e.offsetY / dot);
    index = pixels[x + y * size];
    console.log('x:' + x);
});
document.addEventListener('keydown', function (e) {
    if (e.key == 's') {
        download(img.src, "image.png", 'image/png');
    }
});
for (var i = 0; i < palettes[1].colors.length; i++) {
    putPixel(i, i, 0);
}
function putPixel(colorindex, x, y) {
    ctxMain.fillStyle = ctxSmall.fillStyle = palettes[1].colors[colorindex];
    ctxMain.fillRect(x * dot, y * dot, dot, dot);
    ctxSmall.fillRect(x, y, 1, 1);
    var bmp = canvasSmall.toDataURL("image/png");
    img.src = bmp;
    pixels[x + y * size] = colorindex;
}
function fill(colorindex) {
    ctxMain.fillStyle = ctxSmall.fillStyle = palettes[1].colors[colorindex];
    ctxMain.fillRect(0, 0, dot * size, dot * size);
    ctxSmall.fillRect(0, 0, size, size);
}
function fillTransparent() {
    for (var j = 0; j < size; j++) {
        for (var i = 0; i < size; i++) {
            if ((i + j) % 2 == 0) {
                ctxTransparent.fillStyle = '#AAA';
            } else {
                ctxTransparent.fillStyle = '#BBB';
            }
            ctxTransparent.fillRect(i * dot, j * dot, dot, dot);
        }
    }

}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function f(n) {
    return document.getElementById(n);
}