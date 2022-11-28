//const DEBUG = true;
const DEBUG = false;
const VERSION = '1.5';
const WIDTH = 900;
//const WIDTH = 630;
const HEIGHT = 500;

const VISIBLE = 0;
const HIDDEN = 1;

const TITLE = 5;
const WALK = 0;
const CAR = 1;
const FLY = 2;
const FALL = 3;
const LIFT = 4;
const GAMEOVER = 6;
const CONGRAT = 7;

const KEY_SPACE = 32;
const KEY_P = 80;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_ESC = 27;
const KEY_ENTER = 13;

const ARMAGEDDON_SPEED = .05;
const ARMAGEDDON_BEGIN = -900;
const SHOW_MESSAGE = 200;
const DAY_SPEED = .0002;
const DAY_BEGIN = .5;//-1 night --> 1 day
const MAG = 400;
const TALL = 480;
const SMALLSIZE = 3;
const MARGIN = 20;
const WALK_SPEED = 50;
const CAR_SPEED = 100;
const FLIGHT_SPEED = 300;
const CAR_ACCELERATION = 1;
const MAX_HEIGHT_TO_DIE = 400;
const GRAVITY = 1;
const MARGIN_VIEW = 20000;
const GLIDER_ROTX_CRASHED = 0.25;
const GLIDER_PROTECTED = 80;

const DEEP = 10;
const INVISIBLE = 200;

var canvas,ctx,debug;

var textArray=[];

var canvasLeft;
var canvasTop;

var ispaused = false;

var w, h;
var head;
var counter, glider_cannot_crash;
var pplace;
var state;
var vehicle;
var hand_band, hand_key, hand_saved, must_saved;
var world = [];//obj,x,y,z
var v = [];//vertex array: x,y,on screen?
var vt = [];//vertex array: x,y,z?
var objpointer = [];
var bbox = [];//bounding boxes w,h
var fov;
var day, color;
var mouse={};
var cx, sx, cy, sy, cz, sz;//sinuses and cosinuses for all axes
var player={}
var title = new Image();
var wall = new Image();
var tunnel = new Image();
var truck_cockpit = new Image();
var car_key = new Image();
var rope = new Image();
var glider_dashboard = new Image();
var snd_walking, snd_engine, snd_pickup, snd_explosion, snd_flying, snd_error;

function start() {
    state = TITLE;
    canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    window.addEventListener('resize',function(e){
        w = canvas.width = document.body.clientWidth;
        h = canvas.height = document.body.clientHeight;
        fov = w/2;
    });
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown',function(e){
        debug=e.which;
        if(state == TITLE){
            if(e.which == KEY_SPACE){
                state = WALK;
                inic();
                addMessage(MSG_LOOKBEHIND);
                addMessage(MSG_ENDOFWORLD);
            }
        }else if(state == CAR){
            if(e.which == KEY_W){
                player.forward += CAR_ACCELERATION;
                if(player.forward > CAR_SPEED){
                    player.forward = CAR_SPEED;
                }
            }else if(e.which == KEY_S && state == CAR){
                player.forward -= CAR_ACCELERATION*2;
                if(player.forward < -CAR_SPEED/5){
                    player.forward = -CAR_SPEED/5;
                }
            }
        }else if(state == WALK){
            if(e.which == KEY_W){
                player.forward = WALK_SPEED;
                snd_walking.play();
            }else if(e.which == KEY_S){
                player.forward = -WALK_SPEED;
                snd_walking.play();
            }
            if(e.which == KEY_A){
                player.side = -WALK_SPEED/2;
                snd_walking.play();
            }else if(e.which == KEY_D){
                player.side = WALK_SPEED/2;
                snd_walking.play();
            }
        }else if(state == GAMEOVER){
            if(e.which == KEY_SPACE){
                inic();
                state = TITLE;
            }
        }
        if(state == WALK || state == CAR || state == FLY){
            if(e.which == KEY_ESC){
                inic();
                state = TITLE;
            }else if(e.which == KEY_P){
                ispaused = !ispaused
            }
        }
    });
    document.addEventListener('keyup',function(e){
        if(state == WALK){
            if(e.which == KEY_S || e.which == KEY_W){
                player.forward = 0;
            }
            if(e.which == KEY_A || e.which == KEY_D){
                player.side = 0;
            }
            snd_walking.pause();
        }
    })
    document.addEventListener('click',function(e){
        if(state == TITLE){
            state = WALK;
            inic();
            addMessage(MSG_LOOKBEHIND);
            addMessage(MSG_ENDOFWORLD);
        }else if(state == GAMEOVER){
            state = TITLE;
            inic();
        }else if(state == CONGRAT){
            state = TITLE;
            inic();
        }
    })
	ctx = canvas.getContext('2d');
	w = WIDTH;
	h = HEIGHT;
    fov = w / 2;
	canvasLeft = canvas.offsetLeft;
	canvasTop = canvas.offsetTop;

	title.src = 'gfx/title.png';
	wall.src = 'gfx/wall.png';
	tunnel.src = 'gfx/tunnel.png';
    truck_cockpit.src = 'gfx/truck_cockpit.png';
    car_key.src = 'gfx/car_key.png';
    rope.src = 'gfx/rope.png';
    glider_dashboard.src = 'gfx/glider_dashboard.png';
    
    snd_walking = document.getElementById('snd_walking');
    snd_engine = document.getElementById('snd_engine');
    snd_pickup = document.getElementById('snd_pickup');
    snd_explosion = document.getElementById('snd_explosion');
    snd_flying = document.getElementById('snd_flying');
    snd_error = document.getElementById('snd_error');
    
    
	createBoundingBoxes();
    inic();
    
    gameLoop();
}

