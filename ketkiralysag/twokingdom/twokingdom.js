const VERSION = "version: 0.4";
const START_LEVEL = 1;
const TITLE_TEXT = "Too Many Kings";
const DEBUG = false;
//const DEBUG = true;

const MAP_WIDTH = 14;
const MAP_HEIGHT = 7;
const PIXEL = 4;
const TILE = 16;
const TILE_REAL = PIXEL * TILE;
const WIDTH = MAP_WIDTH * TILE_REAL;
const HEIGHT= MAP_HEIGHT * TILE_REAL;
const DISTANCE = 3;
const TICK = 200;
const LEVEL_TICK_MULTIPLIER = 30
const SOLDIER_SPEED = 20;

const NONE_SIDE = 0;
const RED_SIDE = 1;
const BLUE_SIDE = 2;
const YELLOW_SIDE = 3;
const CYAN_SIDE = 4;

const ONE_SECOND = 50;
const TWO_SECONDS = ONE_SECOND * 2;

const GRASS = 0;
const EMPTY = 0;
const FOREST = 1;
const STONE = 2;
const FULL = 99;
const LAKE = 20;

const CASTLE = 3;
const STONECUTTER = 4;
const FARM = 5;
const LUMBERMAN = 6;
const BARRACKS = 7;

const SWORDSMAN = 40;
const ARCHER = 41;
const KNIGHT = 42;

const FOOD = 50;
const PEOPLE = 51;
const SHIELD = 52;

const CURSOR_NORMAL = 60;
const CURSOR_TARGET = 61;

const RED_FLAG = 70;
const RED_FLAG_CASTLE = 71;
const RED_FLAG_SOLDIER = 72;
const BLUE_FLAG = 73;
const BLUE_FLAG_CASTLE = 74;
const BLUE_FLAG_SOLDIER = 75;
const YELLOW_FLAG = 76;
const YELLOW_FLAG_CASTLE = 77;
const YELLOW_FLAG_SOLDIER = 78;
const CYAN_FLAG = 79;
const CYAN_FLAG_CASTLE = 80;
const CYAN_FLAG_SOLDIER = 81;
const DUST = 82;

const HUNGER = 0.001;
const CANIBALISM = 0.002;
const PRODUCTIVITY = 0.01;
const FARM_PRODUCTIVITY = 3;
const SAFE_AMOUNT = 10;
const CRITICAL_FOOD = 6;

const WHITE = "#FFF";
const GRAY = "#DDD";
const BLACK = "#444";
const YELLOW = "#FF4";
const GREY = GRAY;
const GREEN = "#5D5";


const TITLE = 0;
const PLAY = 1;
const SELECTBUILDING = 2;
const SELECTSOLDIER = 3;
const SHOWSOLDIER = 4;
const SHOWRESOURCE = 5;
const SHOWCASTLE = 6;
const GAMEOVER = 7;
const SHOWLEVEL = 8;
const MOVESOLDIER = 9;
const YOUWON = 10;

const INVALID = 9999;
const VICTORY_TEXTS = [
  "GLORIOUS VICTORY!",
  "GREAT VICTORY!",
  "YOU ARE GREAT!",
  "YOU WON THE BATTLE!",
  "IT IS DONE!",
  "CONQUEROR!"
];

