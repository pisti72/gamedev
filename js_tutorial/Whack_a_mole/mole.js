const HIT_TIME = 10;
const RECOVER = 20;
const ROWS = 3;
const COLUMNS = 4;
const SLEEPING_BASE = 60;
const SLEEPING_MAX = 60;
const STANDING_BASE = 60;
const STANDING_MAX = 60;

let hammer_idle = document.getElementById("hammer_idle");
let hammer_hit = document.getElementById("hammer_hit");
let hole_svg = document.getElementById("hole");
let mole_pain_svg = document.getElementById("mole_pain");
let mole_svg = document.getElementById("mole");

let holes = [];

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    horizontal_grid = w/(COLUMNS+1);
    vertical_grid = h/(ROWS+1);
    
    hammer = {
        x:0,
        y:0,
        hitting:0,
        tired:0,
        score:0,
        hiscore:0
    }
    mole = {
        x:500,
        y:500,
        sleeping:0,
        standing:0,
        suffering:0,
        hammered:false
    }
    
    createHoles();
    findHoleForMole();
    
    update();
}

function createHoles(){
    for(let j=0;j<ROWS;j++){
        for(let i=0;i<COLUMNS;i++){
            let hole={
                x:(i+1)*horizontal_grid-hole_svg.width/2,
                y:(j+1)*vertical_grid-hole_svg.height/2
            }
            holes.push(hole);
            let hole_tmp = hole_svg.cloneNode(); 
            document.body.appendChild(hole_tmp);
            hole_tmp.style.left=hole.x + "px";
            hole_tmp.style.top=hole.y + "px";
            hole_tmp.style.zIndex="-9990";
        }
    }
    hole_svg.remove();
}

function findHoleForMole(){
    let n = rnd(holes.length);
    mole.x = holes[n].x;
    mole.y = holes[n].y-100;
    mole.sleeping = SLEEPING_BASE + rnd(SLEEPING_MAX);
    mole.standing = STANDING_BASE + rnd(STANDING_MAX);
    mole_svg.style.display = "none";
    mole_pain_svg.style.display = "none";
    mole.hammered = false;
}

document.addEventListener('mousemove',function(event) {
    hammer.x = event.pageX;
    hammer.y = event.pageY;
});

document.addEventListener('mousedown',function(event) {
    if(hammer.tired == 0){
        hammer.hitting = HIT_TIME;
        hammer.tired = RECOVER;
        if(mole.standing > 0){
            if(Math.abs(mole.x-hammer.x)<200 && Math.abs(mole.y-hammer.y)<200){
                mole.suffering = 60;
                mole.standing = 0;
                mole.hammered = true;
                hammer.score++;
                if(hammer.score > hammer.hiscore){
                    hammer.hiscore = hammer.score;
                }
            }
        }
    }
});

function rnd(n){
    return Math.floor(Math.random()*n);
}

function update() {
    if(hammer.tired>0){
        hammer.tired--;
    }
    if(hammer.hitting>0){
        hammer.hitting--;
        hammer_idle.style.display = "none";
        hammer_hit.style.display = "block";
    }else{
        hammer_idle.style.display = "block";
        hammer_hit.style.display = "none";
    }
    hammer_idle.style.left = (hammer.x - 50) + "px";
    hammer_idle.style.top = (hammer.y - 200) + "px";
    hammer_hit.style.left = (hammer.x - 100) + "px";
    hammer_hit.style.top = (hammer.y -100) + "px";
    
    if(mole.sleeping>0){
        mole.sleeping--;
        mole_svg.style.display = "none";
    }else{
        if(mole.standing>0){
            mole.standing--;
        }
        if(mole.suffering>0){
            mole.suffering--;
        }
        if(mole.suffering>0){
            mole_pain_svg.style.display = "block";
            mole_svg.style.display = "none";
        }else{
            mole_pain_svg.style.display = "none";
            mole_svg.style.display = "block";
        }
        
        if(mole.suffering==0 && mole.standing==0){
            if(!mole.hammered){
                hammer.score = 0;
            }
            findHoleForMole();
        }
    }
    
    mole_svg.style.left = mole.x + "px";
    mole_svg.style.top = mole.y + "px";
    mole_pain_svg.style.left = mole.x + "px";
    mole_pain_svg.style.top = mole.y + "px";
    
    document.getElementById("score").innerHTML=hammer.score;
    document.getElementById("hiscore").innerHTML=hammer.hiscore;
    
    window.requestAnimationFrame(update);
}