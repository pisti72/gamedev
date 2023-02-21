const DEBUG = false;
const VERSION = '1.5';
const PAPER = "#222";
const INK = "#ddf";
const GREEN = "#2f2";
const MARGIN = 80;
const ASTRO_COUNT = 10;

const KEY_SPACE = 32;
const KEY_P = 80;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_ESC = 27;
const KEY_ENTER = 13;

const TITLE = 0;
const EDITOR = 1;
const STOPPED = 2;

//const START_STATE = EDITOR;
var start_state = TITLE;
//var start_state = EDITOR;

const shapes=[
    {
        name:"bullet",
        points: [0,15, -4,-11, 0,-15, 4,-11]
    },
    {
        name:"myship",
        points: [0,5, -12,10, 0,-20, 12,10]
    },
    {
        name:"astro",
        points: [-76,-60,50,-80,90,4,14,95,-55,57,-35,-7]
    },
    {
        name:"astro",
        points: [-4,53,-42,23,-37,-18,-14,-32,17,-35,43,-17,43,31]
    },
    {
        name:"astro",
        points: [-7,44,-42,23,-38,-15,-8,-35,21,-23,42,-19,36,28]
    },
    {
        name:"astro",
        points: [17,45,-35,27,-47,-14,11,-50,55,-5]
    },
    {
        name:"particle",
        points: [-2,-2, 2,-2, 2,2, -2,2]
    },
    {
        name:"nil",
        points: []
    }
]

var canvas, ctx, debug, state,hit_snd;
var ispaused = false;
var mousedown = false;
var w, h;
var canvasLeft, canvasTop;
var actors=[];
var particles=[];
var cursor={
    x:0,
    y:0
}
var shape={
    points:[],
    avg:{x:0,y:0},
    radius:0
}


function start() {
    state = start_state;
    //state = EDITOR;
    
    
    //hit_snd = new Audio('hit.wav');
    hit_snd = document.getElementById('hit_snd');
    canvas = document.getElementById('canvas');
    w = canvas.width = document.body.clientWidth;
    h = canvas.height = document.body.clientHeight;
    canvasLeft = canvas.offsetLeft;
	canvasTop = canvas.offsetTop;
    ctx = canvas.getContext('2d');
    ctx.lineJoin = 'bevel';
	ctx.lineWidth = 3;
    ctx.fillStyle = PAPER;
    
    window.addEventListener('resize',function(e){
        w = canvas.width = document.body.clientWidth;
        h = canvas.height = document.body.clientHeight;
        ctx.lineWidth = 3;
    });
    
    document.addEventListener('mousemove',function(e){
        cursor.x = e.pageX - canvasLeft;
        cursor.y = e.pageY - canvasTop;
    });
    
    document.addEventListener('click',function(e){
        if(state == EDITOR){
            shape.points.push(cursor.x);
            shape.points.push(cursor.y);
        }
    });
    document.addEventListener('mousedown',function(e){
        if(state == TITLE){
            mousedown = true;
        }
    });
    document.addEventListener('mouseup',function(e){
        if(state == TITLE){
            mousedown = false;
        }
    });
    
    document.addEventListener('keydown',function(e){
        if(state == EDITOR){
            if(e.which == KEY_SPACE){
                const paragraph = document.createElement("p");
                var t="";
                var x_avg=0;
                var y_avg=0;
                //normalizing
                for(var i=0;i<shape.points.length;i+=2){
                    x_avg+=shape.points[i];
                    y_avg+=shape.points[i+1];
                }
                x_avg = Math.floor(x_avg/shape.points.length*2);
                y_avg = Math.floor(y_avg/shape.points.length*2);
                for(var i=0;i<shape.points.length;i+=2){
                    var x = shape.points[i];
                    var y = shape.points[i+1];
                    x-=x_avg;
                    y-=y_avg;
                    t+=x + ",";
                    t+=y + ",";
                    //t+=x_avg + ",";
                }
                //radius
                var radius = 0;
                for(var i=0;i<shape.points.length;i+=2){
                    var x = shape.points[i];
                    var y = shape.points[i+1];
                    radius += Math.sqrt(x*x+y*y);
                }
                radius = Math.floor(radius/shape.points.length*2);
                t+='\nradius = ' + radius;
                paragraph.innerText = t;
                document.body.appendChild(paragraph);
                state = STOPPED;
            }
        }
    });
    shapes_recalculation();
    
    create_actor(getShapeByName('myship'), w/2, h/2);
    add_meteors(ASTRO_COUNT);
    
    gameLoop();
}

