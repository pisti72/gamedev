let canvas = get("canvas1972");
let snd_left = get("snd_left");
let snd_right = get("snd_right");
let snd_goal = get("snd_goal");
let ctx = canvas.getContext("2d");
let t=0;
let actors=[];
let state = 0;
const TITLE_TEXT = "Pong Duel";
const VERSION = "version 0.1";
const COPYRIGHT_TEXT = "Created by Istvan Szalontai 2022 for Multiplayer Game Jam";

const GREEN = "#3FA33F";
const YELLOW = "#ECE646";
const WHITE = "#EFEFEF";
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

let PAUSED = false;

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
	let paddle = getActorByName(RIGHT_PADDLE);
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
  
  paddle = getActorByName(LEFT_PADDLE);
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
      let ball=getActorByName(BALL);
      if(ball.x>0){
        ball.xv = BALL_INITIAL_XV;
      }else{
        ball.xv = -BALL_INITIAL_XV;
      }
      ball.x = (WIDTH-PIXEL)/2;
      ball.y = (HEIGHT-PIXEL)/2;
      ball.yv = random(-3,3);
      
      let left = getActorByName(LEFT_PADDLE);
      let right = getActorByName(RIGHT_PADDLE);
      left.x = PIXEL;
      left.y = 5 * PIXEL;
      right.x = WIDTH-2*PIXEL;
      right.y = 5 * PIXEL;
      
    }else if(state == GAMEOVER){
      let left = getActorByName(LEFT_PADDLE);
      left.score = 0;
      let right = getActorByName(RIGHT_PADDLE);
      right.score = 0;
      state = TITLE;
    }
  }
  
  if(event.keyCode==KEY_ESC && state == INGAME){
    let left = getActorByName(LEFT_PADDLE);
    left.score = 0;
    let right = getActorByName(RIGHT_PADDLE);
    right.score = 0;
    state = TITLE;
  }
  
  if(event.keyCode==KEY_P && state == INGAME){
    PAUSED = !PAUSED;
  }
  //console.log(event.keyCode);
});

