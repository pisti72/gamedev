var speedf=0, speeds=0;
var rooms=[];//w(n-s),l(w-e),isdoorn,de,ds,dw,day/n,floor,windown,we,ws,ww,ghostnumber,curving (0-none)
var ghosts=[];//start_x, start_y, speed_x, speed_y
var levelup=[  10,  20,  50, 100, 150, 200, 1000];
//var levelup=[  5,  5,  5, 5, 5, 10, 1000];
var leveltext=[
			'The spirits have decided to\ncome into our world.\nBefore do that they have to\ncollect all of the six keys.\nThese keys open the gate of Otherworld.\nThese are hidden in\nsix different castles in the world.\n\nEnter into the first castle and find\nthe first key!',
			'2 of 6\nKey of Hope',
			'3 of 6\nKey of Love',
			'4 of 6\nKey of Fear',
			'5 of 6\nKey of Honor',
			'6 of 6\nKey of Destiny'];

var ghosthit=[.2, .2, .3, .4, .5, .6, .7];
var ghostindex;
var objname=['Piano','Table','Bed','Chair','Table2_vase','Candleholder','Harp'];
var map=[];//contains room index, if 999 there is no room
var mapsize;
var heroMap;
var volume = 100;
var mouse_x, mouse_y, lastmouse_x, deltaX;
var energy;
var currentenergy;
var visiblegauge=0;
var iam, hereiskey;
var level;
var lastroom, lastroomplace;
var showmap;
var LOOPS=3;//1=many loops    10=no loops, one way
const GAUGETIME = 100;
const GHOSTSIZE = 4;
const GHOSTWIDTH = 1.5;
const GHOSTLIKEHOOD = 8;
const GRID=0.16;
const BOTTOM=4;
const MAXSPEED=1.5/400; //10*5

const KEY_A = 65;
const KEY_W = 87;
const KEY_D = 68;
const KEY_S = 83;
const KEY_ESC = 27;
const KEY_ENTER = 13;

var maxspeed=1;
var slowdown=1;

const STATETITLE=0;
const STATEGAME=1;
const STATENEXTLEVEL=2;
const STATEEND=4;
const STATEDIED=5;
const STATECREDITS=6;

const MAPWIDTH=15;//paratlan
const MAPHEIGHT=15;//paratlan
const MAPNOPE=999999;//map.js
const MAPOUT =999998;
const MAPLOOPS = 2;
const ROOMSIZE=20;//18 volt
const TOUCHWIDTH=200;
var isMobile, isSound;
var sndAaah, sndDoor, sndWalking, sndWalkingGravel, sndFurniture, sndCure, sndOuch, sndPhew, sndGhost, sndChoir;
var sndForest, sndNight, sndScream, sndOhyeah, sndCoin, sndClick;
var imgMsg, imgTitle;

var state;

var lasttime=0;
var debug=0;


function start()
{
	//detecting android and ios
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf('android') > -1;
	var isiPad = ua.indexOf('ipad') > -1;
	var isiPhone = ua.indexOf('iphone') > -1;
	var isLinux = ua.indexOf('linux') > -1;
	var isWindows = ua.indexOf('win') > -1;
	if(isWindows || isLinux)isMobile = 0;
	if(isAndroid || isiPad || isiPhone)isMobile = 1;
	
	//events mouse+keyboard
	if(isMobile == 0)
	{
		window.addEventListener('mousemove', onMouseMove, false);
		window.addEventListener('keydown', keyPress, false);
		window.addEventListener('keyup', keyReleased, false);
        hide('gui_play');
        hide('gui_soundon');
        hide('gui_soundoff');
        hide('gui_back');
        hide('gui_credits');
        hide('gui_exit');
		//f('gui_play').addEventListener('mousedown', onClick, false);
        f('gamearea').addEventListener('mousedown', onClick, false);
		//f('gui_soundon').addEventListener('mousedown', soundSwitch, false);
		//f('gui_soundoff').addEventListener('mousedown', soundSwitch, false);
		//f('gui_back').addEventListener('mousedown', onBack, false);
		//f('gui_credits').addEventListener('mousedown', onCredits, false);
		//f('gui_exit').addEventListener('mousedown', onExit, false);
	}
	//events touch
	if(isMobile == 1)
	{
		f('gui_controller').addEventListener('touchmove', onTouchMove, false);
		f('gui_play').addEventListener('touchstart', onClick, false);
		f('gui_soundon').addEventListener('touchstart', soundSwitch, false);
		f('gui_soundoff').addEventListener('touchstart', soundSwitch, false);
		f('gui_back').addEventListener('touchstart', onBack, false);
		f('gui_credits').addEventListener('touchstart', onCredits, false);
		f('gui_exit').addEventListener('touchstart', onExit, false);
	}
	
	//loading sounds
	sndAaah = f('aaah');
	sndDoor = f('door');
	sndWalking = f('walking');
	sndWalkingGravel = f('walkinggravel');
	sndFurniture = f('furniture');
	sndCure = f('cure');
	sndOuch = f('ouch');
	sndPhew = f('phew');
	sndGhost = f('ghost');
	sndChoir = f('choir');
	sndForest = f('forest');
	sndNight = f('night');
	sndScream = f('scream');
	sndOhyeah = f('ohyeah');
	sndCoin = f('coin');
	sndClick = f('click');
	
	//loading images
	imgMsg = new Image();
	imgMsg.src = 'gfx/msg.png';
	imgTitle = new Image();
	imgTitle.src = 'gfx/title_en.png';
	
	
	//others
	
	inicRender();//b[]-feltölti
	energy=1;
	currentenergy=1;
	visiblegauge=0;
	ghostindex = 0;//kell?
	showbutton('gui_exit');
	showbutton('gui_credits');
	showbutton('gui_soundon');
	isSound = 1;
	showPlay();
	state=STATETITLE;
	inicHero();
	level = 1;
	showmap = 0;
	inicLevel(level);
	cursor('default');
	//createRoom(1);
	//show('debug');
	
	setInterval('gameloop()',20);//20=max:50 FPS
	//setInterval('gameloop()',75);
}

function inicLevel(n)
{
	cursor('default');
	mouse_x = 0;
	mouse_y = 0;
	heroMap = (MAPWIDTH-1)/2+(MAPHEIGHT-1)*MAPWIDTH;  //top-left is 0,0
	mapsize = levelup[n-1];
	generateRooms(mapsize+5);
	setHero(0,-(rooms[1]+7)*2,6);
	setHeroRotZ(0);
	pitchHero(0);
	//moveHero(0);//inic Head too
	heroShakeX=0;
	generateMap(mapsize);
	//alert(isObj('Map'));
	createMap();
	whereKey();
	inicObjIndex();//mégegyszer futtatjuk a createMap után
	createRoomZero();
	//createAllObj();
}

