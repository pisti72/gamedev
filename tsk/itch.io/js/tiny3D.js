/*

Project:	Tiny3D
Version:	1.0
Author:		Istvan Szalontai	istvan.szalontai12@gmail.com


*/
var b=[];
var objTitle=[];
var objPointer=[];
var objRadius=[];
var heroX, heroY, heroZ;
var heroRotX, heroRotY, heroRotZ;
var heroHeight, heroHead, heroShakeX;
var cx,sx,cy,sy,cz,sz;
const RADIAN=3.1415/180;
const HEADZ=1.5;
const HEADAMPLITUDO=0.1;
const HEADSTEP=3;
const MODE=0;//0=fill, 1=dot
var world=[];
var worldindex;
const WORLDSIZE=6;
const WORLDTERMINAL=99999;
const OBJSIZE=1.5;
const DISTANCEFAST=0;//0=sqrt, 1=rectangle

const COLOR_WHITE='#DDD';
const COLOR_DARKGREY ='#333';
const COLOR_BLACK='#222';
const COLOR_RED='#844';

const CANVAS_WIDTH=900;
const CANVAS_HEIGHT=500;

const SKY_DAY = 0;
const SKY_BLACK = 1;
const SKY_FULLMOON = 2;

var hidden=0;
var x2,y2,z2;
var ctx;
var w,h;
var fov;
var borderX=10;
var borderY=10;
const BORDERMARGIN=0.025;
var lightintheroom = SKY_DAY;
var disortionindex;
var disortion=[];//x,y,r
var DISORTIONSIZE=3;
var curve=0;

var debug;
/**
upload v2D with 2D dots from b[] 
*/
//window.addEventListener('onresize', onResize, false);


function onResize(e)
{
	w = document.getElementById('gamearea').width=document.body.clientWidth;
	h = document.getElementById('gamearea').height=document.body.clientHeight;
	fov = w/2;
}

function drawObj(obj,x,y,z,m)
{
	
	var v2D=[];//vertices 2d  --> x,y,hidden or visible , x,y,h or v ...
	var j=0;
	var i=0;
	i=getObjPointer(obj);
	i++;
	j=0;
	while(b[i]=='v')
	{
		if(m==1)
		{
			v2D[j+0] = getX2d(x-b[i+1]*1, b[i+3]*1+y, b[i+2]*1+z);//xyz-->x
			v2D[j+1] = getY2d(x-b[i+1]*1, b[i+3]*1+y, b[i+2]*1+z);//xyz-->y
		}
		if(m==2)
		{
			v2D[j+0] = getX2d(x-b[i+3]*1, y-b[i+1]*1, b[i+2]*1+z);//xyz-->x
			v2D[j+1] = getY2d(x-b[i+3]*1, y-b[i+1]*1, b[i+2]*1+z);//xyz-->y
		}
		if(m==3)
		{
			v2D[j+0] = getX2d(x+b[i+1]*1, y-b[i+3]*1, b[i+2]*1+z);//xyz-->x
			v2D[j+1] = getY2d(x+b[i+1]*1, y-b[i+3]*1, b[i+2]*1+z);//xyz-->y
		}
		if(m==4)
		{
			v2D[j+0] = getX2d(x+b[i+3]*1, y+b[i+1]*1, b[i+2]*1+z);//xyz-->x
			v2D[j+1] = getY2d(x+b[i+3]*1, y+b[i+1]*1, b[i+2]*1+z);//xyz-->y
		}
		
		v2D[j+2] = 0; //visible=0
		if(hidden==1)v2D[j+2]=1;//or hidden=1
		i+=4;
		j+=3;
	}
	var baszas=0;
	do
	{
		if(b[i]=='usemtl')
		{
            var color=b[i+1];
            if(color == 'black'){
                ctx.fillStyle = COLOR_BLACK;
            }else{
                ctx.fillStyle = COLOR_WHITE;
            }
			i+=2;
		}
		
		if(b[i]=='s')i+=2;
		
		while(b[i]=='f')
		{
			i++;
			var h=0;
			if(MODE==0)ctx.beginPath();
			if(v2D[b[i]*3+2]==1)h=1;
			if(MODE==0)ctx.moveTo( v2D[b[i]*3+0] , v2D[b[i]*3+1] );
			i++;
			while(b[i]!='o' && b[i]!='f' && b[i]!='usemtl')
			{
				if(v2D[b[i]*3+2]==1)h=1;
				if(MODE==1)ctx.fillRect(v2D[b[i]*3+0] , v2D[b[i]*3+1], 4,4);
				if(MODE==0)ctx.lineTo( v2D[b[i]*3+0] , v2D[b[i]*3+1] );
				i++;
			}
			if(MODE==0)ctx.closePath();
			if(h==0)
			{
				if(MODE==0)ctx.fill();
			}
		}
		baszas++;
	}while(b[i]!='o' && i<b.length && baszas<20000);
}

