const SPEED = 12;
const NUMBER_OF_FLOORS = 6;
const NUMBER_OF_CLOUDS = 6;
const NUMBER_OF_CACTUS = 10;
const GRAVITY = 1;
const JUMP = 20;
const CACTUS_WIDTH = 100;
const CLOUD_WIDTH = 500;
const CRITICAL_DISTANCE = 60;

let paused = false;

let dino1_img = document.getElementById("dino1");
let dino2_img = document.getElementById("dino2");
let cloud_img = document.getElementById("cloud");
let floor_img = document.getElementById("floor");
let cactus_img = document.getElementById("cactus");
let floors = [];
let clouds = [];
let cactuses = [];

document.addEventListener('keydown', function(event) {
    dino.jump();
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

document.addEventListener('mousedown', function(event) {
    dino.jump();
});

document.addEventListener('touchstart', function(event) {
    dino.jump();
});

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    baselevel = h*0.8;

    dino = {
        height:90,
        x:w/3,
        y:baselevel,
        yd:0,
        onfloor:true,
        score:0,
        hiscore:0,
        width:80,
        img1:dino1_img,
        img2:dino2_img,
        t:0,
        lives:true,
        jump:function(){
            if(this.lives && this.onfloor){
                this.yd = -JUMP;
            }
        },
        update:function(){
            this.yd += GRAVITY;
            this.y += this.yd;
            this.onfloor = false;
            if(this.y>baselevel-this.height && this.lives){
                this.y = baselevel-this.height;
                this.onfloor = true;
            }
            
            this.img1.style.left = this.x + "px";
            this.img1.style.top = this.y+ "px";
            this.img2.style.left = this.x + "px";
            this.img2.style.top = this.y+ "px";
            this.t++;
           
            this.img1.style.display = "block";
            this.img2.style.display = "none";
            if(this.t%20>10 && this.onfloor && this.lives){
                this.img1.style.display = "none";
                this.img2.style.display = "block";
            }
            
            if(this.y > h*4){
                this.inic();
                inicFloors();
                inicClouds();
                inicCactuses();
            }
        },
        inic:function(){
            this.lives = true;
            this.y = baselevel-this.height;
            this.img1.style.transform = "scaleY(1)";
            this.img2.style.transform = "scaleY(1)";
            this.score = 0;
        },
        increaseScore:function(n){
            if(this.lives){
                this.score+=n;
                if(this.score > this.hiscore){
                    this.hiscore = this.score;
                }
            }
        }
    }
    
    for(let i=0; i<NUMBER_OF_FLOORS; i++){
        let floor = {};
        floor.img = floor_img.cloneNode(); 
        document.body.appendChild(floor.img);
        floor.width = 405;
        floors.push(floor); 
    }
    inicFloors();
    floor_img.style.display = "none";
    
    for(let i=0; i<NUMBER_OF_CLOUDS; i++){
        let cloud = {};
        cloud.img = cloud_img.cloneNode(); 
        document.body.appendChild(cloud.img);
        cloud.width = CLOUD_WIDTH;
        clouds.push(cloud); 
    }
    inicClouds();
    cloud_img.style.display = "none";
    
    for(let i=0; i<NUMBER_OF_CACTUS; i++){
        let cactus = {};
        cactus.img = cactus_img.cloneNode(); 
        document.body.appendChild(cactus.img);
        cactus.width = CACTUS_WIDTH + w;
        cactuses.push(cactus); 
    }
    inicCactuses();
    cactus_img.style.display = "none";
    
    update();
}

function inicFloors() {
    for(let i=0; i<floors.length; i++){
        let floor = floors[i];
        floor.x = i*floor.width;
        floor.y = baselevel;
    }
}

function inicClouds() {
    for(let i=0; i<clouds.length; i++){
        let cloud = clouds[i];
        cloud.x = i*cloud.width;
        cloud.y = Math.random()*h*0.3;
    }
}

function inicCactuses() {
    for(let i=0; i<cactuses.length; i++){
        let cactus = cactuses[i];
        cactus.x = i*cactus.width;
        cactus.y = baselevel-90;
    }
}

function update() {
    if(!paused){
        dino.update();
        
        for(let i=0; i<floors.length; i++){
            let floor = floors[i];
            floor.x -= SPEED;
            if(floor.x < -floor.width){
                floor.x = + (floor.width * (floors.length-1));
            }
            floor.img.style.left = floor.x + "px";
            floor.img.style.top = floor.y+ "px";
        }
        
        for(let i=0; i<clouds.length; i++){
            let cloud = clouds[i];
            cloud.x -= SPEED/2;
            if(cloud.x < -cloud.width){
                cloud.x = + (cloud.width * (clouds.length-1));
            }
            cloud.img.style.left = cloud.x + "px";
            cloud.img.style.top = cloud.y+ "px";
        }
        
        for(let i=0; i<cactuses.length; i++){
            let cactus = cactuses[i];
            cactus.x -= SPEED;
            if(cactus.x < -cactus.width){
                let x = 0;
                for(let j=0;j<cactuses.length;j++){
                    if(cactuses[j].x > x){
                        x = cactuses[j].x;
                    }
                }
                cactus.x = x + (4 + Math.random()*6)*CACTUS_WIDTH;
                dino.increaseScore(1);
            }
            if(Math.abs(cactus.x-dino.x)<CRITICAL_DISTANCE && Math.abs(cactus.y-dino.y)<CRITICAL_DISTANCE && dino.lives){
                dino.lives = false;
                dino.yd = -1.5*JUMP;
                dino.img1.style.transform = "scaleY(-1)";
                dino.img2.style.transform = "scaleY(-1)";
            }
            cactus.img.style.left = cactus.x + "px";
            cactus.img.style.top = cactus.y+ "px";
        }
    }
    
    document.getElementById("score").innerHTML = dino.score;
    document.getElementById("hiscore").innerHTML = "HI: " + dino.hiscore;
    
    
    window.requestAnimationFrame(update);
}