/*
Gomoku
5 in a row
https://github.com/topics/gomoku-game
*/

let COLUMNS = 25;
let ROWS = 11;

const EMPTY = 0;
const CROSS = 1;
const CIRCLE = 2;

let paused = false;
let board = [];
let board_div = document.getElementById("board");

function onload() {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    COLUMNS = Math.floor(w / 44);
    ROWS = Math.floor(h / 50);
    let t = "<table>";
    for (let j = 0; j < ROWS; j++) {
        t += "<tr>";
        for (let i = 0; i < COLUMNS; i++) {
            t += "<td onclick=\"clicked(" + i + "," + j + ",this)\">&nbsp;</td>";
            let cell = {
                row: j,
                column: i,
                value: EMPTY,
                score_Vertical: { x: 0, o: 0 },
                score_Horizontal: { x: 0, o: 0 },
                score_DiagDown: { x: 0, o: 0 },
                score_DiagUp: { x: 0, o: 0 },
                set: function () {
                    if (value == EMPTY) {

                    }
                }
            }
            board.push(cell);
        }
        t += "</tr>";
    }
    t += "</table>";
    board_div.innerHTML = t;
}

function clicked(column, row, obj) {
    let cell = getCellByCoord(column, row);
    if (cell.value == EMPTY) {
        cell.value = CIRCLE;
        obj.innerHTML = "<span class=\"blue\">O</span>";
        scoreEachCell();
    } else {
        alert("Not empty");
    }
    //obj.innerHTML="<span class=\"red\">X</span>";
}

function getCellByCoord(column, row) {
    for (let i = 0; i < board.length; i++) {
        let cell = board[i];
        if (cell.row == row && cell.column == column) {
            return cell;
        }
    }
    alert("Not found cell");
}

function scoreEachCell() {
    for (let i = 0; i < board.length; i++) {
        let cell = board[i];
        let score = deepMiner(cell.column, cell.row, 5);
    }
}

function deepMiner(column, row, xd, yd, n) {
    if (n > 0) {
        deepMiner(column + xd, row + xd, xd, yd, n - 1);
    }
}

function rnd(n) {
    return Math.floor(Math.random() * n);
}