const ITEMS = [
    {
        id:GRASS,
        name:"Field",
        img_x:86,
        img_y:1,
        resource:false
    },
    {
        id:FOREST,
        name:"Forest",
        img_x:96,
        img_y:0,
        resource:true,
        res_x:16,
        res_y:33,
        res_w:15,
        res_h:7
    },
    {
        id:STONE,
        name:"Stone",
        img_x:80,
        img_y:0,
        resource:true,
        res_x:0,
        res_y:41,
        res_w:15,
        res_h:7
    },
    {
        id:FOOD,
        res_x:16,
        res_y:41,
        res_w:15,
        res_h:7
    },
    {
        id:RED_FLAG,
        res_x:36,
        res_y:20,
        res_w:3,
        res_h:4
    },
    {
        id:RED_FLAG_CASTLE,
        res_x:42,
        res_y:17,
        res_w:6,
        res_h:7
    },
    {
        id:RED_FLAG_SOLDIER,
        res_x:32,
        res_y:20,
        res_w:3,
        res_h:2,
        images:[
          {x:32,y:22},
          {x:32,y:20}
        ]
    },
    {
        id:BLUE_FLAG,
        res_x:36,
        res_y:28,
        res_w:3,
        res_h:4
    },
    {
        id:BLUE_FLAG_CASTLE,
        res_x:42,
        res_y:25,
        res_w:6,
        res_h:7
    },
    {
        id:BLUE_FLAG_SOLDIER,
        res_x:32,
        res_y:30,
        res_w:3,
        res_h:2,
        images:[
          {x:32,y:30},
          {x:32,y:28}
        ]
    },
    {
        id:YELLOW_FLAG,
        res_x:36,
        res_y:36,
        res_w:3,
        res_h:4
    },
    {
        id:YELLOW_FLAG_CASTLE,
        res_x:42,
        res_y:33,
        res_w:6,
        res_h:7
    },
    {
        id:YELLOW_FLAG_SOLDIER,
        res_x:32,
        res_y:38,
        res_w:3,
        res_h:2,
        images:[
          {x:32,y:38},
          {x:32,y:36}
        ]
    },
    {
        id:CYAN_FLAG,
        res_x:36,
        res_y:44,
        res_w:3,
        res_h:4
    },
    {
        id:CYAN_FLAG_CASTLE,
        res_x:42,
        res_y:41,
        res_w:6,
        res_h:7
    },
    {
        id:CYAN_FLAG_SOLDIER,
        res_x:32,
        res_y:46,
        res_w:3,
        res_h:2,
        images:[
          {x:32,y:46},
          {x:32,y:44}
        ]
    },
    {
        id:DUST,
        res_x:8,
        res_y:34,
        res_w:7,
        res_h:4
    },
    {
        id:PEOPLE,
        res_x:0,
        res_y:32,
        res_w:7,
        res_h:9
    },
    {
        id:SHIELD,
        res_x:0,
        res_y:48,
        res_w:8,
        res_h:10
    },
    {
        id:LAKE,
        name:"Lake",
        img_x:112,
        img_y:0,
        resource:false
    },
    {
        id:CASTLE,
        name:"Castle",
        shield:100,
        img_x:0,
        img_y:0,
        resource:false,
        wood: 6,
        ore: 4,
        workers: 2,
        flag_x:6,
        flag_y:0
    },
    {
        id:BARRACKS,
        name:"Barracks",
        shield:80,
        img_x:16,
        img_y:0,
        resource:false,
        wood:3,
        ore:3,
        workers:3,
        flag_x:3,
        flag_y:1
    },
    {
        id:FARM,
        name:"Farm",
        shield:30,
        img_x:32,
        img_y:0,
        resource:false,
        wood:3,
        ore:2,
        workers:1,
        flag_x:1,
        flag_y:1
    },
    {
        id:STONECUTTER,
        name:"Stone cutter",
        shield:20,
        img_x:48,
        img_y:0,
        resource:false,
        wood:1,
        ore:2,
        workers:1,
        flag_x:5,
        flag_y:3
    },
    {
        id:LUMBERMAN,
        name:"Lumberman",
        shield:20,
        img_x:64,
        img_y:0,
        resource:false,
        wood:2,
        ore:0,
        workers:1,
        flag_x:5,
        flag_y:3
    },
    {
        id:SWORDSMAN,
        name:"Swordsman",
        shield:20,
        attack:1,
        img_x:48,
        img_y:16,
        images:[
            {x:48,y:16,flag_x:5,flag_y:4},
            {x:64,y:16,flag_x:4,flag_y:4},
            {x:48,y:32,flag_x:5,flag_y:4},
            {x:64,y:32,flag_x:4,flag_y:4}
        ],
        resource:false,
        wood:1,
        ore:1,
        workers:1
    },
    {
        id:ARCHER,
        name:"Archer",
        shield:30,
        attack:2,
        img_x:80,
        img_y:16,
        images:[
            {x:80,y:16,flag_x:4,flag_y:2},
            {x:96,y:16,flag_x:5,flag_y:2},
            {x:80,y:32,flag_x:4,flag_y:2},
            {x:96,y:32,flag_x:5,flag_y:2}
        ],
        resource:false,
        wood:2,
        ore:2,
        workers:1,
        flag_x:5,
        flag_y:2
    },
    {
        id:KNIGHT,
        name:"Knight",
        shield:50,
        attack:6,
        img_x:112,
        img_y:16,
        images:[
            {x:112,y:16,flag_x:5,flag_y:0},
            {x:128,y:16,flag_x:6,flag_y:-1},
            {x:112,y:32,flag_x:5,flag_y:0},
            {x:128,y:32,flag_x:6,flag_y:-1}
        ],
        resource:false,
        wood:6,
        ore:6,
        workers:1,
        flag_x:6,
        flag_y:0
    },
    {
        id:CURSOR_NORMAL,
        img_x:0,
        img_y:16
    },
    {
        id:CURSOR_TARGET,
        img_x:16,
        img_y:16
    }
];

let castles = [
    {
        side: RED_SIDE,
        name: "Your castle",
        flag: RED_FLAG,
        flag_big: RED_FLAG_CASTLE,
        flag_soldier: RED_FLAG_SOLDIER,
        wood: 0,
        ore: 0,
        food:0,
        food_before:0,
        workers:0,
        towers:0,
        farms:0,
        tick:50
    },
    {
        side: BLUE_SIDE,
        name: "Blue castle",
        flag: BLUE_FLAG,
        flag_big: BLUE_FLAG_CASTLE,
        flag_soldier: BLUE_FLAG_SOLDIER,
        wood: 0,
        ore: 0,
        food:0,
        food_before:0,
        workers:0,
        towers:0,
        farms:0,
        tick:500
    },
    {
        side: YELLOW_SIDE,
        name: "Yellow castle",
        flag: YELLOW_FLAG,
        flag_big: YELLOW_FLAG_CASTLE,
        flag_soldier: YELLOW_FLAG_SOLDIER,
        wood: 0,
        ore: 0,
        food:0,
        food_before:0,
        workers:0,
        towers:0,
        farms:0,
        tick:500
    },
    {
        side: CYAN_SIDE,
        name: "Cyan castle",
        flag: CYAN_FLAG,
        flag_big: CYAN_FLAG_CASTLE,
        flag_soldier: CYAN_FLAG_SOLDIER,
        wood: 0,
        ore: 0,
        food:0,
        food_before:0,
        workers:0,
        towers:0,
        farms:0,
        tick:500
    }
];

const BUILDINGS = [LUMBERMAN,STONECUTTER,FARM,BARRACKS,CASTLE];
const SOLDIERS = [SWORDSMAN,ARCHER,KNIGHT];

let gfx = get("gfx");
let canvas = get("canvas1987");
let snd_click = get("snd_click");
let snd_yessir = get("snd_yessir");
let music_dragonstone = get("music_dragonstone");
music_dragonstone.loop = true;
//music_dragonstone.muted = true;
music_dragonstone.volume = 0.2;

