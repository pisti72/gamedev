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
let field1_div = document.getElementById("field1");
let field2_div = document.getElementById("field2");

let h = document.body.clientHeight;

let grid = Math.floor((h-40)/FIELD_HEIGHT);

block_div.style.width = (grid-2) + "px";
block_div.style.height = (grid-2) + "px";

let fields = [];
let shapes = [];

createField(field1_div);
createField(field2_div);
fields[0].opponent = fields[1];
fields[1].opponent = fields[0];
fields[0].name = "Left Player";
fields[1].name = "Right Player";

createShape(fields[0]);
createShape(fields[1]);
shapes[0].opponent = shapes[1];
shapes[1].opponent = shapes[0];

block_div.remove();

function createField(div){
    let field = {
        name:"undefined",
        div:div,
        matchpoint:0,
        score:0,
        opponent:{},
        width:FIELD_WIDTH,
        height:FIELD_HEIGHT,
        freeblocks:[],
        blocks:[],
        addScore: function(n){
            this.score += n;
        },
        increaseMatch: function(){
            this.matchpoint++;
        },
        increaseOpponentMatch: function(){
            this.opponent.increaseMatch();
        },
        update:function(){
            for(let i=0;i<this.freeblocks.length;i++){
                this.freeblocks[i].update();
            }
            this.div.style.width = this.width * grid + "px";
            this.div.style.height = this.height * grid + "px";
        },
        init:function(){
            for(let i=0; i<this.blocks.length; i++){
                this.blocks[i].init();
            }
            this.blocks = [];
            this.score = 0;
        },
        initOpponent: function(){
            this.opponent.init();
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
        checkFilledRowsAt:function(row){
            let counter = 0;
            for(let i=0; i<this.blocks.length; i++){
                let block = this.blocks[i];
                if(block.y == row){
                    counter++;
                }
            }
                                
            if(counter == this.width){
                console.log(this.name + " filled row : " + row);
                this.copyRowToOpponent(row);
                this.moveDownAbove(row);
                this.opponent.moveUpAbove();
                this.addScore(1);
            }
        },
        copyRowToOpponent:function(row){
            let newblocks = [];
            for(let i=0; i<this.blocks.length; i++){
                let block = this.blocks[i];
                if(block.y == row){
                    let newblock = this.opponent.getBlock();
                    newblock.color = block.color;
                    newblock.put(block.x, this.height);
                    this.opponent.add(newblock);
                    block.init();
                }else{
                    newblocks.push(block);
                }
            }
            this.blocks = newblocks;
        },
        moveDownAbove:function(row){
            for(let i=0; i<this.blocks.length; i++){
                let block = this.blocks[i];
                if(block.y < row){
                    block.y++;
                    block.update();
                }
            }
        },
        moveUpAbove:function(){
            for(let i=0; i<this.blocks.length; i++){
                let block = this.blocks[i];
                block.y--;
                block.update();
            }
        },
        createBlocks: function(){
            for(let i=0; i<500; i++){
                let svg = block_div.cloneNode(); 
                this.div.appendChild(svg);
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
                this.freeblocks.push(block);
            }
        },
        getBlock: function(){
            for(let i=0;i<this.freeblocks.length;i++){
                let block = this.freeblocks[i];
                if(!block.isActive()){
                    return block;
                }
            }
        }
    }
    field.createBlocks();
    field.update();
    fields.push(field);
}


function createShape(field){
    let shape = {
        tick:0,
        field:field,
        opponent:{},
        x:0,
        y:0,
        rotation:0,
        svgs:[],
        pieces:[],
        move:function(direction){
            //check before moving
            if(direction==DOWN){
                this.y++;
                if(!this.probe()){
                    this.y--;
                    this.copyToField();
                    
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
                this.field.init();
                this.field.initOpponent();
                this.field.increaseOpponentMatch();
                this.set(rnd(TETROMINO.length));
                this.opponent.x=4;
                this.opponent.y=0;
                //set(rnd(TETROMINO.length));
            }
            for(let j=0; j<this.pieces.blocks[rotation].length; j++){
                let row = this.pieces.blocks[rotation][j];
                for(let i=0; i<row.length; i++){
                    let letter = row.charAt(i);
                    if(letter == "X"){
                        let block = this.field.getBlock();
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
                        if (!this.field.isFree(i + this.x, j + this.y)){
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
                        block.update();
                        this.field.add(block);
                    } 
                }
                this.field.checkFilledRowsAt(j+this.y);
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
    
    shape.set(rnd(TETROMINO.length));
    shapes.push(shape);
}

update();

document.addEventListener('keydown',function(event) {
    if(event.code=="KeyD"){
        shapes[0].move(RIGHT);
    }
    if(event.code=="KeyA"){
        shapes[0].move(LEFT);
    }
    if(event.code=="KeyS"){
        shapes[0].move(DOWN);
    }
    if(event.code=="KeyW"){
        shapes[0].rotate(CLOCKWISE);
    }
    
    if(event.code=="ArrowRight"){
        shapes[1].move(RIGHT);
    }
    if(event.code=="ArrowLeft"){
        shapes[1].move(LEFT);
    }
    if(event.code=="ArrowDown"){
        shapes[1].move(DOWN);
    }
    if(event.code=="ArrowUp"){
        shapes[1].rotate(CLOCKWISE);
    }
    
    if(event.code=="KeyP"){
        paused = !paused;
    }
});

function update(){
    if(!paused){
        shapes[0].update();
        shapes[1].update();
    }
    
    document.getElementById("message1").innerHTML = fields[0].matchpoint + " : " + fields[0].score;
    document.getElementById("message2").innerHTML = fields[1].matchpoint + " : " + fields[1].score;;
    requestAnimationFrame(update);
}

function rnd(n){
    return Math.floor(Math.random()*n);
}