function hide(n)
{
	f(n).style.visibility = 'hidden';
}

function show(n)
{
	f(n).style.visibility = 'visible';
}

function showbutton(n)
{
	f(n).style.width = '92px';
	f(n).style.visibility = 'visible';
}

function hidebutton(n)
{
	f(n).style.width = '0px';
	f(n).style.visibility = 'hidden';
}

function showPlay()
{
	show('gui_play');
	f('gui_play').style.height = '140px';
}

function hidePlay()
{
	hide('gui_play');
	f('gui_play').style.height = '0px';
}

function change(n, p)
{
	f(n).innerHTML = p;
}

function position(n, p)
{
	f(n).style.backgroundPosition = p+'px';
}

function cursor(n)
{
	f('gamearea').style.cursor=n;
	f('gui_play_center').style.cursor=n;
}

function gameloop()
{
	var time = new Date();
	//debugPrint('DEMO');
	//change('debug',movementX);
		
	if(state == STATETITLE)sndAaah.play(); 
	/*
	
	STATE GAME
	
	*/
	if(state == STATEGAME)
	{	
		sndAaah.pause();
		//background sounds
		if(getMap(heroMap)==0)
		{
			if(rooms[6]==0)//day
			{
				sndForest.play();
			}else
			{
				sndNight.play();
			}
		}else
		{
			sndForest.pause();
			sndNight.pause();
		}
		//PC
		if(isMobile == 0)
		{
			if(mouse_x > w/2-40)turnHero(maxspeed*30);
			if(mouse_x < -w/2+40)turnHero(-maxspeed*30);
		}
		//tablet
		if(isMobile == 1)
		{
			turnHero(mouse_x/TOUCHWIDTH*maxspeed*50);
			speedf=mouse_y/TOUCHWIDTH*maxspeed*5;
			pitchHero(0);
		}
		//speedf
		moveHero(speedf);
		speedf*=slowdown;
		
		//speeds
		sideHero(speeds);
		speeds*=slowdown;
		
		isNextRoom();
		
		moveGhosts();
		collition();
		collitionGhosts();
		if(getEnergy() < 1)died();
		collitionCure();
		collitionKey();
		
		//walking sound
		if(speedf>-0.01 && speedf<0.01 && speeds>-0.01 && speeds<0.01)
		{
			sndWalking.pause();
			sndWalkingGravel.pause();
		}else
		{
			if(getMap(heroMap)==0)
			{
				sndWalkingGravel.play();
			}else
			{
				sndWalking.play();
			}
		}
	}
	//debugPrint(time.getTime()-lasttime);
	maxspeed = MAXSPEED*(time.getTime()-lasttime);
	slowdown = (0.95-0.87)/(0.112-0.28)*(maxspeed-0.28)+0.87;
	//debugPrint(getMap(heroMap));
	//change('debug',speedf+' , '+speeds);
	//change('debug',deltaX);
	//debugPrint('FPS: '+Math.floor(1000/(time.getTime()-lasttime))+'\t speed: '+maxspeed);
	lasttime = time.getTime();
	render();
	/*
	const STATETITLE=0;
    const STATEGAME=1;
    const STATENEXTLEVEL=2;
    const STATEEND=4;
    const STATECREDITS=5;
	*/
	if(state == STATENEXTLEVEL || state == STATEEND || state == STATECREDITS)
	{
		ctx.drawImage(imgMsg,(getWidth()-imgMsg.width)/2,(getHeight()-imgMsg.height)/2);
	}
	if(state == STATETITLE)
	{
		ctx.drawImage(imgTitle, 0, 0, imgTitle.width, 85,      (getWidth()-imgTitle.width*2)/2, (getHeight()-85)*.2, 2*imgTitle.width, 2*85);
        drawTextY('Created by Istvan Szalontai (c)2022\nVolume (W) '+volume+'% (S)');
	}
	if(state == STATENEXTLEVEL)
	{
		drawText(leveltext[level-1]);
		drawTitle(level);
	}
	if(state == STATECREDITS)
	{
		drawText('Created by Istvan Szalontai\n\nAll rights reserved (C)2013');
		drawTitle(9);
	}
	if(state == STATEEND)
	{
		drawText('You made it!\nThe last key has been found!\nThe spirits from the other side\ncan not come into our world.');
		drawTitle(7);
	}
	if(state == STATEDIED)
	{
		drawText('Get out from my castle!\nYou are in the park again.');
		drawTitle(8);
	}
	//if(showmap==1)drawMap();
	drawEnergybar();
	updateVisiblegauge();
}

function drawTitle(n)
{
	var titleoffset=[0, 85, 172, 256, 337, 417, 502, 583, 657, 740];
    var y = (getHeight()-imgMsg.height)/2;
	ctx.drawImage(imgTitle, 0, titleoffset[n], imgTitle.width, 85,      (getWidth()-imgTitle.width)/2, /*(getHeight()-90)*.3*/y-30, imgTitle.width, 90);
}

function drawText(t)
{
	const HEIGHT = 20;
	var i, textx, texty, textwidth;
	var line = t.split('\n');
	var rows = line.length;
	var metrics;
	//ctx.font = '16pt Calibri';
    ctx.font = '16px CaviarDreams';
	ctx.fillStyle = COLOR_BLACK;
	for (i=0; i<rows; i++)
	{
		metrics = ctx.measureText(line[i]);
		textx = (getWidth()-metrics.width)/2;
		texty = (getHeight()-HEIGHT*rows)/2+(i+1)*HEIGHT;
		textwidth = ctx.measureText(t);
		ctx.fillText(line[i], textx, texty );
	}
}

function drawTextY(t,y)
{
	const HEIGHT = 20;
    const MARGIN = 4;
	var i, textx, texty, textwidth;
	var line = t.split('\n');
	var rows = line.length;
	var metrics;
	//ctx.font = '16pt Calibri';
    ctx.font = '16px CaviarDreams';
    ctx.fillStyle = COLOR_WHITE;
    for (i=0; i<rows; i++)
	{
        metrics = ctx.measureText(line[i]);
		textx = (getWidth()-metrics.width)/2;
		texty = (getHeight()-HEIGHT*rows)/2+(i+1)*HEIGHT;
        ctx.fillRect(textx-MARGIN, texty+MARGIN, metrics.width + MARGIN * 2, -HEIGHT - 2*MARGIN);
    }
    ctx.fillStyle = COLOR_BLACK;
	for (i=0; i<rows; i++)
	{
		metrics = ctx.measureText(line[i]);
		textx = (getWidth()-metrics.width)/2;
		texty = (getHeight()-HEIGHT*rows)/2+(i+1)*HEIGHT;
        ctx.fillText(line[i], textx, texty );
	}
    
}