let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
let t = 0;
let path = {
    from:{},
    to:{},
    array:[]
}
let soldiers = [];
let dusts = [];
let hand = {
    MAP_WIDTH:MAP_WIDTH,
    MAP_HEIGHT:MAP_HEIGHT,
    mouse_x:0,
    mouse_y:0,
    item: CURSOR_NORMAL,
    x:0,
    y:0,
    update:function(){
        this.x=Math.floor(this.mouse_x/TILE_REAL);
        this.y=Math.floor(this.mouse_y/TILE_REAL);
        if(this.x<0){
            this.x=0;
        }else if(this.x>this.MAP_WIDTH-1){
            this.x=this.MAP_WIDTH-1;
        }
        if(this.y<0){
            this.y=0;
        }else if(this.y>this.MAP_HEIGHT-1){
            this.y=this.MAP_HEIGHT-1;
        }
    }
};
let map = [];
let level = START_LEVEL;
let state = TITLE;
let selected_item = {}
let selected_soldier = {}
let selected_menuitem = {}


ctx.imageSmoothingEnabled = false;

document.addEventListener("mousemove", function(event){
	hand.mouse_x = event.pageX - rect.left;
    hand.mouse_y = event.pageY - rect.top;
});

document.addEventListener("keydown", function(event){
	if(event.keyCode==77){
    //if(music_dragonstone
    music_dragonstone.muted = !music_dragonstone.muted;
  }else if(event.keyCode==27){
    if(state == PLAY){
      state = GAMEOVER;
    }
  }
  console.log(event.keyCode);
});

document.addEventListener("mousedown", function(event){
	if(state == TITLE){
    snd_click.play();
    music_dragonstone.play();
    newGame();
    state = SHOWLEVEL;
  }else if(state == SHOWLEVEL){
    snd_click.play();
    state = PLAY;
  }else if(state == PLAY){
      snd_click.play();
      selected_item = getItemByCursor();
      if(isSoldier(selected_item, RED_SIDE)){
          state = MOVESOLDIER;
          hand.item = CURSOR_TARGET;
      }else if(isEnemySoldier(selected_item)){
          state = SHOWSOLDIER;
      }else if(canBuild(selected_item, RED_SIDE)){
          state = SELECTBUILDING;
      }else if(selected_item.item == CASTLE){
          state = SHOWCASTLE;
      }else if(selected_item.item == BARRACKS && selected_item.side == RED_SIDE){
          state = SELECTSOLDIER;
      }else{
          state = SHOWRESOURCE;
      }
  }else if(state == SHOWRESOURCE || state == SHOWCASTLE || state == SHOWSOLDIER){
      state = PLAY;
  }else if(state == SELECTBUILDING){
    snd_click.play();
      if(selected_menuitem.id != GRASS){
          setMapAt(selected_menuitem.id, selected_item.x, selected_item.y, RED_SIDE);
          let castle = getCastleBySide(RED_SIDE);
          castle.wood -= selected_menuitem.wood;
          castle.ore -= selected_menuitem.ore;
          castle.workers += selected_menuitem.workers;
      }
      state = PLAY;
  }else if(state == SELECTSOLDIER){
    snd_click.play();
    if(selected_menuitem.id != GRASS){
      let item = getFirstClosestEmpty(selected_item);
      if(item.item != INVALID){
        addSoldier(item, selected_menuitem.id, RED_SIDE);
        let castle = getCastleBySide(RED_SIDE);
        castle.wood -= selected_menuitem.wood;
        castle.ore -= selected_menuitem.ore;
        castle.workers += selected_menuitem.workers;
      }
    }
    state = PLAY;
  }else if(state == MOVESOLDIER){
      snd_yessir.play();
      hand.item = CURSOR_NORMAL;
      selected_soldier.moveTo.x = hand.x;
      selected_soldier.moveTo.y = hand.y;
      state = PLAY;
  }else if(state == GAMEOVER){
    snd_click.play();
      state = TITLE;
  }else if(state == YOUWON){
    snd_click.play();
      level++;
      newGame();
      state = SHOWLEVEL;
  }
});

window.onload = function(){
  //music_dragonstone.muted=false;
  //music_dragonstone.play();
  inicMap();
  update();
}



function getItemByCursor(){
    for(let i=0;i<map.length;i++){
        let m = map[i];
        if(hand.x == m.x && hand.y == m.y){
            return m;
        }
    }
}

function addSoldier(map, id, side){
    let item = getItemById(id);
    let soldier = {
        id:id,
        side:side,
        flip:0,
        shield:item.shield,
        attack:item.attack,
        fighting:false,
        x:map.x,
        y:map.y,
        moveTo:{
            x:map.x,
            y:map.y
        }
    }
    soldiers.push(soldier);
}

function getSoldierAt(map){
  for(let i=0;i<soldiers.length;i++){
    let soldier = soldiers[i];
    if(map.x == soldier.x && map.y == soldier.y){
      return soldier;
    }
  }
  return {id:INVALID};
}

function addDust(map){
    let dust={
        x:map.x * TILE_REAL + random(-3,TILE - getItemById(DUST).res_w + 4) * PIXEL ,
        y:map.y * TILE_REAL + random(-3,TILE - getItemById(DUST).res_h + 4) * PIXEL,
        life:20
    }
    dusts.push(dust);
}

function isSoldier(map, side){
  for(let i=0;i<soldiers.length;i++){
    let soldier = soldiers[i];
    if(map.x == soldier.x && map.y == soldier.y && soldier.side == side){
      selected_soldier = soldier;
      return true;
    }
  }
  return false;
}

function isEnemySoldier(map){
  for(let i=0;i<soldiers.length;i++){
    let soldier = soldiers[i];
    if(map.x == soldier.x && map.y == soldier.y && soldier.side != RED_SIDE){
      selected_soldier = soldier;
      return true;
    }
  }
  return false;
}