function onMouseMove(e) {
    var x = mouse.x;
    var y = mouse.y;
	mouse.x = e.pageX - canvasLeft;
	mouse.y = e.pageY - canvasTop;
    mouse.dx = mouse.x - x;
    mouse.dy = mouse.y - y;
	if (mouse.x < 0) mouse.x = 0;
	if (mouse.x > w) mouse.x = w;
	if (mouse.y < 0) mouse.y = 0;
	if (mouse.y > h) mouse.y = h;
}

function drawObject(j, xg, yg, zg) {
	//pontok 3D-->2D
	var x, y, z, x2, y2, z2, xp, yp;
	var p0x, p1x, p2x, p3x;
	var p0y, p1y, p2y, p3y;
	var p0e, p1e, p2e, p3e;
	var small;
	var offset = objpointer[j];
	var i = 0;
	do {
		//translate
		x = obj[i * 3 + 0 + offset] * MAG - player.pos_x + xg * MAG;
		y = -obj[i * 3 + 2 + offset] * MAG - player.pos_y + yg * MAG;
		z = obj[i * 3 + 1 + offset] * MAG - player.pos_z + zg * MAG;
		//rotate axis-z
		x2 = x * cz - y * sz;
		y2 = x * sz + y * cz;
		z2 = z;
		//pitch axis-x
		x = x2;
		y = y2 * cx - z2 * sx;
		z = y2 * sx + z2 * cx;
		//roll axis-y
		x2 = x * cy - z * sy;
		y2 = y;
		z2 = x * sy + z * cy;
		//eltessz�k a transzform�lt 3d pontokat
		vt[i * 3 + 0] = x2;
		vt[i * 3 + 1] = y2;
		vt[i * 3 + 2] = z2;
		//yout=y2;
		small = 100000;
		v[i * 3 + 2] = VISIBLE;//on screen
		//ha a pont mg�tt�nk van akkor rejtett lesz
		if (y2 <= 0) {
			y2 = -y2;
			x2 = 100 * x2;
			z2 = 100 * z2;
			v[i * 3 + 2] = HIDDEN;//hide
		} else {
			small = (bbox[j * 2 + 0] * MAG * fov) / y2;
			x = (bbox[j * 2 + 1] * MAG * fov) / y2;
			if (x > small){
                small = x;
            }
		}
		//projection
		xp = (x2 * fov) / y2 + w / 2;
		yp = h / 2 - (z2 * fov) / y2;

		v[i * 3 + 0] = xp;
		v[i * 3 + 1] = yp;

		if (xp < -MARGIN_VIEW || xp > w + MARGIN_VIEW || yp < -MARGIN_VIEW || yp > h + MARGIN_VIEW){
            v[i * 3 + 2] = HIDDEN;
        }

		i++;
	} while (obj[i * 3 + 0 + offset] != END_OF_POINTS && small > SMALLSIZE);
	//�lek
	var p0, p1, p2, p3;
	var p0p1x, p0p1y, p0p1z;
	var p0p3x, p0p3y, p0p3z;
	var nx, ny, nz, nabs;
	var bx, by, bz, babs;
	var c;
	var axb, axb2;
	color = 1
	if (small > SMALLSIZE) {
		i = i * 3 + 1;
		do {
			c = obj[i + offset];
			if (c < 1000) {
				p0 = (obj[i + offset + 0] - 1) * 3;
				p1 = (obj[i + offset + 1] - 1) * 3;
				p2 = (obj[i + offset + 2] - 1) * 3;
				p3 = (obj[i + offset + 3] - 1) * 3;
				//lap norm�lisa
				//a
				p0p1x = vt[p1 + 0] - vt[p0 + 0];
				p0p1y = vt[p1 + 1] - vt[p0 + 1];
				p0p1z = vt[p1 + 2] - vt[p0 + 2];
				//b
				p0p3x = vt[p3 + 0] - vt[p0 + 0];
				p0p3y = vt[p3 + 1] - vt[p0 + 1];
				p0p3z = vt[p3 + 2] - vt[p0 + 2];
				//norm�l vektor
				nx = p0p1y * p0p3z - p0p1z * p0p3y;//ay*bz-az*by
				ny = p0p1z * p0p3x - p0p1x * p0p3z;//az*bx-ax*bz
				nz = p0p1x * p0p3y - p0p1y * p0p3x;//ax*by-ay*bx
				nabs = Math.sqrt(nx * nx + ny * ny + nz * nz);
				//vektor szorzata
				bx = vt[p0 + 0];
				by = vt[p0 + 1];
				bz = vt[p0 + 2];
				axb2 = .3 * nz / nabs + .7;//0.7 -> 1.0
				if (color == 16 && day < .5) {
					ink(1, 1, 0);//light
				} else {
                    var r = axb2 * palette[color * 3 + 0] * day / 16;
                    var g = axb2 * palette[color * 3 + 1] * day / 16;
                    var b = axb2 * palette[color * 3 + 2] * day / 16;
					ink(r,g,b);
				}
				axb = (nx * bx + ny * by + nz * bz);
				if (axb < 0) {
					//�leket alkot� 2D pontok

					p0x = v[p0 + 0];
					p0y = v[p0 + 1];
					p0e = v[p0 + 2];

					p1x = v[p1 + 0];
					p1y = v[p1 + 1];
					p1e = v[p1 + 2];

					p2x = v[p2 + 0];
					p2y = v[p2 + 1];
					p2e = v[p2 + 2];

					p3x = v[p3 + 0];
					p3y = v[p3 + 1];
					p3e = v[p3 + 2];

					if (p0e == 0 && p1e == 0 && p2e == 0 && p3e == 0){
                        drawQuad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
                    }
				}
				i += 4;
			} else {
				color = c - 1000;
				i++;
			}

		} while (obj[i + offset] != END_OF_FACES)
	}
}

