const SPEED = 6;
const NOWHERE = -1000;
const MAX_SEGMENTS = 1000;
const OVERLAP_FACTOR = 0.9;
const APPLE_SLEEPING_MIN = 180;
const APPLE_SLEEPING_RANDOM = 180;

const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;

const TITLE = 0;
const INGAME = 1;
const GAMEOVER = 2;

let state = TITLE;
let message = "Snake for 2 Players";
let paused = false;

let dots = [];
let players = [];

let head_svg = document.getElementById("head");
let segment_svg = document.getElementById("segment");
let head_blue_svg = document.getElementById("head_blue");
let segment_blue_svg = document.getElementById("segment_blue");
let apple_svg = document.getElementById("apple");

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
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
            if(this.x == NOWHERE && state == INGAME){
                this.x = rnd(w - this.width);
                this.y = rnd(h - this.height);
            }
        }
    }
    createPlayers(2);
    players[1].img = head_blue_svg;
    players[0].createSegments(segment_svg);
    players[1].createSegments(segment_blue_svg);
    players[0].name = "Green";
    players[1].name = "Blue";
    resetGame();
    update();
}

document.addEventListener('keydown',function(event) {
    if(event.code=="ArrowRight"){
       players[0].direction = RIGHT;
    }
    if(event.code=="ArrowLeft"){
       players[0].direction = LEFT;
    }
    if(event.code=="ArrowDown"){
       players[0].direction = DOWN;
    }
    if(event.code=="ArrowUp"){
       players[0].direction = UP;
    }
    
    if(event.code=="KeyD"){
       players[1].direction = RIGHT;
    }
    if(event.code=="KeyA"){
       players[1].direction = LEFT;
    }
    if(event.code=="KeyS"){
       players[1].direction = DOWN;
    }
    if(event.code=="KeyW"){
       players[1].direction = UP;
    }
    
    if(state == TITLE || state == GAMEOVER){
        resetGame();
        players[0].direction = RIGHT;
        players[1].direction = LEFT;
        message = "";
        state = INGAME;
    }
    
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

function createPlayers(n){
    for(let i=0;i<n;i++){
        player = {
            name:"Undefined",
            x:w/2,
            y:h/2,
            xd:0,
            yd:0,
            direction:NONE,
            numberOfSegments:0,
            score:0,
            hiscore:0,
            img:head_svg,
            width:head_svg.width,
            height:head_svg.height,
            segments:[],
            createSegments: function(svg){
                for(let i=0;i<MAX_SEGMENTS;i++){
                    let segment={
                        x:NOWHERE,
                        y:0,
                        index:0
                    }
                    
                    let segment_tmp = svg.cloneNode(); 
                    document.body.appendChild(segment_tmp);
                    segment_tmp.style.zIndex=MAX_SEGMENTS-i;
                    
                    segment.img = segment_tmp;
                    segment.img.style.left = segment.x + "px";
                    segment.img.style.top = segment.y + "px";
                    this.segments.push(segment);
                }
                svg.remove();
                this.img.style.zIndex = MAX_SEGMENTS+1;
            },
            addScore: function(n){
                this.score += n;
                if(this.score > this.hiscore){
                    this.hiscore = this.score;
                }
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
            reset:function(x,y){
                this.x = x;
                this.y = y;
                this.xd = 0;
                this.direction = NONE;
                this.yd = 0;
                this.score = 0;
                this.coords = [];
                this.numberOfSegments = 0;
                for(let i=0;i<this.segments.length;i++){
                    let segment = this.segments[i];
                    segment.x = NOWHERE;
                    segment.y = 0;
                    segment.img.style.left = segment.x + "px";
                }
            },
            checkCollitionWith: function(obj) {
                for(let i=0;i<this.numberOfSegments;i++){
                    let segment = this.segments[i];
                    if(overlapped(obj,segment)){
                        message = obj.name + " player collied with!";
                        state = GAMEOVER;
                    }
                }
            },
            update: function(){
                if(state == INGAME){
                    this.x += this.xd;
                    this.y += this.yd;
                }
                
                
                for(let i=0;i<this.numberOfSegments;i++){
                    let segment = this.segments[i];
                    let n = Math.floor(this.coords.length - (i+1)*SPEED*2.5);
                    let coord = this.getCoord(n);
                    segment.x = coord.x;
                    segment.y = coord.y;
                    segment.img.style.left = segment.x + "px";
                    segment.img.style.top = segment.y + "px";
                    if(i>=1 && overlapped(this,coord)){
                        message = this.name + " player eaten himself!";
                        state = GAMEOVER;
                        break;
                    }
                }
                
                if(this.x + this.width > w || this.x < 0 || this.y + this.height > h || this.y<0){
                    message = this.name + " player left the arena!";
                    state = GAMEOVER;
                }
                
                if(overlapped(this,apple)){
                    this.addScore(1);
                    this.numberOfSegments++;
                    apple.reset();
                }
                
                if(this.direction == NONE){
                    this.xd = 0;
                    this.yd = 0;
                    this.img.style.transform = "scaleX(1)";
                    this.img.style.transform = "rotate(0deg)";
                }else if(this.direction == LEFT){
                    this.xd = -SPEED;
                    this.yd = 0;
                    this.img.style.transform = "scaleX(-1)";
                }else if(this.direction == RIGHT){
                    this.xd = SPEED;
                    this.yd = 0;
                    this.img.style.transform = "scaleX(1)";
                }else if(this.direction == UP){
                    this.xd = 0;
                    this.yd = -SPEED;
                    this.img.style.transform = "rotate(-90deg)";
                }else if(this.direction == DOWN){
                    this.xd = 0;
                    this.yd = SPEED;
                    this.img.style.transform = "rotate(90deg)";
                }
                this.img.style.left = this.x + "px";
                this.img.style.top = this.y + "px";
            }
        }
        players.push(player);
    }
}

function checkCollitionsWithOpponent(){
    players[0].checkCollitionWith(players[1]);
    players[1].checkCollitionWith(players[0]);
}

function resetGame(){
    players[0].reset(w/2 + 100, h/2);
    players[1].reset(w/2 - 100, h/2);
    apple.reset();
}

function update() {
    if(!paused){
        if(state==INGAME){
            players[0].addCoord();
            players[1].addCoord();
            
            checkCollitionsWithOpponent();
        }
        apple.update();
        players[0].update();
        players[1].update();
    }

    document.getElementById("p1").innerHTML = players[0].score;
    document.getElementById("p2").innerHTML = players[1].score;
    document.getElementById("message").innerHTML = message;
    window.requestAnimationFrame(update);
}

function overlapped(a,b){
    return (Math.abs(a.x - b.x) < a.width * OVERLAP_FACTOR) && 
    (Math.abs(a.y - b.y) < a.height * OVERLAP_FACTOR);
}

function rnd(n){
    return Math.floor(Math.random()*n);
}