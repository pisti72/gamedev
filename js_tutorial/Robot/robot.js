let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let robot1_img = new Image();
let robot2_img = new Image();
let t=0;

const SPEED = 4;

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    canvas.width = w;
    canvas.height = h;
    robot1_img.src = "assets/robot1.png";
    robot2_img.src = "assets/robot2.png";
    
    robot={
        x:w/2,
        y:h/2,
        left:false,
        right:false,
        up:false,
        down:false,
        img:robot1_img
    }
    update();
}

document.addEventListener('keydown', function(event) {
    if(event.code=="ArrowRight"){robot.right=true;}
    if(event.code=="ArrowLeft") {robot.left=true;}
    if(event.code=="ArrowDown") {robot.down=true;}
    if(event.code=="ArrowUp")   {robot.up=true;}
});

document.addEventListener('keyup', function(event) {
    if(event.code=="ArrowRight"){robot.right=false;}
    if(event.code=="ArrowLeft") {robot.left=false;}
    if(event.code=="ArrowDown") {robot.down=false;}
    if(event.code=="ArrowUp")   {robot.up=false;}
});

function update() {
    ctx.fillStyle = "#94B0C2";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    if(robot.right){robot.x += SPEED;}
    if(robot.left) {robot.x -= SPEED;}
    if(robot.down) {robot.y += SPEED;}
    if(robot.up)   {robot.y -= SPEED;}
    robot.img = robot1_img;
    if(t%60>30)robot.img = robot2_img;
    ctx.drawImage(robot.img, robot.x, robot.y);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Hello World!",w/2-50,h/4*3)
    window.requestAnimationFrame(update);
	t++;
}