function drawQuad(u1, v1, u2, v2, u3, v3, u4, v4) {
	ctx.beginPath();
	ctx.moveTo(u1, v1);
	ctx.lineTo(u2, v2);
	ctx.lineTo(u3, v3);
	ctx.lineTo(u4, v4);
	ctx.closePath();
	if (color == 17) {
		ctx.lineJoin = 'bevel';
		ctx.lineWidth = 1;
		ctx.stroke();
	} else { ctx.fill(); }
}

function ink(r, g, b) {
	if (r < 0) r = 0;
	if (r > 1) r = 1;
	if (g < 0) g = 0;
	if (g > 1) g = 1;
	if (b < 0) b = 0;
	if (b > 1) b = 1;
	r = Math.floor(r * 255);
	g = Math.floor(g * 255);
	b = Math.floor(b * 255);
	ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
}

function drawSky() {
	ink((14 * (-(day - 1) * (day - 1) + 1)) / 16, (16 * day * day) / 16, (16 * day * day * 0.2 + 0.8 * 16) / 16);
	ctx.fillRect(0, 0, w, h);
}

function drawGround() {
	var x, y, z, x2, y2, z2, yp1, yp2;
	var m = 200, d = 3000;
	//0-margin=(x2*fov)/(y2+fov)+w/2;
	y2 = d * MAG;
	z2 = 0;
	//x2 = (-m - w / 2) * (y2 + fov) / fov;
    x2 = (-m - w / 2) * y2 / fov;
	//pitch axis-x
	x = x2;
	y = y2 * cx - z2 * sx;
	z = y2 * sx + z2 * cx;
	//roll axis-y
	x2 = x * cy - z * sy;
	y2 = y;
	z2 = x * sy + z * cy;
	//projection
	//xp1 = (x2 * fov) / (y2 + fov) + w / 2;
    xp1 = (x2 * fov) / y2 + w / 2;
	//yp1 = h / 2 - (z2 * fov) / (y2 + fov);
    yp1 = h / 2 - (z2 * fov) / y2;
	//w+margin=(x2*fov)/(y2+fov)+w/2;
	y2 = d * MAG;
	z2 = 0;
	//x2 = (w / 2 + m) * (y2 + fov) / fov;
    x2 = (w / 2 + m) * y2 / fov;
	//pitch axis-x
	x = x2;
	y = y2 * cx - z2 * sx;
	z = y2 * sx + z2 * cx;
	//roll axis-y
	x2 = x * cy - z * sy;
	y2 = y;
	z2 = x * sy + z * cy;
	//projection
	//xp2 = (x2 * fov) / (y2 + fov) + w / 2;
    xp2 = (x2 * fov) / y2 + w / 2;
	//yp2 = h / 2 - (z2 * fov) / (y2 + fov);
    yp2 = h / 2 - (z2 * fov) / y2;
	ink((7 * (-(day - 1) * (day - 1) + 1)) / 16, (15 * day) / 16, (7 * day) / 16);
	ctx.beginPath();
	if (player.rot_y > -.5 && player.rot_y < .5) {
		ctx.moveTo(0, h);
		ctx.lineTo(xp1, yp1);
		ctx.lineTo(xp2, yp2);
		ctx.lineTo(w, h);
	}
	else {
		ctx.moveTo(w, 0);
		ctx.lineTo(xp1, yp1);
		ctx.lineTo(xp2, yp2);
		ctx.lineTo(0, 0);
	}
	ctx.closePath();
	ctx.fill();
}

