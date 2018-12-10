var sndC5 = document.createElement('audio');
var sndD5 = document.createElement('audio');
var sndE5 = document.createElement('audio');
var sndF5 = document.createElement('audio');
var sndG5 = document.createElement('audio');
var sndA5 = document.createElement('audio');
var sndH5 = document.createElement('audio');
var sndC6 = document.createElement('audio');
var wheels = 'C51F51F51F51F51A51C61A51F51G51E51C51A51G51F51C51F51F51F51F51A51C51A51F51G51C51C51F51';

sndC5.setAttribute('src', 'snd/piano_c5.ogg');
sndD5.setAttribute('src', 'snd/piano_d5.ogg');
sndE5.setAttribute('src', 'snd/piano_e5.ogg');
sndF5.setAttribute('src', 'snd/piano_f5.ogg');
sndG5.setAttribute('src', 'snd/piano_g5.ogg');
sndA5.setAttribute('src', 'snd/piano_a5.ogg');
sndH5.setAttribute('src', 'snd/piano_h5.ogg');
sndC6.setAttribute('src', 'snd/piano_c6.ogg');

f('c5').addEventListener('mousedown', playC5, false);
f('d5').addEventListener('mousedown', playD5, false);
f('e5').addEventListener('mousedown', playE5, false);
f('f5').addEventListener('mousedown', playF5, false);
f('g5').addEventListener('mousedown', playG5, false);
f('a5').addEventListener('mousedown', playA5, false);
f('h5').addEventListener('mousedown', playH5, false);
f('c6').addEventListener('mousedown', playC6, false);

f('c5').addEventListener('mouseup', releaseC5, false);
f('d5').addEventListener('mouseup', releaseD5, false);
f('e5').addEventListener('mouseup', releaseE5, false);
f('f5').addEventListener('mouseup', releaseF5, false);
f('g5').addEventListener('mouseup', releaseG5, false);
f('a5').addEventListener('mouseup', releaseA5, false);
f('h5').addEventListener('mouseup', releaseH5, false);
f('c6').addEventListener('mouseup', releaseC6, false);


window.addEventListener('keydown', keypressed, false);
window.addEventListener('keyup', keyreleased, false);

var proc = setInterval('loop()',250);

var i=0;
function loop()
{
	if(i*3>wheels.length)clearInterval(proc);
	var k = wheels.substr(i*3,2);
	releaseC5();
	releaseD5();
	releaseE5();
	releaseF5();
	releaseG5();
	releaseA5();
	releaseH5();
	releaseC6();
	if(k=='C5')playC5();
	if(k=='D5')playD5();
	if(k=='E5')playE5();
	if(k=='F5')playF5();
	if(k=='G5')playG5();
	if(k=='A5')playA5();
	if(k=='H5')playH5();
	if(k=='C6')playC6();
	i++;
}

function playC5()
{
	sndC5.currentTime=0;
	sndC5.play();
	f('c5').style.backgroundImage='url(gfx/pressed.png)';
}
function playD5()
{
	sndD5.currentTime=0;
	sndD5.play();
	f('d5').style.backgroundImage='url(gfx/pressed.png)';
}
function playE5()
{
	sndE5.currentTime=0;
	sndE5.play();
	f('e5').style.backgroundImage='url(gfx/pressed.png)';
}
function playF5()
{
	sndF5.currentTime=0;
	sndF5.play();
	f('f5').style.backgroundImage='url(gfx/pressed.png)';
}
function playG5()
{
	sndG5.currentTime=0;
	sndG5.play();
	f('g5').style.backgroundImage='url(gfx/pressed.png)';
}
function playA5()
{
	sndA5.currentTime=0;
	sndA5.play();
	f('a5').style.backgroundImage='url(gfx/pressed.png)';
}
function playH5()
{
	sndH5.currentTime=0;
	sndH5.play();
	f('h5').style.backgroundImage='url(gfx/pressed.png)';
}
function playC6()
{
	sndC6.currentTime=0;
	sndC6.play();
	f('c6').style.backgroundImage='url(gfx/pressed.png)';
}

function releaseC5()
{
	f('c5').style.backgroundImage='none';
}

function releaseD5()
{
	f('d5').style.backgroundImage='none';
}

function releaseE5()
{
	f('e5').style.backgroundImage='none';
}

function releaseF5()
{
	f('f5').style.backgroundImage='none';
}

function releaseG5()
{
	f('g5').style.backgroundImage='none';
}

function releaseA5()
{
	f('a5').style.backgroundImage='none';
}

function releaseH5()
{
	f('h5').style.backgroundImage='none';
}

function releaseC6()
{
	f('c6').style.backgroundImage='none';
}

function keypressed(e)
{
	if(e.which==65)playC5();
	if(e.which==83)playD5();
	if(e.which==68)playE5();
	if(e.which==70)playF5();
	if(e.which==71)playG5();
	if(e.which==72)playA5();
	if(e.which==74)playH5();
	if(e.which==75)playC6();
}

function keyreleased(e)
{
	if(e.which==65)releaseC5();
	if(e.which==83)releaseD5();
	if(e.which==68)releaseE5();
	if(e.which==70)releaseF5();
	if(e.which==71)releaseG5();
	if(e.which==72)releaseA5();
	if(e.which==74)releaseH5();
	if(e.which==75)releaseC6();
}

function f(n)
{
	return document.getElementById(n);
}