/*
release notes:
1.2
- Mozilla 3.6-os hiba javítása
- lekötözött épülettel is ütközés kezelése
- mögöttünk lévõ dolgok ki nem rajzolása
- rontás és gyõzelem után újraindul a játék

1.1
- gyaloglás közben fejmozgás
- elsõ és második kötél felvétele feliratai



*/

document.onmousemove=onMouseMove;
//get a reference to the canvas

const VERSION='1.2';
const WALK=0;
const CAR=1;
const FLY=2;
const FALL=3;
const LIFT=4;

const DEEP=10;

var ctx;

var canvasLeft;
var canvasTop;

var w,h;
var mag,smallsize,margin,tall,head;
var armageddon_speed,flight_speed,car_speed,walk_speed;
var armageddon_begin;
var message1,message2,counter,counter1,counter2,counter3;
var pplace;
var status;
var vehicle;
var hand_band,hand_key,hand_saved,must_saved;
var world=[];//obj,x,y,z
var v=[];//vertex array: x,y,on screen?
var vt=[];//vertex array: x,y,z?
var objpointer=[];
var bbox=[];//bounding boxes w,h
var fov;
var day,day_speed,day_begin,color;
var mouse_x,mouse_y,temp;
var cx,sx,cy,sy,cz,sz;//sinuses and cosinuses for all axes
var my_pos_x,my_pos_y,my_pos_z;
var my_vel,my_vel_x,my_vel_y,my_vel_z;
var my_way;
var my_rot_x,my_rot_y,my_rot_z;
var invisible;
var splash=new Image();
var wall=new Image();
var tunnel=new Image();

function onMouseMove(e)
{
	mouse_x=e.pageX-canvasLeft;
	mouse_y=e.pageY-canvasTop;
	if(mouse_x<0)mouse_x=0;
	if(mouse_x>w)mouse_x=w;
	if(mouse_y<0)mouse_y=0;
	if(mouse_y>h)mouse_y=h;
}