function armageddon() {
	var i = 0
	var border = counter * ARMAGEDDON_SPEED + ARMAGEDDON_BEGIN;
	do {
		if (border > world[i + 2]) {
			if (world[i] == OBJ_TREE){
                world[i] = OBJ_TREE_WITH_ROOT;//ha fa volt
            }
            
            if (world[i] == OBJ_TREE_WITH_ROOT || world[i] == OBJ_HOUSE ||
				world[i] == OBJ_GLIDER || world[i] == OBJ_TRUCK ||
				world[i] == OBJ_PARKING || world[i] == OBJ_BUILDING ||
				world[i] == OBJ_BALLOON || world[i] == OBJ_JFHU_LOGO) {
                    world[i + 3] += GRAVITY;
                }
		}
        if(state == WALK || state == CAR || state == FLY){
            if (border > player.pos_y / MAG){
                state = FALL;
                player.forward = 0;
                addMessage(MSG_FALLENUP);
                addMessage(MSG_YOUWILLDIE);
            }
        }
		
		if (world[i + 3] > 300) world[i] = INVISIBLE;
		i += 4;
	} while (i < world.length);
}

function drawObjects() {
	var i = 0, j, n = 0, tn, ty;
	var ordern = [];
	var ordery = [];
	do {
		ordern[n] = n;
		ordery[n] = (world[i + 1] * MAG - player.pos_x) * sz + (world[i + 2] * MAG - player.pos_y) * cz;//rotate axis-z
		n++;
		i += 4;
	} while (i < world.length);

	for (i = n; i >= 0; i--) {
		for (j = 0; j < i; j++) {
			if (ordery[j] < ordery[j + 1]) {
				tn = ordern[j];
				ty = ordery[j];
				ordern[j] = ordern[j + 1];
				ordery[j] = ordery[j + 1];
				ordern[j + 1] = tn;
				ordery[j + 1] = ty;
			}
		}
	}
	i = 0;
	do {
		j = ordern[i] * 4;
		if (world[j] < INVISIBLE && ordery[i] > 0){
            
            drawObject(world[j], world[j + 1], world[j + 2], world[j + 3]);
        }
	} while ((++i) != n);
}

