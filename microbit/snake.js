const DEBUG = false;
//const DEBUG = true;
const WIDTH = 600;
const HEIGHT = 400;
const TOP = 70;
const LEFT = 90;
const SPACE_W = 24;
const SPACE_H = 23;
const ON = 1;
const OFF = 0;

const KEY_SPACE = 32;
const KEY_P = 80;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_ESC = 27;
const KEY_ENTER = 13;

const TITLE = 0;
const INGAME = 1;
const GAMEOVER = 2;

const TITLE_TXT= [
    '.WWW..WWWW...WWW..WW.WW..WWWW....',
    'WW....WW.WW.WW.WW.WW.WW.WW.......',
    '.WWW..WW.WW.WW.WW.WWWW..WWWW.....',
    '...WW.WW.WW.WWWWW.WW.WW.WW.......',
    'WWWW..WW.WW.WW.WW.WW.WW..WWWW....'
    ];
    
const GAMEOVER_TXT= [
    '.WWWW..WWW..WWW.WWW..WWWW....WWW..WW.WW..WWWW.WWWW.....',
    'WW....WW.WW.WWWWWWW.WW......WW.WW.WW.WW.WW....WW.WW....',
    'WW.WW.WW.WW.WW.W.WW.WWWW....WW.WW.WW.WW.WWWW..WWWW.....',
    'WW.WW.WWWWW.WW...WW.WW......WW.WW..WWW..WW....WW.WW....',
    '.WWWW.WW.WW.WW...WW..WWWW....WWW....W....WWWW.WW.WW....'
    ];

const DIRECTIONS = [
        {xd:1,yd:0},
        {xd:0,yd:1},
        {xd:-1,yd:0},
        {xd:0,yd:-1}
    ];
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let img_board = new Image();
let img_light = new Image();
let led = [];
let snake={
    direction:0,
    tail:[{x:0,
    y:0}]}
let t = 0;
let state = TITLE;

img_board.src = "assets/board.png";
img_light.src = "assets/light.png";

document.getElementById("light");

window.addEventListener('resize',function(e){
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
});

document.addEventListener('keydown',function(e){
    
    if(e.which == KEY_D){
        snake.direction++;
        if(snake.direction > DIRECTIONS.length-1){
            snake.direction = 0;
        }
    }else if(e.which == KEY_A){
        snake.direction--;
        if(snake.direction<0){
            snake.direction = DIRECTIONS.length-1;
        }
    }
});

canvas.width = WIDTH;
canvas.height = HEIGHT;

update();

function update(){
    if(t%20 == 0){
        snake.tail[0].x+=DIRECTIONS[snake.direction].xd;
        snake.tail[0].y+=DIRECTIONS[snake.direction].yd;
        if(snake.tail[0].x < 0){
            snake.tail[0].x = 4;
        }
        if(snake.tail[0].y < 0){
            snake.tail[0].y = 4;
        }
        snake.tail[0].x = snake.tail[0].x % 5;
        snake.tail[0].y = snake.tail[0].y % 5;
        
        //cls();
        for(let i=snake.tail.length; i>0; i--){
            snake.tail[i+1] = snake.tail[i];
        }
        off()
        on(snake.x,snake.y);
    }
    let offset_x = Math.floor(canvas.width - img_board.width)/2;
    let offset_y = Math.floor(canvas.height - img_board.height)/2;
    ctx.drawImage(img_board,offset_x,offset_y);
    for(let i=0;i<25;i++){
        if(led[i] == ON){
            ctx.drawImage(img_light, offset_x + LEFT + (i%5)*SPACE_W, offset_y + TOP + Math.floor(i/5) * SPACE_H);
        }
    }
    t++;
    window.requestAnimationFrame(update);
    
}

function cls(){
    for(let i=0;i<25;i++){
        off(i%5,Math.floor(i/5));
    }
}

function on(x,y){
    if(x>=0 && x<5 && y>=0 && y<5){
        led[x+y*5] = ON;
    }
}

function off(x,y){
    if(x>=0 && x<5 && y>=0 && y<5){
        led[x+y*5] = OFF;
    }
}

function random(i,j){
	return Math.floor(Math.random()*Math.abs(i-j));
}

