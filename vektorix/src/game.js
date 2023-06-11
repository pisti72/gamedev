/**
 * @license
 * Vektorix
 * Copyright (c) 2013, Istvan Szalontai
 *
 * Vektorix is licensed under the CC License.
 * http://creativecommons.org/licenses/by-nc/4.0/deed.en
 *
 * @author Istvan Szalontai http://istvanszalontai.atw.hu/ @SzalontaiIstvan
 */
 
/*
TODO

- ikon 30x30 60x60 128x128
- foszereplo modell
- akadalyok 12 darab
- lives - energy
- levels with lock
- touch left, touch right tutorial

*/
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const STATE_TITLE = 0;
const STATE_LEVELS = 1;
const STATE_GAME = 2;
const STATE_END = 3;
const STATE_PAUSED = 4;

var sound = true;
var pause = false;
var state = STATE_TITLE;
var level;
var counter;

f('btn_soundyes').addEventListener('mousedown', toggleSound, false);
f('btn_soundno').addEventListener('mousedown', toggleSound, false);
f('btn_exit').addEventListener('mousedown', function(evt){window.close();}, false);
f('btn_tweet').addEventListener('mousedown', function(evt){window.location.assign("https://twitter.com/SzalontaiIstvan");}, false);
f('btn_play').addEventListener('mousedown', playPressed, false);
f('btn_pause').addEventListener('mousedown', togglePause, false);
f('btn_home').addEventListener('mousedown', homePressed, false);
f('lvl_1_free').addEventListener('mousedown', inicLvl1, false);


var t = new TINY3D;
t.init('objects.obj');
t.addObj('title','Vektorix' ,0 ,6 ,0);
//t.changeObj('fa1','Cube');

/**
 *
 */
function toggleSound(evt)
{
	sound = !sound;
	if(sound)
	{
		show('btn_soundyes');
		hide('btn_soundno');
	}else
	{
		hide('btn_soundyes');
		show('btn_soundno');
	}
}

/**
 *
 */
function togglePause(evt)
{
	pause = !pause;
	if(pause)	status = STATUS_GAME; else status = STATUS_PAUSED;
}

/**
 *
 */
function playPressed(evt)
{
	//state = STATE_LEVELS;
	state = STATE_LEVELS;
	hide('btn_play');
	hide('btn_soundyes');
	hide('btn_soundno');
	hide('btn_exit');
	hide('btn_tweet');
	hide('created_by');
	
	show('lvl_1_free');
	show('lvl_2_lock');
	show('lvl_3_lock');
	show('lvl_4_lock');
	show('lvl_5_lock');
	show('lvl_6_lock');
	show('btn_home');
	//show('btn_pause');
	pause = false;
	
	t.emptyStage();
	for(var i=0; i<10; i++)
	{
		t.addObj('o'+i,'Peak' ,random(-20,20) ,i*20+10 ,-3);
		if(i%3 == 0)t.colorObj('o'+i,'orange');
		if(i%3 == 1)t.colorObj('o'+i,'red');
		if(i%3 == 2)t.colorObj('o'+i,'green');
	}
}

function inicLvl1(evt)
{
	state = STATE_GAME;
	level = 1;
	counter = 0;
	
	hide('lvl_1_free');
	hide('lvl_2_lock');
	hide('lvl_3_lock');
	hide('lvl_4_lock');
	hide('lvl_5_lock');
	hide('lvl_6_lock');
}

/**
 *
 */
function homePressed(evt)
{
	state = STATE_TITLE;
	
	show('btn_play');
	if(sound) show('btn_soundyes'); else show('btn_soundno');
	show('btn_exit');
	show('btn_tweet');
	show('created_by');
	
	hide('btn_home');
	hide('btn_pause');
	hide('lvl_1_free');
	hide('lvl_2_lock');
	hide('lvl_3_lock');
	hide('lvl_4_lock');
	hide('lvl_5_lock');
	hide('lvl_6_lock');
	
	t.emptyStage();
	t.addObj('title','Vektorix' ,0 ,6 ,0);
}

// start animating
animate();

function animate()
{
	counter++;
	
	if(state == STATE_TITLE) t.rotateObj('title',-0.00 ,0 ,0.02);
	if(state == STATE_GAME && !pause)
	{
		if(counter>0 && counter<100 && counter%20 > 4)show('hand_left'); else hide('hand_left');
		if(counter>140 && counter<220 && counter%20 > 4)show('hand_right'); else hide('hand_right');
		//if(counter>100 && counter<110)hide('hand_left');
		for(var i=0; i<10; i++)
		{
			t.rotateObj('o'+i, 0, 0, 0.2);
			t.translateObj('o'+i, 0, -1, 0);
			if(t.getposObj('o'+i, 0, 1, 0) < 0)
			{
				t.setposObj('o'+i, random(-20,20) , 200, -3 );
			}
		}
	}
	t.render();
    requestAnimationFrame(animate);
}


