const SPEED = 3;
const NOWHERE = -1000;

const NONE = 0;
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;

const COLUMNS = 25;
const ROWS = 11;

const LEVEL = [
    {command:"W",x:0,y:1,width:COLUMNS,height:1},
    {command:"W",x:0,y:1,width:1,height:ROWS},
    {command:"W",x:2,y:3,width:7,height:1},
    {command:"W",x:10,y:1,width:1,height:5},
    {command:"W",x:12,y:3,width:1,height:7},
    {command:"W",x:0,y:5,width:3,height:1},
    {command:"W",x:6,y:5,width:5,height:1},
    {command:"W",x:4,y:3,width:1,height:3},
    
    {command:"E",x:1,y:2},
    {command:"P",x:2,y:2},
];

let paused = false;
let grid = 0;

let walls = [];
let dots = [];
let enemies = [];

let enemy_svg       = document.getElementById("enemy");
let dotman_idle_svg = document.getElementById("dotman_idle");
let dotman_eating_svg = document.getElementById("dotman_eating");
let wall_div        = document.getElementById("wall");
let dot_div        = document.getElementById("dot");

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    grid = Math.floor(w/COLUMNS);
    //dotman_idle_svg.style.width = grid * 0.8 + "px";
    dotman_idle_svg.style.height = grid * 0.7 + "px";
    enemy_svg.width = grid * 0.7;
    //dot_div.style.height = "20px";
    //console.log("thius" + dot_div.height);
    //dotman_idle_svg.style.width = grid * 0.8 + "px";
    dotman_eating_svg.style.height = grid * 0.7 + "px";
    
    player = {
        name : "player",
        x:w/2,
        y:h/2,
        direction:NONE,
        xd:0,
        yd:0,
        length:0,
        score:0,
        hiscore:0,
        img:dotman_idle_svg,
        width:dotman_idle_svg.width,
        height:dotman_idle_svg.height,
        addScore: function(n){
            this.score += n;
            if(this.score > this.hiscore){
                this.hiscore = this.score;
            }
        },
        get:function(){
            let column = Math.floor(this.x/grid);
            let row = Math.floor(this.y/grid);
            return column + ","+row;
        },
        put:function(x,y){
            this.x = grid * x;
            this.y = grid * y;
        },
        reset:function(){
            this.x = w/2;
            this.y = h/2;
            this.direction = NONE;
            this.xd = 0;
            this.yd = 0;
            this.score = 0;
            this.coords = [];
            this.dots = 0;
            this.img.style.transform = "scaleX(1)";
            this.img.style.transform = "rotate(0deg)";
        },
        update: function(){
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
            this.x += this.xd;
            this.y += this.yd;
            
            
            if(checkCollitionWithWalls(this)){
                this.x -= this.xd;
                this.y -= this.yd;
                this.direction = NONE;
            }
                        
            if(this.xd != 0 || this.yd != 0){
                this.length++;
            }
            
            
            if(this.length%20 > 10){
                dotman_idle_svg.style.left = NOWHERE + "px";
                this.img = dotman_eating_svg;
            }else{
                dotman_eating_svg.style.left = NOWHERE + "px";
                this.img = dotman_idle_svg;
            }
            
            this.img.style.left = this.x + "px";
            this.img.style.top = this.y + "px";
        }
    }
    
    createLevel();
    update();
}

