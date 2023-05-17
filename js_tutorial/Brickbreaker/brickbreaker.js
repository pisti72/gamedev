const SPEED = 8;
const NOWHERE = -1000;
const LIVES = 5;
let paused = false;

let player_img = document.getElementById("pad");
let ball_img = document.getElementById("ball");
let red_div = document.getElementById("red");
let blue_div = document.getElementById("blue");
let green_div = document.getElementById("green");
let yellow_div = document.getElementById("yellow");

let snd_ball = document.getElementById("snd_ball");

let bricks = [];

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    player = {
        x:0,
        y:h-50,
        lives:LIVES,
        balls:[],
        score:0,
        hiscore:0,
        width:player_img.width,
        height:player_img.height,
        addScore: function(n){
            this.score += n;
            if(this.score > this.hiscore){
                this.hiscore = this.score;
            }
            snd_ball.play();
        },
        update: function() {
            player_img.style.left = this.x + "px";
            player_img.style.top = this.y + "px";
        }
    }
    
    brickData = {
        width:red_div.width+4,
        height:red_div.height+4
    }
    
    ball = {
        x:50,
        y:400,
        xd:SPEED,
        yd:SPEED,
        width:ball_img.width,
        height:ball_img.height,
        update:function(){
            this.x += this.xd;
            this.y += this.yd;
            if(this.y + this.height > h * 1.5){
                ballLost();
            }
            if(this.y < 0){
                this.y = 0;
                this.yd *= -1;
                snd_ball.play();
            }
            if(this.x < 0){
                this.x = 0;
                this.xd *= -1;
                snd_ball.play();
            }
            if(this.x + this.width > w){
                this.x = w - this.width;
                this.xd *= -1;
                snd_ball.play();
            }
            ball_img.style.left = this.x + "px";
            ball_img.style.top = this.y + "px";
        }
    }
    createLives(LIVES);
    createWall();
    update();
}

document.addEventListener('keydown',function(event) {
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

document.addEventListener('mousemove',function(event) {
    player.x = event.pageX - player.width/2;
    if(player.x<0){
        player.x = 0;
    }
    if(player.x+player.width>w){
        player.x = w - player.width;
    }
});

function ballLost(){
    player.lives--;
    if(player.lives >= 0){
        player.balls[player.lives].x = NOWHERE;
        player.balls[player.lives].update();
    }else{
        player.lives = LIVES;
        player.score = 0;
        for(let i=0;i<player.balls.length;i++){
            let smallBall = player.balls[i];
            smallBall.x =30 + i*80;
            smallBall.update();
        }
        for(let i=0;i<bricks.length;i++){
            let brick = bricks[i];
            brick.x = brick.staticX;
            brick.update();
        }
    }
    ball.x = 50;
    ball.y = 400;
    ball.xd = SPEED;
    ball.yd = SPEED;
}

function createLives(n){
    for(let i=0;i<n;i++){
        let tmp = ball_img.cloneNode();
        document.body.appendChild(tmp);
        let smallBall = {
            x:30 + i*80,
            y:30,
            img:tmp,
            update:function(){
                this.img.style.left = this.x + "px";
                this.img.style.top = this.y + "px";
            }
        }
        smallBall.update();
        player.balls.push(smallBall);
    }
}

function createWall(){
    let bricksArray = [red_div, blue_div, green_div, yellow_div];
    let columns = Math.floor(w/brickData.width);
    for(let j=0;j<bricksArray.length;j++){
        for(let i=0;i<columns;i++){
            let tmp = bricksArray[j].cloneNode();
            let brick={
                x:i*brickData.width,
                y:200 + j*brickData.height,
                staticX: i*brickData.width,
                width:brickData.width,
                height:brickData.height,
                img:tmp,
                update:function(){
                    this.img.style.left = this.x + "px";
                    this.img.style.top = this.y + "px";
                },
                isInside:function(x,y){
                    return x>this.x && x<this.x+this.width && y>this.y && y<this.y+this.height;
                }
            }
            document.body.appendChild(tmp);
            tmp.style.left = brick.x + "px";
            tmp.style.top = brick.y + "px";
            bricks.push(brick);
        }
        bricksArray[j].remove();
    }
}



function update() {
    if(!paused){
        player.update();
        ball.update();
    }
        
    if(ball.y+ball.height>player.y && ball.y+ball.height<player.y+player.height){
        let bottom = ball.x+ball.width/2;
        if(bottom > player.x && bottom < player.x+player.width){
            ball.yd = -Math.abs(ball.yd);
            ball.y = player.y - ball.height;
            snd_ball.play();
        }
    }
    
    for(let i=0;i<bricks.length;i++){
        let brick = bricks[i];
        
        if(brick.isInside(ball.x+ball.width/2,ball.y)){
            brick.x = NOWHERE;
            ball.yd = Math.abs(ball.yd);
            player.addScore(10);
        }else if(brick.isInside(ball.x+ball.width/2,ball.y+ball.height)){
            brick.x = NOWHERE;
            ball.yd = -Math.abs(ball.yd);
            player.addScore(10);
        }else if(brick.isInside(ball.x,ball.y+ball.height/2)){
            brick.x = NOWHERE;
            ball.xd = Math.abs(ball.xd);
            player.addScore(10);
        }else if(brick.isInside(ball.x+ball.width,ball.y+ball.height/2)){
            brick.x = NOWHERE;
            ball.xd = -Math.abs(ball.xd);
            player.addScore(10);
        }
        brick.update();
    }
    
    document.getElementById("score").innerHTML = player.score;
    document.getElementById("hiscore").innerHTML = "HI: " + player.hiscore;
    
    window.requestAnimationFrame(update);
}