// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0;
//Matter.Body.setInertia(1);

var box_ball, box_bottom, box_top, box_left, box_right;
var score_left, score_right;

let canvas = get("canvas1972");
let snd_left = get("snd_left");
let snd_right = get("snd_right");
let snd_goal = get("snd_goal");
let ctx = canvas.getContext("2d");
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

const SENSITIVITY = .1;
const PADDLE_FRICTION = .08;
const BALL_FRICTION = .0002;
const BALL_INITIAL_XV = .05;
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
  if(event.keyCode==KEY_UP){
    box_right.force.y = -SENSITIVITY; 
  }else if(event.keyCode==KEY_DOWN){
    box_right.force.y = SENSITIVITY; 
  }
  if(event.keyCode==KEY_LEFT){
    box_right.force.x = -SENSITIVITY; 
  }else if(event.keyCode==KEY_RIGHT){
    box_right.force.x = SENSITIVITY; 
  }
  
  if(event.keyCode==KEY_W){
    box_left.force.y = -SENSITIVITY; 
  }else if(event.keyCode==KEY_S){
    box_left.force.y = SENSITIVITY; 
  }
  if(event.keyCode==KEY_A){
    box_left.force.x = -SENSITIVITY; 
  }else if(event.keyCode==KEY_D){
    box_left.force.x = SENSITIVITY; 
  }
  
  if(event.keyCode==KEY_SPACE){
    if(state == TITLE){
      state = GETREADY;
    }else if(state == GETREADY){
      state = INGAME;
      if(box_ball.position.x>0){
        box_ball.force.x = BALL_INITIAL_XV;
      }else{
        box_ball.force.x = -BALL_INITIAL_XV;
      }
      box_ball.position.x = (WIDTH-PIXEL)/2;
      box_ball.position.y = (HEIGHT-PIXEL)/2;
      box_ball.force.y = BALL_INITIAL_XV;
      
      box_left.position.x = PIXEL;
      //box_left.position.y = 5 * PIXEL;
      box_right.position.x = WIDTH-2*PIXEL;
      //box_right.position.y = 5 * PIXEL;
      
    }else if(state == GAMEOVER){
      score_left = 0;
      score_right = 0;
      state = TITLE;
    }
  }
  
  if(event.keyCode==KEY_ESC && state == INGAME){
    score_left = 0;
    score_right = 0;
    state = TITLE;
  }
  
  if(event.keyCode==KEY_P && state == INGAME){
    PAUSED = !PAUSED;
  }
});

document.addEventListener("keyup", function(event){
	
  if(event.keyCode==KEY_UP || event.keyCode==KEY_DOWN){
    box_right.force.y = 0;
  }
  if(event.keyCode==KEY_LEFT || event.keyCode==KEY_RIGHT){
    box_right.force.x = 0;
  }
  
  if(event.keyCode==KEY_W || event.keyCode==KEY_S){
    box_left.force.y = 0;
  }
  if(event.keyCode==KEY_A || event.keyCode==KEY_D){
    box_left.force.x = 0;
  }
});

window.onload = function(){
  init();
  update();
}

function init(){
  // create paddles, top and bottom boxes and a ball
  box_ball = Bodies.rectangle(WIDTH/2,HEIGHT/2,PIXEL,PIXEL,{ restitution: 1 });
  //box_ball.force.y = .04;
  //box_ball.force.x = .04;
  //box_ball.inertia = 10;
  console.log(box_ball);
  box_bottom = Bodies.rectangle(0,HEIGHT-0.5*PIXEL,2*WIDTH,PIXEL,{ isStatic: true,restitution: 1 });
  box_top = Bodies.rectangle(0,0.5*PIXEL,2*WIDTH,PIXEL,{ isStatic: true,restitution: 1 });
  box_left = Bodies.rectangle(PIXEL,HEIGHT/2,PIXEL,5*PIXEL,{ restitution: 1 });
  box_right = Bodies.rectangle(WIDTH-PIXEL,HEIGHT/2,PIXEL,5*PIXEL,{ restitution: 1 });
  Matter.Body.setInertia(box_ball, Infinity);
  Matter.Body.setInertia(box_left, Infinity);
  Matter.Body.setInertia(box_right, Infinity);
  // add all of the bodies to the world
  Composite.add(engine.world, [box_ball, box_bottom, box_top, box_left, box_right]);
  score_left=score_right=0;
  state = TITLE;
}

