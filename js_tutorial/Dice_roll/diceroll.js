let dice1_img = document.getElementById("dice1");
let dice2_img = document.getElementById("dice2");
let dice3_img = document.getElementById("dice3");
let dice4_img = document.getElementById("dice4");
let dice5_img = document.getElementById("dice5");
let dice6_img = document.getElementById("dice6");
let dices = [dice1_img, dice2_img, dice3_img, dice4_img, dice5_img, dice6_img];
let statistic = [0,0,0,0,0,0];

function roll() {
    n = Math.floor(Math.random()*6)+1;
    
    for(let i=0;i<dices.length;i++){
        let dice = dices[i];
        dice.style.display = "none";
        let digit = statistic[i];
        if(i == (n-1)){
            dice.style.display = "block";
            statistic[i]++;
            digit = "<b>" + statistic[i] + "</b>";
        }
        document.getElementById("d"+(i+1)).innerHTML = digit;
    }
}