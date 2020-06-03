Surf = {
    debug: {
        text: '',
        on: true
    },
    paper: '#66f',
    image: {},
    tiles: [],
    pressed: {
        leftKeys: ['a', 'j', 'ArrowLeft'],
        righKeys: ['d', 'l', 'ArrowRight'],
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
        document.addEventListener("keydown", function (e) {
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
        });
        this.fillAll();
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
        this.debug.text += line + ' - ';
    },
    addActor: function (obj) {
        var tile = this.getTile(obj.tile);
        obj.tile = tile;
        this.actors.push(obj);
    },
    update: function () {
        this.clearActors();
        this.print('Hello');
        this.print('Szabi');
        this.moveActors();
        //this.drawRect();
        this.drawActors();
        this.drawDebug();
    },
    moveActors: function () {
        for (var i = 0; i < this.actors.length; i++) {
            var actor = this.actors[i];
            actor.x += actor.xd;
            actor.y += actor.yd;
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