function drawObject(j,xg,yg,zg)
{
	//pontok 3D-->2D
	var x,y,z,x2,y2,z2,xp,yp;
	var p0x,p1x,p2x,p3x;
	var p0y,p1y,p2y,p3y;
	var p0e,p1e,p2e,p3e;
	var small;
	var offset=objpointer[j];
	var i=0;
	do
	{
		//translate
		x=obj[i*3+0+offset]*mag-my_pos_x+xg*mag;
		y=-obj[i*3+2+offset]*mag-my_pos_y+yg*mag;
		z=obj[i*3+1+offset]*mag-my_pos_z+zg*mag;
		//rotate axis-z
		x2=x*cz-y*sz;
		y2=x*sz+y*cz;
		z2=z;
		//pitch axis-x
		x=x2;
		y=y2*cx-z2*sx;
		z=y2*sx+z2*cx;
		//roll axis-y
		x2=x*cy-z*sy;
		y2=y;
		z2=x*sy+z*cy;
		//eltesszük a transzformált 3d pontokat
		vt[i*3+0]=x2;
		vt[i*3+1]=y2;
		vt[i*3+2]=z2;
		//yout=y2;
		small=100000;
		v[i*3+2]=0;//on screen
		//ha a pont mgöttünk van akkor rejtett lesz
		if(y2+fov<=0){
			y2=-y2;
			x2=100*x2;
			z2=100*z2;
			v[i*3+2]=1;//hide
		}else{
			small=(bbox[j*2+0]*mag*fov)/(y2+fov);
			x=(bbox[j*2+1]*mag*fov)/(y2+fov);
			if(x>small)small=x;
		}
		//projection
		xp=(x2*fov)/(y2+fov)+w/2;
		yp=h/2-(z2*fov)/(y2+fov);

		v[i*3+0]=xp;
		v[i*3+1]=yp;
		
		if(xp<-margin || xp>w+margin || yp<-margin || yp>h+margin)v[i*3+2]=1;//hide

		i++;
	}while(obj[i*3+0+offset]!=88888 && small>smallsize);
	//élek
	var p0,p1,p2,p3;
	var p0p1x,p0p1y,p0p1z;
	var p0p3x,p0p3y,p0p3z;
	var nx,ny,nz,nabs;
	var bx,by,bz,babs;
	var c;
	var axb,axb2;
	color=1
	if(small>smallsize)
	{
		i=i*3+1;
		do
		{
			c=obj[i+offset];
			if(c<1000)
			{
				p0=(obj[i+offset+0]-1)*3;
				p1=(obj[i+offset+1]-1)*3;
				p2=(obj[i+offset+2]-1)*3;
				p3=(obj[i+offset+3]-1)*3;
				//lap normálisa
				//a
				p0p1x=vt[p1+0]-vt[p0+0];
				p0p1y=vt[p1+1]-vt[p0+1];
				p0p1z=vt[p1+2]-vt[p0+2];
				//b
				p0p3x=vt[p3+0]-vt[p0+0];
				p0p3y=vt[p3+1]-vt[p0+1];
				p0p3z=vt[p3+2]-vt[p0+2];
				//normál vektor
				nx=p0p1y*p0p3z-p0p1z*p0p3y;//ay*bz-az*by
				ny=p0p1z*p0p3x-p0p1x*p0p3z;//az*bx-ax*bz
				nz=p0p1x*p0p3y-p0p1y*p0p3x;//ax*by-ay*bx
				nabs=Math.sqrt(nx*nx+ny*ny+nz*nz);
				//vektor szorzata
				bx=vt[p0+0];
				by=vt[p0+1];
				bz=vt[p0+2];
				axb2=.3*nz/nabs+0.7;//0.7 -> 1.0
				if(color==16 && day<.5)
				{
					ink(1,1,0);//light
				}else{
					ink(axb2*palette[color*3+0]*day/16,axb2*palette[color*3+1]*day/16,axb2*palette[color*3+2]*day/16);
				}
				axb=(nx*bx+ny*by+nz*bz);
				if(axb<0)
				{
					//éleket alkotó 2D pontok
				
					p0x=v[p0+0];
					p0y=v[p0+1];
					p0e=v[p0+2];
			
					p1x=v[p1+0];
					p1y=v[p1+1];
					p1e=v[p1+2];
			
					p2x=v[p2+0];
					p2y=v[p2+1];
					p2e=v[p2+2];
			
					p3x=v[p3+0];
					p3y=v[p3+1];
					p3e=v[p3+2];

					if(p0e==0 && p1e==0 && p2e==0 && p3e==0)drawQuad(p0x,p0y,p1x,p1y,p2x,p2y,p3x,p3y);
				}
				i+=4;
			}else{
				color=c-1000;
				i++;
			}
			
		}while(obj[i+offset]!=99999)
	}
}

function drawQuad(u1,v1,u2,v2,u3,v3,u4,v4)
{
	ctx.beginPath();
	ctx.moveTo(u1,v1);
	ctx.lineTo(u2,v2);
	ctx.lineTo(u3,v3);
	ctx.lineTo(u4,v4);
	ctx.closePath();
	if(color==17)
	{
		ctx.lineJoin = 'bevel';
		ctx.lineWidth = 1;
		ctx.stroke();
	}else{ctx.fill();}
}

function ink(r,g,b)
{
	if(r<0)r=0;
	if(r>1)r=1;
	if(g<0)g=0;
	if(g>1)g=1;
	if(b<0)b=0;
	if(b>1)b=1;
	r=Math.floor(r*255);
	g=Math.floor(g*255);
	b=Math.floor(b*255);
	ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
}

function drawSky()
{
	ink((14*(-(day-1)*(day-1)+1))/16,(16*day*day)/16,(16*day*day*0.2+0.8*16)/16);
	ctx.fillRect (0, 0,  w, h);
}

