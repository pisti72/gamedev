var map = {
    tile: 16,
    scale: 2,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    img: new Image(),
    blocks: [{
        name: 'brick',
        char: 'M',
        color: '#e80',
        tile: 0
    }, {
        name: 'grass',
        char: 'G',
        color: '#0a0',
        tile: 0
    }, {
        name: 'coin',
        char: '.',
        color: '#ff0',
        tile: 1
    }],
    cursor: {
        x: 0,
        y: 0,
        on: true,
        block: ' ',
        color: 'rgba(0,0,0,.8)',
        counter: 0
    },
    value: [],
    init: function (src) {
        this.height = this.value.length;
        this.width = this.value[0].length;
        this.img.src = src;
    },
    get: function (x, y) {
        return this.value[y].charAt(x);
    },
    cursorCopy: function () {
        this.cursor.block = this.get(this.cursor.x, this.cursor.y);
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.cursor.block == this.blocks[i].char) {
                this.cursor.color = this.blocks[i].color;
                return;
            }
        }
        this.cursor.block = ' ';
        this.cursor.color = 'rgba(0,0,0,0)';
    },
    set: function (n, x, y) {
        var s = this.value[y];
        s = s.substr(0, x) + n + s.substr(x + 1, s.length - x);
        this.value[y] = s;
    },
    draw: function (ctx) {
        for (var j = 0; j < this.height; j++) {
            for (var i = 0; i < this.width; i++) {
                //https://www.w3schools.com/tags/canvas_drawimage.asp
                for (var b = 0; b < this.blocks.length; b++) {
                    if (this.get(i, j) == this.blocks[b].char) {
                        ctx.fillStyle = this.blocks[b].color;
                        ctx.fillRect(i * this.tile + this.x, j * this.tile + this.y, this.tile, this.tile);
                    }
                }
            }
        }
        //cursor
        if (this.cursor.on) {
            if (++this.cursor.counter % 10 < 5) {
                ctx.fillStyle = 'rgba(0,0,0,.4)';
            } else {
                ctx.fillStyle = this.cursor.color;
            }
            ctx.fillRect(this.cursor.x * this.tile + this.x, this.cursor.y * this.tile + this.y, this.tile, this.tile);
        }
    },
    fill: function (n, w, h) {
        this.width = w;
        this.height = h;
        for (var j = 0; j < h; j++) {
            this.value[j] = n.repeat(w);
        }
        //put all block at top
        var s = ' ';
        for (var b = 0; b < this.blocks.length; b++) {
            s += this.blocks[b].char;
        }
        s += this.value[0].substr(this.blocks.length, this.value[0].length - this.blocks.length - 1);
        this.value[0] = s;
    },
    box: function (n, x, y, w, h) {
        for (var j = 0; j < h; j++) {
            for (var i = 0; i < w; i++) {
                this.set(n, x + i, y + j);
            }
        }
    },
    toString: function () {
        var s = '';
        for (var j = 0; j < this.height; j++) {
            var b = this.value[j].split(" ").join('&nbsp;');
            s += '\'' + b + '\',<br/>';
        }
        return s;
    },
    test: function () {
        this.value = [
            ' MM MM ',
            'M..MMMM',
            'M.MMMMM',
            ' MMMMM ',
            '  MMM  ',
            '   M   '];
    }
}
