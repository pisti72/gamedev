let SPEED = 4
let paused = false

let dragoncat_img = document.getElementById("dragoncat")
let wall_div = document.getElementById("wall")

let actors = []
let walls = []
let map = [[1,0,1,0,1,0,1]]

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    dragoncat_img.style.width="100px"
    createActor("player",dragoncat_img,0,0);
    createWall(20,40,400,20);
    createWall(20,80,400,20);
    wall_div.remove()
    dragoncat_img.remove()
    update();
}

document.addEventListener('keydown',function(event) {
    let player = getActorByName("player")
    if(event.code=="ArrowRight"){
       player.xd = SPEED
       player.yd = 0
    }
    if(event.code=="ArrowLeft"){
       player.xd = -SPEED
       player.yd = 0
    }
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

document.addEventListener('keyup',function(event) {
    let player = getActorByName("player")
    if(event.code=="ArrowRight" || event.code=="ArrowLeft"){
       player.xd = 0
    }
});

function createWall(x,y,w,h){
    let tmp_div = wall_div.cloneNode(); 
    document.body.appendChild(tmp_div);
    let wall={
        x:x,
        y:y,
        w:w,
        h:h,
        div:tmp_div,
    }
    //tmp_img.style.zIndex=MAX_SEGMENTS-i;
    wall.div.style.backgroundColor="#22F"
    wall.div.style.left = wall.x + "px";
    wall.div.style.top = wall.y + "px";
    wall.div.style.width = wall.w + "px";
    wall.div.style.height = wall.h + "px";
    walls.push(wall);
}

function createActor(name,img,x,y){
   let tmp_img = img.cloneNode(); 
   document.body.appendChild(tmp_img);
   let actor={
        name:name,
        img:tmp_img,
        x:x,
        y:y,
        xd:0,
        yd:0,
        update:function(){
            this.x += this.xd
            this.y += this.yd
            this.img.style.left = this.x + "px";
            this.img.style.top = this.y + "px";
       }
   }
   actor.update()
   actors.push(actor)
}

function getActorByName(name){
    for(let i=0;i<actors.length;i++){
        let a=actors[i]
        if(a.name==name){
            return a;
        }
    }
}

function rnd(n){
    return Math.floor(Math.random()*n);
}

function update() {
    if(!paused){
        for(let i=0;i<actors.length;i++){
            let a=actors[i]
            a.update()
        }
    }

    window.requestAnimationFrame(update);
}