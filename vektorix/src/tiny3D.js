/**
 * @license
 * TINY3D 
 * Copyright (c) 2013, Istvan Szalontai
 *
 * TINY3D is licensed under the CC License.
 * http://creativecommons.org/licenses/by-nc/4.0/deed.en
 *
 */
 
/**
 * @author Istvan Szalontai http://istvanszalontai.atw.hu/ @SzalontaiIstvan
 */
 
/*
version:
1-2013-12-11:
- add colors
- collition

2-2013-12-12:
- z-buffer
- setposObj
- getposObj
*/
function TINY3D(){
	var objects = [];
	var masterobj = [];
	var ctx;
	var w,h;
	var stream = [];
	var fov;
	var Camera;
/**
 *
 */
this.init = function(url){
	var c = document.getElementsByTagName('canvas');
	w = c[0].width = document.body.clientWidth;
	h = c[0].height = document.body.clientHeight;
	fov = w/2;
	Camera = new Point3D(0,-1,0);
	ctx = c[0].getContext('2d');
	
	//opening wavefront obj data
	var extFile;
	var oReq = new XMLHttpRequest();
	oReq.onload = reqListener;
	oReq.open("get", url, false);//false = asyncronous
	oReq.send();
	
	function reqListener () {
		extFile = this.responseText;
		console.log('objects has been loaded');
	}
	var i,j,k;
	var edgeoffset;
	for(i=0; i<extFile.length; i++)extFile = extFile.replace('\n',' ');//eliminate enters
	stream = extFile.split(' ');	
	//creating objects
	i = 0;
	j = -1;
	k = 1;
	while(i < stream.length-1)
	{
		//found new object
		if(stream[i] == 'o')
		{
			edgeoffset = k;
			j++;
			masterobj.push(new MasterObj);
			i++;
			masterobj[j].name = stream[i];
		}
		//found new vertex
		if(stream[i] == 'v')
		{
			masterobj[j].pushVertex(Number(stream[i+1]), Number(stream[i+3]), Number(stream[i+2]));//y and z are exchanged
			k++;
			i += 3;
		}
		//found new edge
		if(stream[i] == 'l')
		{
			masterobj[j].pushEdge(stream[i+1]-edgeoffset, stream[i+2]-edgeoffset);
			i += 2;
		}
		i++;
	} 
}
/**
 *
 *
 *
 */
this.render = function(){
	ctx.clearRect(0,0,w,h);
	var v2D = [];
	var a, b;
	//z-buffering
	var order = [];
	var value = [];
	for(var i=0; i<objects.length; i++)
	{
		order[i]=i;
		value[i] = objects[i].Point3D.y;
	}
	
	for(var i=objects.length-1; i>0; i--) //N --> 1
	{
		for(var j=0; j<i; j++)//j N --> 1
		{
			if(value[j] < value[j+1])
			{
				var t = order[j];
				order[j] = order[j+1];
				order[j+1] = t;
				t = value[j];
				value[j] = value[j+1];
				value[j+1]=t;
			}
		}
	}

	
	//draw them
	for(var i=0; i<objects.length; i++)
	{
		v2D.length = 0;
		var j = getMasterObjIndex(objects[i].name);
		if(j != -1)
		{
			//calculate 2D vertices from 3D vertices
			for(var k=0; k<masterobj[j].vertices; k++)
			{
				v2D.push(get2Dxy(masterobj[j].Point3D(k), objects[order[i]].Point3D, objects[order[i]].Rotation3D));
			}
			//draw 2d edges
			ctx.strokeStyle = objects[order[i]].color;
			ctx.lineWidth = 4;
			ctx.beginPath();
			for(var k=0; k<masterobj[j].edges; k++)
			{
				a = masterobj[j].Edge3D(k).a;
				b = masterobj[j].Edge3D(k).b;
				if(v2D[a].visible && v2D[b].visible)
				{
					ctx.moveTo(v2D[a].x , v2D[a].y);
					ctx.lineTo(v2D[b].x , v2D[b].y);
				}
			}
			ctx.stroke();

			ctx.strokeStyle = 'white';
			ctx.lineWidth = 1;
			ctx.beginPath();
			for(var k=0; k<masterobj[j].edges; k++)
			{
				a = masterobj[j].Edge3D(k).a;
				b = masterobj[j].Edge3D(k).b;
				if(v2D[a].visible && v2D[b].visible)
				{
					ctx.moveTo(v2D[a].x , v2D[a].y);
					ctx.lineTo(v2D[b].x , v2D[b].y);
				}
			}
			ctx.stroke();
		}
	}
}
/**
 *
 *
 *
 */
function get2Dxy(master, objpos, objrot)
{
	var x,y,z,x2,y2,z2;
	x = master.x * Math.cos(objrot.z) - master.y * Math.sin(objrot.z);
	y = master.x * Math.sin(objrot.z) + master.y * Math.cos(objrot.z);
	z = master.z;
	
	x2 = x;
	y2 = y * Math.cos(objrot.x) - z * Math.sin(objrot.x);
	z2 = y * Math.sin(objrot.x) + z * Math.cos(objrot.x);
	
	x = x2 + objpos.x - Camera.x;
	y = y2 + objpos.y - Camera.y;
	z = z2 + objpos.z - Camera.z;
	var visible = true;
	if(y <= 0)visible = false;
	//the magic happens here :-)
	return new Point2D(Math.floor((x*fov)/y+w/2), Math.floor(h/2-(z*fov)/y), visible);
}
/**
 *
 *
 *
 */
function getMasterObjIndex(name)
{
	var i = -1;
	do
	{
		i++;
	}while(masterobj[i].name != name && i < masterobj.length-1);
	if(masterobj[i].name == name)return i;else return -1;
}
/**
 *
 *
 *
 */
this.addObj = function(id, objname, x, y, z){
	objects.push(new Obj(id, objname, x, y, z));
}
/**
 *
 *
 *
 */
this.rotateObj = function(id, x, y, z){
	for(var i=0; i<objects.length; i++)
	{
		if(id == objects[i].id)
		{
			objects[i].Rotation3D.x += x;
			objects[i].Rotation3D.y += y;
			objects[i].Rotation3D.z += z;
		}
	}
}
/**
 *
 */
this.translateObj = function(id, x, y, z){
	for(var i=0; i<objects.length; i++)
	{
		if(id == objects[i].id)
		{
			objects[i].Point3D.x += x;
			objects[i].Point3D.y += y;
			objects[i].Point3D.z += z;
		}
	}
}
/**
 *
 */
this.changeObj = function(id, name){
	for(var i=0; i<objects.length; i++)
	{
		if(id == objects[i].id)objects[i].name = name;
	}
}
/**
 *
 */
this.colorObj = function(id, color){
	for(var i=0; i<objects.length; i++)
	{
		if(id == objects[i].id)
		{
			objects[i].color = color;
		}
	}
}
/**
 *
 */
this.getposObj = function(id,x,y,z){
	for(var i=0; i<objects.length; i++)
	{
		if(id == objects[i].id)
		{
			if(x>0)return objects[i].Point3D.x;
			if(y>0)return objects[i].Point3D.y;
			if(z>0)return objects[i].Point3D.z;
		}
	}
}
/**
 *
 */
this.setposObj = function(id,x,y,z){
	for(var i=0; i<objects.length; i++)
	{
		if(id == objects[i].id)
		{
			objects[i].Point3D.x = x;
			objects[i].Point3D.y = y;
			objects[i].Point3D.z = z;
		}
	}
}
/**
 *
 */
this.collition = function(id){
	var j = -1;
	do{
		j++;
	}while(j<objects.length && id!=objects[j].id);
	
	for(var i=0; i<objects.length; i++)
	{
		if(i != j)
		{
			if(distance(objects[i].Point3D, objects[j].Point3D) < 1)return objects[i].id;
		}
	}
	return 'none';
}
/**
 *
 */
this.emptyStage = function(){
	objects.length = 0;
	console.log('Empty stage length='+objects.length);
}
/**
 *
 *
 *
 */
this.setObjRotation = function(obj,x,y,z){
	
}
/**
 *
 *
 *
 */
this.setCameraPosition = function(x,y,z){
	Camera.x = x;
	Camera.y = y;
	Camera.z = z;
}
/**
 *
 *
 *
 */
this.setCameraRotation = function(x,y,z){
	//console.log('Camera rotation x='+x+',y='+y+',z='+z);
}
/**
 *
 *
 *
 */
this.lookAt = function(x,y,z){
	//console.log('lookAt');
}
/**
 *
 *
 *
 */
this.forwardCamera = function(distance){
	//console.log('distance='+distance);
}
	/**
	 *
	 */
	function distance(a, b)
	{
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
	}
	/**
	 *
	 */
	function Obj(id,name, x, y, z)
	{
		this.id = id;
		this.name = name;
		this.color = 'blue';
		this.Point3D = new Point3D(x,y,z);
		this.Rotation3D = new Point3D(0,0,0);
	}
	/**
	 *
	 */
	function MasterObj()
	{
		this.name;
		this.vertices = 0;
		this.edges = 0;
		var v3 = [];
		var edge = [];
		this.pushVertex = function(x ,y, z){
			v3.push(new Point3D(x,y,z));
			this.vertices++;
		}
		this.pushEdge = function(a ,b){
			edge.push(new Edge3D(a, b));
			this.edges++;
		}
		//get vertices
		this.Point3D = function(i){
			return v3[i];
		}
		//get edges
		this.Edge3D = function(i){
			return edge[i];
		}
		
		//v3[0]=new Point3D(1,1,1);
	}
	/**
	 *
	 */
	function Point2D(x, y, v)
	{
		this.x = x;
		this.y = y;
		this.visible = v;
	}
	/**
	 *
	 */
	function Point3D(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
	/**
	 *
	 */
	function Edge3D(a, b)
	{
		this.a = a;
		this.b = b;
	}
}

/**
Further very useful functions
*/

function f(n)
{
	return document.getElementById(n);
}

function show(n)
{
	f(n).style.visibility = 'visible';
}

function hide(n)
{
	f(n).style.visibility = 'hidden';
}

function random(a,b)
{
	var r = Math.floor(Math.random()*(b-a+1))+a;
	return r;
}
