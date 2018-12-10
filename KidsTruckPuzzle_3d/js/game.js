/*
context.imageSmoothingEnabled=false;
*/
var boxes=[];
var boxindex;
const BOXSIZE = 4;
var ctx;

function start()
{
	ctx = f('canvas').getContext('2d');
	setInterval('gameloop()',20);//20=max:50 FPS
}

function pushBox(x,y,w,h)
{
	boxes[boxindex*BOXSIZE+0]=x;
	boxes[boxindex*BOXSIZE+1]=y;
	boxes[boxindex*BOXSIZE+2]=w;
	boxes[boxindex*BOXSIZE+3]=h;
	boxindex++;
}

function isBoxClicked(x,y)
{
	var i=;
	do
	{
		i++;
	}while();
}

function gameloop()
{
	
}

function f(n)
{
	return document.getElementById(n);//object
}

function rnd(n)//0-n random integer
{
	return Math.floor(Math.random()*n);
}

window.addEventListener("load", start, false);