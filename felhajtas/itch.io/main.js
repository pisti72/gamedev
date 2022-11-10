const DEBUG = true;
const VERSION = '1.3';

const TITLE = 5;
const WALK = 0;
const CAR = 1;
const FLY = 2;
const FALL = 3;
const LIFT = 4;

const KEY_SPACE = 32;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

const WIDTH = 900;
const HEIGHT = 400;
const ARMAGEDDON_SPEED = .11;
const ARMAGEDDON_BEGIN = -900;
const SHOW_MESSAGE = 150;
const DAY_SPEED = .0003;
const DAY_BEGIN = .5;//-1 night --> 1 day
const MAG = 400;
const SMALLSIZE = 3;
const MARGIN = 10;
const WALK_SPEED = 50;
const CAR_SPEED = 100;
const CAR_ACCELERATION = 1;

const DEEP = 10;
const INVISIBLE = 200;

var canvas,ctx,debug;

var textArray=[];

var canvasLeft;
var canvasTop;

var w, h;
var behind, margin, tall, head;
var flight_speed;
var message1, message2, counter, counter1, counter2, counter3;
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
var temp;
var cx, sx, cy, sy, cz, sz;//sinuses and cosinuses for all axes
var player={}
var my_pos_x, my_pos_y, my_pos_z;
var my_vel_x, my_vel_y, my_vel_z;
var my_way;
var my_rot_x, my_rot_y, my_rot_z;
var title = new Image();
var wall = new Image();
var tunnel = new Image();
var truck_cockpit = new Image();
var car_key = new Image();
var rope = new Image();

