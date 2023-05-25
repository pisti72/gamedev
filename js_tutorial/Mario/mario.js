const SPEED = 6;
const JUMPFORCE = 14;

const NONE = 0;
const LEFT = 1;
const RIGHT = 2;

const NOWHERE = -1000;
const TILE = 64;
const GRAVITY = 0.4;
const LEVEL = [
'',
'          C                      C',
'  C         ',
'                C                        C',
'     X                 W o' ,
'             oooo        o        P     G',
'             o   o            P        GG',
'     W     WWWWW  o      P            GGG',
'          Woo     o P                GGGG',
'         WWoo          K   o    F   GGGGG                  ',
'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
];

let paused = false;

let blocks = [];

let boy_idle_svg = document.getElementById("boy_idle");
let boy_run1_svg = document.getElementById("boy_run1");
let boy_run2_svg = document.getElementById("boy_run2");
let floor_svg = document.getElementById("floor");
let grey_svg = document.getElementById("grey");
let coin_svg = document.getElementById("coin");
let pipe_svg = document.getElementById("pipe");
let brickwall_svg = document.getElementById("brickwall");
let cloud_svg = document.getElementById("cloud");
let fox_svg = document.getElementById("fox");

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    player = {
        x:w/2,
        y:64*6,
        xd:0,
        yd:0,
        score:0,
        onfloor:true,
        live:true,
        direction:NONE,
        hiscore:0,
        idle:boy_idle_svg,
        run_anim:[boy_run1_svg, boy_run2_svg],
        width:boy_idle_svg.width,
        height:boy_idle_svg.height,
        addScore: function(n){
            this.score += n;
            if(this.score > this.hiscore){
                this.hiscore = this.score;
            }
        },
        zIndex: function(){
            this.idle.style.zIndex=2000;
            this.run_anim[0].style.zIndex=2000;
            this.run_anim[1].style.zIndex=2000;
        },
        put: function(x,y){
            this.x = x;
            this.y = y;
        },
        jump: function(){
            if(this.onfloor){
                this.yd = -JUMPFORCE;
            }
        },
        reset:function(){
            this.x = w/2;
            this.y = h/2;
            this.xd = 0;
            this.yd = 0;
            this.score = 0;
            //this.img.style.transform = "scaleX(1)";
            //this.img.style.transform = "rotate(0deg)";
        },
        update: function(){
            this.yd += GRAVITY;
            this.x += this.xd;
            this.y += this.yd;
            if(this.yd>SPEED){
                this.yd=SPEED;
            }
            
            if(this.x<0){
                this.x = 0;
            }
            
            if(this.direction == LEFT){
                this.xd =-SPEED;
            }else if(this.direction == RIGHT){
                this.xd =SPEED;
            }else{
                this.xd =0;
            }
            
            this.onfloor = false;
            for(let i=0; i<blocks.length; i++){
                //check verical
                let block = blocks[i];
                let letter = block.letter;
                if(letter == "F" || letter == "W" || letter == "G" || letter == "P"){
                    let p={
                        x:this.x,
                        y:this.y + this.yd + GRAVITY,
                        width:this.width,
                        height:this.height
                    }
                    if(overlapped(p,block)){
                        this.yd = 0-GRAVITY;
                        this.onfloor = true;
                    }
                    p.x = this.x + this.xd;
                    p.y = this.y + this.yd;
                    if(overlapped(p,block)){
                        this.xd = 0;
                    }
                }
                
                if(letter == "o" && overlapped(block,this)){
                    block.x = NOWHERE;
                    this.addScore(10);
                }
                
                if(letter == "K" && overlapped(block,this)){
                    this.live = false;
                }
            }
            
            if(this.xd==0){
                this.idle.style.left = this.x - camera.x + "px";
                this.idle.style.top = this.y - camera.y + "px";
                this.run_anim[0].style.left = NOWHERE + "px";
                this.run_anim[1].style.left = NOWHERE + "px";
              
            }else{
                this.idle.style.left = NOWHERE + "px";
                if(this.xd<0){
                    this.idle.style.transform = "scaleX(-1)";
                    this.run_anim[0].style.transform = "scaleX(-1)";
                    this.run_anim[1].style.transform = "scaleX(-1)";
                }
                if(this.xd>0){
                    this.idle.style.transform = "scaleX(1)";
                    this.run_anim[0].style.transform = "scaleX(1)";
                    this.run_anim[1].style.transform = "scaleX(1)";
                }
                let phase = Math.floor(this.x)%64>32;
                this.run_anim[0].style.left = NOWHERE + "px";
                this.run_anim[1].style.left = this.x - camera.x + "px";
                if(phase){
                    this.run_anim[0].style.left = this.x - camera.x + "px";
                    this.run_anim[1].style.left = NOWHERE + "px";;
                }
                
                this.run_anim[0].style.top = this.y - camera.y + "px";
                this.run_anim[1].style.top = this.y - camera.y + "px";
            }
        }
    }
    
    camera = {
        x:0,
        y:0,
        update:function(){
            this.x = player.x - w/2;
            if(this.x<0){
                this.x = 0;
            }
        }
    }
    
    createBlocks();
    player.zIndex();
    update();
}

