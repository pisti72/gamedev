let canvas = get("canvas1972");
let snd_left = get("snd_left");
let snd_right = get("snd_right");
let snd_goal = get("snd_goal");
let ctx = canvas.getContext("2d");

const TITLE_TEXT = "Pong Duel";
const VERSION = "version 0.2";
const COPYRIGHT_TEXT = "Created by Istvan Szalontai 2022 for Multiplayer Game Jam";
const DEBUG = false;
const LIMITS = false;

const GREEN = "#3FA33F";
const YELLOW = "#ECE646";
const WHITE = "#EFEFEF";
const RED = "#FF6D6D";
const GREY = "#20202080";
const WIDTH = 1000;
const HEIGHT = 600;
const PIXEL = 40;

const TOP = "top";
const BOTTOM = "bottom";
const RIGHT_PADDLE = "rightpaddle";
const LEFT_PADDLE = "leftpaddle";
const BALL = "ball";

const TITLE = 0;
const INGAME = 1;
const GETREADY = 2;
const GAMEOVER = 3;

let state = TITLE;
let paused = false;
let single_player = false;

const PADDLE_FRICTION = .08;
const BALL_FRICTION = .0002;
const BALL_INITIAL_XV = 5;
const MATCH = 20;

const KEY_ESC = 27;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_P = 80;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

document.addEventListener("keydown", function(event){
	let paddle = JustBoxes.getActorByName(RIGHT_PADDLE);
  if(event.keyCode==KEY_UP){
    paddle.yforce = -1; 
  }else if(event.keyCode==KEY_DOWN){
    paddle.yforce = 1; 
  }
  if(event.keyCode==KEY_LEFT){
    paddle.xforce = -1; 
  }else if(event.keyCode==KEY_RIGHT){
    paddle.xforce = 1; 
  }
  
  paddle = JustBoxes.getActorByName(LEFT_PADDLE);
  if(event.keyCode==KEY_W){
    paddle.yforce = -1; 
  }else if(event.keyCode==KEY_S){
    paddle.yforce = 1; 
  }
  if(event.keyCode==KEY_A){
    paddle.xforce = -1; 
  }else if(event.keyCode==KEY_D){
    paddle.xforce = 1; 
  }
  
  if(event.keyCode==KEY_SPACE){
    if(state == TITLE){
      state = GETREADY;
    }else if(state == GETREADY){
      state = INGAME;
      let ball = JustBoxes.getActorByName(BALL);
      if(ball.x>0){
        ball.xv = BALL_INITIAL_XV;
      }else{
        ball.xv = -BALL_INITIAL_XV;
      }
      ball.x = (WIDTH-PIXEL)/2;
      ball.y = (HEIGHT-PIXEL)/2;
      ball.yv = random(-3,3);
      
      let left = JustBoxes.getActorByName(LEFT_PADDLE);
      let right = JustBoxes.getActorByName(RIGHT_PADDLE);
      left.x = PIXEL;
      left.y = 5 * PIXEL;
      right.x = WIDTH-2*PIXEL;
      right.y = 5 * PIXEL;
      
    }else if(state == GAMEOVER){
      let left = JustBoxes.getActorByName(LEFT_PADDLE);
      left.score = 0;
      let right = JustBoxes.getActorByName(RIGHT_PADDLE);
      right.score = 0;
      state = TITLE;
    }
  }
  
  if(event.keyCode==KEY_ESC && state == INGAME){
    let left = JustBoxes.getActorByName(LEFT_PADDLE);
    left.score = 0;
    let right = JustBoxes.getActorByName(RIGHT_PADDLE);
    right.score = 0;
    state = TITLE;
  }
  
  if(event.keyCode==KEY_P && state == INGAME){
    paused = !paused;
  }
  
  if(event.keyCode==KEY_ENTER && state == TITLE){
    single_player = !single_player;
  }
  //console.log(event.keyCode);
});

document.addEventListener("keyup", function(event){
	let paddle = JustBoxes.getActorByName(RIGHT_PADDLE);
  if(event.keyCode==KEY_UP || event.keyCode==KEY_DOWN){
    paddle.yforce = 0;
  }
  if(event.keyCode==KEY_LEFT || event.keyCode==KEY_RIGHT){
    paddle.xforce = 0;
  }
  
  paddle = JustBoxes.getActorByName(LEFT_PADDLE);
  if(event.keyCode==KEY_W || event.keyCode==KEY_S){
    paddle.yforce = 0;
  }
  if(event.keyCode==KEY_A || event.keyCode==KEY_D){
    paddle.xforce = 0;
  }
});

window.onload = function(){
  init();
  update();
}

function init(){
  JustBoxes.addActor(TOP,-WIDTH,-4*PIXEL,3*WIDTH,5 * PIXEL);
  JustBoxes.addActor(BOTTOM,-WIDTH,HEIGHT-PIXEL,3*WIDTH,5*PIXEL);
  JustBoxes.addActor(LEFT_PADDLE, PIXEL        ,5 * PIXEL, PIXEL, 5*PIXEL);
  JustBoxes.addActor(RIGHT_PADDLE,WIDTH-6*PIXEL,5 * PIXEL, 5*PIXEL, 5*PIXEL);
  JustBoxes.addActor(BALL,(WIDTH-PIXEL)/2,(HEIGHT-PIXEL)/2,PIXEL,PIXEL);
  let ball = JustBoxes.getActorByName(BALL);
  ball.friction = BALL_FRICTION;
  
  let top = JustBoxes.getActorByName(TOP);
  let bottom = JustBoxes.getActorByName(BOTTOM);
  top.fixed = true;
  bottom.fixed = true;
  
  let left_paddle = JustBoxes.getActorByName(LEFT_PADDLE);
  let right_paddle = JustBoxes.getActorByName(RIGHT_PADDLE);
  left_paddle.friction = PADDLE_FRICTION;
  right_paddle.friction = PADDLE_FRICTION;
  
  state = TITLE;
}



