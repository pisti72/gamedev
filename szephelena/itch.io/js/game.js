const WIDTH = 800;
const HEIGHT = 400;


const KEY_SPACE = 32;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_ESC = 27;
const KEY_ENTER = 13;

const EDITOR = 0;
const INGAME = 1;

const TILE = 12;

const JUMP_FORCE = -2.5;

const CURSOR_SPEED = 10;

var cursor = { x: 0, y: 0, dx: 0, dy: 0 };
var player = {};
var state = EDITOR;

function inic() {
    var canvas = document.getElementById('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    var tiles = document.getElementById('tiles');
    Mario.setTileset(tiles);
    Mario.setCanvas(canvas);
    Mario.setBackground('#ddd');
    Mario.setPixel(4);
    var mw = map[0].length;
    var mh = map.length
    Mario.setMapWidth(mw);
    Mario.setMapHeight(mh);

    for (var j = 1; j < map.length; j++) {
        for (var i = 0; i < map[j].length; i++) {
            var tile = map[j].charAt(i)
            var tileabove = map[j - 1].charAt(i);
            var level = Math.floor((mh - j) / (mh / 4));
            Mario.setTileAt(' ', i, j);
            if (tile == 'G') {
                if (level == 0) {
                    if (tileabove != 'G') {
                        Mario.setTileAt('a', i, j);
                    } else {
                        Mario.setTileAt('b', i, j);
                    }
                } else if (level == 1) {
                    if (tileabove != 'G') {
                        Mario.setTileAt('c', i, j);
                    } else {
                        Mario.setTileAt('d', i, j);
                    }
                } else if (level == 2) {
                    if (tileabove != 'G') {
                        Mario.setTileAt('e', i, j);
                    } else {
                        Mario.setTileAt('f', i, j);
                    }
                } else if (level == 3) {
                    if (tileabove != 'G') {
                        Mario.setTileAt('g', i, j);
                    } else {
                        Mario.setTileAt('h', i, j);
                    }
                }
            } else if (tile == '-') {
                Mario.addActor('i', i, j);
            } else if (tile == 'X') {
                Mario.addActor('j', i, j);
            } else if (tile == 'P') {
                Mario.addActor('k', i, j);
            } else if (tile == 'L') {
                Mario.addActor('m', i, j);
            }
        }
    }
    console.log(Mario.getTileAt(0, 1));
    Mario.setCamera(0, 0);
    cursor.x = 0;
    cursor.y = 0;
    document.addEventListener('keydown', function (e) {
        if (state == EDITOR) {
            if (e.which == KEY_D) {
                cursor.dx = CURSOR_SPEED;
            } else if (e.which == KEY_A) {
                cursor.dx = -CURSOR_SPEED;
            }
            if (e.which == KEY_W) {
                cursor.dy = -CURSOR_SPEED;
            } else if (e.which == KEY_S) {
                cursor.dy = CURSOR_SPEED;
            }
        } else if (state == INGAME) {
            if (e.which == KEY_D) {
                player.dx = 1;
            } else if (e.which == KEY_A) {
                player.dx = -1;
            }
            if (e.which == KEY_SPACE && Mario.getTileAt(Math.floor((player.x + TILE / 2) / TILE), Math.floor((player.y + player.dy + TILE + 1) / TILE)) != ' ') {
                player.dy = JUMP_FORCE;
            }
        }

    });
    document.addEventListener('keyup', function (e) {
        if (e.which == KEY_A || e.which == KEY_D) {
            cursor.dx = 0;
            player.dx = 0;
        }
        if (e.which == KEY_W || e.which == KEY_S) {
            cursor.dy = 0;
            player.dy = 0;
        }
    });
    player = Mario.getFirstActorByTile('k');
    //player.dx=1;
    state = INGAME;
    gameloop();
}
function gameloop() {
    Mario.update();
    cursor.x += cursor.dx;
    cursor.y += cursor.dy;
    //Mario.setCamera(cursor.x,cursor.y);
    requestAnimationFrame(gameloop);
}