document.addEventListener('keydown',function(event) {
    if(event.code=="ArrowRight"){
        player.direction = RIGHT;
    }
    if(event.code=="ArrowLeft"){
        player.direction = LEFT;
    }
    if(event.code=="ArrowDown"){
        player.direction = DOWN;
    }
    if(event.code=="ArrowUp"){
        player.direction = UP;
    }
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

function checkCollitionWithWalls(obj){
    let collied = false;
    for(let i=0;i<walls.length;i++){
        if(overlapped(walls[i],obj)){
            collied = true;
        }
    }    
    return collied;
}

function checkCollitionWithDots(){
    for(let i=0;i<dots.length;i++){
        if(overlapped(dots[i],player)){
            dots[i].hide();
        }
    }
}

function createLevel(){
    for(let i=0;i<LEVEL.length;i++){
        let data = LEVEL[i];
        if(data.command == "W"){
            createWall(data.x, data.y, data.width, data.height);
            createWall(COLUMNS-data.x-data.width,data.y, data.width, data.height);
            createWall(data.x, ROWS +2 - data.y - data.height, data.width, data.height);
            createWall(COLUMNS-data.x-data.width, ROWS +2- data.y - data.height, data.width, data.height);
        }else if(data.command == "P"){
            player.put(data.x,data.y);
        }else if(data.command == "E"){
            createEnemy(enemy_svg,data.x,data.y);
            createEnemy(enemy_svg,COLUMNS - 1 - data.x,data.y);
            createEnemy(enemy_svg,data.x,ROWS + 1 - data.y);
            createEnemy(enemy_svg,COLUMNS - 1 - data.x,ROWS + 1 - data.y);
        }
    }
    createDots();
    
    enemy_svg.remove();
    wall_div.remove();
}

function createWall(x,y,width,height){
     let div = wall_div.cloneNode(); 
    document.body.appendChild(div);
    
    let wall = {
        name : "wall",
        img:div,
        x : grid * x,
        y : grid * y,
        width : grid * width,
        height : grid * height,
        update:function(){
            this.img.style.left = this.x + "px";
            this.img.style.top = this.y + "px";
            this.img.style.width = this.width - 8 + "px";
            this.img.style.height = this.height - 8 + "px";
        }
    }
    wall.update();
    walls.push(wall);
}

function createDots(){
    for(let j=1;j<ROWS;j++){
        for(let i=0;i<COLUMNS;i++){
            let dot = {
                name:"dot",
                width : 20,
                height : 20,
                x : grid * i + grid/2 ,
                y : grid * j + grid/2 ,
                update:function(){
                    this.img.style.left = this.x - this.width/2 + "px";
                    this.img.style.top = this.y - this.height/2 + "px";
                },
                hide:function(){
                    this.x = NOWHERE;
                    this.update();
                }
            }
            
            if(!checkCollitionWithWalls(dot)){
                let div = dot_div.cloneNode(); 
                document.body.appendChild(div);
                dot.img = div;
                dot.update();
                dots.push(dot);
            }
        }
    }
    dot_div.remove();
}

function createEnemy(source_svg,x,y){
    let svg = source_svg.cloneNode(); 
    document.body.appendChild(svg);
    
    let enemy = {
        img : svg,
        direction:RIGHT,
        x : grid * x,
        y : grid * y,
        width : source_svg.width,
        height : source_svg.height,
        update: function(){
            const directions = [LEFT,RIGHT,UP,DOWN];
            if(this.direction == NONE){
                this.xd = 0;
                this.yd = 0;
                this.direction=directions[rnd(directions.length)];
            }else if(this.direction == LEFT){
                this.xd = -SPEED;
                this.yd = 0;
            }else if(this.direction == RIGHT){
                this.xd = SPEED;
                this.yd = 0;
            }else if(this.direction == UP){
                this.xd = 0;
                this.yd = -SPEED;
            }else if(this.direction == DOWN){
                this.xd = 0;
                this.yd = SPEED;
            }
            this.x += this.xd;
            this.y += this.yd;
            
            
            if(checkCollitionWithWalls(this)){
                this.x -= this.xd;
                this.y -= this.yd;
                this.direction = NONE;
            }
            this.img.style.left = this.x + "px";
            this.img.style.top = this.y + "px";
        },
        hide:function(){
            this.x = NOWHERE;
            this.update();
        }
    }
    enemies.push(enemy);
}

function resetGame(){
    player.reset();
    for(let i=0;i<dots.length;i++){
        dots[i].hide();
    }
}

function updateEnemy(){
    for(let i=0;i<enemies.length;i++){
        enemies[i].update();
    }
}

function update() {
    if(!paused){
        player.update();
        updateEnemy();
        checkCollitionWithDots();
    }

    document.getElementById("score").innerHTML = player.get();
    document.getElementById("hiscore").innerHTML = "HI: " + player.hiscore;
    
    window.requestAnimationFrame(update);
}
function overlapped(a,b){
    if(b.name == "dot"){
        //console.log(b.height);
    }
    
    return (Math.abs((a.x+a.width/2)-(b.x+b.width/2))<(a.width+b.width)/2) 
        && (Math.abs((a.y+a.height/2)-(b.y+b.height/2))<(a.height + b.height)/2);
}

function rnd(n){
    return Math.floor(Math.random()*n);
}