function canBuild(item, side){
	if(item.item == GRASS){
		for(let i=0; i<map.length; i++){
			if(map[i].item == CASTLE && map[i].side == side && Math.abs(item.x - map[i].x) < DISTANCE && Math.abs(item.y - map[i].y) < DISTANCE){
				return true;
            }
		}
    }
	return false;
}

function update(){
    if(state==PLAY || state==SHOWRESOURCE || state==SHOWCASTLE || state==SELECTBUILDING || state==SELECTSOLDIER || state==MOVESOLDIER){
        collect_data_before_ai();
        eating();
        harvest();
        move_soldiers();
        ai();
    }
    drawMap();
    drawSoldiers();
    drawDust();
    
    if(state==PLAY || state==MOVESOLDIER){
        hand.update();
        drawCursor(hand.x,hand.y);
    }
    
    if(DEBUG){
        hand.update();
        ctx.fillStyle = WHITE;
        ctx.font = "20px RetroGaming";
        ctx.fillText(hand.mouse_x+","+hand.mouse_y, 5, 50);
        ctx.fillText(hand.x+","+hand.y, 5, 70);
        ctx.fillText(selected_item.id, 5, 90);
        //ctx.fillText(soldiers[0].fighting, 5, 110);
    }
    if(state == SHOWRESOURCE){
      drawRect(7,4);
      let item = getItemById(selected_item.item);
      drawTile(item,4,2);
      ctx.fillStyle = BLACK;
      ctx.font = "40px RetroGaming";
      ctx.fillText(item.name, 330, 3*TILE_REAL);
      if(item.resource){
          ctx.fillText("=" + Math.floor(selected_item.amount*10)/10, 330, 286);
          drawResource(item, 4, 4);
      }else if(isBuilding(item.id)){
          ctx.fillText("=" + selected_item.shield, 330, 286);
          let item = getItemById(SHIELD);
          drawResource(item, 4, 4);
      }
    }else if(state == SHOWSOLDIER){
      drawRect(7,4);
      let soldier = getSoldierAt(selected_item);
      let item = getItemById(soldier.id);
      drawTile(item,4,2);
      ctx.fillStyle = BLACK;
      ctx.font = "40px RetroGaming";
      ctx.fillText(item.name, TILE_REAL * 5, 3 * TILE_REAL);
      ctx.fillText("=" + soldier.shield, TILE_REAL * 5, TILE_REAL * 4);
      ctx.fillText(soldier.x + "," + soldier.y + "->"
       + soldier.moveTo.x + "," + soldier.moveTo.y, TILE_REAL * 4.5, TILE_REAL * 5);
      item = getItemById(SHIELD);
      drawResource(item, 4.5, 3.5);
    }else if(state == SHOWCASTLE){
        drawRect(8,6);
        let item = getItemById(selected_item.item);
        drawTile(item,4,1);
        ctx.fillStyle = BLACK;
        ctx.font = "40px RetroGaming";
        
        let castle = getCastleBySide(selected_item.side);
        ctx.fillText(castle.name, 5*TILE_REAL, 2*TILE_REAL);
        let array=[
            {
                icon:getItemById(FOREST),
                value:castle.wood
            },
            {
                icon:getItemById(STONE),
                value:castle.ore
            },
            {
                icon:getItemById(FOOD),
                value:castle.food
            },
            {
                icon:getItemById(PEOPLE),
                value:Math.floor(castle.workers)
            },
            {
                icon:getItemById(SHIELD),
                value:selected_item.shield
            }
        ];
        let j=0;
        for(let i=0; i<array.length; i++){
            let x = 4+Math.floor(j/3)*3.5;
            let y = (j%3)*1.5+2.5
            drawResource(array[i].icon,x,y);
            ctx.fillText("="+Math.floor(array[i].value*10)/10, (x+1)*TILE_REAL, (y+0.5)*TILE_REAL);
            j++;
        }
    }else if(state == SELECTBUILDING){
      creatorMenu("Select building",BUILDINGS);
    }else if(state == SELECTSOLDIER){
      creatorMenu("Select soldier",SOLDIERS);
      item = getItemById(SHIELD);
      ctx.fillText("=" + selected_item.shield, TILE_REAL * 8, TILE_REAL * 4.5);
      drawResource(item, 7.5, 4);
    }else if(state == TITLE){
        drawTextMiddle(TITLE_TEXT,"60px RetroGaming",160);
        drawTextMiddle("Developed by Istvan Szalontai for RTS JAM 1998","20px RetroGaming",208);
        drawTextMiddle("Click to play","40px RetroGaming",420);
        drawVersion();
    }else if(state == SHOWLEVEL){
      drawTextMiddle("Prepare for level","50px RetroGaming",200);
      drawTextMiddle(level,"80px RetroGaming",280);
      drawTextMiddle("Click to play","40px RetroGaming",420);
    }else if(state == GAMEOVER){
        drawTextMiddle("Game Over","50px RetroGaming",200);
    }else if(state == YOUWON){
        drawTextMiddle(VICTORY_TEXTS[level%VICTORY_TEXTS.length],"60px RetroGaming",180);
    }
    
    window.requestAnimationFrame(update);
    t++;
}

function collect_data_before_ai(){
  for(let i=0;i<castles.length;i++){
    castles[i].food_before = castles[i].food;
  }
   
}

function isBuilding(id){
    for(let i=0; i<BUILDINGS.length; i++){
        if(id == BUILDINGS[i]){
            return true;
        }
    }
    return false;
}