function update(){
  ctx.fillStyle = GREEN;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if(!paused){
    JustBoxes.updateActors();
  }
  
  let paddle = JustBoxes.getActorByName(LEFT_PADDLE);
  if(paddle.x<0 && LIMITS){
    paddle.x = 0;
    paddle.xv = 0;
  }else if(paddle.x>(WIDTH-2*PIXEL)/2 && LIMITS){
    paddle.x = (WIDTH-2*PIXEL)/2;
    paddle.xv = 0;
  }
  
  paddle = JustBoxes.getActorByName(RIGHT_PADDLE);
  if(paddle.x>WIDTH-PIXEL && LIMITS){
    paddle.x = WIDTH-PIXEL;
    paddle.xv = 0;
  }else if(paddle.x<WIDTH/2 && LIMITS){
    paddle.x = WIDTH/2;
    paddle.xv = 0;
  }
  
  if(state == TITLE){
    let ball = JustBoxes.getActorByName(BALL);
    ball.x = JustBoxes.INFINITY;
    ball.y = JustBoxes.INFINITY;
  }else if(state == INGAME){
    let ball = JustBoxes.getActorByName(BALL);
    if(ball.x < -3 * PIXEL){
      state = GETREADY;
      snd_goal.play();
      let paddle = JustBoxes.getActorByName(RIGHT_PADDLE);
      paddle.score++;
      if(paddle.score >= MATCH){
        state = GAMEOVER;
      }
    }else if(ball.x > WIDTH + 2 * PIXEL){
      state = GETREADY;
      snd_goal.play();
      let paddle = JustBoxes.getActorByName(LEFT_PADDLE);
      paddle.score++;
      if(paddle.score >= MATCH){
        state = GAMEOVER;
      }
    }
  }
  
  drawGUI();
  drawActors();
  
  window.requestAnimationFrame(update);
}



function playBallSound(a,b){
  if(a.name == BALL && b.name == LEFT_PADDLE){
    snd_left.play();
  }
  if(a.name == BALL && b.name == RIGHT_PADDLE){
    snd_right.play();
  }
  if(a.name == LEFT_PADDLE && b.name == BALL){
    snd_left.play();
  }
  if(a.name == RIGHT_PADDLE && b.name == BALL){
    snd_right.play();
  }
}

function drawGUI(){
  ctx.fillStyle = YELLOW;
  ctx.font="180px Gamer";
  if(state != TITLE){
    ctx.fillText(JustBoxes.getActorByName(LEFT_PADDLE).score, 4*PIXEL, 4*PIXEL);
    ctx.fillText(JustBoxes.getActorByName(RIGHT_PADDLE).score, WIDTH-6*PIXEL, 4*PIXEL);
  }
  if(state != INGAME){
    drawTextMiddle("Press SPACE", HEIGHT - 2*PIXEL);
  }
  if(state == TITLE){
    drawTextMiddle(TITLE_TEXT, PIXEL * 5);
    if(single_player){
      drawTextMiddle("P1: CPU", PIXEL * 8);
    }else{
      drawTextMiddle("P1:-WASD-", PIXEL * 8);
    }
    drawTextMiddle("P2:ARROWS", PIXEL * 10);
    ctx.font="40px Gamer";
    drawTextMiddle(COPYRIGHT_TEXT, PIXEL * 2);
    drawTextMiddle(VERSION, HEIGHT - PIXEL);
  }else if(state == GETREADY){
    drawTextMiddle("Get Ready", PIXEL * 8);
  }else if(state == GAMEOVER){
    drawTextMiddle("Game Over", PIXEL * 7);
    let left = JustBoxes.getActorByName(LEFT_PADDLE).score;
    let right = JustBoxes.getActorByName(RIGHT_PADDLE).score;
    if(left == right){
      drawTextMiddle("Drawn", PIXEL * 9);
    }else if(left>right){
      drawTextMiddle("Left won!", PIXEL * 9);
    }else{
      drawTextMiddle("Right won!", PIXEL * 9);
    }
  }else if(state == INGAME){
    for(i=0;i<10;i++){
      ctx.fillRect((WIDTH-PIXEL)/2, PIXEL*2*i, PIXEL, PIXEL);
    }
  }
}

function drawTextMiddle(txt,y){
  let w = ctx.measureText(txt).width;
  let x = Math.floor((WIDTH-w)/2);
  ctx.fillText(txt,x, y);
}

function drawActors(){
  ctx.filter = 'blur(10px)';
  ctx.fillStyle = GREY;
  const SHADOW = 20;
  let actors = JustBoxes.getAllActors();
  for(let i=0;i<actors.length;i++){
    let actor = actors[i];
    ctx.fillRect(actor.left + SHADOW, actor.top + SHADOW, actor.w, actor.h);
  }
  ctx.filter = 'blur(0px)';
  ctx.fillStyle = WHITE;
  for(let i=0;i<actors.length;i++){
    let actor = actors[i];
    ctx.fillStyle = WHITE;
    if(actor.overlapped){
      ctx.fillStyle = RED;
    }
    ctx.fillRect(actor.left, actor.top, actor.w, actor.h);
  }
}

function random(i,j){
	return Math.floor(Math.random()*Math.abs(i-j))+i;
}

function get(n){
	return document.getElementById(n);
}
