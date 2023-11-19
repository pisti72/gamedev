/*
 * https://en.wikipedia.org/wiki/Snake_(video_game_genre)
 *
 */
const SPEED = 6;
const NOWHERE = -1000;
const MAX_SEGMENTS = 1000;
const OVERLAP_FACTOR = 0.9;
const APPLE_SLEEPING_MIN = 180;
const APPLE_SLEEPING_RANDOM = 180;

let paused = false;

let dots = [];

let head_svg = document.getElementById("head");
let segment_svg = document.getElementById("segment");
let apple_svg = document.getElementById("apple");

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    player = {
        x:w/2,
        y:h/2,
        xd:SPEED,
        yd:0,
        dots:0,
        score:0,
        hiscore:0,
        img:head_svg,
        width:head_svg.width,
        height:head_svg.height,
        addScore: function(n){
            this.score += n;
            if(this.score > this.hiscore){
                this.hiscore = this.score;
            }
        },
        move: function (){
            this.x += this.xd;
            this.y += this.yd;
        },
        coords:[],
        addCoord:function(){
            let coord = {
                x:this.x,
                y:this.y
            }
            this.coords.push(coord);
        },
        getCoord:function(n){
            return this.coords[n];
        },
        reset:function(){
            this.x = w/2;
            this.y = h/2;
            this.xd = SPEED;
            this.yd = 0;
            this.score = 0;
            this.coords = [];
            this.dots = 0;
            this.img.style.transform = "scaleX(1)";
            this.img.style.transform = "rotate(0deg)";
        },
        update: function(){
            head_svg.style.left = this.x + "px";
            head_svg.style.top = this.y + "px";
        }
    }
    
    apple = {
        x:NOWHERE,
        y:0,
        width:apple_svg.width,
        height:apple_svg.height,
        sleeping:APPLE_SLEEPING_MIN,
        reset: function(){
            this.x = NOWHERE;
            this.sleeping = APPLE_SLEEPING_MIN + rnd(APPLE_SLEEPING_RANDOM);
        },
        update: function(){
            if(this.sleeping>0){
                this.sleeping--;
            }else{
                this.putApple();
            }
            apple_svg.style.left = this.x + "px";
            apple_svg.style.top = this.y + "px";
        },
        putApple: function(){
            if(this.x == NOWHERE){
                this.x = rnd(w - this.width);
                this.y = rnd(h - this.height);
            }
        }
    }
    createDots();
    update();
}

document.addEventListener('keydown',function(event) {
    if(event.code=="ArrowRight"){
       player.xd = SPEED;
       player.yd = 0;
       player.img.style.transform = "scaleX(1)";
    }
    if(event.code=="ArrowLeft"){
       player.xd = -SPEED;
       player.yd = 0;
       player.img.style.transform = "scaleX(-1)";
    }
    if(event.code=="ArrowDown"){
       player.xd = 0;
       player.yd = SPEED;
       player.img.style.transform = "rotate(90deg)";
    }
    if(event.code=="ArrowUp"){
       player.xd = 0;
       player.yd = -SPEED;
       player.img.style.transform = "rotate(-90deg)";
    }
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

function createDots(){
    for(let i=0;i<MAX_SEGMENTS;i++){
        let dot={
            x:NOWHERE,
            y:0,
            index:0
        }
        
        let segment_tmp = segment_svg.cloneNode(); 
        document.body.appendChild(segment_tmp);

        segment_tmp.style.zIndex=MAX_SEGMENTS-i;
        
        dot.img = segment_tmp;
        dot.img.style.left = dot.x + "px";
        dot.img.style.top = dot.y + "px";
        dots.push(dot);
    }
    segment_svg.remove();
    head_svg.style.zIndex=MAX_SEGMENTS+1;
}

function resetGame(){
    player.reset();
    for(let i=0;i<dots.length;i++){
        let dot = dots[i];
        dot.img.style.left = NOWHERE + "px";
    }
    apple.reset();
}

function update() {
    if(!paused){
        player.move();
        player.addCoord();
        player.update();
        apple.update();
    }
    
    for(let i=0;i<player.dots;i++){
        let dot = dots[i];
        let n = Math.floor(player.coords.length - (i+1)*SPEED*2.5);
        let coord = player.getCoord(n);
        dot.img.style.left = coord.x + "px";
        dot.img.style.top = coord.y + "px";
        if(i>=1 && overlapped(coord)){
            resetGame();
            break;
        }
    }
    
    if(player.x + player.width > w || player.x < 0 || player.y + player.height > h || player.y<0){
        resetGame();
    }
    
    if(overlapped(apple)){
        player.addScore(1);
        player.dots++;
        apple.reset();
    }

    document.getElementById("score").innerHTML = player.score;
    document.getElementById("hiscore").innerHTML = "HI: " + player.hiscore;
    
    window.requestAnimationFrame(update);
}

function overlapped(obj){
    return (Math.abs(player.x - obj.x) < player.width * OVERLAP_FACTOR) && 
    (Math.abs(player.y - obj.y) < player.height * OVERLAP_FACTOR);
}

function rnd(n){
    return Math.floor(Math.random()*n);
}