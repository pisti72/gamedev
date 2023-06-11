/*
 *  https://tetris.com/
 *
 */

const NOWHERE = -1000;
const FIELD_HEIGHT = 20;
const FIELD_WIDTH = 10;

const SPEED = 60;

const CLOCKWISE = 0;
const ANTICLOCKWISE = 1;

const DOWN = 0;
const LEFT = 1;
const RIGHT = 2;

let paused = false;

let block_div = document.getElementById("block");
let field_div = document.getElementById("field");

let h = document.body.clientHeight;

let grid = Math.floor((h-40)/FIELD_HEIGHT);

block_div.style.width = (grid-2) + "px";
block_div.style.height = (grid-2) + "px";


let blocks = [];

let field = {
    div:field_div,
    width:FIELD_WIDTH,
    height:FIELD_HEIGHT,
    blocks:[],
    update:function(){
        this.div.style.width = this.width * grid + "px";
        this.div.style.height = this.height * grid + "px";
    },
    init:function(){
        for(let i=0; i<this.blocks.length; i++){
            this.blocks[i].init();
        }
        this.blocks = [];
    },
    add:function(block){
        this.blocks.push(block);
    },
    isFree:function(column,row){
        if(column<0 || column>=this.width){
            return false; 
        }
        if(row>=this.height){
            return false; 
        }
        for(let i=0; i<this.blocks.length; i++){
            let block = this.blocks[i];
            if(column == block.x && row == block.y){
                return false;
            }
        }
        return true;
    },
    checkFilledRows:function(){
        for(let row=0; row<this.height; row++){
            let counter = 0;
            for(let i=0; i<this.blocks.length; i++){
                let block = this.blocks[i];
                if(block.y == row){
                    counter++;
                }
            }
                                
            if(counter == this.width){
                this.clearRow(row);
                this.moveDownAbove(row);
                shape.addScore(1);
            }
        }
    },
    clearRow:function(row){
        for(let i=0; i<this.blocks.length; i++){
            let block = this.blocks[i];
            if(block.y == row){
                block.init();
            }
        }
        for(let j=0;j<20;j++){//while
            for(let i=0; i<this.blocks.length; i++){
                if(!this.blocks[i].isActive()){
                    this.blocks.splice(i,1);
                }
            }
        }
    },
    moveDownAbove:function(row){
        console.log("Move down above "+row);
        for(let i=0; i<this.blocks.length; i++){
            let block = this.blocks[i];
            if(block.y < row){
                block.y++;
                block.update();
            }
        }
    }
}

field.update();

let shape = {
    score:0, /* https://tetris.wiki/Scoring */
    hiscore:0,
    tick:0,
    x:0,
    y:0,
    rotation:0,
    svgs:[],
    pieces:[],
    addScore: function(n){
        this.score += n;
        if(this.score > this.hiscore){
            this.hiscore = this.score;
        }
    },
    move:function(direction){
        //check before moving
        if(direction==DOWN){
            this.y++;
            if(!this.probe()){
                this.y--;
                this.copyToField();
                field.checkFilledRows();
                this.set(rnd(TETROMINO.length));
            }
        }else if(direction==LEFT){
            this.x--;
            if(!this.probe()){
                this.x++;
            }
        }else if(direction==RIGHT){
            this.x++;
            if(!this.probe()){
                this.x--;
            }
        }
    },
    rotate:function(rot){
        let original = this.rotation;
        if(rot==CLOCKWISE){
            this.rotation++;
        }else{
            this.rotation--;
        }

        if(this.rotation < 0){
            this.rotation = this.pieces.blocks.length-1;
        }else if(this.rotation > this.pieces.blocks.length-1){
            this.rotation = 0;
        }
        
        if(!this.probe()){
            this.rotation = original;
        }
    },
    set:function(n){
        this.x = 4;
        this.y = 0;
        this.rotation = 0;
        this.svgs = [];
        this.pieces = TETROMINO[n%TETROMINO.length];
        let rotation = this.rotation%this.pieces.blocks.length;
        if(!this.probe()){
            field.init();
            this.score = 0;
        }
        for(let j=0; j<this.pieces.blocks[rotation].length; j++){
            let row = this.pieces.blocks[rotation][j];
            for(let i=0; i<row.length; i++){
                let letter = row.charAt(i);
                if(letter == "X"){
                    let block = getBlock();
                    block.color = this.pieces.color;
                    block.put(i+this.x, j+this.y);
                    this.svgs.push(block);
                } 
            }
        }
    },
    probe:function(){
        for(let j = 0; j < this.pieces.blocks[this.rotation].length; j++){
            let row = this.pieces.blocks[this.rotation][j];
            for(let i=0; i<row.length; i++){
                let letter = row.charAt(i);
                if(letter == "X"){
                    if (!field.isFree(i + this.x, j + this.y)){
                        return false;
                    }
                } 
            }
        }
        return true;
    },
    copyToField:function(){
        let n = 0;
        for(let j = 0; j < this.pieces.blocks[this.rotation].length; j++){
            let row = this.pieces.blocks[this.rotation][j];
            for(let i=0; i<row.length; i++){
                let letter = row.charAt(i);
                if(letter == "X"){
                    let block = this.svgs[n++];
                    block.put(i+this.x, j+this.y);
                    field.add(block);
                } 
            }
        }
    },
    update:function(){
        this.tick++;
        if(this.tick > SPEED){
            this.tick = 0;
            this.move(DOWN);
        }
        let n = 0;
        for(let j = 0; j < this.pieces.blocks[this.rotation].length; j++){
            let row = this.pieces.blocks[this.rotation][j];
            for(let i=0; i<row.length; i++){
                let letter = row.charAt(i);
                if(letter == "X"){
                    let block = this.svgs[n++];
                    block.put(i+this.x,j+this.y);
                    block.update();
                } 
            }
        }
        
    }
}



createBlocks();
shape.set(rnd(TETROMINO.length));

update();

function getBlock(){
    for(let i=0;i<blocks.length;i++){
        let block = blocks[i];
        if(!block.isActive()){
            return block;
        }
    }
}

function createBlocks(){
    for(let i=0; i<500; i++){
        let svg = block_div.cloneNode(); 
        field_div.appendChild(svg);
        let block={
            x:NOWHERE,
            y:0,
            color:"red",
            svg:svg,
            update:function(){
                this.svg.style.left = this.x * grid + "px";
                this.svg.style.top = this.y *grid + "px";
                this.svg.style.backgroundColor = this.color;
            },
            put:function(x,y){
                this.x = x;
                this.y = y;
            },
            init:function(){
                this.x = NOWHERE;
                this.y = 0;
                this.update();
            },
            isActive:function(){
                return (this.x != NOWHERE);
            }
        }
        block.init();
        blocks.push(block);
    }
    
    block_div.remove();
    
}

document.addEventListener('keydown',function(event) {
    if(event.code=="ArrowRight"){
       shape.move(RIGHT);
    }
    if(event.code=="ArrowLeft"){
       shape.move(LEFT);
    }
    if(event.code=="ArrowDown"){
       shape.move(DOWN);
    }
    if(event.code=="ArrowUp"){
       shape.rotate(CLOCKWISE);
    }
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

function update(){
    if(!paused){
        shape.update();
    }
    for(let i=0;i<blocks.length;i++){
        blocks[i].update();
    }
    document.getElementById("score").innerHTML = shape.score;
    document.getElementById("hiscore").innerHTML = "HI: " + shape.hiscore;
    requestAnimationFrame(update);
}

function rnd(n){
    return Math.floor(Math.random()*n);
}