function drawGround()
{
	var x,y,z,x2,y2,z2,yp1,yp2;
	var m=200,d=3000;
	//0-margin=(x2*fov)/(y2+fov)+w/2;
	y2=d*mag;
	z2=0;
	x2=(-m-w/2)*(y2+fov)/fov;
	//pitch axis-x
	x=x2;
	y=y2*cx-z2*sx;
	z=y2*sx+z2*cx;
	//roll axis-y
	x2=x*cy-z*sy;
	y2=y;
	z2=x*sy+z*cy;
	//projection
	xp1=(x2*fov)/(y2+fov)+w/2;
	yp1=h/2-(z2*fov)/(y2+fov);
	//w+margin=(x2*fov)/(y2+fov)+w/2;
	y2=d*mag;
	z2=0;
	x2=(w/2+m)*(y2+fov)/fov;
	//pitch axis-x
	x=x2;
	y=y2*cx-z2*sx;
	z=y2*sx+z2*cx;
	//roll axis-y
	x2=x*cy-z*sy;
	y2=y;
	z2=x*sy+z*cy;
	//projection
	xp2=(x2*fov)/(y2+fov)+w/2;
	yp2=h/2-(z2*fov)/(y2+fov);
	ink((7*(-(day-1)*(day-1)+1))/16,(15*day)/16,(7*day)/16);
	ctx.beginPath();
	if(my_rot_y>-.5 && my_rot_y<.5)
	{
		ctx.moveTo(0,h);
		ctx.lineTo(xp1,yp1);
		ctx.lineTo(xp2,yp2);
		ctx.lineTo(w,h);
	}
	else
	{
		ctx.moveTo(w,0);
		ctx.lineTo(xp1,yp1);
		ctx.lineTo(xp2,yp2);
		ctx.lineTo(0,0);
	}
	ctx.closePath();
	ctx.fill();
}

function armageddon()
{
	var i=0
	var border=counter*armageddon_speed+armageddon_begin;
	do
	{
		if(border>world[i+2])//y
		{
			if(world[i]==1)world[i]=5;//ha fa volt
			if(world[i]==5 || world[i]==0 || 
				world[i]==2 || world[i]==3 || 
				world[i]==4 || world[i]==8 || 
				world[i]==7 || world[i]==11)world[i+3]+=gravity;//lináris!!!
		}
		if(border>my_pos_y/mag && status!=LIFT)status=FALL;//felszálltál
		if(world[i+3]>300)world[i]=invisible;
		i+=4;
	}while(i<world.length);
}

function drawObjects()
{
	var i=0,j,n=0,tn,ty;
	var ordern=[];
	var ordery=[];
	do
	{
		ordern[n]=n;
		ordery[n]=(world[i+1]*mag-my_pos_x)*sz+(world[i+2]*mag-my_pos_y)*cz;//rotate axis-z
		n++;
		i+=4;
	}while(i<world.length);
	
	for(i=n;i>=0;i--)
	{
		for(j=0;j<i;j++)
		{
			if(ordery[j]<ordery[j+1])
			{
				tn=ordern[j];
				ty=ordery[j];
				ordern[j]=ordern[j+1];
				ordery[j]=ordery[j+1];
				ordern[j+1]=tn;
				ordery[j+1]=ty;
			}
		}
	}
	i=0;
	do
	{
		j=ordern[i]*4;
		if(world[j]<invisible && ordery[i]>0)drawObject(world[j],world[j+1],world[j+2],world[j+3]);
	}while((++i)!=n);
}

function drawText()
{
	ctx.fillStyle = '#fff';
	ctx.font = 'bold 8px courier';
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'center';
	if(counter1>0)
	{
		ctx.fillText(message1, w/2, h-10);
		counter1--;
	}
	if(counter1<=0 && counter2>0)
	{
		ctx.fillText(message2, w/2, h-10);
		counter2--;
	}
}

function sendMessage(m1,c1,m2,c2)
{
	if(counter2==0)
	{
		counter1=c1;
		counter2=c2;
		message1=m1;
		message2=m2;
	}
}

function createBoundingBoxes()
{
	var i=0,j=0,k=0;
	var xmax=0,zmax=0;
	objpointer[k]=0;
	do
	{
		if(obj[i+0]==88888)
		{
			bbox[j*2+0]=xmax;
			bbox[j*2+1]=zmax;
			j++;
			xmax=0;
			zmax=0;
			do{}while(obj[++i]!=99999);
			i++;
			objpointer[++k]=i;
		}
		if(obj[i+0]>xmax)xmax=obj[i+0];
		if(obj[i+1]>zmax)zmax=obj[i+1];
		i+=3;
	}while(i<=obj.length);
	//lekötözött toronyház kivétel
	bbox[9*2+0]=bbox[8*2+0];
}

function elapseTime()
{
	counter++;
	day=(Math.sin(counter*day_speed+day_begin)+1)/2;
}

