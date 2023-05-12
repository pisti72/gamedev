const WIDTH = 616;
const HEIGHT = 435;
let canvas = document.getElementById("canvas");
let etch_img = document.getElementById("etch");

let ctx = canvas.getContext("2d");

function onload () {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    mouse={
        x:0,
        y:0,
        x_before:0,
        y_before:0,
        down:false,
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#AAA";
    ctx.fillStyle = "#EEE";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

document.addEventListener('mousedown', function (event) {
    mouse.down = true;
});

etch_img.addEventListener('mousedown', function (event) {
    ctx.fillStyle = "#EEE";
    ctx.fillRect(0,0,canvas.width,canvas.height);
});

document.addEventListener('mouseup', function (event) {
    mouse.down = false;
});

document.addEventListener('mousemove', function (event) {
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop  ;
    if(mouse.down){
        ctx.beginPath();
        ctx.moveTo(mouse.x_before, mouse.y_before);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
    mouse.x_before = mouse.x;
    mouse.y_before = mouse.y;
});