function drawMessage(){
    
	ctx.font = 'bold 22px RobotoBold';
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
    
    for(var i=0;i<textArray.length;i++){
        var message = textArray[i];
        if(message.counter > 0){
            message.counter--;
            ctx.fillStyle = '#4448';
            ctx.fillRect(0,h-40,w,40);
            ctx.fillStyle = '#fff';
            ctx.fillText(message.txt, w / 2, h - 10);
        }else{
            textArray.shift();
        }
        return;
    }
}

function addMessage(msg){
    var found_same = false;
    for(var i=0;i<textArray.length;i++){
        var message = textArray[i];
        if(message.txt == msg){
            found_same = true;
        }
    }
    if(!found_same){
        var message2 = {
            txt:msg,
            counter:SHOW_MESSAGE
        }
        textArray.push(message2);
    }
}

function createBoundingBoxes() {
	var i = 0, j = 0, k = 0;
	var xmax = 0, zmax = 0;
	objpointer[k] = 0;
	do {
		if (obj[i + 0] == END_OF_POINTS) {
			bbox[j * 2 + 0] = xmax;
			bbox[j * 2 + 1] = zmax;
			j++;
			xmax = 0;
			zmax = 0;
			do { } while (obj[++i] != END_OF_FACES);
			i++;
			objpointer[++k] = i;
		}
		if (obj[i + 0] > xmax) xmax = obj[i + 0];
		if (obj[i + 1] > zmax) zmax = obj[i + 1];
		i += 3;
	} while (i <= obj.length);

	bbox[OBJ_BUILDING_WITH_WIRE * 2 + 0] = bbox[OBJ_BUILDING * 2 + 0];
}

function elapseTime() {
	counter++;
	day = (Math.sin(counter * DAY_SPEED + DAY_BEGIN) + 1) / 2;
}

function update() {
    if(ispaused){
        return;
    }
	elapseTime();
	//rotate axis
	cx = Math.cos(player.rot_x);
	sx = Math.sin(player.rot_x);
	cy = Math.cos(player.rot_y);
	sy = Math.sin(player.rot_y);
	cz = Math.cos(player.rot_z);
	sz = Math.sin(player.rot_z);
	drawSky();
	drawGround();
	drawObjects();

	if (state == TITLE) {
		var x = Math.floor((w - title.width) / 2);
        var y = Math.floor((h - title.height) / 2);
        ctx.drawImage(title, x, y);
        addMessage(MSG_SHORTDESCRIPTION);
        addMessage(MSG_PRESSFIRE);
        addMessage(MSG_CREDITS);
        addMessage("Version: " + VERSION);
	}else if(state == CAR){
        snd_engine.play();
        var truck_cockpit_height = Math.floor((w/truck_cockpit.width)*truck_cockpit.height);
        ctx.drawImage(truck_cockpit, 0, h - truck_cockpit.height*1.2, w, truck_cockpit_height);
    }else if(state == FLY){
        snd_flying.play();
        var glider_dashboard_height = Math.floor((w/glider_dashboard.width)*glider_dashboard.height);
        ctx.drawImage(glider_dashboard, (w-glider_dashboard.width)/2, h - glider_dashboard.height);
    }
    if(hand_key == 1 && state == WALK){
        ctx.drawImage(car_key, w - car_key.width - MARGIN, h - car_key.height - MARGIN);
    }
    if(hand_band > 0){
        for(var i = 0; i<hand_band; i++){
            ctx.drawImage(rope, w - car_key.width - MARGIN - rope.width * (i+1), h - rope.height - MARGIN);
        }
    }
	if (player.pos_y > pplace * MAG && player.pos_y < pplace * (MAG + 1) && state == CAR){
        addMessage(MSG_NEARPARKING);
        addMessage(MSG_PUTCAR);
    }
	if (state == LIFT || state == CONGRAT) {
		addMessage('You successfully saved the city!');
        addMessage('Congratulations!');
        var wall_height = Math.floor((w/wall.width)*wall.height);
        if (0 <= h / 2 + player.pos_z + wall_height * DEEP - 1) {
			player.pos_z -= 4; 
		}else{
            state = CONGRAT;
        }
		for (var i = 0; i < DEEP; i++) {
			ctx.drawImage(wall, 0, h / 2 + player.pos_z + wall_height * i,w,wall_height);
		}
        var tunnel_height = Math.floor((w/tunnel.width)*tunnel.height);
		ctx.drawImage(tunnel, 0, h / 2 + player.pos_z + wall_height * i,w,tunnel_height);
	}
    drawMessage();
	if (player.pos_z / MAG >= MAX_HEIGHT_TO_DIE){
        state = GAMEOVER;
        addMessage(MSG_GAMEOVER);
        addMessage(MSG_PRESSFIRE);
    }
    //debug = 'DEMO';
    if(DEBUG){
        ctx.fillStyle = '#fff';
        ctx.fillText(debug, w/2, 30);
    }
}