function onMouseMove(e)
{
	var k=50;
	mouse_x = e.pageX-w/2;
	mouse_y = e.pageY-h/2;
	if(deltaX == undefined)
	{
		lastmouse_x = mouse_x;
		deltaX = 0;
	}else
	{
		deltaX = mouse_x-lastmouse_x;
		lastmouse_x = mouse_x;
	}
	if(state == STATEGAME)k=180;
	if(deltaX != undefined)turnHero(deltaX/w*k);
	pitchHero(mouse_y/h*k);
}

function onTouchMove(e)
{
	e.preventDefault();
	mouse_x=e.touches[0].clientX-TOUCHWIDTH/2-f("gui_controller").offsetLeft;
	mouse_y=TOUCHWIDTH/2-e.touches[0].clientY+f("gui_controller").offsetTop;
	//change('debug',mouse_x+' , '+mouse_y);
}

function onClick(e)
{
	if(state == STATENEXTLEVEL || state == STATEDIED)
	{
		sndClick.play();
		setHero(0, -rooms[0+1]-2, 0);
		state = STATEGAME;
		cursor('none');
		addEnergy(100);
		currentenergy = 1;
		//hidePlay();
		//if(isMobile == 1)show('gui_controller');
	}
	
	if(state == STATETITLE)
	{
		sndClick.play();
		state = STATENEXTLEVEL;
		showmap = 0;
		//hidebutton('gui_exit');
		//hidebutton('gui_credits');
		//hidebutton('gui_soundon');
		//hidebutton('gui_soundoff');
		//showbutton('gui_back');
	}
	
	if(state == STATEEND)
	{
		sndClick.play();
		state = STATETITLE;
		//hide('gui_controller');
		//hidebutton('gui_back');
		//showbutton('gui_exit');
		//showbutton('gui_credits');
		//showbutton('gui_soundon');
	}
}

function decVolume(){
    if(volume>=20){
        volume -= 20;
    }
    setVolume(volume);
    //sndCoin.play();
}

function incVolume(){
    if(volume<=80){
        volume += 20;
    }
    setVolume(volume);
    //sndCoin.play();
}

function keyPress(e)
{
    if(state == STATEGAME){
	    if(e.which==KEY_A || e.which==37)speeds=-maxspeed*0.8;
	    if(e.which==KEY_D || e.which==39)speeds=maxspeed*0.8;
	    if(e.which==KEY_W || e.which==38)speedf=maxspeed;
	    if(e.which==KEY_S || e.which==40)speedf=-maxspeed;
        if(e.which==KEY_ESC){
		    level = 1;
		    inicLevel(level);
	        state = STATETITLE;
        }
    }else if(state == STATETITLE){
        if(e.which==KEY_W){
            incVolume();
        }else if(e.which==KEY_S){
            decVolume();
        }
    }
    if(e.which==KEY_ENTER){
        onClick(e);
    }
    //console.log(e.which);
	/*
	if(e.which==81)turnHero(-5);//q
	if(e.which==69)turnHero(5);//e
	if(e.which==45)toggleMap();//INS
	if(e.which==46)addEnergy(-50);//DEL
	*/
	//debugPrint(e.keyCode);
}

function keyReleased(e)
{
/*
	if(e.which==65 || e.which==37)speeds=0;//d
	if(e.which==68 || e.which==39)speeds=0;//a
	if(e.which==87 || e.which==38)speedf=0;//w
	if(e.which==83 || e.which==40)speedf=0;//s
*/
}

function soundSwitch(e)
{
	if(isSound == 1)
	{
		hidebutton('gui_soundon');
		showbutton('gui_soundoff');
		setVolume(0);
		isSound = 0;
	}else
	{
		hidebutton('gui_soundoff');
		showbutton('gui_soundon');
		setVolume(volume);
		sndClick.play();
		isSound = 1;
	}
}

function onBack(e)
{
	cursor('default');
	sndClick.play();
	
	if(state == STATEGAME || state == STATENEXTLEVEL)
	{
		level = 1;
		inicLevel(level);
	}
	state = STATETITLE;
	hide('gui_controller');
	hidebutton('gui_back');
	showbutton('gui_exit');
	showbutton('gui_credits');
	if(isSound == 1)showbutton('gui_soundon');
	if(isSound == 0)showbutton('gui_soundoff');
	showPlay();
}

function onCredits(e)
{
	sndClick.play();
	state = STATECREDITS;
	showbutton('gui_back');
	hidebutton('gui_exit');
	hidebutton('gui_credits');
	hidebutton('gui_soundon');
	hidebutton('gui_soundoff');
	hidePlay();
}

function onExit(e)
{
	sndClick.play();
	window.location = "http://jatekfejlesztes.hu/"
}

function toggleMap()
{
	if(showmap==0)
	{
		showmap=1;
	}else
	{
		showmap=0;
	}
}

function isNextRoom()
{
	var offset=getMap(heroMap)*ROOMSIZE;
	var t=collitionBorder();
	var width;
	var length;
	var isdoorn = rooms[offset+2];
	var isdoore = rooms[offset+3];
	var isdoors = rooms[offset+4];
	var isdoorw = rooms[offset+5];
	
	if(isdoorn==1 && t=='n')
	{
		heroMap-=MAPWIDTH;
		createRoom(getMap(heroMap));
		length = rooms[ROOMSIZE*getMap(heroMap)+1];
		setHeroY(1.1-length*2);
		sndDoor.play();
	}
	
	if(isdoore==1 && t=='e')
	{
		heroMap++;
		createRoom(getMap(heroMap));
		width = rooms[ROOMSIZE*getMap(heroMap)+0];
		setHeroX(1.1-width*2);
		sndDoor.play();
	}
	
	if(isdoors==1 && t=='s')
	{
		heroMap+=MAPWIDTH;
		if(getMap(heroMap)==0)createRoomZero();
		if(getMap(heroMap)!=0)createRoom(getMap(heroMap));
		length = rooms[ROOMSIZE*getMap(heroMap)+1];
		setHeroY(length*2-1.1);
		sndDoor.play();
	}
	
	if(isdoorw==1 && t=='w')
	{
		heroMap--;
		createRoom(getMap(heroMap));
		width = rooms[ROOMSIZE*getMap(heroMap)+0];
		setHeroX(width*2-1.1);
		sndDoor.play();
	}
}