function drawMoon(x,y,z)
{
	var xt,yt;
	const r = 50;
	xt = getX2d(x , y, z);
	yt = getY2d(x , y, z);
	if(y2>(-x2-4) && y2>(x2-4))
	{
		ctx.fillStyle = COLOR_WHITE;
		ctx.beginPath();
		ctx.arc(xt,yt,r, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}
/**
Reorganize face indexes time: 0:17
csak egyszer futhat le
*/
function reindexFaces()
{
	var v=0;
	var va=0;
	for (var i=0; i<b.length; i++)
	{
		if(b[i]=='o')va=v;
		if(b[i]=='v')v++;
		if(b[i]=='f')
		{
			i++;
			while(b[i]!='o' && b[i]!='f' && b[i]!='usemtl')
			{
				//most biztos szam jon. Az elnek a szama.
				b[i]--;
				b[i]-=va;
				i++;
			}
			i--;
		}
	}
}
/**
Render to canvas
*/
function render()
{
	var xt,yt,zt;
	ctx.fillStyle = COLOR_WHITE;
	if(lightintheroom == SKY_BLACK)ctx.fillStyle = COLOR_BLACK;
	if(lightintheroom == SKY_FULLMOON)ctx.fillStyle = COLOR_DARKGREY;
	ctx.fillRect (0, 0,  w, h);
	if(lightintheroom == SKY_FULLMOON)drawMoon(20,200,150);
	for(var i=0; i<worldindex; i++)
	{
		xt = world[i*WORLDSIZE+1];
		yt = world[i*WORLDSIZE+2];
		zt = world[i*WORLDSIZE+3];
		transformation(xt, yt, zt);//out --> x2,y2,z2
		if(y2>(-x2-4) && y2>(x2-4))
		{
			drawObj(world[i*WORLDSIZE+0], xt , yt , zt , world[i*WORLDSIZE+4]);
		}
	}
	//collition();
}
/**
Projection x
*/
function getX2d(x,y,z)
{
	transformation(x,y,z);//not nice
	return (x2*fov)/y2+w/2+heroShakeX;
}
/**
Projection y
*/
function getY2d(x,y,z)
{
	var d,d2;
	d2=getDistance(x2, y2, 0, 0 );
	for(var i=0; i<disortionindex; i++)
	{
		d=getDistance(x, y, disortion[i*DISORTIONSIZE+0],  disortion[i*DISORTIONSIZE+1] );
		z2+=(1/(d+0.01))*disortion[i*DISORTIONSIZE+2]*Math.random();
	}
	z2+=d2*curve;
	return h/2-(z2*fov)/y2;
}

function transformation(x,y,z)
{
	//translate and scale
	x=x-heroX;
	y=y-heroY;
	z=z-heroZ;

	//rotate axis-z
	x2=x*cz-y*sz;
	y2=x*sz+y*cz;
	z2=z;

	//pitch axis-x
	x=x2;
	y=y2*cx-z2*sx;
	z=y2*sx+z2*cx;
	
	//roll axis-y
	//x2=x*cy-z*sy;
	//y2=y;
	//z2=x*sy+z*cy;
	x2=x;
	y2=y;
	z2=z;
	//ha a pont mogottunk van akkor rejtett lesz
	hidden=0;
	if(y2<=0)hidden=1;//hide
}

function setHero(x,y,z)
{
	heroX=x;
	heroY=y;
	heroZ=z;
}

function setHeroX(n)
{
	heroX=n;
}

function setHeroY(n)
{
	heroY=n;
}

function setHeroZ(n)
{
	heroZ=n;
	if(heroZ<0)heroZ=0;
}

function getHeroX()
{
	return heroX;
}

function getHeroY()
{
	return heroY;
}

function setHeroRotZ(n)
{
	heroRotZ=n*RADIAN;
	cz=Math.cos(heroRotZ);
	sz=Math.sin(heroRotZ);
}

function inicHero()
{
	heroX=heroY=heroZ=0;
	heroRotX=heroRotY=heroRotZ=0;
	heroHeight=HEADZ;
	heroZ=heroHeight;
	heroHead=0;
	sx=sy=sz=0;
	cx=cy=cz=1;
}

function turnHero(degree)
{
	heroRotZ+=degree*RADIAN;
	cz=Math.cos(heroRotZ);
	sz=Math.sin(heroRotZ);
}

function debugHero()
{
	debug=Math.floor(heroX)+' , '+Math.floor(heroY)+' , d:'+getTurnHero();
	debugPrint(debug);
}

function emptyDisortion()
{
	disortionindex=0;
}

function pushDisortion(x, y, r)
{
	disortion[disortionindex*DISORTIONSIZE+0]=x;
	disortion[disortionindex*DISORTIONSIZE+1]=y;
	disortion[disortionindex*DISORTIONSIZE+2]=r;
	disortionindex++;
}

function getDistance(x1,y1,x2,y2)
{
	if(DISTANCEFAST==0)return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
	if(DISTANCEFAST==1)return Math.abs(x1-x2)+Math.abs(y1-y2);
}

function getTurnHero()
{
	var i=Math.floor(heroRotZ/RADIAN);
	return i;
}

function setLight(n)
{
	lightintheroom = n;
}

function setBorder(x,y)
{
	borderX=x;
	borderY=y;
}

function getBorderX()
{
	return borderX;
}

function getBorderY()
{
	return borderY;
}

function collitionBorder()//vissza '' vagy n,e,s,w
{
	var t='';
	//Borders
	if(heroX > borderX-BORDERMARGIN)
	{
		//east
		if(heroY>-1 && heroY<1)t='e';
		heroX = borderX-BORDERMARGIN;
	}
	if(heroX < -borderX+BORDERMARGIN)
	{
		//west
		if(heroY>-1 && heroY<1)t='w';
		heroX = -borderX+BORDERMARGIN;
	}
	if(heroY > borderY-BORDERMARGIN)
	{
		//north
		if(heroX>-1 && heroX<1)t='n';
		heroY = borderY-BORDERMARGIN;
	}
	if(heroY < -borderY+BORDERMARGIN)
	{
		//south
		if(heroX>-1 && heroX<1)t='s';
		heroY = -borderY+BORDERMARGIN;
	}
	return t;
}

function collition()
{
	
	var i,j,d;
	var x1, y1, x2, y2;
	for(i=0; i<worldindex; i++)
	{
		if(world[i*WORLDSIZE+5]==1)//has physic
		{
			x1 = world[i*WORLDSIZE+1];
			y1 = world[i*WORLDSIZE+2];
			//masik targyakkal
			for(j=0; j<worldindex; j++)
			{	
				if(world[j*WORLDSIZE+5]==1 && i!=j)//has physic
				{	
					x2 = world[j*WORLDSIZE+1];
					y2 = world[j*WORLDSIZE+2];
				
					d = getDistance(x1, y1, x2, y2);
					if(d<OBJSIZE)//ellokjuk magunkat a masiktol mert tul kozel kerultunk
					{
						world[i*WORLDSIZE+1] = fromObjX(x1, y1, x2, y2);
						world[i*WORLDSIZE+2] = fromObjY(x1, y1, x2, y2);
					}
				}
			}
			//magunkkal  ez mi a franc???
			x2 = heroX;
			y2 = heroY;
			d = getDistance(x1, y1, x2, y2);
			if(d<OBJSIZE)//ellokjuk a targyat magunktol
			{
				world[i*WORLDSIZE+1] = fromObjX(x1, y1, x2, y2);
				world[i*WORLDSIZE+2] = fromObjY(x1, y1, x2, y2);
				sndFurniture.play();
			}
		}
	}
}
//rossz
function fromObjX(x1, y1, x2, y2)
{
	var x,d;
	d = getDistance(x1, y1, x2, y2);
	if(d!=0) x = OBJSIZE*(x1-x2)/d+x2;
	if(x > OBJSIZE || d==0) x = OBJSIZE+x2;
	if(x < -borderX+OBJSIZE)x = -borderX+OBJSIZE;
	if(x > borderX-OBJSIZE)x = borderX-OBJSIZE;
	return x;
}

function fromObjY(x1, y1, x2, y2)
{
	var x,d;
	d = getDistance(x1, y1, x2, y2);
	if(d!=0) y = OBJSIZE*(y1-y2)/d+y2;
	if(y > OBJSIZE || d==0) y = OBJSIZE+y2;
	if(y < -borderY+OBJSIZE)y = -borderY+OBJSIZE;
	if(y > borderY-OBJSIZE)y = borderY-OBJSIZE;
	return y;
}

function isCollition(n)
{
	var i, x1, y1, x2, y2;
	var t=false;
	for(i=0; i<worldindex; i++)
	{
		x1 = world[i*WORLDSIZE+1];
		y1 = world[i*WORLDSIZE+2];
		x2 = heroX;
		y2 = heroY;
		d = getDistance(x1, y1, x2, y2);
		if(world[i*WORLDSIZE+0]==n && d<OBJSIZE)t=true;
	}
	return t;
}

function removeObject(n)
{
	var i,j;
	for(i=0; i<worldindex; i++)
	{
		if(world[i*WORLDSIZE+0] == n)
		{
			for(j=i; j<worldindex-1; j++)
			{
				world[j*WORLDSIZE+0]=world[(j+1)*WORLDSIZE+0];
				world[j*WORLDSIZE+1]=world[(j+1)*WORLDSIZE+1];
				world[j*WORLDSIZE+2]=world[(j+1)*WORLDSIZE+2];
				world[j*WORLDSIZE+3]=world[(j+1)*WORLDSIZE+3];
			}
			worldindex--;
		}
	}
}



function pushObject(objname, x, y, z, m, p)
{
	world[worldindex*WORLDSIZE+0]=objname;
	world[worldindex*WORLDSIZE+1]=x;
	world[worldindex*WORLDSIZE+2]=y;
	world[worldindex*WORLDSIZE+3]=z;
	world[worldindex*WORLDSIZE+4]=m;
	world[worldindex*WORLDSIZE+5]=p;//has physic
	worldindex++;
}
function emptyWorld()
{
	worldindex=0;
}	

function pitchHero(degree)
{
	heroRotX=degree*RADIAN;
	cx=Math.cos(heroRotX);
	sx=Math.sin(heroRotX);
}

function moveHero(speed)
{
	heroX+=Math.sin(heroRotZ)*speed;
	heroY+=Math.cos(heroRotZ)*speed;
	heroHead+=speed*HEADSTEP;	
	heroZ=heroHeight+Math.sin(heroHead)*HEADAMPLITUDO;
}

function sideHero(speed)
{
	heroX+=Math.cos(heroRotZ)*speed;
	heroY-=Math.sin(heroRotZ)*speed;
	heroHead+=speed*HEADSTEP;	
	heroZ=heroHeight+Math.sin(heroHead)*HEADAMPLITUDO;
}

function slideHero(speed)
{
	heroX+=Math.cos(heroRotZ)*speed;
	heroY-=Math.sin(heroRotZ)*speed;
}

function shakeHead(s)
{
	heroShakeX=s;
}

function listerStream()
{
	for(var i=0; i<b.length; i++)
	{
		debug+=i+'&nbsp;&nbsp;---&nbsp;&nbsp;'+b[i]+'<br>';
	}
	debugPrint(debug);
}
function listerObj()
{
	var i=0;
	var v=0;
	do
	{
		if(b[i]=='v')
		{
			v++;
		}
		if(b[i]=='o' && i!=b.length-1)
		{
			debug+=b[i+1]+'&nbsp;:&nbsp;';
		}
		if(b[i]=='usemtl')
		{
			debug+=v+'<br>';
			v=0;
		}
		i++;
	}while(i<b.length);
	debugPrint(debug);
}

function inicObjIndex()//hogy ne kelljen keresgelni 30 objekt kozt
{
	var i=0;
	var j=0;
	//megkeressuk az obj-ektet
	for(i=0; i<b.length-1; i++)
	{
		if(b[i]=='o')
		{
			objTitle[j]=b[i+1];
			objPointer[j]=i+1;//nevre mutat
			j++;
		}
	}
	return j;
}

function getObjPointer(n)//object name
{
	//var r=99999;//Null object
	var r=0;//Cure
	var i=-1;
	do
	{
		i++;
	}while(objTitle[i]!=n && i<objTitle.length);
	if(objTitle[i]==n)r=objPointer[i];
	return r;
}

function isObj(n)
{
	var r=1;
	if(getObjPointer(n)==0)r=0;
	return r;
}

function getWidth()
{
	return w;
}

function getHeight()
{
	return h;
}

function setCurve(c)
{
	curve = c;
}

function inicRender()
{
	window.onresize=function()
	{
		w = document.getElementById('gamearea').width = document.getElementById('container').clientWidth;
		h = document.getElementById('gamearea').height = document.getElementById('container').clientHeight;
        fov = w/2;
        console.log('resized');
	};
	ctx = document.getElementById('gamearea').getContext('2d');
	//w = document.getElementById('gamearea').width=document.body.clientWidth;
	//h = document.getElementById('gamearea').height=document.body.clientHeight;
	w = document.getElementById('gamearea').width = CANVAS_WIDTH;
    h = document.getElementById('gamearea').height = CANVAS_HEIGHT;
	setHero(0,0,0);
	turnHero(0);
	pitchHero(0);
	moveHero(0);
	heroShakeX=0;
	fov=w/2;
	b=res.split(' ');
	reindexFaces();
	emptyDisortion();
	emptyWorld();
	setCurve(0);
	inicObjIndex();
	inicHero();
}

function debugPrint(i)
{
	document.getElementById('debug').innerHTML=i;
}

