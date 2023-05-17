const LASER_SPEED = 10;
const UFO_SPEED = 10;
const ROWS = 5;
const COLUMNS = 8;
const NOWHERE = -1000;

let player_svg = document.getElementById("player");
let laser_svg = document.getElementById("laser");
let ufo_svg = document.getElementById("ufo");
let crab_svg = document.getElementById("crab");
let bomb_svg = document.getElementById("bomb");

let invaders = [];

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    player = {
        x:0,
        y:h-50,
        score:0,
        hiscore:0,
        width:player_svg.width,
        height:player_svg.height,
        addScore: function(n){
            this.score += n;
            if(this.score > this.hiscore){
                this.hiscore = this.score;
            }
        }
    }
    
    laser = {
        x:NOWHERE,
        y:0,
        yd:0,
        height:laser_svg.height,
        width:laser_svg.width
    }
    
    bomb = {
        x:NOWHERE,
        y:0,
        yd:0,
        height:bomb_svg.height,
        width:bomb_svg.width
    }
    
    ufo = {
        x:w+10,
        y:50,
        width:ufo_svg.width,
        height:ufo_svg.height,
        sleeping:60,
        reset: function(){
            this.x = w+10;
            this.sleeping = rnd(180)+180;
        }
    }
    
    createInvaders();
    
    update();
}

document.addEventListener('mousemove',function(event) {
    player.x = event.pageX - player.width/2;
    if(player.x<0){
        player.x = 0;
    }
    if(player.x+player.width>w){
        player.x = w - player.width;
    }
});

document.addEventListener('mousedown',function(event) {
    if(laser.x == NOWHERE){
        laser.x = player.x + (player.width - laser.width)/2;
        laser.y = player.y-laser.height;
        laser.yd = -LASER_SPEED;
    }
});

function createInvaders(){
    let left_margin = (w-COLUMNS*crab_svg.width*1.25)/2;
    let top_margin = ufo.y+ufo.height+10;
    for(let j=0;j<ROWS;j++){
        for(let i=0;i<COLUMNS;i++){
            let crab={
                x:i*crab_svg.width*1.25 + left_margin,
                y:j*crab_svg.height*1.25 + top_margin,
                width:crab_svg.width,
                height:crab_svg.height
            }
            
            let crab_tmp = crab_svg.cloneNode(); 
            document.body.appendChild(crab_tmp);
            
            crab_tmp.style.zIndex="-9990";
            crab.img = crab_tmp;
            invaders.push(crab);
        }
    }
    crab_svg.remove();
}


function update() {
    player_svg.style.left = player.x + "px";
    player_svg.style.top = player.y + "px";
    
    if(laser.x != NOWHERE){
        laser.y += laser.yd;
        if(laser.y < -laser.height){
            laser.x = NOWHERE;
        }
        
        if(overlapped(ufo,laser)){
            ufo.reset();
            player.addScore(10);
            laser.x = NOWHERE;
        }
        
        for(let i=0;i<invaders.length;i++){
            let invader = invaders[i];
            if(overlapped(invader,laser) && laser.x != NOWHERE){
                laser.x = NOWHERE;
                player.addScore(1);
                invader.x = NOWHERE;
            }
        }
    }
    
    if(bomb.x == NOWHERE){
        let pick = rnd(invaders.length);
        let invader = invaders[pick];
        if(invader.x != NOWHERE){
            bomb.x = invader.x + (invader.width-bomb.width)/2;
            bomb.y = invader.y + invader.height;
        }
    }else{
        if(bomb.y > 2*h){
            bomb.x = NOWHERE;
        }else{
            bomb.y += LASER_SPEED;
        }
    }
    
    if(ufo.sleeping>0){
        ufo.sleeping--;
    }else{
        ufo.x -= UFO_SPEED;
    }
    
    if(ufo.x < -ufo.width){
        ufo.reset();
    }
    
    laser_svg.style.left = laser.x + "px";
    laser_svg.style.top = laser.y + "px";
    
    bomb_svg.style.left = bomb.x + "px";
    bomb_svg.style.top = bomb.y + "px";
    
    ufo_svg.style.left = ufo.x + "px";
    ufo_svg.style.top = ufo.y + "px";
    
    for(let i=0;i<invaders.length;i++){
        let invader = invaders[i];
        invader.img.style.left = invader.x + "px";
        invader.img.style.top = invader.y + "px";
    }
    
    document.getElementById("score").innerHTML = player.score;
    //document.getElementById("score").innerHTML = bomb.y;
    document.getElementById("hiscore").innerHTML = "HI: " + player.hiscore;
    
    window.requestAnimationFrame(update);
}

function overlapped(a,b){
    return (Math.abs((a.x+a.width/2)-(b.x+b.width/2))<(a.width+b.width)/2) 
        && (Math.abs((a.y+a.height/2)-(b.y+b.height/2))<(a.height + b.height)/2);
}

function rnd(n){
    return Math.floor(Math.random()*n);
}