function createRoom(r)//create room from rooms[] array
{
	var i,j,k;
	
	var offset = ROOMSIZE*r;
	var width      = rooms[offset+0];
	var realwidth  = width*2-1;
	var length     = rooms[offset+1];
	var reallength = length*2-1;
	var isdoorn    = rooms[offset+2];
	var isdoore    = rooms[offset+3];
	var isdoors    = rooms[offset+4];
	var isdoorw    = rooms[offset+5];
	var isday      = rooms[offset+6];
	var isfloor    = rooms[offset+7];
	var iswindown  = rooms[offset+8];
	var iswindowe  = rooms[offset+9];
	var iswindows  = rooms[offset+10];
	var iswindoww  = rooms[offset+11];
	var obj=[rooms[offset+12], rooms[offset+14], rooms[offset+16]];
	var objplace=[rooms[offset+13], rooms[offset+15], rooms[offset+17]];
	var ghostnumber = rooms[offset+18];
	var cure		= rooms[offset+19];
	
	if(r == lastroom)
	{
		isday = 0;
		isfloor = 2;//square
	}
	setLight(isday);
	
	setBorder(width*2-1, length*2-1);
	emptyWorld();
	
	//create windows
	k=Math.floor(width/2);//3=1, 4=1, 5=2, 6=3,
	if(width==2)k--;
	if(width==4)k--;
	if(width==11)k++;
	if(width>12)k++;
	
	for(i=-k-1; i<k; i++)
	{
		if(iswindown==1){if(i!=-1 || isdoorn==0)pushObject('Window', i*3+3, (length+1)*2-3, 0, 3, 0);}
		if(iswindows==1){if(i!=-1 || isdoors==0)pushObject('Window', i*3+3, 3-(length+1)*2, 0, 1, 0);}
	}
	
	k=Math.floor(length/2);
	if(length==2)k--;
	if(length==4)k--;
	if(length==11)k++;
	if(length>12)k++;
	
	for(i=-k-1; i<k; i++)
	{
		if(iswindowe==1){if(i!=-1 || isdoore==0)pushObject('Window', (width+1)*2-3, i*3+3, 0, 2, 0);}
		if(iswindoww==1){if(i!=-1 || isdoorw==0)pushObject('Window', 3-(width+1)*2, i*3+3, 0, 4, 0);}
	}
	
	//create doors
	if(isdoorn==1)pushObject('Door', 0, length*2-1, 0, 3, 0);
	if(isdoorw==1)pushObject('Door', 1-width*2, 0, 0, 4, 0);
	if(isdoors==1)pushObject('Door', 0, 1-length*2, 0, 1, 0);
	if(isdoore==1)pushObject('Door', width*2-1, 0, 0, 2, 0);
	
	//create map on the north wall
	if(isdoorn==0 && isday==0 && iswindown==0)
	{
		//rossz!! paros kastelyba nem tesz terkepet
		sndPhew.play();
		whereIam();
		pushObject('Map', 0, length*2-1, 0, 3, 0);
		ghostnumber = 0;
	}
	
	//create floor
	for(i=0; i<realwidth; i++)//1=1, 2=3, 3=5  (n-1)*2+1=n*2-2+1
	{
		for(j=0; j<reallength; j++)
		{
			if(isfloor==1)pushObject('Floor1_checked', (i-width+1)*2, (j-length+1)*2, 0, 1, 0);
			if(isfloor==2)pushObject('Floor2_square', (i-width+1)*2, (j-length+1)*2, 0, 1, 0);
			if(isfloor==3)pushObject('Floor3_star', (i-width+1)*2, (j-length+1)*2, 0, 1, 0);
		}
	}
	
	//create corner
	pushObject('Corner', (1-width)*2, (1-length)*2, 0, 4, 0);
	pushObject('Corner', (width-1)*2, (1-length)*2, 0, 1, 0);
	pushObject('Corner', (width-1)*2, (length-1)*2, 0, 2, 0);
	pushObject('Corner', (1-width)*2, (length-1)*2, 0, 3, 0);
	
	//create Chandelier
	if(isday == 0 && width < length) pushObject('Chandelier', 0, 0, 0, 1, 0);
	
	//create objects
	for(j=0; j<3; j++)
	{
		pushObject(objname[obj[j]], (1-width+objplace[j]%realwidth)*2, (1-length+Math.floor(objplace[j]/realwidth))*2, 0, 1, 1);//has physic
	}
	
	//create fireplace
	//if(iswindown == 0 && isdoorn == 0 && r%4 == 0)pushObject('Fireplace', 0, length*2-1, 0, 3, 0);//here is the map
	if(iswindowe == 0 && isdoore == 0 && r%4 == 1)pushObject('Fireplace', width*2-1, 0, 0, 2, 0);
	if(iswindows == 0 && isdoors == 0 && r%4 == 2)pushObject('Fireplace', 0, 1-length*2, 0, 1, 0);
	if(iswindoww == 0 && isdoorw == 0 && r%4 == 3)pushObject('Fireplace', 1-width*2, 0, 0, 4, 0);
	
	//create knights
	if(isdoorn == 1 && r%3 == 0)
	{
		pushObject('Knight', -2, length*2-1.2, 0, 3, 1);
		pushObject('Knight', 2, length*2-1.2, 0, 3, 1);
	}
	
	if(isdoore == 1 && r%4 == 1)
	{
		pushObject('Knight', width*2-1.2, 2, 0, 2, 1);
		pushObject('Knight', width*2-1.2,-2, 0, 2, 1);
	}
	
	//create cure
	if(cure == 1)pushObject('Cure', r%5-2, (r+1)%5-2, 0, 1, 0);//can be collected
	
	//create key
	if(r == lastroom)
	{
		ghostnumber = 0;
		pushObject('Key', 0, 0, 0, 1, 0);
		if(level==1)pushObject('Keyholder2_cylinder', 0, 0, 0, 1, 0);
		//if(level==1)pushObject('Keyholder1_angel', 0, 0, 0, 1, 0);
		if(level==2)pushObject('Keyholder3_ring', 0, 0, 0, 1, 0);
		if(level==3)pushObject('Keyholder4_golem', 0, 0, 0, 1, 0);
		if(level==4)pushObject('Keyholder6_chest', 0, 0, 0, 1, 0);
		if(level==5)pushObject('Keyholder5_prison', 0, 0, 0, 1, 0);
		if(level==6)pushObject('Keyholder1_angel', 0, 0, 0, 1, 0);
	}

	//create ghosts
	emptyGhosts();
	for(i=0; i<ghostnumber; i++)
	{
		pushGhost( (rnd(2)*2-1)*width , (rnd(2)*2-1)*length , (rnd(2)+1)*(rnd(2)*2-1) , (rnd(2)+1)*(rnd(2)*2-1) ); 
	}
}