function drawSoldiers(){
    for(let i=0; i<soldiers.length; i++){
        let soldier = soldiers[i];
        let item = getItemById(soldier.id);
        
        let anim = 0;
        if(soldier.fighting && t%SOLDIER_SPEED > SOLDIER_SPEED/2){
          anim = 1;
        }
        ctx.drawImage(gfx, item.images[soldier.flip + anim].x, item.images[soldier.flip + anim].y,
          TILE, TILE,
          TILE_REAL*soldier.x, TILE_REAL*soldier.y,
          TILE_REAL, TILE_REAL);
        let castle = getCastleBySide(soldier.side);
        let flag = getItemById(castle.flag_soldier);
        
        if(soldier.flip == 0){
          ctx.drawImage(gfx, flag.images[0].x, flag.images[0].y,
              flag.res_w, flag.res_h,
              PIXEL*(soldier.x * TILE + item.images[anim].flag_x), PIXEL*(soldier.y * TILE + item.images[anim].flag_y),
              flag.res_w * PIXEL, flag.res_h * PIXEL);
        }else{
          ctx.drawImage(gfx, flag.images[1].x, flag.images[1].y,
              flag.res_w, flag.res_h,
              PIXEL*(soldier.x * TILE + TILE - flag.res_w - item.images[anim].flag_x), PIXEL*(soldier.y * TILE + item.images[anim].flag_y),
              flag.res_w * PIXEL, flag.res_h * PIXEL);
        }
    }
}

function drawMap(){
  ctx.fillStyle = GREEN;
  //ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, MAP_WIDTH * TILE_REAL, MAP_HEIGHT * TILE_REAL);
  for(let i=0; i<map.length; i++){
    drawMapTile(map[i]);
  }
}

function drawDust(){
  for(let i=0; i<dusts.length; i++){
    let dust = getItemById(DUST);
    ctx.drawImage(gfx, dust.res_x, dust.res_y,
      dust.res_w, dust.res_h,
      dusts[i].x, dusts[i].y,
      dust.res_w * PIXEL, dust.res_h * PIXEL);
    if(dusts[i].life <= 0){
      dusts.splice(i,1);
    }else{
      dusts[i].life--;
    }
  }
}

function drawTextMiddle(txt,font,y){
  ctx.font = font;
  let w = ctx.measureText(txt).width;
  let x = Math.floor((WIDTH-w)/2);
  ctx.fillStyle = BLACK;
  ctx.fillText(txt, x+PIXEL, y);
  ctx.fillStyle = YELLOW;
  ctx.fillText(txt, x, y);
}

function drawVersion(){
  ctx.font="20px RetroGaming";
  let w = Math.floor(ctx.measureText(VERSION).width);
  let x = WIDTH-w - PIXEL;
  let y = HEIGHT-PIXEL;
  ctx.fillStyle = BLACK;
  ctx.fillText(VERSION, x+PIXEL, y);
  ctx.fillStyle = YELLOW;
  ctx.fillText(VERSION, x, y);
}

function move_soldiers(){
    if(t%SOLDIER_SPEED == 0){
        for(let i=0;i<soldiers.length;i++){
            let soldier = soldiers[i];
            if(soldier.x != soldier.moveTo.x || soldier.y != soldier.moveTo.y){
                if(soldier.x < soldier.moveTo.x && isEmptyAt(soldier.x+1,soldier.y)){
                    soldier.x++;
                }else if(soldier.x > soldier.moveTo.x && isEmptyAt(soldier.x-1,soldier.y)){
                    soldier.x--;
                }else if(soldier.y < soldier.moveTo.y && isEmptyAt(soldier.x,soldier.y+1)){
                    soldier.y++;
                }else if(soldier.y > soldier.moveTo.y && isEmptyAt(soldier.x,soldier.y-1)){
                    soldier.y--;
                }
            }
            if(soldier.x < soldier.moveTo.x){
              soldier.flip = 0;
            }
            if(soldier.x > soldier.moveTo.x){
              soldier.flip = 2;
            }
        }
    }
    for(let i=0;i<soldiers.length;i++){
        let soldier = soldiers[i];
        soldier.fighting = false;
        let map = getClosestEnemyBuilding(soldier);
        if(map.item != INVALID){
            if(t%SOLDIER_SPEED == 0){
                map.shield -= soldier.attack;
            }
            soldier.fighting = true;
            addDust(map);
            if(map.shield < 0){
              //state = PLAY;
              setMapAt(GRASS, map.x, map.y, NONE_SIDE);
            }
        }
        let soldier_enemy = getClosestEnemySoldier(soldier);
        if(soldier_enemy.id != INVALID){
            if(t%SOLDIER_SPEED == 0){
                soldier_enemy.shield -= soldier.attack;
            }
            soldier.fighting = true;
            addDust(soldier_enemy);
        }
        if(soldier.shield <= 0){
            soldiers.splice(i,1);
        }
    }
}

function getClosestEnemyBuilding(soldier){
    let diff = Math.abs(soldier.x-soldier.moveTo.x) + Math.abs(soldier.y-soldier.moveTo.y);
    if(diff == 1){
        let map = getMapAt(soldier.moveTo.x, soldier.moveTo.y);
        if(map.side != soldier.side && map.side != NONE_SIDE){
            return map;
        }
    }
    return {item:INVALID}
}

function getClosestEnemySoldier(soldier){
    let diff = Math.abs(soldier.x - soldier.moveTo.x) + Math.abs(soldier.y - soldier.moveTo.y);
    if(diff == 1){
        for(let i=0; i<soldiers.length; i++){
            let soldier_enemy = soldiers[i];
            if(soldier.moveTo.x == soldier_enemy.x && soldier.moveTo.y == soldier_enemy.y && soldier.side != soldier_enemy.side){
                return soldier_enemy;
            }
        }
    }
    return {id:INVALID}
}

function isItemAt(id,x,y){
    for(let i=0; i<map.length; i++){
        let m = map[i];
        if(m.x == x && m.y == y && m.item == id){
            return true;
        }
    }
    return false;
}