function start() {
    canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown',function(e){
        //debug=e.which;
        if(e.which == KEY_SPACE && state == TITLE){
            state = WALK;
            inic();
            addMessage(MSG_LOOKBEHIND);
            addMessage(MSG_ENDOFWORLD);
        }else if(e.which == KEY_W && state == CAR){
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
        if(state == WALK){
            if(e.which == KEY_W){
                player.forward = WALK_SPEED;
            }else if(e.which == KEY_S){
                player.forward = -WALK_SPEED;
            }
            if(e.which == KEY_A){
                player.side = -WALK_SPEED/2;
            }else if(e.which == KEY_D){
                player.side = WALK_SPEED/2;
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
        }
    })
    document.addEventListener('click',function(e){
        console.log('clicked');
        if(state == TITLE){
            state = WALK;
            inic();
            addMessage(MSG_LOOKBEHIND);
            addMessage(MSG_ENDOFWORLD);
        }
    })
	ctx = canvas.getContext('2d');
	w = WIDTH;
	h = HEIGHT;
	canvasLeft = canvas.offsetLeft;
	canvasTop = canvas.offsetTop;
    state = TITLE;
	temp = 0;
	behind = -2000;
	margin = 20000;
	gravity = 1;
	flight_speed = MAG;
	
	
    //border=counter*armageddon_speed+armageddon_begin;
	//1900=25000*x-900 --> 1000/25000=x
	
	fov = w / 2;
	title.src = 'gfx/title.png';
	wall.src = 'gfx/wall.png';
	tunnel.src = 'gfx/tunnel.png';
    truck_cockpit.src = 'gfx/truck_cockpit.png';
    car_key.src = 'gfx/car_key.png';
    rope.src = 'gfx/rope.png';
	inic();
	createBoundingBoxes();
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
		y = -obj[i * 3 + 2 + offset] * MAG - my_pos_y + yg * MAG;
		z = obj[i * 3 + 1 + offset] * MAG - my_pos_z + zg * MAG;
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
		v[i * 3 + 2] = 0;//on screen
		//ha a pont mg�tt�nk van akkor rejtett lesz
		if (y2 <= 0) {
			y2 = -y2;
			x2 = 100 * x2;
			z2 = 100 * z2;
			v[i * 3 + 2] = 1;//hide
		} else {
			small = (bbox[j * 2 + 0] * MAG * fov) / y2;
			x = (bbox[j * 2 + 1] * MAG * fov) / y2;
			if (x > small) small = x;
		}
		//projection
		xp = (x2 * fov) / y2 + w / 2;
		yp = h / 2 - (z2 * fov) / y2;

		v[i * 3 + 0] = xp;
		v[i * 3 + 1] = yp;

		if (xp < -margin || xp > w + margin || yp < -margin || yp > h + margin) v[i * 3 + 2] = 1;//hide

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
				axb2 = .3 * nz / nabs + 0.7;//0.7 -> 1.0
				if (color == 16 && day < .5) {
					ink(1, 1, 0);//light
				} else {
					ink(axb2 * palette[color * 3 + 0] * day / 16, axb2 * palette[color * 3 + 1] * day / 16, axb2 * palette[color * 3 + 2] * day / 16);
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

					if (p0e == 0 && p1e == 0 && p2e == 0 && p3e == 0) drawQuad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
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
	if (my_rot_y > -.5 && my_rot_y < .5) {
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
		if (border > world[i + 2])//y
		{
			if (world[i] == OBJ_TREE){
                world[i] = OBJ_TREE_WITH_ROOT;//ha fa volt
            }
			if (world[i] == OBJ_TREE_WITH_ROOT || world[i] == OBJ_HOUSE ||
				world[i] == 2 || world[i] == 3 ||
				world[i] == 4 || world[i] == OBJ_BUILDING ||
				world[i] == 7 || world[i] == 11) {
                    world[i + 3] += gravity;
                }
		}
		if (border > my_pos_y / MAG && state != LIFT) state = FALL;//felsz�llt�l
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
		ordery[n] = (world[i + 1] * MAG - player.pos_x) * sz + (world[i + 2] * MAG - my_pos_y) * cz;//rotate axis-z
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

function drawText() {
	ctx.fillStyle = '#fff';
	ctx.font = 'bold 30px courier';
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
	if (counter1 > 0) {
		ctx.fillText(message1, w / 2, h - 10);
		counter1--;
	}
	if (counter1 <= 0 && counter2 > 0) {
		ctx.fillText(message2, w / 2, h - 10);
		counter2--;
	}
}

function drawMessage(){
    
	ctx.font = 'bold 22px RetroGaming';
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
    
    for(var i=0;i<textArray.length;i++){
        var message = textArray[i];
        if(message.counter > 0){
            message.counter--;
            ctx.fillStyle = '#0008';
            ctx.fillRect(0,h-40,w,40);
            ctx.fillStyle = '#fff';
            ctx.fillText(message.txt, w / 2, h - 10);
        }else{
            textArray.shift();
        }
        return;
    }
}

function sendMessage(m1, c1, m2, c2) {
	if (counter2 == 0) {
		counter1 = c1;
		counter2 = c2;
		message1 = m1;
		message2 = m2;
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
	//lek�t�z�tt toronyh�z kiv�tel
	bbox[9 * 2 + 0] = bbox[8 * 2 + 0];
}

function elapseTime() {
	counter++;
	day = (Math.sin(counter * DAY_SPEED + DAY_BEGIN) + 1) / 2;
}

function update() {
	elapseTime();
	//rotate axis
	cx = Math.cos(my_rot_x);
	sx = Math.sin(my_rot_x);
	cy = Math.cos(my_rot_y);
	sy = Math.sin(my_rot_y);
	cz = Math.cos(my_rot_z);
	sz = Math.sin(my_rot_z);
	drawSky();
	drawGround();
	drawObjects();

	if (state == TITLE) {
		ctx.drawImage(title, Math.floor((w - title.width) / 2), Math.floor((h - title.height) / 2));
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 10px courier';
		ctx.textBaseline = 'bottom';
		ctx.textAlign = 'right';
		ctx.fillText('v' + VERSION, w - 10, h - 10);
	}
    if(state == CAR){
        var truck_cockpit_height = Math.floor((w/truck_cockpit.width)*truck_cockpit.height);
        ctx.drawImage(truck_cockpit, 0, h - truck_cockpit.height*1.2, w, truck_cockpit_height);
    }
    if(hand_key == 1 && state == WALK){
        ctx.drawImage(car_key, w - car_key.width - MARGIN, h - car_key.height - MARGIN);
    }
    if(hand_band > 0){
        for(var i = 0; i<hand_band; i++){
            ctx.drawImage(rope, w - car_key.width - MARGIN - rope.width * (i+1), h - rope.height - MARGIN);
        }
    }
	if (my_pos_y > pplace * MAG && my_pos_y < pplace * (MAG + 1) && state == CAR){
        addMessage(MSG_NEARPARKING);
        addMessage(MSG_PUTCAR);
    }
	if (state == FALL) sendMessage('Felzuhant�l! Meg fogsz halni...', 200, 'Felzuhansz az �rbe, ahol majd megfulladsz :(', 1000);
	if (state == LIFT) {
		sendMessage('Siker�lt megmentened n�h�ny lakost,', 200, '�s k�zt�k magadat is. Gratul�lok!', 1000);
		if (0 < h / 2 + my_pos_z + wall.height * DEEP - 1) {
			my_pos_z -= 4;
		} else inic();
		for (var i = 0; i < DEEP; i++) {
			ctx.drawImage(wall, 0, h / 2 + my_pos_z + wall.height * i);
		}
		ctx.drawImage(tunnel, 0, h / 2 + my_pos_z + wall.height * i);
	}
	//drawText();
    drawMessage();
	if (state == FALL && my_pos_z >= 1){
        inic();   
    }
    debug = player.forward;
    if(DEBUG){
        ctx.fillStyle = '#fff';
        ctx.fillText(debug, w/2, 30);
    }
}

function playerControl() {
	//turning
    if(state == WALK){
        if(mouse.x <= 0){
            my_rot_z -= 0.01;
        }else if(mouse.x >= w){
            my_rot_z += 0.01;
        }else{
            my_rot_z += mouse.dx * 0.01;
        }
        mouse.dx = 0;
    }else if(state == CAR){
        my_rot_z += (mouse.x - w / 2)*player.forward / 400000;
    }else if(state == FLY){
        my_rot_z += (mouse.x - w / 2) / 4000;
    }else if(state == FALL){
        my_rot_z -= (mouse.x - w / 2) / 4000;
    }
	//rolling
	if (state == FLY) my_rot_y = (mouse.x - w / 2) / 1000;
	if (state == CAR) {
        //my_rot_y = -(mouse.x - w / 2) / 4000;
        my_rot_y = -(mouse.x - w / 2)*player.forward / 400000
    }
	if (state == FALL) my_rot_y = (mouse.x - w / 2) / 2000 + Math.PI;
	//speed
	if (state == FLY) player.forward = flight_speed;
	if (state == FALL) my_vel_z = gravity * MAG;
	//pitch
    if (state == WALK) {
        my_rot_x = -(h / 2 - mouse.y) / 200;
    }else if (state == FLY) {
		my_rot_x = (h / 2 - mouse.y) / 400;
		counter3--;
		if (counter3 < 0) counter3 = 0;
		if (counter3 > 0 && my_rot_x > -.1) my_rot_x = -.1;
	}else if (state == CAR) {
		my_rot_x = Math.abs(mouse.x - w / 2)  *player.forward / 100000;
	}else if (state == FALL){
        my_rot_x = (h / 2 - mouse.y) / 200;
    } 
	//head
	head += player.forward / 200;
	if (state == WALK) my_pos_z = tall + Math.sin(head) * 40;
	if (state == CAR) my_pos_z = tall + Math.sin(head) * 20;
	my_vel_y = Math.cos(my_rot_z) * player.forward - Math.sin(my_rot_z) * player.side;
	my_vel_x = Math.sin(my_rot_z) * player.forward  + Math.cos(my_rot_z) * player.side;
	if (state == FLY) my_vel_z = -Math.sin(my_rot_x) * player.forward;
	player.pos_x += my_vel_x;
	my_pos_y += my_vel_y;
	my_pos_z += my_vel_z;
	my_way += Math.abs(player.forward) / MAG;
	if (my_pos_z <= 0 && state == FLY) {
		my_rot_y = 0;
		my_vel_z = 0;
		my_pos_z = tall;
		world[vehicle + 1] = (player.pos_x - 4 * my_vel_x) / MAG;
		world[vehicle + 2] = (my_pos_y - 4 * my_vel_y) / MAG;
		world[vehicle + 3] = 0;
		state = WALK;
		if (my_rot_x > 0.25) {
			world[vehicle + 0] = 6;//roncs repcsi
			sendMessage('T�l meredek volt a lesz�ll�s!', 50, 'Szerezz m�sik sikl�t!', 50);
		} else {
			world[vehicle + 0] = 2;//rep�l�
			sendMessage('Lesz�llt�l!', 50, '', 0);
		}
		my_rot_x = 0;
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
			if (bh * MAG < tall) bh += tall / MAG;
			if (player.pos_x > (world[i + 1] - bw) * MAG && player.pos_x < (    world[i + 1] + bw) * MAG &&
				my_pos_y > (world[i + 2] - bw) * MAG && my_pos_y < (world[i + 2] + bw) * MAG &&
				my_pos_z > (world[i + 3]) * MAG && my_pos_z < (world[i + 3] + bh) * MAG) {
				found = true;
			}
		}
		i += 4;
	} while (!found && i < world.length);

	if (found) {
		i -= 4;
        player.forward = 0;
        player.side = 0;
		if (world[i] == OBJ_GLIDER && state == WALK) {
			addMessage(MSG_GOTGLIDER);
            addMessage(MSG_CAREFUL);
			world[i] = INVISIBLE;
			counter3 = 30;
			state = FLY;
			vehicle = i;
		}
		//roncs sikl�
		if (world[i] == OBJ_WRECKED_GLIDER && state == WALK) {
			addMessage(MSG_WONTFLIGHT);
            addMessage(MSG_FINDANOTHER);
		}
		//aut�
		if (world[i] == OBJ_TRUCK && state == WALK) {
			if (hand_key == 1) {
				addMessage(MSG_GOTCAR);
				world[i] = INVISIBLE;
				state = CAR;
                player.forward = 0;
                player.side = 0;
				vehicle = i;
			} else {
				addMessage(MSG_GETCARKEY);
			}
		}
		//out of car at P-plate
		if (world[i] == OBJ_PARKING && state == CAR) {
			my_rot_x = 0;
			my_rot_y = 0;
			my_vel_z = 0;
			my_pos_z = tall;
			world[vehicle + 0] = OBJ_TRUCK;
			world[vehicle + 1] = world[i + 1];
			world[vehicle + 2] = world[i + 2] + 2;//put it close to P
			world[vehicle + 3] = world[i + 3];
			state = WALK;
			addMessage(MSG_GOTOUT);
		}
		if (world[i] == OBJ_HOUSE && hand_key == 0) {
			addMessage(MSG_GOTKEY);
			hand_key = 1;
		}
		if (world[i] == OBJ_CITY_HALL && state == WALK) {
			if (hand_saved >= must_saved) {
				sendMessage('Most m�r beenged�nk az �v�helyre!', 50, 'Megmenek�lt�l!', 50);
				state = LIFT;
				player.forward = 0;
                player.side = 0;
				my_vel_x = 0;
				my_vel_y = 0;
			} else {
				sendMessage('Mentsd meg az �sszes h�zat!', 50, 'Eddig ' + hand_saved + ' toronyh�zat r�gz�tett�l!', 50);
			}
		}
		//felvessz�k a k�telet
		if (world[i] == OBJ_BALLOON) {
			if (hand_band < 2) {
				hand_band++;
				if (hand_band == 1) sendMessage('Felvetted az els� k�telet!', 50, '', 0);
				if (hand_band == 2) sendMessage('Felvetted a m�sodik k�telet!', 50, '', 0);
				world[i] = INVISIBLE;
			} else {
				sendMessage('Nincs t�bb hely a sikl�n!', 50, '', 0);
			}
		}
		//hoztunk k�telet gyalog a h�zhoz
		if (world[i] == OBJ_BUILDING && state == WALK) {
			if (hand_band == 0) { sendMessage('Nincs k�teled a r�gz�t�shez!', 50, '', 0); }
			if (hand_band == 1) {
				sendMessage('Egy egys�g k�t�l nem el�g!', 50, 'K�t egys�g k�t�l kell a r�gz�t�shez!', 50);
			}
			if (hand_band == 2) {
				world[i] = 9;//k�teles h�z
				hand_band = 0;
				hand_saved++;
				if (must_saved - hand_saved != 0) {
					sendMessage('A h�zat r�gz�tetted!', 50, 'M�g ' + (must_saved - hand_saved) + ' h�zat kell megmentened!', 50);
				} else {
					sendMessage('Ezzel, az �sszes h�zat r�gz�tetted!', 50, 'Most menj az �v�helyre!', 50);
				}
			}
		}
		//jfhu logo
		if (world[i] == OBJ_JFHU_LOGO) {
			sendMessage('A v�ros v�delemz�je!', 50, 'L�togass el a www.jatekfejlesztes.hu oldalra!', 50);
		}
		//�tk�z�s a rep�l�vel a t�rgyaknak
		if ((world[i] == OBJ_BUILDING || 
            world[i] == OBJ_BUILDING_WITH_WIRE || 
            world[i] == OBJ_CITY_HALL || 
            world[i] == OBJ_HOUSE || 
            world[i] == OBJ_TREE || 
            world[i] == OBJ_JFHU_LOGO) && state == FLY) {
                state = WALK;
                my_pos_z = tall;
                player.pos_x -= my_vel_x * 5;
                my_pos_y -= my_vel_y * 5;
                my_rot_x = 0;
                my_rot_y = 0;
                my_vel_z = 0;
                world[vehicle + 0] = OBJ_WRECKED_GLIDER;//roncs repcsi
                world[vehicle + 1] = (player.pos_x - 4 * my_vel_x) / MAG;
                world[vehicle + 2] = (my_pos_y - 4 * my_vel_y) / MAG;
                world[vehicle + 3] = 0;
                sendMessage('Lezuhant�l!', 50, 'Szerezz m�sik sikl�t!', 0);//lezuhant�l
		}
		//�tk�z�s sokmindennel
		if (world[i] == OBJ_HOUSE || 
            world[i] == OBJ_TREE || 
            world[i] == OBJ_WRECKED_GLIDER || 
            world[i] == OBJ_TRUCK ||
			world[i] == OBJ_PARKING || 
            world[i] == OBJ_BUILDING || 
            world[i] == OBJ_BUILDING_WITH_WIRE || 
            world[i] == OBJ_CITY_HALL || 
            world[i] == OBJ_JFHU_LOGO) {
                player.pos_x -= my_vel_x;
                my_pos_y -= my_vel_y;
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
	armageddon();
	playerControl();
	playerCollition();
	update();
    requestAnimationFrame(gameLoop);
}

function inic() {
	tall = 1.2 * MAG;
	head = 0;
	day = 0;
	message1 = '', message2 = '';
	counter = 0, counter1 = 0, counter2 = 0, counter3 = 0;
	
	vehicle = 0;
	hand_band = 0, hand_key = 1, hand_saved = 0;
	mouse.x = 0, mouse.y = 0;
	player.pos_x = -4 * MAG, my_pos_y = -2 * MAG, my_pos_z = tall;
	player.forward = 0;
    player.side = 0;
    my_vel_x = 0, my_vel_y = 0, my_vel_z = 0;
	my_way = 0;
	my_rot_x = 0, my_rot_y = 0, my_rot_z = 0;
	createWorld();
    
}

