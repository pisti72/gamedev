<html>
	<head>
<?php
$count_my_page = ("hitcounter.txt");
$hits = file($count_my_page);
$hits[0] ++;
$fp = fopen($count_my_page , "w");
fputs($fp , "$hits[0]");
fclose($fp);
//echo $hits[0];
?>
		<title>POLGÁRMESTER A PÁCBAN</title>
		<link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAAAXNSR0IArs4c6QAAAAxQTFRFpDY2z2ts2pCR0KGdnrZUzQAAACxJREFUCNdj+DVt1SqGX6tgxH8gYAgFAggR4MgiACHia7/fh4hNRZWYjyIBAFADHYHFC0a2AAAAAElFTkSuQmCC" type="image/png" sizes="16x16" />
		<style>
			#display{
				cursor:none;
				position:absolute;
				background:PaleGreen;
				left:0px;
				top:0px;
			}
			#download{
				position:absolute;
				right:10px;
				bottom:10px;
			}
		</style>
	</head>
	<body>
		<audio id="explosion0" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="explosion1" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="explosion2" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="explosion3" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="explosion4" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="explosion5" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="explosion6" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="explosion7" src="explosion.wav">Your browser does not support the audio element.</audio>
		<audio id="build0" src="build.wav">Your browser does not support the audio element.</audio>
		<audio id="build1" src="build.wav">Your browser does not support the audio element.</audio>
		<audio id="build2" src="build.wav">Your browser does not support the audio element.</audio>
		<audio id="build3" src="build.wav">Your browser does not support the audio element.</audio>
		<audio id="build4" src="build.wav">Your browser does not support the audio element.</audio>
		<audio id="build5" src="build.wav">Your browser does not support the audio element.</audio>
		<audio id="build6" src="build.wav">Your browser does not support the audio element.</audio>
		<audio id="build7" src="build.wav">Your browser does not support the audio element.</audio>
		<canvas id="display" >Your browser does not support the canvas element.</canvas>
		<div id="download"><a href="polgarmester.zip"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAASAgMAAACiOPGtAAAAAXNSR0IArs4c6QAAAAlQTFRFAAAA7FUV////dW/zPQAAAAF0Uk5TAEDm2GYAAABRSURBVBjTldAxDoBQCANQFu/n0oX7dekppWri4EdDtz4SQojAIhENbyveO4YIgSAzgXQpadmVxTJfJf+4ohHfS/TJ54EeWbKIz90vnv1k9O8DW5afESlzDQIAAAAASUVORK5CYII=" border="0"></a></div>
		<script>
