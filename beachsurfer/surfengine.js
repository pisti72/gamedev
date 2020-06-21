Surf = {
    debug: {
        text: '',
        on: true
    },
    paper: '#66f',
    image: {},
    tiles: [],
    pressed: {
        leftKeys: ['a', 'j', 'A', 'ArrowLeft'],
        rightKeys: ['d', 'l', 'D', 'ArrowRight'],
        upKeys: ['w', 'i', 'ArrowUp'],
        downKeys: ['s', 'k', 'ArrowDown']
    },
    actors: [],
    ctx: {},
    size: {
        heightInPixel: 128
    },
    init: function () {
        this.createCanvas();
        this.image = document.getElementsByTagName('IMG')[0];
        document.addEventListener('keydown', function (e) {
            if (Surf.pressed.leftKeys.includes(e.key)) {
                Surf.pressed.left = true;
            } else if (Surf.pressed.rightKeys.includes(e.key)) {
                Surf.pressed.right = true;
            }
            if (Surf.pressed.upKeys.includes(e.key)) {
                Surf.pressed.up = true;
            } else if (Surf.pressed.downKeys.includes(e.key)) {
                Surf.pressed.down = true;
            }
        })
        document.addEventListener('keyup', function (e) {
            if (Surf.pressed.leftKeys.includes(e.key) || Surf.pressed.rightKeys.includes(e.key)) {
                Surf.pressed.left = false;
                Surf.pressed.right = false;
            }
        })
        document.addEventListener('mousedown', function (e) {
            Surf.mousedown(e);
        })
        document.addEventListener('mousemove', function (e) {
            Surf.mousemove(e);
        })
        document.addEventListener('mouseup', function(e){
            Surf.mouseup();
        })
        this.fillAll();
    },
    mousemove: function(e) {
        var x = e.clientX;
        var y = e.clientY;
        var actor = this.getActorByDragged();
        if (actor) {
            actor.xd = x-actor.x;
            actor.yd = y-actor.y;
            //actor.x = x;
            //actor.y = y;
        }
    },
    mousedown: function (e) {
        var x = e.clientX;
        var y = e.clientY;
        var actor = this.getActorByCoord(x, y);
        if (actor) {
            actor.dragged = true;
            console.log('dragged');
            return;
        }
        console.log('actor not: ' + x + ','+y);
    },
    mouseup: function () {
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            actor.dragged = false;
        }
    },
    createCanvas: function () {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        document.body.style = document.style = 'height: 100%';
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        this.ctx = canvas.getContext('2d');
        this.size.width = canvas.width = window.innerWidth;
        this.size.height = canvas.height = window.innerHeight;
        this.size.pixel = Math.floor(this.size.height / this.size.heightInPixel);
        //this.size.tile = this.size.pixel * 8;
        //console.log(this.size.pixel);

    },
    print: function (line) {
        this.debug.text += line;
    },
    addActor: function (obj) {
        var tile = this.getTile(obj.tile);
        obj.tile = tile;
        if (!obj.xd) {
            obj.xd = 0;
        }
        if (!obj.yd) {
            obj.yd = 0;
        }
        obj.xforce = 0;
        obj.yforce = 0;
        obj.width = obj.tile.width * this.size.pixel;
        obj.dragged = false;
        this.actors.push(obj);
    },
    getRandomXY: function () {
        return {
            x: Math.floor(Math.random() * this.size.width),
            y: Math.floor(Math.random() * this.size.height)
        }
    },
    getCenter: function () {
        return {
            x: Math.floor(this.size.width / 2),
            y: Math.floor(this.size.height / 2)
        }
    },
    update: function () {
        this.clearActors();
        this.print('DEMO');
        this.movePlayer();
        this.spawnWaves();
        this.moveActors();
        //this.drawRect();
        this.drawActors();
        this.drawDebug();
    },
    spawnWaves: function () {
        //TBD
    },
    movePlayer: function () {
        var player = this.getActorByName('player');
        if (this.pressed.right) {
            player.xforce = .3;
        }
        if (this.pressed.left) {
            player.xforce = -.3;
        }
        if (!this.pressed.left && !this.pressed.right) {
            player.xforce = 0;
        }
        if (player.x < 0) {
            player.xd = 0;
            player.x = 0;
        } else if (player.x + player.width > this.size.width) {
            player.xd = 0;
            player.x = this.size.width - player.width;
        }
    },
    getActorByCoord: function (x, y) {
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            var isX = (x >= actor.x) && (x <= actor.x + actor.tile.width * this.size.pixel);
            var isY = (y >= actor.y) && (y <= actor.y + actor.tile.height *  this.size.pixel);
            if (isX && isY) return actor;
        }
        return false;
    },
    getActorByDragged: function (){
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            if(actor.dragged) return actor;
        }
        return false;
    },
    getActorByName: function (name) {
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            if (actor.name == name) return actor;
        }
        return false;
    },
    moveActors: function () {
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            actor.xd += actor.xforce;
            actor.yd += actor.yforce;
            actor.x += actor.xd;
            actor.y += actor.yd;
            actor.xd *= 1 - actor.friction;
            actor.yd *= 1 - actor.friction;
        }
    },
    drawActors: function () {
        this.ctx.imageSmoothingEnabled = false;
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            this.ctx.drawImage(this.image,
                actor.tile.x, actor.tile.y,
                actor.tile.width, actor.tile.height,
                actor.x, actor.y,
                actor.tile.width * this.size.pixel, actor.tile.height * this.size.pixel);
        }
    },
    clearActors: function () {
        this.ctx.fillStyle = this.paper;
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            this.ctx.fillRect(
                actor.x, actor.y,
                actor.tile.width * this.size.pixel, actor.tile.height * this.size.pixel);
        }
    },
    getTile: function (id) {
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            if (tile.id == id) return tile;
        }
        return false;
    },
    drawDebug: function () {
        if (this.debug.on) {
            this.ctx.font = "16px Arial";
            this.ctx.stroke =
                this.ctx.fillStyle = '#444';
            this.ctx.fillText(this.debug.text, 10, 20);
            this.debug.text = '';
        }
    },
    drawRect: function () {
        this.ctx.fillRect(0, 0, 100, 100);
    },
    fillAll: function () {
        this.ctx.fillStyle = this.paper;
        this.ctx.fillRect(0, 0, this.size.width, this.size.height);
    }
}