function isEmptyAt(x,y){
    if(isItemAt(GRASS,x,y)){
        for(let i=0;i<soldiers.length;i++){
            let soldier = soldiers[i];
            if(soldier.x == x && soldier.y == y){
                return false;
            }
        }
        return true;
    }else{
        
        return false;
    }
    return false;
}

function creatorMenu(title,array){
    drawRect(9,6);
    ctx.fillStyle = BLACK;
    ctx.font = "40px RetroGaming";
    ctx.fillText(title, 4*TILE_REAL, 1.5*TILE_REAL);
    let j = 0;
    selected_menuitem = getItemById(GRASS);
    let castle = getCastleBySide(RED_SIDE);
    for(let i=0;i<array.length;i++){
        let item = getItemById(array[i]);
        if(castle.wood >= item.wood && castle.ore >= item.ore){
            let x = 3+Math.floor(j/3)*4.5;
            let y = (j%3)*1.5+2
            drawTile(item,x,y);
            if(hand.mouse_x >= x*TILE_REAL && hand.mouse_x < (x+1)*TILE_REAL &&
                hand.mouse_y >= y*TILE_REAL && hand.mouse_y < (y+1)*TILE_REAL){
                drawCursor(x,y);
                selected_menuitem = item;
            }
            
            let resource = getItemById(FOREST);
            if(item.wood>0){
                drawResource(resource, x+1.5, y);
                ctx.fillText("="+item.wood, (x+2.5)*TILE_REAL, (y+0.5)*TILE_REAL);
            }
            resource = getItemById(STONE);
            if(item.ore>0){
                drawResource(resource, x+1.5, y+0.5);
                ctx.fillText("="+item.ore, (x+2.5)*TILE_REAL, (y+1)*TILE_REAL);
            }
            j++;
        }
    }
}

function ai(){
  for(let i=0; i<castles.length; i++){
    let castle = castles[i];
    if(castle.side != RED_SIDE){
      let selected_menuitem = getItemById(GRASS);
      let selected_item = getItemById(GRASS);
      if(t%castle.tick == 0){
        selected_item = getItemForAI(castle);
        if(selected_item.item == GRASS && isEmptyAt(selected_item.x, selected_item.y)){
          let dice = random(0,100)
          
          if(isClosest(selected_item,FOREST)){
              selected_menuitem = getItemById(LUMBERMAN);
          }
          if(isClosest(selected_item,STONE)){
              selected_menuitem = getItemById(STONECUTTER);
          }
          
          let farm = getItemById(FARM);
          if(castle.wood >= farm.wood+2 && castle.ore >= farm.ore+2){
              if(castle.food_before > castle.food || castle.food < CRITICAL_FOOD){
                  selected_menuitem = farm;
              }
          }
          
          if(dice>80 && castle.wood >= SAFE_AMOUNT && castle.ore >= SAFE_AMOUNT){
              selected_menuitem = getItemById(BARRACKS);
          }
          if(dice>90 && castle.wood >= SAFE_AMOUNT && castle.ore >= SAFE_AMOUNT){
              selected_menuitem = getItemById(CASTLE);
          }
          //Ez mi?
          let lumberman = getItemById(LUMBERMAN);
          if(castle.wood <= lumberman.wood || castle.ore <= lumberman.ore){
              if(isClosest(selected_item,FOREST)){
                  selected_menuitem = lumberman;
              }
          }
          //Ez mi?
          let stonecutter = getItemById(STONECUTTER);
          if(castle.wood <= stonecutter.wood || castle.ore <= stonecutter.ore){
              if(isClosest(selected_item,STONE)){
                  selected_menuitem = stonecutter;
              }
          }
          
          //Ez mi?
          if(isClosest(selected_item,BARRACKS)){
            selected_menuitem = getItemById(GRASS);
          }
              
          if(selected_menuitem.id != GRASS){
              if(castle.wood >= selected_menuitem.wood && castle.ore >= selected_menuitem.ore){
                  setMapAt(selected_menuitem.id, selected_item.x, selected_item.y, castle.side);
                  castle.wood -= selected_menuitem.wood;
                  castle.ore -= selected_menuitem.ore;
                  castle.workers += selected_menuitem.workers;
              }
          }   
        }
      }
      //create soldier
      selected_item = map[random(0,map.length)];
      if(selected_item.item == BARRACKS && selected_item.side == castle.side){
          let soldier_picked = SOLDIERS[random(0,SOLDIERS.length)];
          selected_menuitem = getItemById(soldier_picked);
          if(castle.wood >= selected_menuitem.wood + 2 && castle.ore >= selected_menuitem.ore + 2 && castle.food > 2){
              let m = getFirstClosestEmpty(selected_item);
              if(m.item != INVALID){
                  addSoldier(m, selected_menuitem.id, castle.side);
                  castle.wood -= selected_menuitem.wood;
                  castle.ore -= selected_menuitem.ore;
                  castle.workers += selected_menuitem.workers;
              }
          }
      }
    }
  }
  //fight soldier
  for(let i=0; i<soldiers.length; i++){
    let soldier = soldiers[i];
    if(soldier.side != RED_SIDE){
      let enemy_map = getClosestEnemyBuildingToFight(soldier);
      if(enemy_map.id != INVALID){
        soldier.moveTo.x = enemy_map.x;
        soldier.moveTo.y = enemy_map.y;
      }
    }
  }
}