/*
http://yscik.com/jf/mgeowlist.php
https://developer.mozilla.org/en/Canvas_tutorial/Using_images
http://www.motobit.com/util/base64-decoder-encoder.asp
http://www.opinionatedgeek.com/dotnet/tools/base64encode/
http://www.drpetter.se/project_sfxr.html
http://js1k.com/2010-first/demos
https://developer.mozilla.org/En/XPCOM_Interface_Reference/NsIDOMHTMLMediaElement

2012 Január 23., hétfõ dél
*/
document.onmousemove=onMouseMove;
document.onmousedown=onMousePressed;
document.onmouseup=onMouseReleased;
const version='1.4';
const tilew=64;
const tileh=32;
const gravity=16;
var mouse_x=0, mouse_y=0;
var snd_explosion=[];
snd_explosion[0] = document.getElementById("explosion0");
snd_explosion[1] = document.getElementById("explosion1");
snd_explosion[2] = document.getElementById("explosion2");
snd_explosion[3] = document.getElementById("explosion3");
snd_explosion[4] = document.getElementById("explosion4");
snd_explosion[5] = document.getElementById("explosion5");
snd_explosion[6] = document.getElementById("explosion6");
snd_explosion[7] = document.getElementById("explosion7");
var snd_build=[];
snd_build[0] = document.getElementById("build0");
snd_build[1] = document.getElementById("build1");
snd_build[2] = document.getElementById("build2");
snd_build[3] = document.getElementById("build3");
snd_build[4] = document.getElementById("build4");
snd_build[5] = document.getElementById("build5");
snd_build[6] = document.getElementById("build6");
snd_build[7] = document.getElementById("build7");
var ctx = document.getElementById('display').getContext('2d');
var w=document.getElementById('display').width=document.body.clientWidth;
var h=document.getElementById('display').height=document.body.clientHeight;
var img_pointer=new Image();
var img_tiles=new Image();
var img_title=new Image();
var img_digits=new Image();
var period=Math.floor(w/tilew)+1;
var map=[];
var map2=[];
var ast=[];//xy,z
var mnz=[];
var mnv=[];
var score,hi;
var c1,c2,c3,c4,c5;
var state='TITLE';
var cash,house;
var mapsize=(Math.floor(w/tilew)+1)*Math.floor(h/tileh);
var strength=Math.floor(mapsize/12);
var scan;
img_pointer.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAA4AgMAAAAqSvZvAAAAAXNSR0IArs4c6QAAAAxQTFRFZXhlAAIA/96w/v/84xRugAAAAAF0Uk5TAEDm2GYAAAB1SURBVDjLzdAxDoAgDAXQLtzPpUsXTsfy78esWFsHgeCAxD99XhNIISLmjZ5pmeAjC8zvDGmO2d3FfM22ydWL+bhn2k+zcW2B1SSVv1VDxyDQTuWIgeE2DAxuWGZww1JjC3np2H4lU7Q2w3J04yk2fpfr/MkOKZHATutH3twAAAAASUVORK5CYII=';
img_tiles.src='data:image/png;base64,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';
img_title.src='data:image/png;base64,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';
img_digits.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOoAAAAYBAMAAAAG4HxvAAAAAXNSR0IArs4c6QAAAA9QTFRF/yX3Y2If/4D71tZH//9VcgeSBAAAAAF0Uk5TAEDm2GYAAAErSURBVEjHzZbLFcQgCEVp4dWSFui/pon8NTo5sxl1E4LANQRRIsI9SB8ipJSq3qio4GPworexhQrw1azAfAuqYFGFYEakRm51y1CFWFWva4UtX7aBehsBah2RTQxBaD1VmKjU9q5eFnCe1xZ0G9Wtm+iRi38wckWWRqSCgYkXjWWFXPRx1Das0mr23Ut/kEJpStVHUvMzTqF6ICkVrzjZHBTbg+umMpuYikWbUzQSth90DLX0BMsw1IQ1wCONGP6LlQz4IUTbOYYKqxkUhgxgTh0qBcsM+9QxVIVefV1ohiXMS4bzPPlx5/yB2nd/dFWAPlChYtlbEvrsiLHf9lC7U31V6H7kl9JHmeruAoTloS7d53rcJf5HHS5ipdAnF7hBU9PY3da+3Qy3UT8VngP6nqQ8JAAAAABJRU5ErkJggg==';
if(localStorage.hiscore2>=0 && localStorage.hiscore2<=9999)//NaN   0....99999
{
	hi=Number(localStorage.hiscore2);
}else
{
	localStorage.hiscore2=0;
}

