/**
* @author istvan.szalontai12@gmail.com
* @date 2019-08-15
* 
* TODO
*   - friction
*   - spin must be there wheel and ball
*   - refactor: render,phisic,game logic should split into classes
*
*
*/

const MAG = 24;
var keyGas = false;
var keyBreak = false;
var level = 1;//0=double pendulum, 1=car
var counter = 0;
var mouse={x:0,y:0};
/*
double pendulum https://www.youtube.com/watch?v=uWzPe_S-RVE
*/
var scenes=[
    {ball:[//0 double pendulum
        {id:100,r:10,x:300,y:500,fix:true,wheel:false,soft:false},
        {id:101,r:30,x:300,y:300,fix:false,wheel:false,soft:false},
        {id:102,r:30,x:300,y:100,fix:false,wheel:false,soft:false},
        ],
    rod:[
        {id:200,b1:101,b2:100},
        {id:201,b1:102,b2:101},
        ],
    track:
        {p:400,h:10,data:[0,0,0,0,0,0]}
    },
    {ball:[//1 car
        {id:100,r:10,x:270,y:600,fix:true,wheel:false,soft:false},
        {id:101,r:17,x:290,y:300,fix:false,wheel:false,soft:false},
        {id:102,r:25,x:280,y:250,fix:false,wheel:true,soft:false},//rear wheel
        {id:103,r:28,x:390,y:250,fix:false,wheel:true,soft:false},//front wheel
        {id:104,r:17,x:340,y:300,fix:false,wheel:false,soft:false},
        {id:105,r:10,x:330,y:400,fix:false,wheel:false,soft:false},
        {id:106,r:50,x:600,y:400,fix:false,wheel:true,soft:true}//ball to play
        ],
    rod:[
        {id:200,b1:105,b2:100},
        {id:201,b1:101,b2:102},
        {id:202,b1:101,b2:103},
        {id:203,b1:102,b2:103},
        {id:204,b1:104,b2:101},
        {id:205,b1:104,b2:102},
        {id:206,b1:104,b2:103},
        {id:207,b1:105,b2:101},
        {id:208,b1:105,b2:104},
        ],
    box:[
        {x:710,y:100,w:13},
        // {x:810,y:140,w:30},
        // {x:990,y:140,w:40},
        // {x:1050,y:210,w:50},
        // {x:1100,y:140,w:30},
        // {x:1100,y:210,w:25},
        //{x:760,y:350,w:40},
        ],
    track:
        {p:400,h:0,data:[0,4,0,0,0,0,2,4,6,4,2,1,0,-1,-2,-4,-6,-4,-2,0,1,3,4,6,0,-6,-4,-3,-1,0,8,-12]}
    }
];

window.onkeydown = function (e) {
    if (e.key == 'd') {
        keyGas=true;
    } else if (e.key == 'a') {
        keyBreak=true;
    }
}
window.onkeyup = function (e) {
    if (e.key == 'd') {
        keyGas=false;
    }
    if (e.key == 'a') {
        keyBreak=false;
    }
}
window.onmousemove = function (e) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}
window.onmousedown = function (e) {
    
    
}
window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
document.body.onload = function () {
    TinyPhysic2D.init();
 
    if(mobileAndTabletcheck()){
        var left = document.getElementById('left');
        var right = document.getElementById('right');
        
        left.style.display = 'block';
        left.addEventListener("touchstart",function(){keyBreak=true;});
        left.addEventListener("touchend",function(){keyBreak=false;});
        
        right.style.display = 'block';
        right.addEventListener("touchstart",function(){keyGas=true;});
        right.addEventListener("touchend",function(){keyGas=false;});
        
        event.preventDefault();
    }
    //car
    var scene = scenes[level];
    for(var i=0;i<scene.ball.length; i++){
        var ball = scene.ball[i];
        TinyPhysic2D.addBall(ball.id,ball.r,ball.x,ball.y,ball.fix,ball.wheel,ball.soft);
    }
    for(var i=0; i<scene.rod.length; i++){
        var rod = scene.rod[i];
        TinyPhysic2D.addLine(rod.id,rod.b1,rod.b2);
    }
    if(scene.track){
        var x = 0;
        section_length = scene.track.p;
        var y = scene.track.h;
        for(var i=0; i<scene.track.data.length-1; i++){
            y += scene.track.data[i]*MAG;
            var y_next = y+scene.track.data[i+1]*MAG;
            TinyPhysic2D.addTrack(x, y, section_length, y_next-y);
            x += section_length;
        }
    }
    if(scene.box){
        for(var i=0; i<scene.box.length; i++){
            var box = scene.box[i];
            TinyPhysic2D.addBox(box.x, box.y, box.w);
        }
    }
    TinyPhysic2D.lookAt(100);//first ball
    loop();
}

function drawDebug(){
    TinyPhysic2D.drawText('TIME: ' + counter, 10, 20);
    TinyPhysic2D.drawText('SPEED: ' + Math.floor(TinyPhysic2D.getBallById(102).xv), 10, 40);
    TinyPhysic2D.drawText('LENGTH: ' + Math.floor(TinyPhysic2D.getBallById(102).x), 10, 60);
    TinyPhysic2D.drawText('BALLS: ' + TinyPhysic2D.getNumberOfBalls(), 10, 80);
    TinyPhysic2D.drawText('BOXES: ' + TinyPhysic2D.getNumberOfBoxes(), 10, 100);
    TinyPhysic2D.drawText('CONTROL: A-BREAK  D-GAS', 10, 120);
}
function interact(){
    counter++;
    if(level==1){
        if(counter==10){
            TinyPhysic2D.lookAt(102);//rear wheel
            TinyPhysic2D.getBallById(100).visible = false;
            TinyPhysic2D.getBallById(101).visible = false;
            TinyPhysic2D.getBallById(104).visible = false;
            TinyPhysic2D.getBallById(105).visible = false;
            TinyPhysic2D.getLineById(202).visible = false;
            TinyPhysic2D.getLineById(205).visible = false;
        }
        if(counter%200==0){
            TinyPhysic2D.addBall(
                200,
                Math.random()*30+10,
                Math.random()*2000+6000,
                800,
                false,true,true);
        }
        if(counter==120){
            TinyPhysic2D.disableLine(207);  
        }
        if(counter==130){
            TinyPhysic2D.disableLine(208);
        }
        var p_rear = TinyPhysic2D.getBallById(102);
        var p_front = TinyPhysic2D.getBallById(103);
        if(keyGas){
            if(p_rear.collied){
                p_rear.xv += .7;
                // if(p_rear.xv>150)p_rear.xv=150;
                //p_front.xv = p_rear.xv;
            }
            if(p_front.collied){
                p_front.xv += .7;
            }
        }
        //p_front.xv = p_rear.xv;
        if(keyBreak){
            if(p_rear.collied){
                p_rear.xv -= 1;
                //p_front.xv = p_rear.xv;
            }
        }
        if(!keyGas){
            if(p_rear.collied){
                //p_rear.xv *= .8;
            }
        }
    }
}
function loop(){
    interact();
    TinyPhysic2D.update();
    TinyPhysic2D.draw();
    drawDebug();
    requestAnimationFrame(loop);
}