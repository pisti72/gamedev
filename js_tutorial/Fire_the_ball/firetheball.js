const GRAVITY = .2;
const STRENGTH = .26;
const RIGIDITY = 0.9;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let balls=[];
let pointer={x:0,y:0};
let gun={x:0,y:0,r:60}
let colors=["#F88","#8F8","#88F","#FF8","#F8F","#8FF"];

document.addEventListener('mousemove',function(event) {
    pointer.x = event.pageX;
    pointer.y = event.pageY;
    let rad = Math.atan((h-pointer.y)/(pointer.x));
    //rad=Math.PI/8;
    gun.x = Math.cos(rad)*gun.r;
    gun.y = Math.sin(rad)*gun.r;
});

function clicked() {
    addBall(gun.x,h-gun.y,gun.x*STRENGTH,-gun.y*STRENGTH)
}

function addBall(x,y,xd,yd) {
    let ball={
        x:x,
        y:y,
        xd:xd,
        yd:yd,
        r:20,
        color:Math.floor(Math.random()*colors.length)
    }
    balls.push(ball);
}

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    canvas.width = w;
    canvas.height = h;
    update();
}

function update() {
    ctx.fillStyle = "#94B0C2";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(pointer.x,pointer.y,4,4);
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(gun.x, h-gun.y);
    ctx.stroke();
    for(let i=0;i<balls.length;i++){
        let ball=balls[i];
        ball.yd += GRAVITY;
        ball.x+=ball.xd;
        ball.y+=ball.yd;
        if(ball.x+ball.r>w){
            ball.x = w-ball.r ;
            ball.xd = -ball.xd*RIGIDITY;
        }
        if(ball.x-ball.r<0){
            ball.x = ball.r ;
            ball.xd = -ball.xd*RIGIDITY;
        }
        if(ball.y+ball.r>h){
            ball.y = h-ball.r ;
            ball.yd = -ball.yd*RIGIDITY;
        }
        for(let j=0;j<balls.length;j++){
            ball2 = balls[j];
            if(i!=j){
                let xdiff = ball.x-ball2.x;
                let ydiff = ball.y-ball2.y;
                let distance = Math.sqrt(
                Math.pow(xdiff,2)+Math.pow(ydiff,2))-ball.r-ball2.r;
                if (distance<0) { 
                    //var ratio = 0.5;
                    //ball.xd*=-1;
                    //ball.yd*=-1;
                    //ball2.yd=0;
                    //ball2.yd=0;
                    ball.xd += (ball.x-ball2.x)/distance/5;
                    ball.yd += (ball.y-ball2.y)/distance/5;
                    ball2.xd += (ball2.x-ball.x)/distance/5;
                    ball2.yd += (ball2.y-ball.y)/distance/5;
                }
            }
            
            
        }
        ctx.fillStyle = colors[ball.color];
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
        ctx.fill();
    }
    window.requestAnimationFrame(update);
}