function onMouseMove(e)
{
	mouse_x=e.pageX;
	mouse_y=e.pageY;
}
function onMousePressed(e)
{
	c1=1;
}
function onMouseReleased(e)
{
	c1=0;
	if(state=='TITLE'){state='GAME';init();}
	if(state=='OVER')state='TITLE';
}
function asteroid()
{
	var j;
	var i=0;
	do
	{
		j=Math.floor(Math.random()*mapsize);
	}while(++i<strength && map[j]!=1)
	if(map[j]==1 && ast[j]==9999)ast[j]=h;
}
function update()
{
	if(c1==1)
	{
		var xy=Math.floor(mouse_x/tilew)+Math.floor(mouse_y/tileh)*period;
		if(state=='GAME')
		{
			if((map[xy]==0 && cash>=5) || (map[xy]==2 && cash>=12) || (map[xy]==11 && cash>=12))
			{
				if(c5>7)c5=0;
				//if(snd_build[c5].ended==true)
				snd_build[c5++].play();
				if(map[xy]==0)
				{
					mnv[xy]='-5$';
					cash-=5;
				}
				if(map[xy]==2 || map[xy]==11)
				{
					mnv[xy]='-12$';
					cash-=12;
				}
				map[xy]=1;
				map2[xy]=Math.floor(Math.random()*4);
				mnz[xy]=0;
				house++;
			}
		}
	}
	c2++;
	if(state=='GAME' && c2%33==0)
	{
		score++;
		if(score>hi)hi=score;
	}
	if(c2>500 && c2%4==0)
	{
		if((Math.sin(c2/400)+1)/2<Math.random())asteroid();
	}
	if(c3>0)c3--;
	var shake=(c3%4)*2;
	ctx.clearRect (0,0,w,h);
	ctx.fillStyle = 'rgb(255,255,0)';
	
	if(c2>500 && house==0 && state=='GAME')state='OVER';
	//map
	for(var i=0;i<mapsize;i++)
	{
		//robbanás
		if(map[i]>11)
		{
			drawTile(9+Math.floor(map[i]/2)%2,i,shake);
			map[i]--;
		}
		//házak,fák,rom
		if(map[i]==1)
		{
			drawTile(1+map2[i],i,shake);
			if(c2%100==0)
			{
				mnz[i]=0;
				mnv[i]='+1$';
				cash++;
			}
		}
		if(map[i]==2)drawTile(5+i%2,i,shake);
		if(map[i]==11)drawTile(11,i,shake);
	
		//asteroid
		if(ast[i]!=9999)
		{
			drawTile(7+Math.floor(c2/4)%2,i,ast[i]);
			ast[i]-=gravity;
			if(ast[i]<0)
			{
				if(c4>7)c4=0;
				//if(snd_explosion[c4].ended==true)
				snd_explosion[c4++].play();
				map[i]=50;
				ast[i]=9999;
				house--;
				if(c3==0)c3=50;
			}
			
		}
		
		//cash
		if(mnz[i]!=9999)
		{
			var u=mnz[i];
			drawString(mnv[i], (i%period)*tilew, Math.floor(i/period)*tileh-96-2*u);
			mnz[i]++;
			if(mnz[i]>30)mnz[i]=9999;
		}
	}
	//cursor
	ctx.drawImage(img_tiles,0,96,64,32,Math.floor(mouse_x/tilew)*tilew,Math.floor(mouse_y/tileh)*tileh-shake,64,32);
	//hand
	if(c1==0)ctx.drawImage(img_pointer,0,0,38,56,mouse_x-13,mouse_y-5,38,56);
	if(c1!=0)ctx.drawImage(img_pointer,38,0,38,56,mouse_x-13,mouse_y-5,38,56);
	//cash
	drawString(cash+'$',10,10);
	//score
	drawString(score+'', 10, 50);
	drawString(hi+'', 10, 90);
	//title
	if(state=='TITLE')ctx.drawImage(img_title,Math.floor((w-img_title.width)/2),Math.floor((h-img_title.height)/3));
	if(state=='OVER')
	{
		localStorage.hiscore2=Number(hi);
	}
	//debug
	ctx.fillStyle='#FFF';
	//ctx.fillText(c5,10,200);
	//ctx.fillText(snd_build[0].ended,10,200);
	//ctx.fillText(house, 10, 40);
	//ctx.fillText(c2, 10, 40);
	//ctx.fillText((Math.sin(c2/400)+1)/2,10, 80);
	
}

function drawTile(n,i,z)
{
	ctx.drawImage(img_tiles,n*64,0,64,128,(i%period)*tilew,Math.floor(i/period)*tileh-96-z,64,128);
}

function drawString(s,x,y)
{
	var c,j;
	for(var i=0;i<s.length;i++)
	{
		j=0;
		var c=s.charCodeAt(i);
		if(c>=48 && c<=57)j=48;
		if(c==36)j=24;
		if(c==43)j=33;
		if(c==45)j=34;
		if(j!=0)ctx.drawImage(img_digits,18*(c-j),0,18,24,x+i*18,y,18,24);
	}
}

function init()
{
	for(var i=0;i<mapsize;i++)
	{
		map[i]=0;
		ast[i]=9999;
		mnz[i]=9999;
	}
	for(i=0;i<20;i++)map[Math.floor(Math.random()*mapsize)]=2;//fa
	score=0;
	c1=0,c2=0,c3=0,c4=0,c5=0;
	cash=50,house=0;
	scan=9999;
}

function gameLoop()
{
	update();
	window.setTimeout("gameLoop();",30);//frissítés 1sec=1000 30frame/sec = 33
}
init();
gameLoop();
		</script>
	</body>
</html>