function update()
{
	elapseTime();
	//rotate axis
	cx=Math.cos(my_rot_x);
	sx=Math.sin(my_rot_x);
	cy=Math.cos(my_rot_y);
	sy=Math.sin(my_rot_y);
	cz=Math.cos(my_rot_z);
	sz=Math.sin(my_rot_z);
	drawSky();
	drawGround();
	drawObjects();
	
	if(counter<80)
	{
		ctx.drawImage(splash,Math.floor((w-splash.width)/2),Math.floor((h-splash.height)/2));
		ctx.fillStyle = '#fff';
		ctx.font = 'bold 10px courier';
		ctx.textBaseline = 'bottom';
		ctx.textAlign = 'right';
		ctx.fillText('v'+VERSION, w-10, h-10);
	}
	if(counter==81)sendMessage('Nézz a hátad mögé! Hogy repülnek a fák!',50,'Közeledik a VILÁGVÉGE! Menekülj a város felé!',100);
	if(my_pos_y>pplace*mag && my_pos_y<pplace*(mag+1) && status==CAR)sendMessage('A közelben találsz parkoló táblát.',50,'Ott lerakhatod az autót.',50);
	if(status==FALL)sendMessage('Felzuhantál! Meg fogsz halni...',200,'Felzuhansz az ûrbe, ahol majd megfulladsz :(',1000);
	if(status==LIFT)
	{
		sendMessage('Sikerült megmentened néhány lakost,',200,'és köztük magadat is. Gratulálok!',1000);
		if(0<h/2+my_pos_z+wall.height*DEEP-1)
		{
			my_pos_z-=4;
		}else inic();
		for(var i=0;i<DEEP;i++)
		{
			ctx.drawImage(wall,0,h/2+my_pos_z+wall.height*i);
		}
		ctx.drawImage(tunnel,0,h/2+my_pos_z+wall.height*i);
	}
	drawText();
	if(status==FALL && my_pos_z/mag>=400)inic();
}

function playerControl()
{
	//turning
	if(counter>85 && status!=LIFT)
	{
		if(status==FALL)
		{
			my_rot_z-=(mouse_x-w/2)/4000;
		}else
		{
			my_rot_z+=(mouse_x-w/2)/4000;
		}
	}
	//rolling
	if(status==FLY)my_rot_y=(mouse_x-w/2)/1000;
	if(status==CAR)my_rot_y=-(mouse_x-w/2)/4000;
	if(status==FALL)my_rot_y=(mouse_x-w/2)/2000+3.14;
	//speed
	if(status==WALK && counter>100)my_vel=(h/2-mouse_y)/200*walk_speed;
	if(status==FLY)my_vel=flight_speed;
	if(status==CAR)my_vel=(h/2-mouse_y)/200*car_speed;
	if(status==FALL)my_vel_z=gravity*mag;
	//pitch
	if(status==FLY)
	{
		my_rot_x=(h/2-mouse_y)/400;
		counter3--;
		if(counter3<0)counter3=0;
		if(counter3>0 && my_rot_x>-.1)my_rot_x=-.1;
	}
	if(status==CAR)
	{
		my_rot_x=Math.abs(mouse_x-w/2)/2000;
		temp=mouse_y;
	}
	if(status==FALL)my_rot_x=(h/2-mouse_y)/200;
	//head
	head+=my_vel/200;
	if(status==WALK)my_pos_z=tall+Math.sin(head)*40;
	if(status==CAR)my_pos_z=tall+Math.sin(head)*20;
	my_vel_y=Math.cos(my_rot_z)*my_vel;
	my_vel_x=Math.sin(my_rot_z)*my_vel;
	if(status==FLY)my_vel_z=-Math.sin(my_rot_x)*my_vel;
	my_pos_x+=my_vel_x;
	my_pos_y+=my_vel_y;
	my_pos_z+=my_vel_z;
	my_way+=Math.abs(my_vel)/mag;
	if(my_pos_z<=0 && status==FLY)
	{
		my_rot_y=0;
		my_vel_z=0;
		my_pos_z=tall;
		world[vehicle+1]=(my_pos_x-4*my_vel_x)/mag;
		world[vehicle+2]=(my_pos_y-4*my_vel_y)/mag;
		world[vehicle+3]=0;
		status=WALK;
		if(my_rot_x>0.25)
		{
			world[vehicle+0]=6;//roncs repcsi
			sendMessage('Túl meredek volt a leszállás!',50,'Szerezz másik siklót!',50);
		}else
		{
			world[vehicle+0]=2;//repülö
			sendMessage('Leszálltál!',50,'',0);
		}
		my_rot_x=0;
	}
}