document.addEventListener("keyup", function(event){
	let paddle = getActorByName(RIGHT_PADDLE);
  if(event.keyCode==KEY_UP || event.keyCode==KEY_DOWN){
    paddle.yforce = 0;
  }
  if(event.keyCode==KEY_LEFT || event.keyCode==KEY_RIGHT){
    paddle.xforce = 0;
  }
  
  paddle = getActorByName(LEFT_PADDLE);
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
  addActor(TOP,-WIDTH,-4*PIXEL,3*WIDTH,5 * PIXEL);
  addActor(BOTTOM,-WIDTH,HEIGHT-PIXEL,3*WIDTH,5*PIXEL);
  addActor(LEFT_PADDLE, PIXEL        ,5 * PIXEL, PIXEL, 5*PIXEL);
  addActor(RIGHT_PADDLE,WIDTH-2*PIXEL,5 * PIXEL, PIXEL, 5*PIXEL);
  addActor(BALL,(WIDTH-PIXEL)/2,(HEIGHT-PIXEL)/2,PIXEL,PIXEL);
  let ball=getActorByName(BALL);
  ball.friction = BALL_FRICTION;
  
  let top = getActorByName(TOP);
  let bottom = getActorByName(BOTTOM);
  top.fixed = true;
  bottom.fixed = true;
  
  let left_paddle = getActorByName(LEFT_PADDLE);
  let right_paddle = getActorByName(RIGHT_PADDLE);
  left_paddle.friction = PADDLE_FRICTION;
  right_paddle.friction = PADDLE_FRICTION;
  
  state = TITLE;
}

function addActor(name,x,y,w,h){
  let actor={
    name:name,
    x:x,
    y:y,
    w:w,
    h:h,
    m:w*h,
    xv:0,
    yv:0,
    xforce:0,
    yforce:0,
    friction:0,
    score:0,
    fixed:false
  }
  actors.push(actor);
}

function isOverlappedX(actor,actor2){
  let a={
    x:actor.x + actor.xv,
    y:actor.y,
    w:actor.w,
    h:actor.h
  }
  return isOverlapped(a,actor2);
}

function isOverlappedY(actor,actor2){
  let a={
    x:actor.x,
    y:actor.y + actor.yv,
    w:actor.w,
    h:actor.h
  }
  return isOverlapped(a,actor2);
}

function isOverlapped(a,b){
  if(a.x > b.x && a.x < b.x + b.w){
    if(a.y > b.y && a.y < b.y + b.h){ 
      return true;
    }
  }
  if(a.x + a.w > b.x && a.x + a.w < b.x + b.w){
    if(a.y > b.y && a.y < b.y + b.h){ 
      return true;
    }
  }
  if(a.x > b.x && a.x < b.x + b.w){
    if(a.y + a.h > b.y && a.y + a.h < b.y + b.h){ 
      return true;
    }
  }
  if(a.x + a.w > b.x && a.x + a.w < b.x + b.w){
    if(a.y + a.h > b.y && a.y + a.h < b.y + b.h){ 
      return true;
    }
  }
  return false;
}

function getActorByName(name){
  for(let i=0;i<actors.length;i++){
    if(actors[i].name == name){
      return actors[i];
    }
  }
}

function update(){
  ctx.fillStyle = GREEN;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if(!PAUSED){
    updateActors();
  }
  
  let paddle = getActorByName(LEFT_PADDLE);
  if(paddle.x<0){
    paddle.x = 0;
    paddle.xv = 0;
  }else if(paddle.x>(WIDTH-2*PIXEL)/2){
    paddle.x = (WIDTH-2*PIXEL)/2;
    paddle.xv = 0;
  }
  
  paddle = getActorByName(RIGHT_PADDLE);
  if(paddle.x>WIDTH-PIXEL){
    paddle.x = WIDTH-PIXEL;
    paddle.xv = 0;
  }else if(paddle.x<WIDTH/2){
    paddle.x = WIDTH/2;
    paddle.xv = 0;
  }
  
  if(state == TITLE){
    let ball = getActorByName(BALL);
    ball.x = 9999;
    ball.y = 9999;
  }else if(state == INGAME){
    let ball = getActorByName(BALL);
    if(ball.x < -3 * PIXEL){
      state = GETREADY;
      snd_goal.play();
      let paddle = getActorByName(RIGHT_PADDLE);
      paddle.score++;
      if(paddle.score >= MATCH){
        state = GAMEOVER;
      }
    }else if(ball.x > WIDTH + 2 * PIXEL){
      state = GETREADY;
      snd_goal.play();
      let paddle = getActorByName(LEFT_PADDLE);
      paddle.score++;
      if(paddle.score >= MATCH){
        state = GAMEOVER;
      }
    }
  }
  
  drawGUI();
  drawActors();
  
  window.requestAnimationFrame(update);
  t++;
}

function updateActors(){
  //calculate forces
  for(let i=0;i<actors.length;i++){
    let actor = actors[i];
    for(let j=0;j<actors.length;j++){
      let actor2 = actors[j];
      if(j < i){
        if(isOverlappedX(actor,actor2)){
          playBallSound(actor,actor2);
          let mu = actor.m * actor.xv + actor2.m * actor2.xv;
          let u = mu/(actor.m + actor2.m);
          actor.xv = 2 * u - actor.xv;
          actor2.xv = 2 * u - actor2.xv;
          
          u = actor2.yv - actor.yv;
          actor.yv += u/2;
          actor2.yv -= u/2;
        }
        if(isOverlappedY(actor,actor2)){
          let mu = actor.m * actor.yv + actor2.m * actor2.yv;
          let u = mu/(actor.m + actor2.m);
          actor.yv = 2 * u - actor.yv;
          actor2.yv = 2 * u - actor2.yv;
          /*
          u = actor2.xv - actor.xv;
          actor.xv += u;
          actor2.xv -= u;
          */
           
          /*
          actor.yv = -actor.yv + actor2.yv;;
          actor.xv += actor2.xv;
          */
        }
      }
    }
  }
  //apply move
  for(let i=0;i<actors.length;i++){
    let actor = actors[i];
    if(actor.fixed){
      actor.xv = 0;
      actor.yv = 0;
    }else{
      actor.x += actor.xv;
      actor.y += actor.yv;
      actor.xv *= 1-actor.friction;
      actor.yv *= 1-actor.friction;
      actor.xv += actor.xforce;
      actor.yv += actor.yforce;
    }
  }
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
    ctx.fillText(getActorByName(LEFT_PADDLE).score, 4*PIXEL, 4*PIXEL);
    ctx.fillText(getActorByName(RIGHT_PADDLE).score, WIDTH-6*PIXEL, 4*PIXEL);
  }
  if(state != INGAME){
    drawTextMiddle("Press SPACE", HEIGHT - 2*PIXEL);
  }
  if(state == TITLE){
    drawTextMiddle(TITLE_TEXT, PIXEL * 5);
    drawTextMiddle("P1:-WASD-", PIXEL * 8);
    drawTextMiddle("P2:ARROWS", PIXEL * 10);
    ctx.font="40px Gamer";
    drawTextMiddle(COPYRIGHT_TEXT, PIXEL * 2);
    drawTextMiddle(VERSION, HEIGHT - PIXEL);
  }else if(state == GETREADY){
    drawTextMiddle("Get Ready", PIXEL * 8);
  }else if(state == GAMEOVER){
    drawTextMiddle("Game Over", PIXEL * 7);
    let left = getActorByName(LEFT_PADDLE).score;
    let right = getActorByName(RIGHT_PADDLE).score;
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
  for(let i=0;i<actors.length;i++){
    let actor = actors[i];
    ctx.fillRect(actor.x + 20, actor.y + 20, actor.w, actor.h);
  }
  ctx.filter = 'blur(0px)';
  ctx.fillStyle = WHITE;
  for(let i=0;i<actors.length;i++){
    let actor = actors[i];
    ctx.fillRect(actor.x, actor.y, actor.w, actor.h);
  }
}

function random(i,j){
	return Math.floor(Math.random()*Math.abs(i-j))+i;
}

function get(n){
	return document.getElementById(n);
}
