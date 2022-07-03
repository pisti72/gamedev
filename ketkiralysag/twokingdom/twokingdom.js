//const DEBUG = false;
const DEBUG = true;

const MAP_WIDTH = 14;
const MAP_HEIGHT = 7;
const PIXEL = 4;
const TILE = 16;
const TILE_REAL = PIXEL * TILE;
const WIDTH = MAP_WIDTH * TILE_REAL;
const HEIGHT= MAP_HEIGHT * TILE_REAL;
const DISTANCE = 3;

const GRASS = 0;
const EMPTY = 0;
const FOREST = 1;
const STONE = 2;
const FULL = 99;
const LAKE = 20;

const CASTLE_RED = 3;
const STONECUTTER = 4;
const FARM = 5;
const LUMBERMAN = 6;
const BARRACKS = 7;
const CASTLE_BLUE = 35;
const STONECUTTER_BLUE = 36;
const FARM_BLUE = 37;
const LUMBERMAN_BLUE = 38;
const BARRACKS_BLUE = 39;


const FOOD = 50;
const PEOPLE = 51;

const FACTOR = 0.001;
const PRODUCTIVITY = 0.01;
const SAFE_AMOUNT = 3;

const WHITE = "#FFF";
const GRAY = "#DDD";
const BLACK = "#444";
const YELLOW = "#FF4";
const GREY = GRAY;


const TITLE = 0;
const PLAY = 1;
const SELECTBUILDING = 2;
const SHOWRESOURCE = 3;
const SHOWCASTLE = 4;
const GAMEOVER = 5;
const PAUSE = 7;


const ITEMS = [
    {
        id:GRASS,
        name:"Field",
        strength:0,
        img_x:86,
        img_y:1,
        resource:false
    },
    {
        id:FOREST,
        name:"Wood",
        strength:0,
        img_x:69,
        img_y:1,
        resource:true,
        res_x:18,
        res_y:36,
        res_w:15,
        res_h:7
    },
    {
        id:STONE,
        name:"Ore",
        strength:0,
        img_x:52,
        img_y:1,
        resource:true,
        res_x:1,
        res_y:44,
        res_w:15,
        res_h:7
    },
    {
        id:FOOD,
        res_x:18,
        res_y:44,
        res_w:15,
        res_h:7
    },
    {
        id:PEOPLE,
        res_x:1,
        res_y:34,
        res_w:7,
        res_h:9
    },
    {
        id:LAKE,
        name:"Lake",
        strength:0,
        img_x:120,
        img_y:52,
        resource:false
    },
    {
        id:CASTLE_RED,
        name:"Your Castle",
        strength:400,
        img_x:1,
        img_y:1,
        resource:false,
        wood: 6,
        ore: 4,
        workers: 2,
    },
    {
        id:CASTLE_BLUE,
        name:"Blue Castle",
        strength:400,
        img_x:1,
        img_y:52,
        resource:false,
        wood: 6,
        ore: 4,
        workers: 2,
    },
    {
        id:FARM,
        name:"Farm",
        strength:200,
        img_x:35,
        img_y:1,
        resource:false,
        wood:1,
        ore:1,
        workers:1
    },
    {
        id:FARM_BLUE,
        name:"Farm",
        strength:200,
        img_x:35,
        img_y:52,
        resource:false,
        wood:1,
        ore:1,
        workers:1
    },
    {
        id:LUMBERMAN,
        name:"Lumberman",
        strength:200,
        img_x:120,
        img_y:1,
        resource:false,
        wood:2,
        ore:0,
        workers:1
    },
    {
        id:LUMBERMAN_BLUE,
        name:"Lumberman",
        strength:200,
        img_x:120,
        img_y:18,
        resource:false,
        wood:2,
        ore:0,
        workers:1
    },
    {
        id:STONECUTTER,
        name:"Stone cutter",
        strength:200,
        img_x:86,
        img_y:18,
        resource:false,
        wood:1,
        ore:2,
        workers:1
    },
    {
        id:STONECUTTER_BLUE,
        name:"Stone cutter",
        strength:200,
        img_x:52,
        img_y:52,
        resource:false,
        wood:1,
        ore:2,
        workers:1
    },
    {
        id:BARRACKS,
        name:"Barracks",
        strength:200,
        img_x:18,
        img_y:1,
        resource:false,
        wood:3,
        ore:3,
        workers:3
    },
    {
        id:BARRACKS_BLUE,
        name:"Barracks",
        strength:200,
        img_x:18,
        img_y:52,
        resource:false,
        wood:3,
        ore:3,
        workers:3
    }
];
const BUILDINGS = [FARM,LUMBERMAN,STONECUTTER,BARRACKS,CASTLE_RED];
const BUILDINGS_BLUE = [FARM_BLUE,LUMBERMAN_BLUE,STONECUTTER_BLUE,BARRACKS_BLUE,CASTLE_BLUE];
const PLAYERS = [CASTLE_RED,CASTLE_BLUE];

