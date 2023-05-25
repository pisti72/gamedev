const db = [
{
    title:"Hello World",
    href:"Robot/robot.html",
    src:"assets/robot.png",
    description:"Move your robot in four directions.",
 },
 {
    title:"Bouncing ball",
    href:"Bouncing_ball/bouncing_ball.html",
    src:"assets/bouncingball.png",
    description:"Simple red ball is bouncing",
 },
 {
    title:"What day is today",
    href:"What_day_is_today/whatistoday.html",
    src:"assets/whatistoday.png",
    description:"Tells excatly what day is today.",
 },
 {
    title:"TODO list",
    href:"Todo/todo.html",
    src:"assets/todo.png",
    description:"Create your own TODO list.",
 },
 {
    title:"Painter",
    href:"Painter/painter.html",
    src:"assets/painter.png",
    description:"Paint anything what you want.",
 },
 {
    title:"Giftbox",
    href:"Giftbox/giftbox.html",
    src:"assets/giftbox.png",
    description:"Open boxes and win a game console",
 },
 {
    title:"Dice roll",
    href:"Dice_roll/diceroll.html",
    src:"assets/diceroll.png",
    description:"Rolling with a dice",
 },
 {
    title:"Raindrop",
    href:"Raindrop/raindrop.html",
    src:"assets/raindrop.png",
    description:"Catch the raindrops with your bucket!",
 },
 {
    title:"Flappy bird",
    href:"FlappyBird/flappybird.html",
    src:"assets/flappybird.png",
    description:"Flying between pipes",
    
 },
 {
    title:"Asteroids",
    href:"Asteroids/asteroids.html",
    src:"assets/asteroids.png",
    description:"Navigate through the asteroid field",
 },
 {
    title:"Dinorun",
    href:"Dinorun/dinorun.html",
    src:"assets/dinorun.png",
    description:"Running with your dino",
 },
 
 
 
 
 {
    title:"Whack a mole",
    href:"Whack_a_mole/whack_a_mole.html",
    src:"assets/whackamole.png",
    description:"Hit the mole.",
 },
 {
    title:"3D Car racing",
    href:"F1_racing/f1.html",
    src:"assets/racing.png",
    description:"Racing with a car in the 3D world.",
 },
 {
    title:"Space invaders",
    href:"Space_Invaders/invaders.html",
    src:"assets/invaders.png",
    description:"Shoot the aliens.",
 },
 {
    title:"Platformer",
    href:"Mario/mario.html",
    src:"assets/mario.png",
    description:"Collect the coins and reach the exit.",
 },
 {
    title:"Snake",
    href:"Snake/snake.html",
    src:"assets/snake.png",
    description:"Eat the apple and avoid from any collitions.",
 },
 {
    title:"Snake 2 players",
    href:"Snake/snake_2P.html",
    src:"assets/snake2p.png",
    description:"Compete with each other.",
 },
 {
    title:"Brickbreaker",
    href:"Brickbreaker/brickbreaker.html",
    src:"assets/brickbreaker.png",
    description:"Breake the wall with your ball.",
 },
];

let list = document.getElementById("list");
let card = document.getElementById("card");
let header = document.getElementsByTagName("h1")[0];
//console.log(card);

for(let i=0; i<db.length; i++){
    let data = db[i];
    let newcard = card.cloneNode(true);
    newcard.getElementsByTagName("h3")[0].innerHTML = data.title;
    newcard.getElementsByTagName("img")[0].src = data.src;
    newcard.getElementsByTagName("a")[0].href = data.href;
    newcard.getElementsByTagName("p")[0].innerHTML = data.description;
    list.appendChild(newcard);
}

card.remove();
let txt = header.innerHTML + " (" + db.length + ")"; 
header.innerHTML = txt;