function getClosestEnemyBuildingToFight(mysoldier){
  let enemy_map = {id:INVALID}
  let distance_min = 9999;
  for(let i=-5; i<=5; i++){
    let map1 = getMapAt(mysoldier.x+i, mysoldier.y);
    if(map1.item != INVALID){
      if(map1.side != mysoldier.side && map1.side != NONE_SIDE){
        let distance = Math.abs(mysoldier.x-map1.x)+Math.abs(mysoldier.y-map1.y);
        if(distance<distance_min){
          distance_min = distance;
          enemy_map = map1;
        }
      }
    }
  }
  for(let i=-5; i<=5; i++){
    let map1 = getMapAt(mysoldier.x, mysoldier.y+i);
    if(map1.item != INVALID){
      if(map1.side != mysoldier.side && map1.side != NONE_SIDE){
        let distance = Math.abs(mysoldier.x-map1.x)+Math.abs(mysoldier.y-map1.y);
        if(distance<distance_min){
          distance_min = distance;
          enemy_map = map1;
        }
      }
    }
  }
  for(let i=0; i<soldiers.length; i++){
    let soldier = soldiers[i];
    if(mysoldier.side != soldier.side){
      let distance = Math.abs(mysoldier.x-soldier.x)+Math.abs(mysoldier.y-soldier.y);
      if(distance<distance_min){
        distance_min = distance;
        enemy_map = soldier;
      }
    }
  }
  return enemy_map;
}

function getItemForAI(castle){
    for(let i=0;i<100;i++){
        let selected_item = map[random(0,map.length)];
        if(canBuild(selected_item, castle.side)){
            return selected_item;
        }
    }
    return {item:FULL};
}

function eating(){
  for(let i=0; i<castles.length; i++){
    let castle = castles[i];
    castle.food -= castle.workers * HUNGER;
    if(castle.food <= 0){
      castle.food = 0;
      castle.workers -= CANIBALISM*(castle.workers + 3);
    }
    if(castle.workers <= 0){
      if(castle.side == RED_SIDE){
        state = GAMEOVER;
      }
    }
  }
}

function harvest(){
  for(let i=0; i<castles.length; i++){
    castles[i].towers = 0;
    castles[i].farms = 0;
  }
	for(let i=0; i<map.length; i++){
    let m = map[i];
    let castle = getCastleBySide(m.side);
    let map_next = getFirstClosest(m , INVALID);
    if(m.item == STONECUTTER){
        map_next = getFirstClosest(m , STONE);
    }else if(m.item == LUMBERMAN){
        map_next = getFirstClosest(m , FOREST);
    }
    
    if(map_next.item != INVALID){
        map_next.amount -= PRODUCTIVITY;
        if(map_next.item == FOREST){
            castle.wood += PRODUCTIVITY;
        }else{
            castle.ore += PRODUCTIVITY;
        }
        
        if(map_next.amount < 0){
            //remove resource if depleted
            setMapAt(GRASS, map_next.x, map_next.y, NONE_SIDE);
        }
    }
    
    if(m.item == STONECUTTER || m.item == LUMBERMAN){
        if(map_next.item == INVALID){
            //remove miner if no resource anymore
            castle.workers -= getItemById(m.item).workers;
            setMapAt(GRASS, m.x, m.y, NONE_SIDE);
        }
    }
    

    if(m.item == FARM){
        castle.food += HUNGER * FARM_PRODUCTIVITY;
        //count farms
        castle.farms++;
    }
    
    
    //count castles
    if(m.item == CASTLE){
      castle.towers++;
    }
	}
  
  let enemy_castle_towers = 0;
  for(let i=0; i<castles.length; i++){
    let castle = castles[i];
    if(castle.side == RED_SIDE){
      if(castle.towers <= 0){
        state = GAMEOVER;
      }
    }else{
      enemy_castle_towers += castle.towers;
    }
  }
  
  if(enemy_castle_towers <= 0){
    state = YOUWON;
  }
}

function getCastleBySide(side){
    for(let i=0; i<castles.length; i++){
        if(castles[i].side == side){
            return castles[i];
        }
    }
}

function getFirstClosest(m,item){
    let directions = [
        {x:0,y:-1},
        {x:1,y:0},
        {x:0,y:1},
        {x:-1,y:0}
    ];
    for(let i=0;i<directions.length;i++){
        let map = getMapAt(m.x+directions[i].x, m.y+directions[i].y);
        if(map.item == item){
            return map;
        }
    }
    
    return {item:INVALID}
}

function getFirstClosestEmpty(m){
    let directions = [
        {x:0,y:-1},
        {x:1,y:0},
        {x:0,y:1},
        {x:-1,y:0}
    ];
    for(let i=0;i<directions.length;i++){
        if(isEmptyAt(m.x+directions[i].x, m.y+directions[i].y)){
            return getMapAt(m.x+directions[i].x, m.y+directions[i].y);
        }
    }
    return {item:INVALID}
}

function isClosest(m,item){
    let directions = [
        {x:0,y:-1},
        {x:1,y:0},
        {x:0,y:1},
        {x:-1,y:0}
    ];
    for(let i=0;i<directions.length;i++){
        let map = getMapAt(m.x+directions[i].x,m.y+directions[i].y);
        if(map.item == item){
            return true;
        }
    }
    return false;
}

function getMapAt(x,y){
    for(let i=0; i<map.length; i++){
        if(map[i].x == x && map[i].y == y){
            return map[i];
        }
    }
    return {item:INVALID};
}

function setMapAt(id,x,y,side){
    let item = getItemById(id);
    for(let i=0; i<map.length; i++){
        if(map[i].x == x && map[i].y == y){
            map[i].item = id;
            map[i].shield = item.shield;
            map[i].side = side;
            return;
        }
    }
}

function drawRect(width,height){
    let w = width*TILE_REAL;
    let h = height*TILE_REAL;
    ctx.fillStyle = GREY;
    ctx.fillRect((WIDTH-w)/2,(HEIGHT-h)/2,w,h);
}

