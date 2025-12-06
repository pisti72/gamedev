const MARIO_CONFIG = {
    TILE_SIZE: 12,
    GRAVITY: 0.4,
    MAX_FALL_SPEED: 10,
    PIXEL_SCALE: 4,
    PLAYER_SPEED: 3,
    CAMERA_OFFSET_X: 80,
    CAMERA_OFFSET_Y: 80
};

const TILE_TYPES = {
    EMPTY: { char: ' ', sprite: ' ', spriteIndex: -1, solid: false, collectable: false },
    GROUND_TOP_1: { char: 'a', sprite: 'a', spriteIndex: 0, solid: true, collectable: false },
    GROUND_BODY_1: { char: 'b', sprite: 'b', spriteIndex: 1, solid: true, collectable: false },
    GROUND_TOP_2: { char: 'c', sprite: 'c', spriteIndex: 2, solid: true, collectable: false },
    GROUND_BODY_2: { char: 'd', sprite: 'd', spriteIndex: 3, solid: true, collectable: false },
    GROUND_TOP_3: { char: 'e', sprite: 'e', spriteIndex: 4, solid: true, collectable: false },
    GROUND_BODY_3: { char: 'f', sprite: 'f', spriteIndex: 5, solid: true, collectable: false },
    GROUND_TOP_4: { char: 'g', sprite: 'g', spriteIndex: 6, solid: true, collectable: false },
    GROUND_BODY_4: { char: 'h', sprite: 'h', spriteIndex: 7, solid: true, collectable: false },
    STAR: { char: '-', sprite: 'i', spriteIndex: 8, solid: false, collectable: true },
    GATE: { char: 'X', sprite: 'j', spriteIndex: 9, solid: true, collectable: false },
    PLAYER: { char: 'P', sprite: 'k', spriteIndex: 10, solid: false, collectable: false },
    LADY: { char: 'L', sprite: 'm', spriteIndex: 12, solid: false, collectable: false }
};