function getActorByName(n){
    for(var i=0; i<actors.length; i++){
        var a = actors[i];
        if(a.name == n){
            return a;
        }
    }
}

function add_meteors(n){
    var i=0;
    while(i < n){
        var shape_id = random(shapes.length);
        var x = random(w);
        var y = random(h);
        var xd = Math.random() * 4 - 2;
        var yd = Math.random() * 4 - 2;
        
    
        if(shapes[shape_id].name == "astro"){
            if(not_overlapped_with_any({x:x,y:y,r:shapes[shape_id].radius})){
                create_actor(shapes[shape_id], x, y);
                i++;
            }
        } 
    }
    for(var i=0; i<actors.length; i++){
        var a = actors[i];
        var radd = Math.random() * 0.1-0.05;
        a.radd = radd;
    }
}

function not_overlapped_with_any(a){
    for(var i=0; i<actors.length; i++){
        var b = actors[i];
        if(b.x != a.x && b.y != a.y && overlapped(a,b)){
            return false;
        }
    }
    return true;
}

function random(n){
    return Math.floor(Math.random()*n);
}

function shapes_recalculation(){
    for(var i=0;i<shapes.length;i++){
        var p=shapes[i].points;
        var sum=0;
        for(var j=0; j<p.length; j+=2){
            var x=p[j];
            var y=p[j+1];
            var r=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            sum += r;
        }
        var r = sum/p.length*2;
        shapes[i].radius = r;
        shapes[i].mass = Math.pow(r,2) * Math.PI;
    }
}

function create_actor(shape, x, y){
    var actor = {
        name:shape.name,
        points:shape.points,
        x:x,
        y:y,
        xd:0,
        yd:0,
        xforce:0,
        yforce:0,
        reloading_rate:10,
        reloading:0,
        rad:0,
        radd:0,
        r:shape.radius,
        remove:false,
        mass:shape.mass,
        life:0,
        damage:100
    }
    actors.push(actor);
}

function getShapeByName(name){
    for(var i=0; i<shapes.length; i++){
        if(shapes[i].name == name){
            return shapes[i];
        }
    }
}

function create_particle(x,y,rad){
    var particle = {
        x:x,
        y:y,
        rad:rad,
        life:50
    }
    particles.push(particle);
}

function update_particles(){
    for(var i=0; i<particles.length; i++){
        var p=particles[i];
        p.x += Math.cos(p.rad-Math.PI/2)*5;
        p.y += Math.sin(p.rad-Math.PI/2)*5;
        p.life--;
        ctx.strokeStyle = INK;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x+5, p.y);
        ctx.closePath();
        ctx.stroke();
    }
    var new_particles=[];
    for(var i=0; i<particles.length; i++){
        var p=particles[i];
        if(p.life>0){
            new_particles.push(p);
        }
    }
    particles=new_particles;
}