function playerControl() {
	//turning
    if(state == WALK){
        if(mouse.x <= MARGIN){
            player.rot_z -= 0.02;
        }else if(mouse.x >= w - MARGIN){
            player.rot_z += 0.02;
        }else{
            player.rot_z += mouse.dx * 0.01;
        }
        mouse.dx = 0;
    }else if(state == CAR){
        player.rot_z += (mouse.x - w / 2)*player.forward / 1000 / w;
    }else if(state == FLY){
        player.rot_z += (mouse.x - w / 2) / 10 / w;
    }else if(state == FALL){
        if(mouse.x <= MARGIN){
            player.rot_z += 0.02;
        }else if(mouse.x >= w - MARGIN){
            player.rot_z -= 0.02;
        }else{
            player.rot_z -= mouse.dx * 0.01;
        }
        mouse.dx = 0;
    }
	//rolling
	if (state == FLY) {
        player.rot_y = (mouse.x - w / 2) / 2 /w;
    }else if (state == CAR) {
        player.rot_y = -(mouse.x - w / 2)*player.forward / 1000 / w;
    }else if (state == FALL){
        player.rot_y = Math.PI;  
    } 
	//speed
	if (state == FLY){
        player.forward = FLIGHT_SPEED;
    }else if (state == FALL){
        player.vel_z = GRAVITY * MAG/4;
    }
	//pitch
    if (state == WALK) {
        player.rot_x = (mouse.y - h / 2) / h;
    }else if (state == FLY) {
		player.rot_x = (h / 2 - mouse.y) / h;
		glider_cannot_crash--;
		if (glider_cannot_crash < 0){
            glider_cannot_crash = 0;
        }
		if (glider_cannot_crash > 0 && player.rot_x > -.1) player.rot_x = -.1;
	}else if (state == CAR) {
		player.rot_x = Math.abs(mouse.x - w / 2)  *player.forward / h / 1000;
	}else if (state == FALL){
        player.rot_x = (h / 2 - mouse.y) / h;
    } 
	//head
	head += player.forward / 200;
	if (state == WALK){
        player.pos_z = TALL + Math.sin(head) * 40;
    }else if (state == CAR){
        player.pos_z = TALL + Math.sin(head) * 20;
    }
	player.vel_y = cz * player.forward - sz * player.side;
	player.vel_x = sz * player.forward + cz * player.side;
	
    if (state == FLY){
        player.vel_z = -sx * player.forward;
    }
	player.pos_x += player.vel_x;
	player.pos_y += player.vel_y;
	player.pos_z += player.vel_z;
	if (player.pos_z <= 0 && state == FLY) {
		world[vehicle + 1] = (player.pos_x - 4 * player.vel_x) / MAG;
		world[vehicle + 2] = (player.pos_y - 4 * player.vel_y) / MAG;
		world[vehicle + 3] = 0;
		state = WALK;
        snd_flying.pause();
		if (player.rot_x > GLIDER_ROTX_CRASHED) {
			world[vehicle + 0] = OBJ_WRECKED_GLIDER;
            snd_explosion.play();
			addMessage(MSG_CRASHED);
            addMessage(MSG_FINDANOTHER);
		} else {
			world[vehicle + 0] = OBJ_GLIDER;
			addMessage(MSG_LANDED);
		}
		player.rot_x = 0;
		player.rot_y = 0;
        player.rot_z = 0;
		player.vel_z = 0;
		player.pos_z = TALL;
        player.forward = 0;
	}
}

