const WIDTH = 800;
const HEIGHT = 480;
const SPAWN_TIME = 600;
const RAIN_SPEED = 4;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let bucket_image = new Image();
let raindrop_image = new Image();
let raindrops = [];
let lastDropTime = Date.now();

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    
    bucket_image.src = "assets/bucket.png";
    raindrop_image.src = "assets/drop.png";
    
    bucket = {
        x:WIDTH / 2 - 64 / 2,
        y:HEIGHT-20-64,
        width:64,
        height:64,
        score:0
    }
    spawnRaindrop();
    update();
}

canvas.addEventListener('mousemove', function (event) {
    bucket.x = event.clientX - 64 / 2;
});

function spawnRaindrop() {
    let raindrop = {
        x: Math.random()*(WIDTH-64),
        y: 0-64,
        width:64,
        height:64,
        remove:false
    }
    raindrops.push(raindrop);
    lastDropTime = Date.now();
}
   
function update() {
    ctx.fillStyle = "#94B0C2";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    if(bucket.x < 0) bucket.x = 0;
    if(bucket.x > WIDTH - 64) bucket.x = WIDTH - 64;
    
    if(Date.now() - lastDropTime > SPAWN_TIME) spawnRaindrop();
    
    for(let i=0;i<raindrops.length;i++){
        let  raindrop = raindrops[i];
        if(raindrop.remove) raindrops.splice(i,1);
    }
    
    for(let i=0;i<raindrops.length;i++)
    {
        let  raindrop = raindrops[i];
        raindrop.y += RAIN_SPEED;
        if(raindrop.y > HEIGHT) raindrop.remove=true;
        if(Math.abs(raindrop.x-bucket.x)<64 && Math.abs(raindrop.y-bucket.y)<64){
            raindrop.remove=true;
            bucket.score++;
        }
        ctx.drawImage(raindrop_image, raindrop.x, raindrop.y);
    }
    
    ctx.drawImage(bucket_image, bucket.x, bucket.y);
    ctx.font = "30px grobold";
    ctx.fillStyle = "blue";
    ctx.fillText(bucket.score,WIDTH/2-20,50)
    window.requestAnimationFrame(update);
}