function createRoomZero()
{
	var width;
	var length;
	var r;
	var i,j;
	const WALLWIDTH=6;
	width = rooms[0];
	length = rooms[1];
	
	setLight(rooms[6]);
	setBorder(width*2-1, length*2-1);
	emptyWorld();
	//ray trace left side
	for(i=0; i<(MAPWIDTH-1)/2; i++)
	{
		j=MAPHEIGHT;
		do
		{
			j--;
		}while(j>1 && getMap(i+j*MAPWIDTH)==MAPNOPE);
		
		if(getMap(i+j*MAPWIDTH)!=MAPNOPE || i>(MAPWIDTH-1)/2-3)
		{
			r=rnd(6);
			if(r==0)
			{
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH, 3, 0);
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH*2, 3, 0);
				pushObject('Wallbottom', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, 0, 3, 0);
			}
			if(r==1)
			{
				if(rnd(3)==0)pushObject('Tower', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH, 3, 0);
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH, 3, 0);
				pushObject('Wallbottom', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, 0, 3, 0);
			}
			if(r>1)
			{
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, 0, 3, 0);
			}
		}
	}
	//ray trace right side
	for(i=MAPWIDTH-1; i>(MAPWIDTH-1)/2; i--)
	{
		j=MAPHEIGHT;
		do
		{
			j--;
		}while(j>1 && getMap(i+j*MAPWIDTH)==MAPNOPE);

		if(getMap(i+j*MAPWIDTH)!=MAPNOPE || i<(MAPWIDTH-1)/2+3)
		{
			r=rnd(6);
			if(r==0)
			{
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH, 3, 0);
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH*2, 3, 0);
				pushObject('Wallbottom', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, 0, 3, 0);
			}
			
			if(r==1)
			{
				if(rnd(3)==0)pushObject('Tower', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH, 3, 0);
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, WALLWIDTH, 3, 0);
				pushObject('Wallbottom', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, 0, 3, 0);
			}
			
			if(r>1)
			{
				pushObject('Walltop', (i-(MAPWIDTH-1)/2)*WALLWIDTH, length*2-1, 0, 3, 0);
			}
			
		}
	}
	
	pushObject('Tower',    0, length*2-1, WALLWIDTH*2, 3, 0);
	pushObject('Walltop',  0, length*2-1, WALLWIDTH, 3, 0);
	pushObject('Walltop',  0, length*2-1, WALLWIDTH*2, 3, 0);
	pushObject('Wallgate', 0, length*2-1, 0, 3, 0);
	pushObject('Oldtimer', 4, length*2-1-4, 0, 2, 1);
	//path
	for(i=-length; i<length; i++)
	{
		pushObject('Floor4_outdoor', 0, i*2, 0, 1, 0);
		
		if((i+1000)%2 == 0 && isMobile == 0)
		{
			pushObject('Bush2', -8, i*2, 0, 1, 0);
			pushObject('Bush2', 8, i*2, 0, 1, 0);
		}
		/*
		if((i+1000)%2==1)
		{
			pushObject('Bush1', -11, i*2, 0, 1, 0);
			pushObject('Bush1', 11, i*2, 0, 1, 0);
		}
		*/
		if((i+1000)%3==0 && isMobile == 0)
		{
			pushObject('Vase_outdoor', -2, i*2, 0, 1, 1);
			pushObject('Vase_outdoor', 2, i*2, 0, 1, 1);
		}
	}
	//gate
	pushObject('Gate', 0, -length*2, 0, 3, 0);
	//trees random
	for(i=0; i<6; i++)
	{
		pushObject('Tree', (rnd(width+1)*2-width)*6, -length*2-5-rnd(length)*6, 0, rnd(4)+1, 0);
	}
	
	emptyGhosts();
	
	setCurve(0);
	
	/*
	whereIam();
	pushObject('Map', 0, length*2-1-15, 0, 3);
	*/
}

function createAllObj()
{
	const WALLWIDTH=6;
	var width=200;
	var length=200;
	var allObj=['Cure','Bush2','Tree','Floor4_outdoor','Fireplace',
	'Bed','Tower','Key','Chair','Chandelier',
	'Table2_vase','Vase_outdoor2','Knight','Gate','Bush1',
	'Wallgate','Wallbottom','Walltop','Floor3_star','Floor2_square',
	'Oldtimer','Window','Corner','Door','Floor1_checked',
	'Test_cube','Table','Piano','JF_logo'];
	setLight(1);
	setBorder(width*2-1, length*2-1);
	emptyWorld();
	setCurve(0);
	for(var i=0; i<allObj.length; i++)
	{
		pushObject(allObj[i], i*WALLWIDTH, 0, 0, 1, 0);
	}
	
}

function generateRooms(amount)
{
	var r, width, length, t;
	rooms[0]=10;//width
	rooms[1]=5+level;//length 
	
	rooms[2]=0;
	rooms[3]=0;
	rooms[4]=0;
	rooms[5]=0;
    rooms[6]=SKY_DAY;
    if(level%2==0){
        rooms[6]=SKY_FULLMOON;
    }
	rooms[7]=0;
	rooms[8]=0;
	rooms[9]=0;
	rooms[10]=0;
	rooms[11]=0;
	rooms[12]=0;
	rooms[13]=0;
	rooms[14]=0;
	rooms[15]=0;
	rooms[16]=0;
	rooms[17]=0;
	rooms[18]=0;
	rooms[19]=0;
	
	for(var i=1; i<amount; i++)
	{
		//size
		width = rnd(9)+2;//2-10
		length = rnd(10-width)+2;//2-10
		rooms[i*ROOMSIZE+0]=width;
		rooms[i*ROOMSIZE+1]=length;
		//doors
		rooms[i*ROOMSIZE+2]=0;
		rooms[i*ROOMSIZE+3]=0;
		rooms[i*ROOMSIZE+4]=0;
		rooms[i*ROOMSIZE+5]=0;
		//day
		rooms[i*ROOMSIZE+6]=0;
		if(rnd(6)>=4 && i!=mapsize-1)rooms[i*ROOMSIZE+6]=1;//if 4 or 5
		//floor
		rooms[i*ROOMSIZE+7]=0;
		if(rooms[i*ROOMSIZE+6] == 0)rooms[i*ROOMSIZE+7]=rnd(3)+1;//on day floor can be
		//window
		rooms[i*ROOMSIZE+8]=rnd(2);
		rooms[i*ROOMSIZE+9]=rnd(2);
		rooms[i*ROOMSIZE+10]=rnd(2);
		rooms[i*ROOMSIZE+11]=rnd(2);
		//objects none
		rooms[i*ROOMSIZE+12]=rnd(objname.length);
		t=rnd((width*2-1)*(length*2-1)/3);
		rooms[i*ROOMSIZE+13]=t;
		rooms[i*ROOMSIZE+14]=rnd(objname.length);
		t+=rnd((width*2-1)*(length*2-1)/3);
		rooms[i*ROOMSIZE+15]=t;
		rooms[i*ROOMSIZE+16]=rnd(objname.length);
		t+=rnd((width*2-1)*(length*2-1)/3);
		rooms[i*ROOMSIZE+17]=t;
		//ghostnumber
		rooms[i*ROOMSIZE+18]=0;
		if(rnd(GHOSTLIKEHOOD) < level) rooms[i*ROOMSIZE+18] = rnd(4);//0 - 3 szellem a szobaban
		//if(rooms[i*ROOMSIZE+6] > 0) rooms[i*ROOMSIZE+18] = 0;//csak vilagos szobaban lehet
		//cure
		rooms[i*ROOMSIZE+19] = 0;
		if(i%3 == 0 && i < mapsize-3)rooms[i*ROOMSIZE+19] = 1;
	}
}