function playerCollition() {
	var i = 0;
	var found = false;
	var bw, bh;
	do {
		if (world[i] < INVISIBLE) {
			bw = bbox[world[i] * 2 + 0];
			bh = bbox[world[i] * 2 + 1];
			if (bh * MAG < TALL){
                bh += TALL / MAG;
            }
			if (player.pos_x > (world[i + 1] - bw) * MAG && player.pos_x < (    world[i + 1] + bw) * MAG &&
				player.pos_y > (world[i + 2] - bw) * MAG && player.pos_y < (world[i + 2] + bw) * MAG &&
				player.pos_z > (world[i + 3]) * MAG && player.pos_z < (world[i + 3] + bh) * MAG) {
				found = true;
			}
		}
		i += 4;
	} while (!found && i < world.length);

	if(found) {
		i -= 4;
        player.forward = 0;
        player.side = 0;
        var object = world[i]; 
		if (object == OBJ_GLIDER && state == WALK) {
			addMessage(MSG_GOTGLIDER);
            addMessage(MSG_CAREFUL);
			world[i] = INVISIBLE;
			glider_cannot_crash = GLIDER_PROTECTED;
			state = FLY;
			vehicle = i;
		}else if(object == OBJ_WRECKED_GLIDER && state == WALK) {
            snd_error.play();
			addMessage(MSG_WONTFLIGHT);
            addMessage(MSG_FINDANOTHER);
		}else if(object == OBJ_TRUCK && state == WALK) {
			if (hand_key == 1) {
				addMessage(MSG_GOTCAR);
                addMessage('Drive toward the city!');
                addMessage('Find a parking place to leave the car!');
                
				world[i] = INVISIBLE;
				state = CAR;
                player.forward = 0;
                player.side = 0;
				vehicle = i;
			} else {
                snd_error.play();
				addMessage(MSG_GETCARKEY);
			}
		}else if(object == OBJ_PARKING && state == CAR) {
			player.rot_x = 0;
			player.rot_y = 0;
            player.vel_x = 0;
            player.vel_y = 0;
			player.vel_z = 0;
            player.pos_y = (world[i + 2] + 5) * MAG;
			player.pos_z = TALL;
			world[vehicle + 0] = OBJ_TRUCK;
			world[vehicle + 1] = world[i + 1];
			world[vehicle + 2] = world[i + 2] + 2;//put it close to P
			world[vehicle + 3] = world[i + 3];
			state = WALK;
            snd_engine.pause();
            snd_pickup.play();
			addMessage(MSG_GOTOUT);
            addMessage('Find a glider to catch some balloons!');
		}else if(object == OBJ_HOUSE && hand_key == 0) {
			addMessage(MSG_GOTKEY);
            snd_pickup.play();
			hand_key = 1;
		}else if(object == OBJ_CITY_HALL && state == WALK) {
			if (hand_saved >= must_saved) {
                snd_pickup.play();
				addMessage('We are now letting you into the shelter.');
                addMessage('You are saved!');
				state = LIFT;
				player.forward = 0;
                player.side = 0;
				player.vel_x = 0;
				player.vel_y = 0;
			} else {
                snd_error.play();
				addMessage('We are not allowed getting into the shelter.');
                addMessage('Still ' + (must_saved - hand_saved) + ' buildings must be tied down!');
			}   
		}else if(object == OBJ_BALLOON) {
			if(hand_band < 2) {
                snd_pickup.play();
				hand_band++;
				if (hand_band == 1){
                    addMessage('You have taken the first rope');
                }else if (hand_band == 2){
                    addMessage('You have taken the second rope');
                }
				world[i] = INVISIBLE;
			} else {
                snd_error.play();
				addMessage('There is no more place for rope!');
			}
		}else if (object == OBJ_BUILDING && state == WALK) {
			if(hand_band == 0) {
                snd_error.play();
                addMessage('You do not have rope to tie down!');
            }else if (hand_band == 1) {
                snd_error.play();
				addMessage('One rope is not enough!');
                addMessage('Get one more!');
			}else{
                snd_pickup.play();
				world[i] = OBJ_BUILDING_WITH_WIRE;
				hand_band = 0;
				hand_saved++;
				if (hand_saved >= must_saved) {
                    addMessage('You tied down all buildings!');
                    addMessage('Now go to the townhouse shelter!');
                }else{
                    addMessage('You tied the building down');
                    addMessage(hand_saved + ' of ' + must_saved + ' buildings are saved');
                }
			}
		}else if (object == OBJ_JFHU_LOGO) {
			addMessage('Just a statue in the city');
		}
        
        if ((object == OBJ_BUILDING || 
            object == OBJ_BUILDING_WITH_WIRE || 
            object == OBJ_CITY_HALL || 
            object == OBJ_HOUSE || 
            object == OBJ_TREE || 
            object == OBJ_JFHU_LOGO) && state == FLY) {
                state = WALK;
                player.pos_z = TALL;
                player.pos_x -= player.vel_x * 5;
                player.pos_y -= player.vel_y * 5;
                player.rot_x = 0;
                player.rot_y = 0;
                player.rot_z = 0;
                player.vel_z = 0;
                world[vehicle + 0] = OBJ_WRECKED_GLIDER;
                world[vehicle + 1] = (player.pos_x - 4 * player.vel_x) / MAG;
                world[vehicle + 2] = (player.pos_y - 4 * player.vel_y) / MAG;
                world[vehicle + 3] = 0;
                snd_flying.pause();
                snd_explosion.play();
                addMessage(MSG_CRASHED);
                addMessage(MSG_FINDANOTHER);
		}
		//collition with all
		if (world[i] == OBJ_HOUSE || 
            world[i] == OBJ_TREE || 
            world[i] == OBJ_WRECKED_GLIDER || 
            world[i] == OBJ_TRUCK ||
			world[i] == OBJ_PARKING || 
            world[i] == OBJ_BUILDING || 
            world[i] == OBJ_BUILDING_WITH_WIRE || 
            world[i] == OBJ_CITY_HALL || 
            world[i] == OBJ_JFHU_LOGO) {
                player.pos_x -= player.vel_x;
                player.pos_y -= player.vel_y;
		}
	}
}