function update_actors(){
    for(var i=0; i<actors.length; i++){
        var a = actors[i];
        //collition
        for(var j=0; j<actors.length; j++){
            var b = actors[j];
            if(a.x<-MARGIN){
                if(a.name == "bullet"){
                    a.remove = true;
                }
                a.xd = Math.abs(a.xd);
            }else if(a.x>w+MARGIN){
                if(a.name == "bullet"){
                    a.remove = true;
                }
                a.xd = -Math.abs(a.xd);
            }
            if(a.y<-MARGIN){
                if(a.name == "bullet"){
                    a.remove = true;
                }
                a.yd = Math.abs(a.yd);
            }else if(a.y > h+MARGIN){
                if(a.name == "bullet"){
                    a.remove = true;
                }
                a.yd = -Math.abs(a.yd);
            }
            //call ovelapped here and get current distance
            if(i < j && overlapped(a,b)){
                var distance = Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2));
                var deformation = a.r + b.r - distance;
                var ratio = 2;
                var mass_sum = a.mass + b.mass;
                var ratio_a = a.mass/mass_sum;
                var ratio_b = b.mass/mass_sum;
                a.xd += (a.x-b.x)/distance*deformation*ratio_b;
                a.yd += (a.y-b.y)/distance*deformation*ratio_b;
                b.xd += (b.x-a.x)/distance*deformation*ratio_a;
                b.yd += (b.y-a.y)/distance*deformation*ratio_a;

                
                var rad_sum = a.rad + b.rad;
                var differenece = a.radd-b.radd;
                a.radd -= differenece;
                b.radd += differenece;
                
                //hit_snd.play();
                //align position
                if(a.name == "bullet" && b.name == "astro"){
                    a.remove = true;
                }
                if(b.name == "bullet" && a.name == "astro"){
                    b.remove = true;
                }
            }
        }
        //moving
        if(a.name == "myship"){
            
            a.radd=0;
            lookAt(a,cursor);
            if(mousedown){
                
                create_actor(getShapeByName('particle'),
                    a.x-Math.cos(a.rad-Math.PI/2)*a.r,
                    a.y-Math.sin(a.rad-Math.PI/2)*a.r);
                if(a.reloading == 0){
                    //create_actor(0, a.x+a.xforce*200,a.y+a.yforce*200, a.xd+a.xforce*80,a.yd+a.yforce*80,a.rad);
                    a.reloading = a.reloading_rate;
                }else{
                    a.reloading--; 
                }
                //create_particle(a.x,a.y,0);
            }else{
                a.xforce = 0;
                a.yforce = 0;
                a.xd *= .99;
                a.yd *= .99;
            }
        }
        a.xd += a.xforce;
        a.yd += a.yforce;
        a.x += a.xd;
        a.y += a.yd;
        a.rad += a.radd;
        
        ctx.strokeStyle = INK;
        ctx.beginPath();
        var point = rotate(a.points[0], a.points[1], a.rad);
        ctx.moveTo(point.x + a.x, point.y + a.y);
        for(var j=2;j<a.points.length;j+=2){
            point = rotate(a.points[j], a.points[j+1], a.rad);
            ctx.lineTo(point.x + a.x, point.y + a.y);
        }
        ctx.closePath();
        ctx.stroke();
        if(DEBUG){
            ctx.strokeStyle = GREEN;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
        }
    }
    //removing actors
    var new_actors=[];
    for(var i=0; i<actors.length; i++){
        var a = actors[i];
        if(!a.remove){
            new_actors.push(a);
        }
    }
    actors = new_actors;
}

function lookAt(a,b){
    a.rad = Math.PI+Math.atan((a.x-b.x)/(b.y-a.y));
    if(b.y<a.y){
        a.rad=Math.atan((a.x-b.x)/(b.y-a.y));
    }
    return a;
}

function overlapped(a,b){
    return Math.sqrt(Math.pow((a.x-b.x),2) + Math.pow((a.y-b.y),2))<a.r+b.r;
}

function draw_cursor(){
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y-10);
    ctx.lineTo(cursor.x, cursor.y+10);
    ctx.moveTo(cursor.x-10, cursor.y);
    ctx.lineTo(cursor.x+10, cursor.y);
    ctx.closePath();
    ctx.stroke();
}

function update_shape(){
    if(shape.points.length>0){
        ctx.beginPath();
        ctx.moveTo(shape.points[0], shape.points[1]);
        if(shape.points.length==2){
            ctx.lineTo(shape.points[0]+2, shape.points[1]);
        }else{
            for(var i=2;i<shape.points.length;i+=2){
                ctx.lineTo(shape.points[i], shape.points[i+1]);
            }
        }
        
        ctx.closePath();
        ctx.stroke();
    }
}

function rotate(x,y,radius){
    var x1 = x*Math.cos(radius)-y*Math.sin(radius);
    var y1 = y*Math.cos(radius)+x*Math.sin(radius);
    return {x:x1,y:y1}
}

function gameLoop(){
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    if(state==TITLE){
        update_particles();
        update_actors();
        draw_cursor();
        ctx.font = '22px joystix';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = INK;
        ctx.fillText('Asteroids', 40, 40);
    }else if(state==EDITOR || state==STOPPED){
        update_shape();
        draw_cursor();
    }
 
    requestAnimationFrame(gameLoop);
}