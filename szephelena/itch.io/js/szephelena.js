// Canvas méret
const WIDTH = 800;
const HEIGHT = 400;

// Billentyűk
const KEY_SPACE = ' ';
const KEY_W = 'w';
const KEY_A = 'a';
const KEY_S = 's';
const KEY_D = 'd';
const KEY_ESC = 'Escape';
const KEY_ENTER = 'Enter';
const KEY_LEFT = 'ArrowLeft';
const KEY_UP = 'ArrowUp';
const KEY_RIGHT = 'ArrowRight';
const KEY_DOWN = 'ArrowDown';

// Játék állapotok
const EDITOR = 0;
const INGAME = 1;

// Fizika konstansok
const TILE = 12;
const JUMP_FORCE = -8;
const PLAYER_SPEED = 3;
const CURSOR_SPEED = 10;

// Pálya elemek
const TILE_STAR = '-';
const TILE_GATE = 'X';
const TILE_PLAYER = 'P';
const TILE_LADY = 'L';
const TILE_GROUND = 'G';

var cursor = { x: 0, y: 0, dx: 0, dy: 0 };
var player = {};
var state = EDITOR;
var stars = 0; // Összegyűjtött csillagok száma

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
            Mario.setTileAt(TILE_TYPES.EMPTY.sprite, i, j);
            if (tile == TILE_GROUND) {
                var tileType;
                if (level == 0) {
                    tileType = (tileabove != TILE_GROUND) ? TILE_TYPES.GROUND_TOP_1 : TILE_TYPES.GROUND_BODY_1;
                } else if (level == 1) {
                    tileType = (tileabove != TILE_GROUND) ? TILE_TYPES.GROUND_TOP_2 : TILE_TYPES.GROUND_BODY_2;
                } else if (level == 2) {
                    tileType = (tileabove != TILE_GROUND) ? TILE_TYPES.GROUND_TOP_3 : TILE_TYPES.GROUND_BODY_3;
                } else if (level == 3) {
                    tileType = (tileabove != TILE_GROUND) ? TILE_TYPES.GROUND_TOP_4 : TILE_TYPES.GROUND_BODY_4;
                }
                Mario.setTileAt(tileType.sprite, i, j);
            } else if (tile == TILE_STAR) {
                Mario.addActor(TILE_TYPES.STAR.sprite, i, j);
            } else if (tile == TILE_GATE) {
                Mario.addActor(TILE_TYPES.GATE.sprite, i, j);
            } else if (tile == TILE_PLAYER) {
                Mario.addActor(TILE_TYPES.PLAYER.sprite, i, j);
            } else if (tile == TILE_LADY) {
                Mario.addActor(TILE_TYPES.LADY.sprite, i, j);
            }
        }
    }
    console.log(Mario.getTileAt(0, 1));
    Mario.setCamera(0, 0);
    cursor.x = 0;
    cursor.y = 0;
    document.addEventListener('keydown', function (e) {
        if (state == EDITOR) {
            if (e.key == KEY_D) {
                cursor.dx = CURSOR_SPEED;
            } else if (e.key == KEY_A) {
                cursor.dx = -CURSOR_SPEED;
            }
            if (e.key == KEY_W) {
                cursor.dy = -CURSOR_SPEED;
            } else if (e.key == KEY_S) {
                cursor.dy = CURSOR_SPEED;
            }
        } else if (state == INGAME) {
            if (e.key == KEY_D || e.key == KEY_RIGHT) { // D vagy jobbra nyíl
                player.dx = PLAYER_SPEED;
            } else if (e.key == KEY_A || e.key == KEY_LEFT) { // A vagy balra nyíl
                player.dx = -PLAYER_SPEED;
            }
            if (e.key == KEY_SPACE || e.key == KEY_W || e.key == KEY_UP) { // Space, W vagy fel nyíl
                // Ellenőrizzük, hogy a földön áll-e
                var onGround = Mario.getTileAt(
                    Math.floor((player.x + TILE / 2) / TILE), 
                    Math.floor((player.y + TILE) / TILE)
                );
                if (onGround != ' ' && Math.abs(player.dy) < 1) {
                    player.dy = JUMP_FORCE;
                }
            }
        }

    });
    document.addEventListener('keyup', function (e) {
        if (state == EDITOR) {
            if (e.key == KEY_A || e.key == KEY_D || e.key == KEY_LEFT || e.key == KEY_RIGHT) {
                cursor.dx = 0;
            }
            if (e.key == KEY_W || e.key == KEY_S || e.key == KEY_UP || e.key == KEY_DOWN) {
                cursor.dy = 0;
            }
        } else if (state == INGAME) {
            if (e.key == KEY_A || e.key == KEY_D || e.key == KEY_LEFT || e.key == KEY_RIGHT) {
                player.dx = 0;
            }
        }
    });
    player = Mario.getFirstActorByTile(TILE_TYPES.PLAYER.sprite);
    //player.dx=1;
    state = INGAME;
    gameloop();
}

function checkStarCollision() {
    // Ellenőrizzük, hogy a player érintkezik-e valamelyik csillaggal
    var playerTileX = Math.floor((player.x + TILE / 2) / TILE);
    var playerTileY = Math.floor((player.y + TILE / 2) / TILE);
    
    for (var i = Mario.actor.length - 1; i >= 0; i--) {
        var actor = Mario.actor[i];
        if (actor.tile === TILE_TYPES.STAR.sprite) {
            var actorTileX = Math.floor((actor.x + TILE / 2) / TILE);
            var actorTileY = Math.floor((actor.y + TILE / 2) / TILE);
            
            // Ha ugyanazon a tile-on vannak
            if (playerTileX === actorTileX && playerTileY === actorTileY) {
                // Csillag összeszedése
                Mario.actor.splice(i, 1);
                stars++;
                console.log('Csillagok: ' + stars);
            }
        }
    }
}

function gameloop() {
    Mario.update();
    checkStarCollision();
    cursor.x += cursor.dx;
    cursor.y += cursor.dy;
    //Mario.setCamera(cursor.x,cursor.y);
    requestAnimationFrame(gameloop);
}