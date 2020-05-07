var canvas = f('c');
var ctx = canvas.getContext('2d');
var canvas2 = f('t');
var ctx2 = canvas.getContext('2d');
var size = 20;
var img = f('i');
var h = document.body.clientHeight;
var dot = Math.floor(h / size);
var pendown = false;
var pixels = [];
var index = 0;
canvas.width = dot * size;
canvas.height = dot * size;
canvas2.height = size;
canvas2.width = size;
ctx.clearRect(0, 0, dot * size, dot * size);
canvas.addEventListener('mousemove', function (e) {
    var x = Math.floor(e.clientX / dot);
    var y = Math.floor(e.clientY / dot);
    if (pendown) {
        putPixel(index, x, y);
    }
});
canvas.addEventListener('mousedown', function (e) {
    pendown = true;
});
canvas.addEventListener('mouseup', function (e) {
    pendown = false;
});
canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    var x = Math.floor(e.clientX / dot);
    var y = Math.floor(e.clientY / dot);
    index = pixels[x + y * size];
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
    ctx.fillStyle = ctx2.fillStyle = palettes[1].colors[colorindex];
    ctx.fillRect(x * dot, y * dot, dot, dot);
    ctx2.fillRect(x, y , 1, 1);
    var bmp = canvas2.toDataURL("image/png");
        img.src = bmp;
    pixels[x + y * size] = colorindex;
}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function f(n) {
    return document.getElementById(n);
}