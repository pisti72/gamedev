let ball_svg = document.getElementById("ball");

const GRAVITY = .7;

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    ball={
        x:w/2,
        y:h/4,
        xd:4,
        yd:0,
        width:100,
        height:100
    }
    update();
}

function update() {
    ball.yd += GRAVITY;
    ball.y += ball.yd;
    ball.x += ball.xd;
    if(ball.x+ball.width>w || ball.x<0){
        ball.xd *=-1;
    }
    if(ball.y+ball.height>h){
        ball.yd =-ball.yd-GRAVITY;
    }
    ball_svg.style.left = ball.x+"px";
    ball_svg.style.top = ball.y+"px";
    
    window.requestAnimationFrame(update);
}