function putMap(p,o)
{
	map[p]=o;
}

function getMap(p)
{
	return map[p];
}

function getMapNorth(p)
{
	if(p<MAPWIDTH)return MAPOUT;
	return map[p-MAPWIDTH];
}

function getMapEast(p)
{
	if(p%MAPWIDTH==MAPWIDTH-1)return MAPOUT;
	if(Math.floor(p/MAPWIDTH)>=MAPHEIGHT-1)return MAPOUT;
	return map[p+1];
}

function getMapSouth(p)
{
	if(Math.floor(p/MAPWIDTH)>=MAPHEIGHT-2)return MAPOUT;
	return map[p+MAPWIDTH];
}

function getMapWest(p)
{
	if(p%MAPWIDTH==0)return MAPOUT;
	if(Math.floor(p/MAPWIDTH)>=MAPHEIGHT-1)return MAPOUT;
	return map[p-1];
}
/*
put doors
*/
function putDoorNorth(p)
{
	rooms[getMap(p)*ROOMSIZE+2]=1;
}

function putDoorEast(p)
{
	rooms[getMap(p)*ROOMSIZE+3]=1;
}

function putDoorSouth(p)
{
	rooms[getMap(p)*ROOMSIZE+4]=1;
}

function putDoorWest(p)
{
	rooms[getMap(p)*ROOMSIZE+5]=1;
}
/*
join rooms
*/
function joinRoomsNorth(p)
{
	putDoorNorth(p);
	putDoorSouth(p-MAPWIDTH);
}

function joinRoomsEast(p)
{
	putDoorEast(p);
	putDoorWest(p+1);
}

function joinRoomsSouth(p)
{
	putDoorSouth(p);
	putDoorNorth(p+MAPWIDTH);
}

function joinRoomsWest(p)
{
	putDoorWest(p);
	putDoorEast(p-1);
}

function generateMap(size)//making graf
{
	//clear map
	for(var i=0; i<MAPWIDTH*MAPHEIGHT; i++)
	{
		putMap(i,MAPNOPE);
	}
	
	var pos=heroMap;
	
	var k;
	var t;
	var j;
	var n;
	
	//const DOORN=2;
	//const DOORE=3;
	//const DOORS=4;
	//const DOORW=5;
	//generatemap
	i=1;
	putMap(pos,0);
	do
	{
		j=0;//trials
		do
		{
			k=rnd(4);//0,1,2,3
			//k=3;
			if(k==0)t=getMapNorth(pos);//t=next  roomnumber
			if(k==1)t=getMapEast(pos);
			if(k==2)t=getMapSouth(pos);
			if(k==3)t=getMapWest(pos);
			j++;
		}while(t==MAPOUT || (t!=MAPNOPE && j<MAPLOOPS));//t=vmi, t=MAPOUT, t=MAPNOPE
		//found MAPNOPE=empty cell 90% de lehet
		//itt már tudom merre megyek,
		//odalepek
		if(k==0)pos-=MAPWIDTH;
		if(k==1)pos++;
		if(k==2)pos+=MAPWIDTH;
		if(k==3)pos--;
		//beteszem a szobaszámot
		if(getMap(pos)==MAPNOPE)putMap(pos,i);//uj elemet teszek be
		//tehetem az ajtot mögém
		if(k==0)joinRoomsSouth(pos);
		if(k==1)joinRoomsWest(pos);
		if(k==2)joinRoomsNorth(pos);
		if(k==3)joinRoomsEast(pos);
		lastroom = getMap(pos);
		lastroomplace = pos;
		i++;
	}while(i<size);
}