function drawTile(item,x,y){
  if(item.id != GRASS){
    ctx.drawImage(gfx,item.img_x,item.img_y,TILE,TILE,TILE_REAL*x,TILE_REAL*y,TILE_REAL,TILE_REAL);
  }
}

function drawCursor(x,y){
  let item = getItemById(hand.item);
  drawTile(item,x,y);
}

function drawResource(item,x,y){
  ctx.drawImage(gfx, item.res_x, item.res_y,
    item.res_w, item.res_h,
    TILE_REAL*x, TILE_REAL*y,
    item.res_w * PIXEL, item.res_h * PIXEL);
}

function drawMapTile(map){
    if(map.item == GRASS){
        return;
    }
    let item = getItemById(map.item);
    ctx.drawImage(
        gfx, item.img_x, item.img_y,
        TILE, TILE,
        TILE_REAL*map.x, TILE_REAL*map.y,
        TILE_REAL, TILE_REAL);
    
    //drawing flag on buildings
    if(map.side != NONE_SIDE){
      let castle = getCastleBySide(map.side);
      let flag = getItemById(castle.flag);
      
      if(map.item == CASTLE || map.item == BARRACKS){
          flag = getItemById(castle.flag_big);
      }
      ctx.drawImage(
          gfx, flag.res_x, flag.res_y,
          flag.res_w, flag.res_h,
          TILE_REAL*map.x+PIXEL*item.flag_x, TILE_REAL*map.y+PIXEL*item.flag_y,
          flag.res_w * PIXEL, flag.res_h * PIXEL);
    }
}

function newGame(){	
  t = 0;
  for(let i=0;i<castles.length;i++){
      let castle = castles[i];
      castle.wood = 6 + level;
      castle.ore = 6 + level;
      castle.food = 10;
      castle.workers = 2;
      castle.tick = TICK - level * LEVEL_TICK_MULTIPLIER + i*2;
      if(castle.tick<10){
        castle.tick = 10;
      }
  }
 
	inicMap();
  let LEVELS = 5;

  if(level%LEVELS == 1){
    setMapAt(CASTLE,           1, 3, RED_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 3, BLUE_SIDE);
  }else if(level%LEVELS == 2){
    setMapAt(CASTLE,           1, 3, RED_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 2, BLUE_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 4, YELLOW_SIDE);
  }else if(level%LEVELS == 3){
    setMapAt(CASTLE,           1, 3, RED_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 2, BLUE_SIDE);
    setMapAt(BARRACKS,MAP_WIDTH-2,4, BLUE_SIDE);
    setMapAt(GRASS    ,MAP_WIDTH-3,4, NONE_SIDE);
  }else if(level%LEVELS == 4){
    setMapAt(CASTLE,           1, 3, RED_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 3, BLUE_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 5, YELLOW_SIDE);
    setMapAt(CASTLE, Math.floor(MAP_WIDTH/2), 3, CYAN_SIDE);
    
  }else if(level%LEVELS == 0){
    setMapAt(CASTLE,           1, 3, CYAN_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 3, BLUE_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2, 5, YELLOW_SIDE);
    setMapAt(CASTLE, Math.floor(MAP_WIDTH/2), 3, RED_SIDE);
  }else{
    //setMapAt(BARRACKS,1,4, RED_SIDE);
    setMapAt(GRASS,3,4, NONE_SIDE);
    addSoldier(getMapAt(3,4),SWORDSMAN,YELLOW_SIDE);
    setMapAt(FARM,3,5, CYAN_SIDE);
    //setMapAt(GRASS,3,5, NONE_SIDE);
    setMapAt(FARM,3,6, CYAN_SIDE);
    setMapAt(FARM,3,3, BLUE_SIDE);
    //setMapAt(GRASS,2,4, NONE_SIDE);
    //setMapAt(GRASS,3,4, NONE_SIDE);
    //setMapAt(GRASS,4,4, NONE_SIDE);
    //addSoldier(getMapAt(4,4),SWORDSMAN,BLUE_SIDE);
    //setMapAt(FARM,2,3, BLUE_SIDE);
    //setMapAt(FARM,4,4, BLUE_SIDE);
    
    //setMapAt(BARRACKS,MAP_WIDTH - 2,4, BLUE_SIDE);
    //setMapAt(GRASS,MAP_WIDTH - 3,4, NONE_SIDE);
    let castle = getCastleBySide(BLUE_SIDE);
    castle.tick = 20;
    castle = getCastleBySide(CYAN_SIDE);
    castle.tick = 18;
    castle = getCastleBySide(YELLOW_SIDE);
    castle.tick = 14;
  }
}

function inicMap(){
  map = [];
  soldiers = [];
  for(let i=0;i<MAP_WIDTH*MAP_HEIGHT;i++){
		let item = GRASS;
		let animation = EMPTY;
		let r = random(0,100);
		if(r >= 60+level){
      //less forest
      item = FOREST;
    }else if(r >= 35){
      //stones always same
      item = STONE;
    }else	if(r >= 30){
      //more lake
      item = LAKE;
    }
		let amount = random(5,20+level);//nyersanyag eloszlás
    addToMap(item, i%MAP_WIDTH, Math.floor(i/MAP_WIDTH), amount);
	}
  
  //setMapAt(CASTLE, 3, 3, BLUE_SIDE);
}

function addToMap(item,x,y,amount){
  let field={
    x:x,
    y:y,
    item:item,
    side:NONE_SIDE,
    amount:amount
  }
  map.push(field);
}

function getItemById(id){
  for(let i=0;i<ITEMS.length;i++){
    if(id == ITEMS[i].id){
      return ITEMS[i];
    }
  }
  return false;
}

function random(i,j){
	return Math.floor(Math.random()*Math.abs(i-j))+i;
}

function get(n){
	return document.getElementById(n);
}