function createWorld() {
	var i = 0;
	var k = 0;
	must_saved = 0;
	do {
		for (var j = 0; j < prog[i + 1]; j++) {
			world[k] = prog[i + 0];
			if (world[k] == OBJ_BUILDING){
                must_saved++;//counting the buildings
            }
			if (world[k] == OBJ_PARKING){
                pplace = prog[i + 3];//parking place
            }
			world[k + 1] = Math.floor(Math.random() * prog[i + 5]) + prog[i + 2];
			world[k + 2] = Math.floor(Math.random() * prog[i + 6]) + prog[i + 3];
			world[k + 3] = Math.floor(Math.random() * prog[i + 7]) + prog[i + 4];
			k += 4;
		}
		i += 8;
	} while (i < prog.length);
}

function gameLoop() {
    update();
	armageddon();
	playerControl();
	playerCollition();
    requestAnimationFrame(gameLoop);
}

function inic() {
    textArray = [];
	head = 0;
	day = 0;
	counter = 0;
    glider_cannot_crash = 0;
	vehicle = 0;
	hand_band = 0, hand_key = 0, hand_saved = 0;
	mouse.x = 0;
    mouse.y = 0;
    mouse.dx = 0;
    mouse.dy = 0;
    snd_flying.pause();
    snd_engine.pause();
    snd_walking.pause();
    snd_pickup.play();
	player.pos_x = -4 * MAG;
    player.pos_y = -2 * MAG;
    player.pos_z = TALL;
	player.forward = 0;
    player.side = 0;
    player.vel_x = 0;
    player.vel_y = 0;
    player.vel_z = 0;
	player.rot_x = 0;
    player.rot_y = 0;
    player.rot_z = 0;
	createWorld();
}