function playerCollition()
{
	var i=0;
	var found=0;
	var bw,bh;
	do
	{
		if(world[i]<invisible)
		{
			bw=bbox[world[i]*2+0];
			bh=bbox[world[i]*2+1];
			if(bh*mag<tall)bh+=tall/mag;
			if(my_pos_x>(world[i+1]-bw)*mag && my_pos_x<(world[i+1]+bw)*mag &&
			my_pos_y>(world[i+2]-bw)*mag && my_pos_y<(world[i+2]+bw)*mag &&
			my_pos_z>(world[i+3])*mag && my_pos_z<(world[i+3]+bh)*mag)
			{
				found=1;
			}
		}
		i+=4;
	}while(found==0 && i<world.length);
	
	if(found==1)
	{
		i-=4;
		//sikló
		if(world[i]==2 && status==WALK)
		{
			sendMessage('Beszálltál a siklóba!',50,'Vigyázz rá ne törd össze!',50);
			world[i]=invisible;
			counter3=30;
			status=FLY;
			vehicle=i;
		}
		//roncs sikló
		if(world[i]==6 && status==WALK)
		{
			sendMessage('Ezzel te már nem repülsz ;-)',50,'Szerezz másik siklót!',50);
		}
		//autó
		if(world[i]==3 && status==WALK)
		{
			if(hand_key==1)
			{
				sendMessage('Beszálltál az autóba!',50,'',0);
				world[i]=invisible;
				status=CAR;
				vehicle=i;
			}else
			{
				sendMessage('Szerezz slusszkulcsot!',50,'',0);
			}
		}
		//out of car at P-plate
		if(world[i]==4 && status==CAR)
		{
			my_rot_x=0;
			my_rot_y=0;
			my_vel_z=0;
			my_pos_z=tall;
			world[vehicle+0]=3;
			world[vehicle+1]=world[i+1];
			world[vehicle+2]=world[i+2]+2;//put it close to P
			world[vehicle+3]=world[i+3];
			status=WALK;
			sendMessage('Kiszálltál az autóból!',50,'',0);
		}
		//házzal
		if(world[i]==0 && hand_key==0)
		{
			sendMessage('Szereztél slusszkulcsot!',50,'',0);
			hand_key=1;
		}
		//Városházával
		if(world[i]==10 && status==WALK)
		{
			if(hand_saved>=must_saved)
			{
				sendMessage('Most már beengedünk az óvóhelyre!',50,'Megmenekültél!',50);
				status=LIFT;
				my_vel=0;
				my_vel_x=0;
				my_vel_y=0;
			}else
			{
				sendMessage('Mentsd meg az összes házat!',50,'Eddig '+hand_saved+' toronyházat rögzítettél!',50);					
			}
		}
		//felvesszük a kötelet
		if(world[i]==7)
		{
			if(hand_band<2)
			{
				hand_band++;
				if(hand_band==1)sendMessage('Felvetted az elsõ kötelet!',50,'',0);
				if(hand_band==2)sendMessage('Felvetted a második kötelet!',50,'',0);
				world[i]=invisible;
			}else
			{
				sendMessage('Nincs több hely a siklón!',50,'',0);
			}
		}
		//hoztunk kötelet gyalog a házhoz
		if(world[i]==8 && status==WALK)
		{
			if(hand_band==0){sendMessage('Nincs köteled a rögzítéshez!',50,'',0);}
			if(hand_band==1)
			{
				sendMessage('Egy egység kötél nem elég!',50,'Két egység kötél kell a rögzítéshez!',50);
			}
			if(hand_band==2)
			{
				world[i]=9;//köteles ház
				hand_band=0;
				hand_saved++;
				if(must_saved-hand_saved!=0)
				{
					sendMessage('A házat rögzítetted!',50,'Még '+(must_saved-hand_saved)+' házat kell megmentened!',50);
				}else
				{
					sendMessage('Ezzel, az összes házat rögzítetted!',50,'Most menj az óvóhelyre!',50);
				}
			}
		}
		//jfhu logo
		if(world[i]==11)
		{
			sendMessage('A város védelemzõje!',50,'Látogass el a www.jatekfejlesztes.hu oldalra!',50);
		}
		//ütközés a repülõvel a tárgyaknak
		if((world[i]==8 || world[i]==9 || world[i]==10 || world[i]==0 || world[i]==1 || world[i]==11) && status==FLY)
		{
			status=WALK;
			my_pos_z=tall;
			my_pos_x-=my_vel_x*5;
			my_pos_y-=my_vel_y*5;
			my_rot_x=0;
			my_rot_y=0;
			my_vel_z=0;
			world[vehicle+0]=6;//roncs repcsi
			world[vehicle+1]=(my_pos_x-4*my_vel_x)/mag;
			world[vehicle+2]=(my_pos_y-4*my_vel_y)/mag;
			world[vehicle+3]=0;
			sendMessage('Lezuhantál!',50,'Szerezz másik siklót!',0);//lezuhantál
		}
		//ütközés sokmindennel
		if(world[i]==0 || world[i]==1 || world[i]==6 ||world[i]==3 ||
			world[i]==4 ||world[i]==8 || world[i]==9 || world[i]==10 ||world[i]==11)
		{
			my_pos_x-=my_vel_x;
			my_pos_y-=my_vel_y;
		}
	}
}