function createMap()
{
	var n;
	var i;
	var center=(MAPWIDTH*GRID)/2;
	if(isObj('Map')==0)//nincs még térképünk
	{
		n = b.length;
		b[n] = 'Map';
	}else
	{
		n=getObjPointer('Map');//már van térképünk, felülírjuk
	}
	n++;
	//create vertices
	for(i=0; i<MAPWIDTH*MAPHEIGHT; i++)
	{
		t=getMap(i);
		if(t!=MAPNOPE)
		{	
			b[n++]='v';
			b[n++]=''+((i%MAPWIDTH)*GRID-center);
			b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID);
			b[n++]='0.00';
			b[n++]='v';
			b[n++]=''+((i%MAPWIDTH)*GRID+GRID-0.02-center);
			b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID);
			b[n++]='0.00';
			b[n++]='v';
			b[n++]=''+((i%MAPWIDTH)*GRID+GRID-0.02-center);
			b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+GRID-0.02);
			b[n++]='0.00';
			b[n++]='v';
			b[n++]=''+((i%MAPWIDTH)*GRID-center);
			b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+GRID-0.02);
			b[n++]='0.00';
			//doors
			if(rooms[t*ROOMSIZE+2]==1)//north
			{
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+(GRID-0.02)/2-0.02-center);// (12-2)/2-2
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+GRID+0.01);
				b[n++]='0.00';
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+(GRID-0.02)/2-0.02+0.04-center);
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+GRID+0.01);
				b[n++]='0.00';
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+(GRID-0.02)/2-0.02+0.04-center);
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+GRID-0.04);
				b[n++]='0.00';
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+(GRID-0.02)/2-0.02-center);
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+GRID-0.04);
				b[n++]='0.00';
			}
			if(rooms[t*ROOMSIZE+3]==1)//east
			{
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+GRID-0.03-center);
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+(GRID-0.02)/2+0.02);
				b[n++]='0.00';
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+GRID+0.02-center);
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+(GRID-0.02)/2+0.02);
				b[n++]='0.00';
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+GRID+0.02-center);
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+(GRID-0.02)/2+0.02-0.04);
				b[n++]='0.00';
				b[n++]='v';
				b[n++]=''+((i%MAPWIDTH)*GRID+GRID-0.03-center);
				b[n++]=''+(BOTTOM-Math.floor(i/MAPWIDTH)*GRID+(GRID-0.02)/2+0.02-0.04);
				b[n++]='0.00';
			}
			if(i == heroMap)//ok a vegere jonnek
			{
				
				iam = n;
				
				b[n++]='v'; b[n++]=0.03; b[n++]=0.02;	b[n++]=0.00;
				b[n++]='v';	b[n++]=GRID-0.05;	b[n++]=0.02; b[n++]=0.00;
				b[n++]='v';	b[n++]=(GRID-0.02)/2;	b[n++]=GRID-0.04;	b[n++]=0.00;
				
				hereiskey = n;
				const c=0.05;
				const d=0.01;
				b[n++]='v';	b[n++]=-0.07*c-d; b[n++]=-0.44*c; b[n++]=0.00;
				b[n++]='v';	b[n++]=-0.71*c-d; b[n++]=-0.44*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.07*c-d; b[n++]= 0.48*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.71*c-d; b[n++]= 0.48*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.07*c-d; b[n++]=-0.12*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.07*c-d; b[n++]= 0.16*c; b[n++]=0.00;
				b[n++]='v'; b[n++]= 0.44*c-d; b[n++]=-0.12*c; b[n++]=0.00;
				b[n++]='v'; b[n++]= 0.77*c-d; b[n++]= 0.16*c; b[n++]=0.00;
				b[n++]='v'; b[n++]= 0.77*c-d; b[n++]=-0.45*c; b[n++]=0.00;
				b[n++]='v'; b[n++]= 0.44*c-d; b[n++]=-0.44*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.26*c-d; b[n++]=-0.24*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.52*c-d; b[n++]=-0.24*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.26*c-d; b[n++]= 0.28*c; b[n++]=0.00;
				b[n++]='v'; b[n++]=-0.52*c-d; b[n++]= 0.28*c; b[n++]=0.00;
			}
		}
	}
	b[n++]='usemtl';
	b[n++]='black';
	//create faces
	var j=0;
	for(i=0; i<MAPWIDTH*MAPHEIGHT; i++)
	{
		t=getMap(i);
		if(t!=MAPNOPE)
		{	
			b[n++]='f';
			b[n++]=0+j;
			b[n++]=1+j;
			b[n++]=2+j;
			b[n++]=3+j;
			j+=4;			
			if(rooms[t*ROOMSIZE+2]==1)
			{
				b[n++]='f';
				b[n++]=0+j;
				b[n++]=1+j;
				b[n++]=2+j;
				b[n++]=3+j;
				j+=4;	
			}
			if(rooms[t*ROOMSIZE+3]==1)
			{
				b[n++]='f';
				b[n++]=0+j;
				b[n++]=1+j;
				b[n++]=2+j;
				b[n++]=3+j;
				j+=4;	
			}
		}
	}
	//végére fehér háromszög
	b[n++]='usemtl';
	b[n++]=COLOR_WHITE;
	b[n++]='f';
	b[n++]=0+j;
	b[n++]=1+j;
	b[n++]=2+j;
	j+=3;

	//és a kulcs
	b[n++]='usemtl';
	b[n++]=COLOR_WHITE;
	b[n++]='f';
	b[n++]=4+j; b[n++]=0+j; b[n++]=1+j; b[n++]=3+j; b[n++]=2+j; b[n++]=5+j;
	b[n++]=7+j; b[n++]=8+j; b[n++]=9+j; b[n++]=6+j;
	b[n++]='usemtl';
	b[n++]='black';
	b[n++]='f';
	b[n++]=12+j; b[n++]=10+j; b[n++]=11+j; b[n++]=13+j;
	
	b[n++]='o';
}

function whereIam()
{
	
	var center=(MAPWIDTH*GRID)/2;
	var n = iam;
	var i = heroMap;
	var x = (i%MAPWIDTH)*GRID-center;
	var y = BOTTOM-Math.floor(i/MAPWIDTH)*GRID;
	
	n++;//v
	b[n]=0.03+x; n++;
	b[n]=0.02+y; n++;
	n++;//0.00
	n++;//v
	b[n]=GRID-0.05+x; n++;
	b[n]=0.02+y; n++;
	n++;//0.00
	n++;//v
	b[n]=(GRID-0.02)/2+x; n++;
	b[n]=GRID-0.04+y; n++;
}

function whereKey()
{
	var center=(MAPWIDTH*GRID)/2;
	var n = hereiskey;
	var i = lastroomplace;
	var x = (i%MAPWIDTH)*GRID-center+GRID/2;
	var y = BOTTOM-Math.floor(i/MAPWIDTH)*GRID+GRID/2;
	var j;
	for (j=0; j<14; j++)
	{
		n++;//v
		b[n]=b[n]*1+x;n++;
		b[n]=b[n]*1+y;n++;
		n++;//0.00
	}
}

