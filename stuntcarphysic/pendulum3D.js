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
var level = 0;//0=pendulum
var counter = 0;
var mouse = { x: 0, y: 0 };
/*
double pendulum https://www.youtube.com/watch?v=uWzPe_S-RVE
*/
var scenes = [
    {
        ball: [//0 double pendulum
            { id: 100, r: 1, x: 300, y: 480, z: 0, fix: true, wheel: false, soft: false },
            { id: 101, r: 30, x: 530, y: 480, z: 380, fix: false, wheel: true, soft: true },
            { id: 102, r: 0, x: 300, y: 200, z: 0, fix: true, wheel: false, soft: false },
            //{id:103,r:25,x:510,y:200,z:200,fix:false,wheel:false,soft:false},
        ],
        rod: [
            { id: 200, b1: 101, b2: 100 }
        ],
        box: [
            { x: 510, y: 100, z: 200, w: 50 }
        ],
        track:
            { p: 400, h: 10, data: [1, 0, 0, 0, 0, -1] }
    }
];

window.onkeydown = function (e) {
    if (e.key == 'd') {
        keyGas = true;
    } else if (e.key == 'a') {
        keyBreak = true;
    }
}
window.onkeyup = function (e) {
    if (e.key == 'd') {
        keyGas = false;
    }
    if (e.key == 'a') {
        keyBreak = false;
    }
}
window.onmousemove = function (e) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}
window.onmousedown = function (e) {


}
window.mobileAndTabletcheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};
document.body.onload = function () {
    TinyPhysic3D.init();

    if (mobileAndTabletcheck()) {
        var left = document.getElementById('left');
        var right = document.getElementById('right');

        left.style.display = 'block';
        left.addEventListener("touchstart", function () { keyBreak = true; });
        left.addEventListener("touchend", function () { keyBreak = false; });

        right.style.display = 'block';
        right.addEventListener("touchstart", function () { keyGas = true; });
        right.addEventListener("touchend", function () { keyGas = false; });

        event.preventDefault();
    }
    //car
    var scene = scenes[level];
    for (var i = 0; i < scene.ball.length; i++) {
        var ball = scene.ball[i];
        TinyPhysic3D.addBall(ball.id, ball.r, ball.x, ball.y, ball.z, ball.fix, ball.wheel, ball.soft);
    }
    for (var i = 0; i < scene.rod.length; i++) {
        var rod = scene.rod[i];
        TinyPhysic3D.addLine(rod.id, rod.b1, rod.b2);
    }
    if (scene.track) {
        var x = 0;
        section_length = scene.track.p;
        var y = scene.track.h;
        for (var i = 0; i < scene.track.data.length - 1; i++) {
            y += scene.track.data[i] * MAG;
            var y_next = y + scene.track.data[i + 1] * MAG;
            TinyPhysic3D.addTrack(x, y, section_length, y_next - y);
            x += section_length;
        }
    }
    if (scene.box) {
        for (var i = 0; i < scene.box.length; i++) {
            var box = scene.box[i];
            TinyPhysic3D.addBox(box.x, box.y, box.z, box.w);
        }
    }
    TinyPhysic3D.lookAt(102);//look to center
    //TinyPhysic3D.getBallById(101).zv = 2;
    loop();
}

function drawDebug() {
    TinyPhysic3D.drawText('TIME: ' + counter, 10, 20);
    TinyPhysic3D.drawText('BALLS: ' + TinyPhysic3D.getNumberOfBalls(), 10, 40);
    TinyPhysic3D.drawText('BOXES: ' + TinyPhysic3D.getNumberOfBoxes(), 10, 60);
}
function interact() {
    counter++;
    if (counter < 20) {
        TinyPhysic3D.getBallById(101).zv++;
    }
    if (counter == 2100) {
        // TinyPhysic3D.disableLine(200);
    }
    if (counter % 50 == 0) {
        //TinyPhysic3D.addBall(1000,Math.random()*30+10,Math.random()*300+300,600,Math.random()*20+100,false,false,false);
        TinyPhysic3D.addBox(Math.random() * 300 + 300, Math.random() * 300 + 300, Math.random() * 300 + 300, 40);
    }
}
function loop() {
    interact();
    TinyPhysic3D.update();
    TinyPhysic3D.draw();
    drawDebug();
    requestAnimationFrame(loop);
}