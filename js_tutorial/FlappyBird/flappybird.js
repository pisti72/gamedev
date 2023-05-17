const GRAVITY = 0.2;
const JUMP = 7;
const GAP = 250;/*200 - HARD, 250-EASY*/
const GAP_TOP = 400;
const DISTANCE_BETWEEN_PIPES = 450;
const DISTANCE_BETWEEN_CLOUDS = 600;
const SPEED = 4;
const NUMBER_OF_PIPES = 10;
const NUMBER_OF_CLOUDS = 10;
const PIPE_HEIGHT = 900;
const NOWHERE = -9000;

let paused = false;

let cloud_img = document.getElementById("cloud");
let bird_img = document.getElementById("bird");
let pipe_bottom_img = document.getElementById("pipe_bottom");
let pipe_top_img = document.getElementById("pipe_top");
let pipes = [];
let clouds = [];

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    bird={
        x:100,
        y:h/4,
        yd:0,
        pressed:false,
        score:0,
        hiscore:0,
        width:60,
        height:40,
        img:bird_img,
        lives:true,
        jump:function(){
            if(this.lives){
                this.yd = -JUMP;
                this.pressed = true;
            }
        },
        update:function(){
            this.yd += GRAVITY;
            this.y += this.yd;
            if(this.y > h){
                this.y = h/4;
                this.yd = 0;
                this.score = 0;
                this.lives = true;
                this.img.style.transform = "scaleY(1)";
                inicPipes();
                inicClouds();
            }
            this.img.style.left = bird.x+"px";
            this.img.style.top = bird.y+"px";
        }
    }
    
    createClouds(NUMBER_OF_CLOUDS);
    inicClouds();
 
    createPipes(NUMBER_OF_PIPES);
    inicPipes()
    
    
    bird_img.style.zIndex = 1000;
    update();
}

function createClouds(n){
    for(let i=0; i<n; i++){
        let tmp = cloud_img.cloneNode(); 
        document.body.appendChild(tmp);
        let cloud = {
            x:0,
            y:0,
            width:tmp.width,
            img:tmp,
            update:function(){
                this.x -= SPEED/2;
                if(this.x < -this.width){
                    let x = NOWHERE;
                    for(let j=0;j<clouds.length;j++){
                        if(clouds[j].x > x){
                            x = clouds[j].x;
                        }
                    }
                    this.x = x + DISTANCE_BETWEEN_CLOUDS;
                }
                this.img.style.left = this.x + "px";
                this.img.style.top = this.y+ "px";
            }
        };   
        clouds.push(cloud); 
    }
    cloud_img.remove();
}

function createPipes(n){
    for(let i=0; i<n; i++){
        let img_top = pipe_top_img.cloneNode();
        let img_bottom = pipe_bottom_img.cloneNode();
        
        document.body.appendChild(img_top);
        document.body.appendChild(img_bottom);
        
        let pipe = {
            img_top: img_top,
            img_bottom: img_bottom,
            width: img_top.width,
            update: function(){
                this.x -= SPEED;
                if(this.x < -this.width){
                    let x = NOWHERE;
                    for(let j=0;j<pipes.length;j++){
                        if(pipes[j].x > x){
                            x = pipes[j].x;
                        }
                    }
                    this.x = x + DISTANCE_BETWEEN_PIPES;
                    this.y = Math.random()*h/2 + h/3;
                    if(bird.lives){
                        bird.score++;
                    }
                    if(bird.score > bird.hiscore){
                        bird.hiscore = bird.score;
                    }
                }
                this.img_top.style.left = this.x + "px";
                this.img_top.style.top = this.y-PIPE_HEIGHT-GAP + "px";
                this.img_bottom.style.left = this.x + "px";
                this.img_bottom.style.top = this.y + "px";
            }
        };
        pipes.push(pipe); 
    }
    pipe_top_img.remove();
    pipe_bottom_img.remove();
}

function inicPipes(){
    for(let i=0;i<pipes.length;i++){
        let pipe = pipes[i];
        pipe.x = DISTANCE_BETWEEN_PIPES*i + w;
        pipe.y = Math.random()*h/2 + h/3;
    }
}

function inicClouds(){
    for(let i=0;i<clouds.length;i++){
        let cloud = clouds[i];
        cloud.x = i*DISTANCE_BETWEEN_CLOUDS;
        cloud.y = Math.random()*h/1.5;
    }
}

document.addEventListener('touchstart', function(event) {
    bird.jump();
});

document.addEventListener('keydown', function(event) {
    if(event.code=="Space" && !bird.pressed){
        bird.jump();
    }
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

document.addEventListener('mousedown', function(event) {
    bird.jump();
});

document.addEventListener('keyup', function(event) {
    if(event.code=="Space"){
        bird.pressed = false;
    }
});

function update() {
    if(!paused){
        bird.update();
        for(let i=0;i<clouds.length;i++){
            let cloud = clouds[i];
            cloud.update();
        }
        for(let i=0;i<pipes.length;i++){
            let pipe = pipes[i];
            pipe.update();
            
            //collition
            if(bird.x+bird.width>pipe.x && bird.x < pipe.x+pipe.width && bird.lives){
                if(bird.y+bird.height > pipe.y || bird.y < pipe.y-GAP){
                    bird.collied = true;
                    bird.yd = -JUMP * 1.5;
                    bird.lives = false;
                    bird.img.style.transform = "scaleY(-1)";
                }
            }
        }
    }
    
    document.getElementById("score").innerHTML = bird.score;
    document.getElementById("hiscore").innerHTML = "HI: " + bird.hiscore;
    window.requestAnimationFrame(update);
}