function update(){
  ctx.fillStyle = GREEN;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if(!PAUSED){
    updateActors();
  }
  //console.log(box_ball.position.x);
  if(box_left.position.x<PIXEL){
    box_left.position.x = PIXEL;
  }else if(box_left.position.x>WIDTH/2){
    box_left.position.x = WIDTH/2;
  }
  
  if(box_right.position.x<WIDTH/2){
    box_right.position.x = WIDTH/2;
  }else if(box_right.position.x>WIDTH){
    box_right.position.x = WIDTH;
  }
  
  if(state == TITLE){
    //let ball = getActorByName(BALL);
    //ball.x = 9999;
    //ball.y = 9999;
  }else if(state == INGAME){
    if(box_ball.position.x < -3 * PIXEL){
      state = GETREADY;
      snd_goal.play();
      score_right++;
      if(score_right >= MATCH){
        state = GAMEOVER;
      }
    }else if(box_ball.position.x > WIDTH + 2 * PIXEL){
      state = GETREADY;
      snd_goal.play();
      score_left++;
      if(score_left >= MATCH){
        state = GAMEOVER;
      }
    }
  }
  
  drawGUI();
  drawActors();
  playBallSound();
  /*
  box_ball.angle= 0;
  box_left.angle= 0;
  box_right.angle= 0;
  box_right.angularSpeed = 0;
  box_right.angularVelocity = 0;
  */
  window.requestAnimationFrame(update);
}

function updateActors(){
  Engine.update(engine, 1000 / 60);
}

function playBallSound(){
  //Matter.Detector.canCollide(box_ball, box_left)
  if(Matter.Detector.canCollide(box_ball, box_left)){
    snd_left.play();
  }
}

function drawGUI(){
  ctx.fillStyle = YELLOW;
  ctx.font="180px Gamer";
  if(state != TITLE){
    ctx.fillText(score_left, 4*PIXEL, 4*PIXEL);
    ctx.fillText(score_right, WIDTH-6*PIXEL, 4*PIXEL);
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
    if(score_left == score_right){
      drawTextMiddle("Drawn", PIXEL * 9);
    }else if(score_left>score_right){
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
  const SHADOW = 20;
  var bodies = Composite.allBodies(engine.world);
  ctx.lineWidth = 1;
  ctx.fillStyle = GREY;
  ctx.filter = 'blur(10px)';
  ctx.strokeStyle = '#999';
  ctx.beginPath();

  for (var i = 0; i < bodies.length; i++) {
      var vertices = bodies[i].vertices;

      ctx.moveTo(vertices[0].x + SHADOW, vertices[0].y+ SHADOW);

      for (var j = 1; j < vertices.length; j += 1) {
          ctx.lineTo(vertices[j].x+ SHADOW, vertices[j].y+ SHADOW);
      }

      ctx.lineTo(vertices[0].x+ SHADOW, vertices[0].y+ SHADOW);
  }
  ctx.fill();

  ctx.filter = 'blur(0px)';
  ctx.fillStyle = WHITE;
  ctx.beginPath();

  for (var i = 0; i < bodies.length; i++) {
      var vertices = bodies[i].vertices;

      ctx.moveTo(vertices[0].x, vertices[0].y);

      for (var j = 1; j < vertices.length; j += 1) {
          ctx.lineTo(vertices[j].x, vertices[j].y);
      }

      ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.fill();
}

function get(n){
	return document.getElementById(n);
}
