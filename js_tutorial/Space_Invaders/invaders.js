const LASER_SPEED = 10;
const UFO_SPEED = 10;
const ROWS = 5;
const COLUMNS = 8;
const NOWHERE = -1000;

let paused = false;

let player_svg = document.getElementById("player");
let laser_svg = document.getElementById("laser");
let ufo_svg = document.getElementById("ufo");
let crab_svg = document.getElementById("crab");
let bomb_svg = document.getElementById("bomb");

let invaders = [];
let invaders_xd = 1;

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
        },
        update: function() {
            player_svg.style.left = this.x + "px";
            player_svg.style.top = this.y + "px";
        }
    }
    
    laser = {
        x:NOWHERE,
        y:0,
        yd:0,
        height:laser_svg.height,
        width:laser_svg.width,
        update:function() {
            if(this.x != NOWHERE){
                this.y += this.yd;
                if(this.y < -this.height){
                    this.x = NOWHERE;
                }
                
                if(overlapped(ufo,this)){
                    ufo.reset();
                    player.addScore(10);
                    this.x = NOWHERE;
                }
                
                for(let i=0;i<invaders.length;i++){
                    let invader = invaders[i];
                    if(overlapped(invader,this) && this.x != NOWHERE){
                        this.x = NOWHERE;
                        player.addScore(1);
                        invader.x = NOWHERE;
                    }
                }
            }
            laser_svg.style.left = this.x + "px";
            laser_svg.style.top = this.y + "px";
        }
    }
    
    bomb = {
        x:NOWHERE,
        y:0,
        yd:0,
        height:bomb_svg.height,
        width:bomb_svg.width,
        update: function() {
            if(this.x == NOWHERE){
                let pick = rnd(invaders.length);
                let invader = invaders[pick];
                if(invader.x != NOWHERE){
                    this.x = invader.x + (invader.width-this.width)/2;
                    this.y = invader.y + invader.height;
                }
            }else{
                if(this.y > 2*h){
                    this.x = NOWHERE;
                }else{
                    this.y += LASER_SPEED;
                }
            }
            bomb_svg.style.left = this.x + "px";
            bomb_svg.style.top = this.y + "px";
        }
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
        },
        update:function(){
            if(this.sleeping>0){
                this.sleeping--;
            }else{
                this.x -= UFO_SPEED;
            }
            
            if(this.x < -this.width){
                this.reset();
            }
            ufo_svg.style.left = this.x + "px";
            ufo_svg.style.top = this.y + "px";
        }
    }
    
    createInvaders();
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
            let crab_tmp = crab_svg.cloneNode(); 
            document.body.appendChild(crab_tmp);
            crab_tmp.style.zIndex="-9990";
            let crab={
                x:i*crab_svg.width*1.25 + left_margin,
                y:j*crab_svg.height*1.25 + top_margin,
                img:crab_tmp,
                width:crab_svg.width,
                height:crab_svg.height,
                update:function(){
                    if(this.x != NOWHERE){
                        if(this.x+this.width>w){
                            invaders_xd = -Math.abs(invaders_xd);
                            moveInvaders(-20,20);
                        }
                        if(this.x<0){
                            invaders_xd = Math.abs(invaders_xd);
                            moveInvaders(20,20);
                        }
                        this.x += invaders_xd;
                    }
                    this.img.style.left = this.x + "px";
                    this.img.style.top = this.y + "px";
                }
            }
            invaders.push(crab);
        }
    }
    crab_svg.remove();
}

function moveInvaders(x,y){
    for(let i=0;i<invaders.length;i++){
        let invader = invaders[i];
        if(invader.x != NOWHERE){
            invader.x += x;
            invader.y += y;
        }
    }
}

function updateInvaders(){
    let active = 0;
    for(let i=0;i<invaders.length;i++){
        let invader = invaders[i];
        invader.update();
        if(invader.x != NOWHERE){
            active++;
        }
    }
    let f = invaders_xd/Math.abs(invaders_xd);
    invaders_xd = f*invaders.length/active;
}

function update() {
    if(!paused){
        player.update();
        ufo.update();
        laser.update();
        bomb.update();
        updateInvaders();
    }
    
    document.getElementById("score").innerHTML = player.score;
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