function drawMap()
{
	var t;
	ctx.fillStyle = COLOR_WHITE;
	ctx.strokeStyle = 'black';
	ctx.lineWidth=1;
	for(var i=0; i<MAPWIDTH*MAPHEIGHT; i++)
	{
		t=getMap(i);
		//if(t==MAPNOPE)ctx.strokeStyle = 'grey';
		
		
		if(t!=MAPNOPE)
		{
			ctx.fillRect(30+(i%MAPWIDTH)*12-1, 30+Math.floor(i/MAPWIDTH)*12-1, 12, 12);
			ctx.beginPath();
			ctx.rect(30+(i%MAPWIDTH)*12, 30+Math.floor(i/MAPWIDTH)*12, 10, 10);
			ctx.stroke();
			if(i==heroMap)
			{
				ctx.beginPath();
				ctx.rect(30+(i%MAPWIDTH)*12+4, 30+Math.floor(i/MAPWIDTH)*12+4, 2, 2);
				ctx.stroke();
			}
			//ctx.fillStyle = 'white';
			ctx.beginPath();
			
			if(rooms[t*ROOMSIZE+2]==1)ctx.fillRect(30+(i%MAPWIDTH)*12+3, 30+Math.floor(i/MAPWIDTH)*12-1, 4, 2);//north
			if(rooms[t*ROOMSIZE+3]==1)ctx.fillRect(30+(i%MAPWIDTH)*12+9, 30+Math.floor(i/MAPWIDTH)*12+3, 2, 4);//east
			if(rooms[t*ROOMSIZE+4]==1)ctx.fillRect(30+(i%MAPWIDTH)*12+3, 30+Math.floor(i/MAPWIDTH)*12+9, 4, 2);//south
			if(rooms[t*ROOMSIZE+5]==1)ctx.fillRect(30+(i%MAPWIDTH)*12-1, 30+Math.floor(i/MAPWIDTH)*12+3, 2, 4);//west
			
			ctx.stroke();
		}
	}
	
}
//bugos
function moveGhosts()
{
	var x, y, xd, yd;
	emptyDisortion();
	if(ghostindex>0)
	{
		sndGhost.play();
	}else
	{
		sndGhost.pause();
	}
	for(var i=0; i<ghostindex; i++)
	{
		//debugPrint(maxspeed);
		//debugPrint(ghosts[GHOSTSIZE*i+2]+' , '+ghosts[GHOSTSIZE*i+3]);
		x = ghosts[GHOSTSIZE*i+0];
		y = ghosts[GHOSTSIZE*i+1];
		xd = ghosts[GHOSTSIZE*i+2];
		yd = ghosts[GHOSTSIZE*i+3];
		
		x+=xd*maxspeed/2;
		y+=yd*maxspeed/2;
		
		if(x > getBorderX() || x < 0-getBorderX())xd=-xd;
		if(y > getBorderY() || y < 0-getBorderY())yd=-yd;
		
		ghosts[GHOSTSIZE*i+0] = x; 
		ghosts[GHOSTSIZE*i+1] = y; 
		ghosts[GHOSTSIZE*i+2] = xd; 
		ghosts[GHOSTSIZE*i+3] = yd;
		pushDisortion(x, y, 0.1);
	}
}

function emptyGhosts()
{
	ghostindex = 0;
}

function pushGhost(x, y, xd, yd)
{
	ghosts[ghostindex*GHOSTSIZE+0] = x;
	ghosts[ghostindex*GHOSTSIZE+1] = y;
	ghosts[ghostindex*GHOSTSIZE+2] = xd;
	ghosts[ghostindex*GHOSTSIZE+3] = yd;
	ghostindex++;
}

function collitionGhosts()
{
	var d,t;
	for(var i=0; i<ghostindex; i++)
	{
		d = getDistance(getHeroX(), getHeroY(), ghosts[i*GHOSTSIZE+0], ghosts[i*GHOSTSIZE+1]);
		if(d<GHOSTWIDTH)
		{
			sndOuch.play();
			t = (GHOSTWIDTH-d+0.5)*100;
			t = (t%3-1)*t;
			shakeHead(t);
			addEnergy(-ghosthit[level-1]);
		}
	}
}

function died()
{
	sndScream.play();
	mouse_x=0;
	mouse_y=0;
	heroMap=(MAPWIDTH-1)/2+(MAPHEIGHT-1)*MAPWIDTH;  //top-left is 0,0
	setHero(0,-18,3);
	turnHero(0);
	pitchHero(0);
	moveHero(0);
	heroShakeX=0;
	createRoomZero();
	showPlay();
	state = STATEDIED;
}

function collitionCure()
{
	if(isCollition('Cure'))
	{
		sndCure.play();
		addEnergy(10);
		removeObject('Cure');
		rooms[ROOMSIZE*getMap(heroMap)+19]=0;
	}
}

function collitionKey()
{
	if(isCollition('Key'))
	{
		//addEnergy(100);
		sndCoin.play();
		removeObject('Key');
		mouse_x=0;
		mouse_y=0;
		heroMap=(MAPWIDTH-1)/2+(MAPHEIGHT-1)*MAPWIDTH;  //top-left is 0,0
		setHero(0,-18,3);
		turnHero(0);
		pitchHero(0);
		moveHero(0);
		heroShakeX=0;
		showPlay();
		if(level < 6)
		{
			sndChoir.play();
			level++;
			inicLevel(level);
			state = STATENEXTLEVEL;
		}else
		{
			sndOhyeah.play();
			level = 1;
			inicLevel(level);
			state = STATEEND;
		}
		//rooms[ROOMSIZE*getMap(heroMap)+19]=0;
	}
}

function updateVisiblegauge()
{
	if(visiblegauge>0)visiblegauge--;
}

function addEnergy(n)
{
	energy+=n;
	if(energy>100)energy=100;
	if(energy<0)energy=0;
	visiblegauge=GAUGETIME;
}

function getEnergy()
{
	return currentenergy;
}

function drawEnergybar()
{
	const GAP=5;
	var y=visiblegauge*5;
	var l=getWidth()-50-GAP*2;
	currentenergy+=(energy-currentenergy)*0.06;
	y=60;
	if(visiblegauge<=15)y=visiblegauge*60/15;
	if(visiblegauge>0)
	{
        ctx.fillStyle = COLOR_WHITE;
		ctx.strokeStyle = COLOR_BLACK;
		ctx.lineWidth=10;
		ctx.fillRect(20, getHeight()-y, getWidth()-40, 40);
		ctx.strokeRect(20, getHeight()-y, getWidth()-40, 40);
		ctx.fillStyle = COLOR_RED;
		ctx.fillRect(25+GAP, getHeight()-y+5+GAP, l*currentenergy/100, 30-GAP*2);
	}
}

function setVolume(i)
{
    var n = i/100;
	sndAaah.volume = n;
	sndDoor.volume = n;
	sndWalking.volume = n;
	sndWalkingGravel.volume = n;
	sndFurniture.volume = n;
	sndCure.volume = n;
	sndOuch.volume = n;
	sndPhew.volume = n;
	sndGhost.volume = n;
	sndChoir.volume = n;
	sndForest.volume = n;
	sndNight.volume = n;
	sndScream.volume = n;
	sndOhyeah.volume = n;
	sndCoin.volume = n;
	sndClick.volume = n;
}

function f(n)
{
	return document.getElementById(n);//object
}

function hide(n) {
    f(n).style.display = 'none';
}

function rnd(n)//0-n random integer
{
	return Math.floor(Math.random()*n);
}

function titleAnimation()
{
	//TODO
}

function finishAnimation()
{
	//TODO
}

function storyAnimation()
{
	//TODO
}

window.addEventListener("load", start, false);
