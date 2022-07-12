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

const NONE_SIDE = 0;
const RED_SIDE = 1;
const BLUE_SIDE = 2;

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
const DUST = 76;

const HUNGER = 0.001;
const CANIBALISM = 0.002;
const PRODUCTIVITY = 0.01;
const FARM_PRODUCTIVITY = 2;
const SAFE_AMOUNT = 3;

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
const SHOWRESOURCE = 4;
const SHOWCASTLE = 5;
const GAMEOVER = 6;
const PAUSE = 7;
const MOVESOLDIER = 8;
const YOUWON = 9;

const INVALID = 9999;


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
        res_y:19,
        res_w:3,
        res_h:4
    },
    {
        id:RED_FLAG_CASTLE,
        res_x:42,
        res_y:16,
        res_w:6,
        res_h:7
    },
    {
        id:RED_FLAG_SOLDIER,
        res_x:32,
        res_y:21,
        res_w:3,
        res_h:2,
        images:[
          {x:32,y:21},
          {x:32,y:19}
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
        res_x:40,
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
        shield:200,
        attack:1,
        img_x:48,
        img_y:16,
        images:[
            {x:48,y:16,flag_x:5,flag_y:4},
            {x:64,y:16,flag_x:5,flag_y:4},
            {x:48,y:32,flag_x:8,flag_y:4},
            {x:64,y:32,flag_x:8,flag_y:4}
        ],
        resource:false,
        wood:1,
        ore:1,
        workers:1
    },
    {
        id:ARCHER,
        name:"Archer",
        shield:200,
        attack:2,
        img_x:80,
        img_y:16,
        images:[
            {x:80,y:16,flag_x:4,flag_y:2},
            {x:96,y:16,flag_x:5,flag_y:2},
            {x:80,y:32,flag_x:4,flag_y:2},
            {x:96,y:32,flag_x:4,flag_y:2}
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
        shield:200,
        attack:6,
        img_x:112,
        img_y:16,
        images:[
            {x:112,y:16,flag_x:5,flag_y:0},
            {x:128,y:16,flag_x:5,flag_y:-1},
            {x:112,y:32,flag_x:5,flag_y:0},
            {x:128,y:32,flag_x:5,flag_y:-1}
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
        wood: 0,
        ore: 0,
        food:0,
        food_before:0,
        workers:0,
        towers:0,
        farms:0,
        tick:500
    },
];

const BUILDINGS = [LUMBERMAN,STONECUTTER,FARM,BARRACKS,CASTLE];
const SOLDIERS = [SWORDSMAN,ARCHER,KNIGHT];

let gfx = get("gfx");
let canvas = get("canvas1987");
let snd_click = get("snd_click");

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
let level = 1;
let state = TITLE;
let selected_item = {}
let selected_soldier = {}
let selected_menuitem = {}


ctx.imageSmoothingEnabled = false;

document.addEventListener("mousemove", function(event){
	hand.mouse_x = event.pageX - rect.left;
    hand.mouse_y = event.pageY - rect.top;
});

document.addEventListener("mousedown", function(event){
    snd_click.play();
	if(state == TITLE){
        newGame();
    }else if(state == PLAY){
        selected_item = getItemByCursor();
        if(isSoldier(selected_item, RED_SIDE)){
            state = MOVESOLDIER;
            hand.item = CURSOR_TARGET;
        }else if(canBuild(selected_item, RED_SIDE)){
            state = SELECTBUILDING;
        }else if(selected_item.item == CASTLE){
            state = SHOWCASTLE;
        }else if(selected_item.item == BARRACKS){
            state = SELECTSOLDIER;
        }else{
            state = SHOWRESOURCE;
        }
    }else if(state == SHOWRESOURCE || state == SHOWCASTLE){
        state = PLAY;
    }else if(state == SELECTBUILDING){
        if(selected_menuitem.id != GRASS){
            setMapAt(selected_menuitem.id, selected_item.x, selected_item.y, RED_SIDE);
            let castle = getCastleBySide(RED_SIDE);
            castle.wood -= selected_menuitem.wood;
            castle.ore -= selected_menuitem.ore;
            castle.workers += selected_menuitem.workers;
        }
        state = PLAY;
    }else if(state == SELECTSOLDIER){
        if(selected_menuitem.id != GRASS){
            let item = getFirstClosestEmpty(selected_item);
            if(item.item != INVALID){
                addSoldier(map[item.id],selected_menuitem.id, RED_SIDE);
                let castle = getCastleBySide(RED_SIDE);
                castle.wood -= selected_menuitem.wood;
                castle.ore -= selected_menuitem.ore;
                castle.workers += selected_menuitem.workers;
            }
        }
        state = PLAY;
    }else if(state == MOVESOLDIER){
        hand.item = CURSOR_NORMAL;
        selected_soldier.moveTo.x = hand.x;
        selected_soldier.moveTo.y = hand.y;
        state = PLAY;
    }else if(state == GAMEOVER){
        state = TITLE;
    }else if(state == YOUWON){
        level++;
        newGame();
    }
});

inicMap();

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

function canBuild(item, side){
	if(item.item == GRASS){
		for(let i=0;i<map.length;i++){
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
    if(state==SHOWRESOURCE){
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
    }
    if(state == SHOWCASTLE){
        drawRect(8,6);
        let item = getItemById(selected_item.item);
        drawTile(item,4,1);
        ctx.fillStyle = BLACK;
        ctx.font = "40px RetroGaming";
        ctx.fillText(item.name, 5*TILE_REAL, 2*TILE_REAL);
        let castle = getCastleBySide(selected_item.side);
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
    }
    if(state == SELECTBUILDING){
        creatorMenu("Select building",BUILDINGS);
    }
    if(state == SELECTSOLDIER){
        creatorMenu("Select soldier",SOLDIERS);
    }
    if(state==TITLE){
        drawTextMiddle("Battle Of Two Kings","60px RetroGaming",160);
        drawTextMiddle("Developed by Istvan Szalontai for RTS JAM 1998","20px RetroGaming",208);
        drawTextMiddle("Click to play","40px RetroGaming",420);
    }
    if(state == GAMEOVER){
        drawTextMiddle("Game Over","40px RetroGaming",420);
    }
    if(state == YOUWON){
        drawTextMiddle("YOU WON! LEVEL:"+level,"40px RetroGaming",420);
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
        let flip = 0;
        if(soldier.x < soldier.moveTo.x){
          flip = 0;
        }
        if(soldier.x > soldier.moveTo.x){
          flip = 2;
        }
        let anim = 0;
        if(soldier.fighting && t%20>10){
          anim = 1;
        }
        ctx.drawImage(gfx, item.images[flip + anim].x, item.images[flip + anim].y,
          TILE, TILE,
          TILE_REAL*soldier.x, TILE_REAL*soldier.y,
          TILE_REAL, TILE_REAL);
        let flag = getItemById(RED_FLAG_SOLDIER);
        if(soldier.side == BLUE_SIDE){
          flag = getItemById(BLUE_FLAG_SOLDIER);
        }
        ctx.drawImage(gfx, flag.images[flip/2].x, flag.images[flip/2].y,
            flag.res_w, flag.res_h,
            PIXEL*(soldier.x * TILE+ item.images[flip + anim].flag_x), PIXEL*(soldier.y * TILE + item.images[flip + anim].flag_y),
            flag.res_w * PIXEL, flag.res_h * PIXEL);
    }
}

function drawMap(){
    ctx.fillStyle = GREEN;
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

function move_soldiers(){
    if(t%10 == 0){
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
        }
    }
    for(let i=0;i<soldiers.length;i++){
        let soldier = soldiers[i];
        soldier.fighting = false;
        let map = getClosestEnemyBuilding(soldier);
        if(map.item != INVALID){
            if(t%10 == 0){
                map.shield -= soldier.attack;
            }
            soldier.fighting = true;
            addDust(map);
            if(map.shield < 0){
                setMapAt(GRASS, map.x, map.y, NONE_SIDE);
            }
        }
        let soldier_enemy = getClosestEnemySoldier(soldier);
        if(soldier_enemy.id != INVALID){
            if(t%10 == 0){
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
        if(map.side == RED_SIDE && soldier.side == BLUE_SIDE){
            return map;
        }else if(map.side == BLUE_SIDE && soldier.side == RED_SIDE){
            return map;
        }
    }
    return {item:INVALID}
}

function getClosestEnemySoldier(soldier){
    let diff = Math.abs(soldier.x-soldier.moveTo.x) + Math.abs(soldier.y-soldier.moveTo.y);
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
    let castle = getCastleBySide(BLUE_SIDE);
    let selected_menuitem = getItemById(GRASS);
    let selected_item = getItemById(GRASS);
    if(t%castle.tick==0){
        selected_item = getItemForAI();
        if(selected_item.item == GRASS && isEmptyAt(selected_item.x, selected_item.y)){
            
            let cube = random(0,100)
            if(isClosest(selected_item,FOREST)){
                selected_menuitem = getItemById(LUMBERMAN);
            }
            if(isClosest(selected_item,STONE)){
                selected_menuitem = getItemById(STONECUTTER);
            }
            
            if(castle.food_before > castle.food){
                selected_menuitem = getItemById(FARM);
            }                   
            
            if(cube>85 && castle.wood >= SAFE_AMOUNT*5 && castle.ore >= SAFE_AMOUNT*5){
                selected_menuitem = getItemById(BARRACKS);
            }
            if(cube>90 && castle.wood >= SAFE_AMOUNT*5 && castle.ore >= SAFE_AMOUNT*5){
                selected_menuitem = getItemById(CASTLE);
            }
            if(castle.food <= SAFE_AMOUNT){
                selected_menuitem = getItemById(FARM);
            }
            if(castle.wood <= SAFE_AMOUNT || castle.ore <= SAFE_AMOUNT){
                if(isClosest(selected_item,FOREST)){
                    selected_menuitem = getItemById(LUMBERMAN);
                }
                if(random(0,100)>50 && isClosest(selected_item,STONE)){
                    selected_menuitem = getItemById(STONECUTTER);
                }
            }
            if(selected_menuitem.id != GRASS){
                if(castle.wood >= selected_menuitem.wood && castle.ore >= selected_menuitem.ore){
                    setMapAt(selected_menuitem.id, selected_item.x, selected_item.y, BLUE_SIDE);
                    castle.wood -= selected_menuitem.wood;
                    castle.ore -= selected_menuitem.ore;
                    castle.workers += selected_menuitem.workers;
                }
            }   
        }
    }
    //create soldier
    selected_item = map[random(0,map.length)];
    if(selected_item.item == BARRACKS && selected_item.side == BLUE_SIDE){
        //console.log("barracks found");
        let soldier_picked = SOLDIERS[random(0,SOLDIERS.length)];
        selected_menuitem = getItemById(soldier_picked);
        //console.log(selected_menuitem.id);
        if(castle.wood >= selected_menuitem.wood + 2 && castle.ore >= selected_menuitem.ore + 2){
            let item = getFirstClosestEmpty(selected_item);
            if(item.item != INVALID){
                addSoldier(map[item.id], selected_menuitem.id, BLUE_SIDE);
                castle.wood -= selected_menuitem.wood;
                castle.ore -= selected_menuitem.ore;
                castle.workers += selected_menuitem.workers;
            }
        }
    }
    //move blue soldiers
    if(selected_item.side == RED_SIDE){
        for(let i=0; i<soldiers.length; i++){
            let soldier = soldiers[i];
            let diff = Math.abs(soldier.x-soldier.moveTo.x)+Math.abs(soldier.y-soldier.moveTo.y)
            if(soldier.side == BLUE_SIDE /*&& diff != 1*/){
                soldier.moveTo.x = selected_item.x;
                soldier.moveTo.y = selected_item.y;
            }
        }
    }
}

function getItemForAI(){
    for(let i=0;i<100;i++){
        let selected_item = map[random(0,map.length)];
        if(canBuild(selected_item, BLUE_SIDE)){
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
      }else{
        state = YOUWON;
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
  if(getCastleBySide(RED_SIDE).towers <= 0){
    state = GAMEOVER;
  }
  if(getCastleBySide(BLUE_SIDE).towers <= 0){
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
    if(map.side == RED_SIDE){
        let flag = getItemById(RED_FLAG);
        
        if(map.item == CASTLE || map.item == BARRACKS){
            flag = getItemById(RED_FLAG_CASTLE);
        }
        ctx.drawImage(
            gfx, flag.res_x, flag.res_y,
            flag.res_w, flag.res_h,
            TILE_REAL*map.x+PIXEL*item.flag_x, TILE_REAL*map.y+PIXEL*item.flag_y,
            flag.res_w * PIXEL, flag.res_h * PIXEL);
    }else if(map.side == BLUE_SIDE){
        let flag = getItemById(BLUE_FLAG);
        //let flag = getItemById(BLUE_FLAG_CASTLE);
        if(map.item == CASTLE || map.item == BARRACKS){
            flag = getItemById(BLUE_FLAG_CASTLE);
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
  state = PLAY;
  for(let i=0;i<castles.length;i++){
      let castle = castles[i];
      castle.wood = 6+level;
      castle.ore = 6+level;
      castle.food = 10;
      castle.workers = 2;
      castle.tick = 400 - level * 10;
  }
 
	inicMap();
  //setMapAt(BARRACKS,1,4, RED_SIDE);
  //addSoldier(getMapAt(2,4),KNIGHT,RED_SIDE);
  //setMapAt(GRASS,2,4, NONE_SIDE);
  //setMapAt(GRASS,3,4, NONE_SIDE);
  //setMapAt(FARM,4,4, BLUE_SIDE);
  
  //setMapAt(BARRACKS,MAP_WIDTH - 2,4, BLUE_SIDE);
  //setMapAt(GRASS,MAP_WIDTH - 3,4, NONE_SIDE);
    
}

function inicMap(){
    map = [];
    soldiers = [];
    for(let i=0;i<MAP_WIDTH*MAP_HEIGHT;i++)
	{
		let item = GRASS;
		let animation = EMPTY;
		let r = random(0,100);
		if(r >= 60+level && r<100)item = FOREST;//fa ritkulnak
		if(r >= 35 && r<60)item = STONE;//sziklák nem ritkulnak
		if(r >= 35-level && r<35)item = LAKE;///tó több lesz
		let amount = random(5,20);//nyersanyag eloszlás
        //TODO addToMap(id,x,y)
        let field={
            id:i,
            x:i%MAP_WIDTH,
            y:Math.floor(i/MAP_WIDTH),
            item:item,
            side:NONE_SIDE,
            amount:amount,
            underattack:false
        }
        map.push(field);
	}
    setMapAt(CASTLE,           1,3,RED_SIDE);
    setMapAt(CASTLE, MAP_WIDTH-2,3,BLUE_SIDE);
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

update();