function createWorld()
{
	var i=0;
	var k=0;
	must_saved=0;
	do
	{
		for(var j=0;j<prog[i+1];j++)
		{
			world[k]=prog[i+0];
			if(world[k]==8)must_saved++;//megszámoljuk a toronyházakat
			if(world[k]==4)pplace=prog[i+3];//honnantól lehet parkolni
			world[k+1]=Math.floor(Math.random()*prog[i+5])+prog[i+2];
			world[k+2]=Math.floor(Math.random()*prog[i+6])+prog[i+3];
			world[k+3]=Math.floor(Math.random()*prog[i+7])+prog[i+4];
			k+=4;
		}
		i+=8;
	}while(i<prog.length);
}

function gameLoop()
{
	armageddon();
	playerControl();
	playerCollition();
	//document.getElementById('r').innerHTML=Math.floor(my_pos_x/mag)+','+Math.floor(my_pos_y/mag);
	//document.getElementById('r').innerHTML=my_rot_y;
	update();
	window.setTimeout("gameLoop();",20);//frissítés 1sec=1000 30frame/sec = 33
}

function inic()
{
	tall=1.2*mag;
	head=0;
	day=0;
	message1='',message2='';
	counter=0,counter1=0, counter2=0, counter3=0;
	status=WALK;
	vehicle=0;
	hand_band=0,hand_key=0,hand_saved=0;
	mouse_x=0, mouse_y=0;
	my_pos_x=-4*mag,my_pos_y=-2*mag,my_pos_z=tall;
	my_vel=0,my_vel_x=0,my_vel_y=0,my_vel_z=0;
	my_way=0;
	my_rot_x=0,my_rot_y=0,my_rot_z=0;
	createWorld();
}

function start()
{
	ctx = document.getElementById('display').getContext('2d');
	w=400;
	h=500;
	canvasLeft=document.getElementById('display').offsetLeft;
	canvasTop=document.getElementById('display').offsetTop;
	mag=600;
	smallsize=6;
	temp=0;
	margin=400;
	gravity=1;
	flight_speed=mag;
	car_speed=mag/2;
	walk_speed=mag/4;
	armageddon_begin=-900;
	armageddon_speed=.11;//border=counter*armageddon_speed+armageddon_begin;
	//1900=25000*x-900 --> 1000/25000=x
	day_speed=.0003;//.0003 lassú volt
	day_begin=.5;//-1 este --> 1 nappal szinusz szerint változik
	fov=600;	
	invisible=200;
	splash.src='gfx/splash.png';
	wall.src='gfx/wall.png';
	tunnel.src='gfx/tunnel.png';
	inic();
	createBoundingBoxes();
	gameLoop();
}