document.addEventListener('keydown',function(event) {
    if(event.code=="ArrowRight"){
       player.direction = RIGHT;
    }
    if(event.code=="ArrowLeft"){
       player.direction = LEFT;
    }
    if(event.code=="ArrowUp"){
       //player.xd = 0;
       player.jump();
    }
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

document.addEventListener('keyup',function(event) {
    if(event.code=="ArrowRight" || event.code=="ArrowLeft"){
       player.direction = NONE;
    }
});

function createBlocks(){
    for(let j=0; j<LEVEL.length; j++){
        let row = LEVEL[j];
        for(i=0;i<row.length;i++){
            let letter = row.charAt(i);
            let tmp_svg = NaN;
            if(letter == "X"){
                player.put(i*TILE,j*TILE);
            }else if(letter == "P"){
                tmp_svg = pipe_svg.cloneNode(); 
            }else if(letter == "F"){
                tmp_svg = floor_svg.cloneNode(); 
            }else if(letter == "C"){
                tmp_svg = cloud_svg.cloneNode(); 
            }else if(letter == "W"){
                tmp_svg = brickwall_svg.cloneNode(); 
            }else if(letter == "G"){
                tmp_svg = grey_svg.cloneNode(); 
            }else if(letter == "o"){
                tmp_svg = coin_svg.cloneNode(); 
            }
            
            if(letter == "P" || letter == "F" || letter == "C" || letter == "W" || letter == "G" || letter == "o"){
                document.body.appendChild(tmp_svg);
                let x = TILE*i;
                let y = TILE*j;
                if(letter == "o"){
                    x += 16;
                    y += 32;
                }
                let block={
                    letter:letter,
                    img:tmp_svg,
                    x:x,
                    y:y,
                    width:tmp_svg.width,
                    height:tmp_svg.height,
                    update: function(){
                        this.img.style.left = this.x - camera.x + "px";
                        this.img.style.top = this.y - camera.y + "px";
                    }
                }
                blocks.push(block);
            }
        }
        
    }
    floor_svg.remove();
    pipe_svg.remove();
    brickwall_svg.remove();
    cloud_svg.remove();
    grey_svg.remove();
    coin_svg.remove();
}

function updateEnemies(){
    for(let i=0; i<blocks.length; i++){
        let block = blocks[i];
        let letter = block.letter;
        if(letter == "K"){
            
        }
    }
}

function overlapped(a,b){
    return (Math.abs((a.x+a.width/2)-(b.x+b.width/2))<(a.width+b.width)/2) 
        && (Math.abs((a.y+a.height/2)-(b.y+b.height/2))<(a.height + b.height)/2);
}

function updateBlocks(){
    for(let i=0; i<blocks.length; i++){
        blocks[i].update();
    }
}

function update() {
    if(!paused){
        camera.update();
        player.update();
        updateEnemies();
        updateBlocks();
        
    }
    
    document.getElementById("score").innerHTML = player.score+","+blocks.length;
    //document.getElementById("score").innerHTML = camera.x;
    document.getElementById("hiscore").innerHTML = "HI: " + player.hiscore;
    
    window.requestAnimationFrame(update);
}