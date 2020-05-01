var engine = {
    camera: { x: 0, y: 0 },
    display: { w: 0, h: 0 },
    ctx: {},
    img: {},
    gravity: .5,
    jumpStrength: 12,
    cursor: { enabled: true, x: 0, y: 0, block: 0, offset: 0 },
    isDone: false,
    gems: 0,
    tile: 64,
    block: [
        {
            char: 'B',
            offset: 0,
            fixed: true,
            wall: true,
            collectable: false,
            mob: false,
            player: false
        },
        {
            char: 'C',
            offset: 1,
            fixed: true,
            wall: true,
            collectable: false,
            mob: false,
            player: false
        },
        {
            char: 'E',
            offset: 2,
            fixed: false,
            wall: false,
            collectable: false,
            mob: true,
            player: false
        },
        {
            char: 'P',
            offset: 3,
            fixed: false,
            wall: false,
            collectable: false,
            mob: true,
            player: true
        },
        {
            char: 'D',
            offset: 4,
            fixed: true,
            wall: false,
            collectable: false,
            mob: false,
            player: false
        },
        {
            char: 'O',
            offset: 5,
            fixed: true,
            wall: false,
            collectable: false,
            mob: false,
            player: false
        },
        {
            char: 'o',
            offset: 6,
            fixed: true,
            wall: false,
            collectable: true,
            mob: false,
            player: false
        },
    ],
    actor: [],
    init: function (canvas, img) {
        canvas.width = this.display.w = document.body.clientWidth;
        canvas.height = this.display.h = document.body.clientHeight;
        this.ctx = canvas.getContext('2d');
        this.img = img;
    },
    createActors: function (data) {
        this.actor = [];
        this.gems = 0;
        this.isDone = false;
        for (var j = 0; j < data.length; j++) {
            var row = data[j];
            for (var i = 0; i < row.length; i++) {
                var char = row.charAt(i);
                if (char != ' ') {
                    var block = this.getBlockByChar(char);
                    this.addActor(
                        block.char,
                        block.offset,
                        block.fixed,
                        block.wall,
                        block.collectable,
                        block.mob,
                        block.player,
                        i * this.tile,
                        j * this.tile);
                    if (char == 'o') {
                        this.gems++;
                    }
                }
            }
        }
    },
    getBlockByChar: function (char) {
        for (var i = 0; i < this.block.length; i++) {
            var block = this.block[i];
            if (char == block.char) {
                return block;
            }
        }
    },
    getActorByName: function (name) {
        for (var i = 0; i < this.actor.length; i++) {
            var actor = this.actor[i];
            if (actor.name == name) {
                return actor;
            }
        }
    },
    addActor: function (name, offset, fixed, wall, collectable, mob, player, x, y) {
        this.actor.push(
            {
                name: name,
                offset: offset,
                fixed: fixed,
                wall: wall,
                collectable: collectable,
                mob: mob,
                player: player,
                live: true,
                x: x,
                y: y,
                xv: 0,
                yv: 0,
                xforce: 0,
                visible: true,
                mustJump: false,
            }
        );
    },
    drawActors: function () {
        for (var i = 0; i < this.actor.length; i++) {
            var actor = this.actor[i];
            if (actor.visible) {
                this.ctx.drawImage(this.img, this.tile * actor.offset, 0,
                    this.tile, this.tile,
                    Math.floor(actor.x + this.camera.x), Math.floor(actor.y + this.camera.y),
                    this.tile, this.tile);
            }
        }
    },
    drawCursor: function () {
        var x = Math.floor(this.cursor.x + this.camera.x);
        var y = Math.floor(this.cursor.y + this.camera.y);
        this.ctx.fillStyle = '#FFF';

        this.ctx.fillRect(x, y, this.tile, this.tile);
        if (this.cursor.block != -1) {
            this.ctx.drawImage(this.img, this.tile * this.cursor.offset, 0,
                this.tile, this.tile,
                x, y,
                this.tile, this.tile);
        }
    },
    nextBlock: function () {
        this.cursor.block++;
        if (this.cursor.block >= this.block.length) {
            this.cursor.block = -1;
        }
        if (this.cursor.block == -1) {

        } else {
            this.cursor.offset = this.block[this.cursor.block].offset;
        }
    },
    putBlock: function () {
        var block = this.block[this.cursor.block];
        this.addActor(
            block.char,
            block.offset,
            block.fixed,
            block.wall,
            block.collectable,
            block.mob,
            block.player,
            this.cursor.x,
            this.cursor.y);
    },
    moveRight: function () {
        this.cursor.x += this.tile;
    },
    moveLeft: function () {
        this.cursor.x -= this.tile;
    },
    moveUp: function () {
        this.cursor.y -= this.tile;
    },
    moveDown: function () {
        this.cursor.y += this.tile;
    },
    isOverlapped: function (actor, other) {
        var xdistance = Math.abs((actor.x + actor.xv) - (other.x + other.xv));
        var ydistance = Math.abs((actor.y + actor.yv) - (other.y + other.yv));
        return xdistance < this.tile / 2 && ydistance < this.tile / 2;
    },
    isLeftTouched: function (actor, fixed) {
        return this.isPointInside(actor.x + actor.xv, actor.y + this.tile / 2, fixed);
    },
    isRightTouched: function (actor, fixed) {
        return this.isPointInside(actor.x + actor.xv + this.tile, actor.y + this.tile / 2, fixed);
    },
    isBottomTouched: function (actor, fixed) {
        return this.isPointInside(
            actor.x + actor.xv + 4,
            actor.y + actor.yv + this.tile,
            fixed) ||
            this.isPointInside(
                actor.x + actor.xv + this.tile - 4,
                actor.y + actor.yv + this.tile,
                fixed);
    },
    isPointInside: function (x, y, fixed) {
        return x > fixed.x && x < fixed.x + this.tile && y > fixed.y && y < fixed.y + this.tile;
    },
    isFloorAtBottom: function (actor) {
        var x = actor.x + actor.xv + this.tile / 2;
        var y = actor.y + actor.yv + 1 + this.tile;
        for (var i = 0; i < this.actor.length; i++) {
            var other = this.actor[i];
            if (other.wall) {
                if (x > other.x && x < other.x + this.tile && y > other.y && y < other.y + this.tile) {
                    return true;
                }
            }
        }
        return false;
    },
    openDoors: function () {
        for (var i = 0; i < this.actor.length; i++) {
            var actor = this.actor[i];
            if (actor.name == 'D') {
                actor.name = 'O';
                actor.offset = this.getBlockByChar('O').offset;
            }
        }
    },
    update: function () {
        //apply forces
        for (var i = 0; i < this.actor.length; i++) {
            var actor = this.actor[i];
            if (actor.name == 'E') {
                if (actor.xv == 0) {
                    actor.dir = 2;
                }
                if (actor.dir != 0) {
                    actor.xv = actor.dir;
                }
                if (!this.isFloorAtBottom(actor)) {
                    actor.dir *= -1;
                }
            }
            if (actor.mustJump && this.isFloorAtBottom(actor)) {
                actor.yv = -this.jumpStrength;
                actor.y += actor.yv;
            }
            if (!actor.fixed) {
                actor.xv += actor.xforce;
                actor.yv += this.gravity;
                actor.yv *= .99;
                actor.xv *= .8;
            }

        }
        //collition with actors
        for (var i = 0; i < this.actor.length; i++) {
            var actor = this.actor[i];
            if (actor.mob && actor.live) {
                for (var j = 0; j < this.actor.length; j++) {
                    var other = this.actor[j];
                    if (i != j && other.wall) {
                        if (this.isBottomTouched(actor, other)) {
                            actor.yv = 0;
                        }
                        if (this.isLeftTouched(actor, other) || this.isRightTouched(actor, other)) {
                            actor.xv = 0;
                        }
                    }
                }
            }
            if (actor.player && actor.live) {
                for (var j = 0; j < this.actor.length; j++) {
                    var other = this.actor[j];
                    if (i != j && other.visible && this.isOverlapped(actor, other)) {
                        if (other.name == 'o') {
                            other.visible = false;
                            this.gems--;
                            if (this.gems == 0) {
                                this.openDoors();
                            }
                        } else if (other.name == 'O') {
                            this.isDone = true;
                        } else if (other.name == 'E' && !this.cursor.enabled) {
                            actor.live = false;
                            actor.yv = -this.jumpStrength;
                            actor.y += actor.yv;
                        }
                    }
                }
            }
        }
        //move actors
        for (var i = 0; i < this.actor.length; i++) {
            var actor = this.actor[i];
            actor.x += actor.xv;
            actor.y += actor.yv;
        }
        //move camera
        var x = this.display.w / 2 - this.getActorByName('P').x;
        var y = this.display.h / 2 - this.getActorByName('P').y;
        this.camera.x += (x - this.camera.x) * .01;
        this.camera.y += (y - this.camera.y) * .01;
        this.camera.x = this.camera.x;
        this.camera.y = this.camera.y;

        this.ctx.fillStyle = '#AAF';
        this.ctx.fillRect(0, 0, this.display.w, this.display.h);
        if (this.cursor.enabled) {
            this.drawCursor();
        }
        this.drawActors();
    }
}