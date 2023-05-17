const NOWHERE = -1000;
let fov = 400;

let objects = [];

let player_img = document.getElementById("car");
let tree_img = document.getElementById("tree");
let floor1_img = document.getElementById("floor1");
let floor2_img = document.getElementById("floor2");

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    
    fov = w/2;
    
    camera = {
        x:0,
        y:0,
        z:-500,
        move:function(x,y,z){
            this.x += x;
            this.y += y;
            this.z += z;
        }
    }
    
    player = {
        x:0,
        y:-180,
        z:500,
        balls:[],
        speed:0,
        score:0,
        hiscore:0,
        img:player_img,
        width:player_img.width,
        height:player_img.height,
        addScore: function(n){
            this.score += n;
            if(this.score > this.hiscore){
                this.hiscore = this.score;
            }
        },
        update: function() {
            let tmp = get2D(this);
            this.img.style.left = tmp.x + "px";
            this.img.style.top = tmp.y + "px";
            this.img.style.width = tmp.width + "px";
            this.img.style.zIndex = 20000 - this.z;
        },
        move: function(x, y, z){
            this.x += x;
            this.y += y;
            this.z += z;
        }
    }
    
    createFloors();
    update();
}

function get2D(obj){
    let x = fov * (obj.x-camera.x)/(obj.z-camera.z) + w/2;
    let y = h/2 - fov * (obj.y-camera.y)/(obj.z-camera.z);
    let width = fov * obj.width/(obj.z-camera.z);
    return {x:x,y:y,width:width};
}

function createFloors(){
    for(let i=0;i<300;i++){
        if(i%30==0){
            addObject("tree",tree_img,-1000,400,i*70+500);
            addObject("tree",tree_img,600,400,i*70+500);
        }
        if(i%20>10){
            addObject("floor1",floor1_img,-500,-300,i*70+500);
        }else{
            addObject("floor2",floor2_img,-500,-300,i*70+500);
        }
    }
    tree_img.remove();
    floor1_img.remove();
    floor2_img.remove();
}

function addObject(name,img,x,y,z){
    let new_img = img.cloneNode();
    document.body.appendChild(new_img);
    let object = {
        name:name,
        x:x,
        y:y,
        z:z,
        img:new_img,
        width:new_img.width,
        update: function() {
            let tmp = get2D(this);
            this.img.style.left = tmp.x + "px";
            this.img.style.top = tmp.y + "px";
            this.img.style.width = tmp.width + "px";
            this.img.style.zIndex = 20000 - this.z;
        }
    }
    objects.push(object);
}

function objectsUpdate(){
    for(let i=0;i<objects.length;i++){
        objects[i].update();
    }
}

function update() {
    player.update();
    player.move(0,0,10);
    objectsUpdate();
    camera.move(-.1,-1,1);
    
    document.getElementById("speed").innerHTML = player.speed;
    document.getElementById("score").innerHTML = player.score;
    document.getElementById("hiscore").innerHTML = "HI: " + player.hiscore;
    
    window.requestAnimationFrame(update);
}

