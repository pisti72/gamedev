let cloud_img = get("cloud");
let bird_img = get("bird");
let pipe_bottom_img = get("pipe_bottom");
let pipe_top_img = get("pipe_top");
let pipes = [];
let clouds = [];

let GRAVITY = 0.2;
let JUMP = 7;
let GAP = 250;/*200 - HARD, 250-EASY*/
const GAP_TOP = 400;
let DISTANCE_BETWEEN_PIPES = 450;
const DISTANCE_BETWEEN_CLOUDS = 600;
let SPEED = 4;
const NUMBER_OF_PIPES = 10;
const NUMBER_OF_CLOUDS = 10;
const PIPE_HEIGHT = 900;

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
        lives:true,
        jump:function(){
            if(this.lives){
                this.yd = -JUMP;
                this.pressed = true;
            }
        }
    }
    
    for(let i=0; i<NUMBER_OF_CLOUDS; i++){
        let cloud = {};
        cloud.img = cloud_img.cloneNode(); 
        document.body.appendChild(cloud.img);
        cloud.width = 250;
        clouds.push(cloud); 
    }
    inicClouds();
    cloud_img.style.display = "none";
    bird.img = bird_img.cloneNode();
    document.body.appendChild(bird.img);
    bird_img.style.display = "none";
    
    for(let i=0; i<NUMBER_OF_PIPES; i++){
        let pipe = {};
        pipe.img_bottom = pipe_bottom_img.cloneNode();
        pipe.img_top = pipe_top_img.cloneNode();
        document.body.appendChild(pipe.img_top);
        document.body.appendChild(pipe.img_bottom);
        pipe.width = 128;
        pipes.push(pipe); 
    }
    inicPipes()
    pipe_top_img.style.display = "none";
    pipe_bottom_img.style.display = "none";
    update();
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
    GAP = get("gap").value * 1;
    DISTANCE_BETWEEN_PIPES = get("distance").value * 1;
    SPEED = get("speed").value * 1;
    GRAVITY = get("gravity").value/10;
    JUMP = get("jump").value * 1;
    for(let i=0;i<clouds.length;i++){
        let cloud = clouds[i];
        cloud.x -= SPEED/2;
        if(cloud.x < -cloud.width){
            let x = -9999;
            for(let j=0;j<clouds.length;j++){
                if(clouds[j].x > x){
                    x = clouds[j].x;
                }
            }
            cloud.x = x + DISTANCE_BETWEEN_CLOUDS;
        }
        cloud.img.style.left = cloud.x + "px";
        cloud.img.style.top = cloud.y+ "px";
    }
    for(let i=0;i<pipes.length;i++){
        let pipe = pipes[i];
        pipe.x -= SPEED;
        if(pipe.x < -pipe.width){
            let x = -9999;
            for(let j=0;j<pipes.length;j++){
                if(pipes[j].x > x){
                    x = pipes[j].x;
                }
            }
            pipe.x = x + DISTANCE_BETWEEN_PIPES;
            pipe.y = Math.random()*h/2 + h/3;
            if(bird.lives){
                bird.score++;
            }
            if(bird.score > bird.hiscore){
                bird.hiscore = bird.score;
            }
        }
        pipe.img_top.style.left = pipe.x + "px";
        pipe.img_top.style.top = pipe.y-PIPE_HEIGHT-GAP + "px";
        pipe.img_bottom.style.left = pipe.x + "px";
        pipe.img_bottom.style.top = pipe.y + "px";
        
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
    bird.yd = bird.yd + GRAVITY;
    bird.y = bird.y + bird.yd;
    if(bird.y > h){
        bird.y = h/4;
        bird.yd = 0;
        bird.score = 0;
        bird.lives = true;
        bird.img.style.transform = "scaleY(1)";
        inicPipes();
        inicClouds();
    }
    bird.img.style.left = bird.x+"px";
    bird.img.style.top = bird.y+"px";
    get("score").innerHTML = "SC:" + bird.score;
    get("hiscore").innerHTML = "HI:" + bird.hiscore;
    window.requestAnimationFrame(update);
}
function get(n){
    return document.getElementById(n);
}