Mario = {
    debug: true,
    map: [],
    actor: [],
    camera: { tile: TILE_TYPES.PLAYER.sprite, x: 0, y: 0 },
    tile: MARIO_CONFIG.TILE_SIZE,
    gravity: MARIO_CONFIG.GRAVITY,
    max_fall: MARIO_CONFIG.MAX_FALL_SPEED,
    pixel: MARIO_CONFIG.PIXEL_SCALE,
    background: '#000',
    tileset: new Image(),
    getTileType: function(char) {
        for (var key in TILE_TYPES) {
            if (TILE_TYPES[key].char === char || TILE_TYPES[key].sprite === char) {
                return TILE_TYPES[key];
            }
        }
        return TILE_TYPES.EMPTY;
    },
    getSpriteIndex: function(sprite) {
        var tileType = this.getTileType(sprite);
        return tileType.spriteIndex;
    },
    setTileset: function (img) {
        this.tileset.src = img.src;
    },
    setCanvas: function (ctx) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width = document.body.clientWidth;
        this.h = canvas.height = document.body.clientHeight;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.font = "24px tahoma";
    },
    addActor: function (t, x, y) {
        var tile = this.tile;
        var a = {
            tile: t,
            x: x * tile,
            y: y * tile,
            dx: 0,
            dy: 0,
            bound: { x: 0, y: 0, w: tile, h: tile }
        };
        this.actor.push(a);
    },
    getFirstActorByTile: function (t) {
        for (var i = 0; i < this.actor.length; i++) {
            var a = this.actor[i];
            if (a.tile == t) {
                return a;
            }
        }
    },
    removeActor: function (actor) {
        var index = this.actor.indexOf(actor);
        if (index > -1) {
            this.actor.splice(index, 1);
        }
    },
    getActorsByTile: function (t) {
        var result = [];
        for (var i = 0; i < this.actor.length; i++) {
            if (this.actor[i].tile == t) {
                result.push(this.actor[i]);
            }
        }
        return result;
    },
    setBackground: function (b) {
        this.background = b;
    },
    setPixel: function (p) {
        this.pixel = p;
    },
    setMapWidth: function (w) {
        this.mw = w;
    },
    setMapHeight: function (h) {
        this.mh = h;
    },
    setTileAt: function (t, x, y) {
        this.map[x + y * this.mh] = t;
    },
    getTileAt: function (x, y) {
        return this.map[x + y * this.mh];
    },
    setCamera: function (x, y) {
        this.camera.x = x;
        this.camera.y = y;
    },
    update: function () {
        this.updateActors();
        this.drawMap();
        this.drawActors();
        this.followCamera();
        this.drawDebug()
    },
    drawDebug: function () {
        this.ctx.fillStyle = "black"
        var vertical_limit = this.mh * this.pixel * this.tile - this.h - 500
        this.ctx.fillText("Value: " + this.mh * this.pixel * this.tile, 20, 24)
    },
    drawMap: function () {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.w, this.h);
        for (var j = 0; j < this.mh; j++) {
            for (var i = 0; i < this.mw; i++) {
                var sprite = this.map[i + j * this.mh];
                if (sprite && sprite != ' ') {
                    var spriteIndex = this.getSpriteIndex(sprite);
                    this.ctx.drawImage(this.tileset,
                        12 * spriteIndex, 0,
                        this.tile, this.tile,
                        this.pixel * (this.tile * i - this.camera.x), this.pixel * (this.tile * j - this.camera.y),
                        this.tile * this.pixel, this.tile * this.pixel);
                }
            }
        }

    },
    updateActors: function () {
        for (var i = 0; i < this.actor.length; i++) {
            var a = this.actor[i];

            // Gravitáció
            a.dy += this.gravity;
            if (a.dy > this.max_fall) { a.dy = this.max_fall; }

            // Vízszintes mozgás - több lépésbenPixelPerfect
            if (a.dx != 0) {
                var step = a.dx > 0 ? 1 : -1;
                var remaining = Math.abs(a.dx);
                
                for (var s = 0; s < remaining; s++) {
                    a.x += step;
                    
                    // Pálya szélének ellenőrzése
                    if (a.x < 0) {
                        a.x = 0;
                        break;
                    }
                    if (a.x + this.tile > this.mw * this.tile) {
                        a.x = this.mw * this.tile - this.tile;
                        break;
                    }
                    
                    // Ellenőrizzük mind a 4 sarokpontot vízszintesen
                    var left = Math.floor(a.x / this.tile);
                    var right = Math.floor((a.x + this.tile - 1) / this.tile);
                    var top = Math.floor(a.y / this.tile);
                    var bottom = Math.floor((a.y + this.tile - 1) / this.tile);
                    
                    var hitTopLeft = this.getTileAt(left, top);
                    var hitTopRight = this.getTileAt(right, top);
                    var hitBottomLeft = this.getTileAt(left, bottom);
                    var hitBottomRight = this.getTileAt(right, bottom);
                    
                    if (this.isSolid(hitTopLeft) || this.isSolid(hitTopRight) || 
                        this.isSolid(hitBottomLeft) || this.isSolid(hitBottomRight)) {
                        a.x -= step;
                        break;
                    }
                }
            }

            // Függőleges mozgás - több lépésben
            if (a.dy != 0) {
                var step = a.dy > 0 ? 1 : -1;
                var remaining = Math.abs(a.dy);
                
                for (var s = 0; s < remaining; s++) {
                    a.y += step;
                    
                    // Pálya tetejének és aljának ellenőrzése
                    if (a.y < 0) {
                        a.y = 0;
                        a.dy = 0;
                        break;
                    }
                    if (a.y + this.tile > this.mh * this.tile) {
                        a.y = this.mh * this.tile - this.tile;
                        a.dy = 0;
                        break;
                    }
                    
                    // Csak alsó sarokpontokat ellenőrizzük (bal alsó, jobb alsó)
                    // Ha fej beüti a falat, az ne állítsa meg az ugrást
                    var left = Math.floor(a.x / this.tile);
                    var right = Math.floor((a.x + this.tile - 1) / this.tile);
                    var bottom = Math.floor((a.y + this.tile - 1) / this.tile);
                    
                    var hitBottomLeft = this.getTileAt(left, bottom);
                    var hitBottomRight = this.getTileAt(right, bottom);
                    
                    if (this.isSolid(hitBottomLeft) || this.isSolid(hitBottomRight)) {
                        a.y -= step;
                        a.dy = 0;
                        break;
                    }
                }
            }
        }
    },
    isSolid: function (tile) {
        if (tile === undefined || tile === ' ') return false;
        var tileType = this.getTileType(tile);
        return tileType.solid;
    },
    drawActors: function () {
        for (var i = 0; i < this.actor.length; i++) {
            var a = this.actor[i];
            var spriteIndex = this.getSpriteIndex(a.tile);
            this.ctx.drawImage(this.tileset,
                12 * spriteIndex, 0,
                this.tile, this.tile,
                this.pixel * (a.x - this.camera.x), this.pixel * (a.y - this.camera.y),
                this.tile * this.pixel, this.tile * this.pixel);
        }
    },
    followCamera: function () {
        var actor = this.getFirstActorByTile(this.camera.tile);
        this.camera.x = actor.x - MARIO_CONFIG.CAMERA_OFFSET_X;
        this.camera.y = actor.y - MARIO_CONFIG.CAMERA_OFFSET_Y;
        
        var horizontal_limit = this.mw * this.tile - this.w / this.pixel;
        var vertical_limit = this.mh * this.tile - this.h / this.pixel;
        
        // Bal oldal korlátozás
        if (this.camera.x < 0) {
            this.camera.x = 0;
        }
        // Jobb oldal korlátozás
        if (this.camera.x > horizontal_limit) {
            this.camera.x = horizontal_limit;
        }
        // Felső korlátozás
        if (this.camera.y < 0) {
            this.camera.y = 0;
        }
        // Alsó korlátozás
        if (this.camera.y > vertical_limit) {
            this.camera.y = vertical_limit;
        }
    }
}