let gfx = get("gfx");
let canvas = get("canvas1987");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
let t = 0;
let hand = {
    MAP_WIDTH:MAP_WIDTH,
    MAP_HEIGHT:MAP_HEIGHT,
    mouse_x:0,
    mouse_y:0,
    img_x:1,
    img_y:18,
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
let selected_menuitem = {}


ctx.imageSmoothingEnabled = false;

document.addEventListener("mousemove", function(event){
	hand.mouse_x = event.pageX - rect.left;
    hand.mouse_y = event.pageY - rect.top;
});

document.addEventListener("mousedown", function(event){
	if(state == TITLE){
        newGame();
    }else if(state == PLAY){
        selected_item = getItemByCursor();
        if(canBuild(selected_item, CASTLE_RED)){
            state = SELECTBUILDING;
        }else if(selected_item.item == CASTLE_RED || selected_item.item == CASTLE_BLUE){
            state = SHOWCASTLE;
        }
        else{
            state = SHOWRESOURCE;
        }
        
    }else if(state == SHOWRESOURCE || state == SHOWCASTLE){
        state = PLAY;
    }else if(state == SELECTBUILDING){
        if(selected_menuitem.id != GRASS){
            map[selected_item.id].item = selected_menuitem.id;
            let castle = getItemById(CASTLE_RED);
            castle.wood_has -= selected_menuitem.wood;
            castle.ore_has -= selected_menuitem.ore;
            castle.workers_has += selected_menuitem.workers;
        }
        state = PLAY;
    }else if(state == GAMEOVER){
        state = TITLE;
    }
});

inicMap();

function getItemByCursor(){
    for(let i=0;i<MAP_WIDTH*MAP_HEIGHT;i++)
	{
        if(hand.x == map[i].x && hand.y == map[i].y){
            return map[i];
        }
    }
}

function canBuild(item, closest_item)//p-hely,w=0-ha én w=1 ha ö
{
	if(item.item == GRASS)//ha ott semmi sincs
		for(let i=0;i<MAP_WIDTH*MAP_HEIGHT;i++)
		{
			if(map[i].item == closest_item && Math.abs(item.x - map[i].x) < DISTANCE && Math.abs(item.y - map[i].y) < DISTANCE){
				return true;
            }
		}
	return false;
}

function update(){
    if(state==PLAY || state==SHOWRESOURCE || state==SHOWCASTLE || state==SELECTBUILDING){
        eating();
        harvest();
        ai();
    }
	
    for(i=0;i<map.length;i++){
        let item = getItemById(map[i].item);
        drawTile(item, i%MAP_WIDTH, Math.floor(i/MAP_WIDTH));
    }
    
    if(state==PLAY){
        hand.update();
        drawTile(hand,hand.x,hand.y);
    }
    
    if(DEBUG){
        hand.update();
        ctx.fillStyle = WHITE;
        ctx.font = "20px RetroGaming";
        ctx.fillText(hand.mouse_x+","+hand.mouse_y, 5, 50);
        ctx.fillText(hand.x+","+hand.y, 5, 70);
        ctx.fillText(selected_item.id, 5, 90);
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
        }
    }
    if(state == SHOWCASTLE){
        drawRect(7,6);
        let item = getItemById(selected_item.item);
        drawTile(item,4,1);
        ctx.fillStyle = BLACK;
        ctx.font = "40px RetroGaming";
        ctx.fillText(item.name, 330, 2*TILE_REAL);
        let castle = getItemById(selected_item.item);
        let array=[
            {
                icon:getItemById(FOREST),
                value:castle.wood_has
            },
            {
                icon:getItemById(STONE),
                value:castle.ore_has
            },
            {
                icon:getItemById(FOOD),
                value:castle.food_has
            },
            {
                icon:getItemById(PEOPLE),
                value:castle.workers_has
            }
        ];
        for(let i=0;i<array.length;i++){
            ctx.fillText("="+Math.floor(array[i].value*10)/10, 330, (3+i)*TILE_REAL);
            drawResource(array[i].icon, 4, 2.5+i);
        }
    }
    if(state == SELECTBUILDING){
        drawRect(9,6);
        ctx.fillStyle = BLACK;
        ctx.font = "40px RetroGaming";
        ctx.fillText("Select building", 4*TILE_REAL, 1.5*TILE_REAL);
        let j = 0;
        selected_menuitem = getItemById(GRASS);
        let castle = getItemById(CASTLE_RED);
        for(let i=0;i<BUILDINGS.length;i++){
            let item = getItemById(BUILDINGS[i]);
            if(castle.wood_has >= item.wood && castle.ore_has >= item.ore){
                let x = 3+Math.floor(j/3)*5;
                let y = (j%3)*1.5+2
                drawTile(item,x,y);
                if(hand.mouse_x >= x*TILE_REAL && hand.mouse_x < (x+1)*TILE_REAL &&
                    hand.mouse_y >= y*TILE_REAL && hand.mouse_y < (y+1)*TILE_REAL){
                    drawTile(hand,x,y);
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
    if(state==TITLE){
        ctx.fillStyle = BLACK;
        ctx.font = "60px RetroGaming";
        ctx.fillText("Battle Of Two Kings", 84+PIXEL*2, 160);
        ctx.fillStyle = YELLOW;
        ctx.fillText("Battle Of Two Kings", 84, 160);
        ctx.font = "20px RetroGaming";
        ctx.fillStyle = BLACK;
        ctx.fillText("Developed by Istvan Szalontai for RTS JAM 1998", 134+PIXEL, 208);
        ctx.fillStyle = YELLOW;
        ctx.fillText("Developed by Istvan Szalontai for RTS JAM 1998", 134, 208);
        ctx.font = "40px RetroGaming";
        ctx.fillText("Click to play", 300, 420);
    }
    if(state == GAMEOVER){
        ctx.font = "40px RetroGaming";
        ctx.fillStyle = YELLOW;
        ctx.fillText("Game Over", 300, 420);
    }
    
    window.requestAnimationFrame(update);
    t++;
}

function ai(){
    if(t%100==0){
        let selected_item = getItemForAI();
        if(selected_item.item == GRASS){
            let selected_menuitem = getItemById(GRASS);
            let cube = random(0,100)
            if(isClosest(selected_item,FOREST)){
                selected_menuitem = getItemById(LUMBERMAN_BLUE);
            }
            if(cube>40 && isClosest(selected_item,STONE)){
                selected_menuitem = getItemById(STONECUTTER_BLUE);
            }
            
            if(cube>80){
                selected_menuitem = getItemById(FARM_BLUE);
            }                   
            
            let castle = getItemById(CASTLE_BLUE);
            if(cube>85 && castle.wood_has >= SAFE_AMOUNT*5 && castle.ore_has >= SAFE_AMOUNT*5){
                selected_menuitem = getItemById(BARRACKS_BLUE);
            }
            if(cube>90 && castle.wood_has >= SAFE_AMOUNT*5 && castle.ore_has >= SAFE_AMOUNT*5){
                selected_menuitem = getItemById(CASTLE_BLUE);
            }
            if(castle.food_has <= SAFE_AMOUNT){
                selected_menuitem = getItemById(FARM_BLUE);
            }
            if(castle.wood_has <= SAFE_AMOUNT || castle.ore_has <= SAFE_AMOUNT){
                if(isClosest(selected_item,FOREST)){
                    selected_menuitem = getItemById(LUMBERMAN_BLUE);
                }
                if(random(0,100)>50 && isClosest(selected_item,STONE)){
                    selected_menuitem = getItemById(STONECUTTER_BLUE);
                }
            }
            if(selected_menuitem.id != GRASS){
                if(castle.wood_has >= selected_menuitem.wood && castle.ore_has >= selected_menuitem.ore){
                    map[selected_item.id].item = selected_menuitem.id;
                    castle.wood_has -= selected_menuitem.wood;
                    castle.ore_has -= selected_menuitem.ore;
                    castle.workers_has += selected_menuitem.workers;
                }
            }
            
        }
        /*
        if(Math.random()>0.5){
            item = STONECUTTER_BLUE;
        }
        */
        
    }
}

function getItemForAI(){
    for(let i=0;i<100;i++){
        let selected_item = map[random(0,MAP_WIDTH*MAP_HEIGHT)];
        if(canBuild(selected_item, CASTLE_BLUE)){
            console.log(selected_item.item);
            return selected_item;
        }
    }
    return {item:FULL};
}

function eating(){
    for(let i=0;i<PLAYERS.length;i++){
        let item = getItemById(PLAYERS[i]);
        item.food_has -= item.workers_has * FACTOR;
        if(item.food_has <= 0){
            item.food_has = 0;
            item.workers_has -= FACTOR;
            if(item.workers_has <= 0){
                if(item.id == CASTLE_RED){
                    state = GAMEOVER;
                }
            }
        }
    }
}

function harvest(){
    let miners = [
        {castle:CASTLE_RED, miner:STONECUTTER,     resource:STONE},
        {castle:CASTLE_RED, miner:LUMBERMAN,       resource:FOREST},
        {castle:CASTLE_BLUE,miner:STONECUTTER_BLUE,resource:STONE},
        {castle:CASTLE_BLUE,miner:LUMBERMAN_BLUE,  resource:FOREST},
    ];

	for(let i=0;i<MAP_WIDTH*MAP_HEIGHT;i++){
        for(let j=0;j<miners.length;j++){
            if(map[i].item == miners[j].miner){
                m = getFirstClosest(map[i] , miners[j].resource);
                if(m.item == miners[j].resource){
                    m.amount -= PRODUCTIVITY;
                    let castle = getItemById(miners[j].castle);
                    if(miners[j].resource == FOREST){//ugly
                        castle.wood_has += PRODUCTIVITY;
                    }else{
                        castle.ore_has += PRODUCTIVITY;
                    }
                    if(m.amount<0){//remove resource if depleted
                        map[m.id].item = GRASS;
                    }
                }else{
                    //remove miner if no resource anymore
                    console.log(getItemById(miners[j].castle).workers_has +"-"+getItemById(miners[j].miner).workers)
                    getItemById(miners[j].castle).workers_has -= getItemById(miners[j].miner).workers;
                    map[i].item = GRASS;
                }
            }
		}
        if(map[i].item == FARM){
            getItemById(CASTLE_RED).food_has += FACTOR * 4;
        }
        if(map[i].item == FARM_BLUE){
            getItemById(CASTLE_BLUE).food_has += FACTOR * 4;
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
        let map = getMapByCoord(m.x+directions[i].x,m.y+directions[i].y);
        if(map.item == item){
            return map;
        }
    }
    
    return {item:EMPTY}
}

function isClosest(m,item){
    let directions = [
        {x:0,y:-1},
        {x:1,y:0},
        {x:0,y:1},
        {x:-1,y:0}
    ];
    for(let i=0;i<directions.length;i++){
        let map = getMapByCoord(m.x+directions[i].x,m.y+directions[i].y);
        if(map.item == item){
            return true;
        }
    }
    return false;
}

function getMapByCoord(x,y){
    for(let i=0;i<MAP_WIDTH*MAP_HEIGHT;i++){
        if(map[i].x == x && map[i].y == y){
            return map[i];
        }
    }
    return false;
}

function drawRect(width,height){
    let w = width*TILE_REAL;
    let h = height*TILE_REAL;
    ctx.fillStyle = GREY;
    ctx.fillRect((WIDTH-w)/2,(HEIGHT-h)/2,w,h);
}

function drawTile(item,x,y){
    ctx.drawImage(gfx,item.img_x,item.img_y,TILE,TILE,TILE_REAL*x,TILE_REAL*y,TILE_REAL,TILE_REAL);
}

function drawResource(item,x,y){
    ctx.drawImage(gfx, item.res_x, item.res_y,
        item.res_w, item.res_h,
        TILE_REAL*x, TILE_REAL*y,
        item.res_w * PIXEL, item.res_h * PIXEL);
}

function newGame(){	
    t = 0;
    state = PLAY;
    for(let i=0;i<PLAYERS.length;i++){
        let item = getItemById(PLAYERS[i]);
        item.wood_has = 6+level;
        item.ore_has = 6+level;
        item.food_has = 10;
        item.workers_has = 2;
    }
 
	inicMap();
}

function inicMap(){
    map = [];
    for(let i=0;i<MAP_WIDTH*MAP_HEIGHT;i++)
	{
		let item = GRASS;
		let animation = EMPTY;
		let r = random(0,100);
		if(r >= 60+level && r<100)item = FOREST;//fa ritkulnak
		if(r >= 35 && r<60)item = STONE;//sziklák nem ritkulnak
		if(r >= 35-level && r<35)item = LAKE;///tó több lesz
		let amount = random(5,20);//nyersanyag eloszlás
        let field={
            id:i,
            x:i%MAP_WIDTH,
            y:Math.floor(i/MAP_WIDTH),
            item:item,
            animation:animation,
            amount:amount,
            strength:0
        }
        map.push(field);
	}
	map[1+3*MAP_WIDTH].item = CASTLE_RED;//piros-vár
	map[1+3*MAP_WIDTH].strength = getItemById(CASTLE_RED).strength;//energiája
	map[MAP_WIDTH-2+3*MAP_WIDTH].item = CASTLE_BLUE;//kék-vár
	map[MAP_WIDTH-2+3*MAP_WIDTH].strength = getItemById(CASTLE_BLUE).strength;//energiája
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