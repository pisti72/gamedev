let box_img = document.getElementById("box");
let ps5_img = document.getElementById("ps5");
let winner_img = document.getElementById("winner");
const COLUMNS = 5;
const ROWS = 4;
let ps5={
    row : Math.floor(Math.random()*ROWS),
    column : Math.floor(Math.random()*COLUMNS),
}

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    for(let j=0; j<ROWS; j++){
        for(let i=0; i<COLUMNS; i++){
            let x=(i*120+100)+"px";
            let y=(j*120+10)+"px";
            if(ps5.row==j && ps5.column==i){
                ps5_img.style.left=x;
                ps5_img.style.top=y;
            }
            let box = box_img.cloneNode();
            box.style.left=x;
            box.style.top=y;
            box.style.display="block";
            box.id = i+"and"+j;
            document.body.appendChild(box);
        }
    }
}

function clicked(obj) {
    obj.style.display = "none";
    if(obj.id==ps5.column+"and"+ps5.row){
        winner.style.display="block";
    }
}

function again() {
    ps5.row = Math.floor(Math.random()*ROWS);
    ps5.column = Math.floor(Math.random()*COLUMNS);
    for(let j=0; j<ROWS; j++){
        for(let i=0; i<COLUMNS; i++){
            let box = document.getElementById(i+"and"+j);
            box.style.display="block";
            if(ps5.row==j && ps5.column==i){
                ps5_img.style.left=(i*120+100)+"px";
                ps5_img.style.top=(j*120+10)+"px";
            }
        }
    }
    winner.style.display="none";
}