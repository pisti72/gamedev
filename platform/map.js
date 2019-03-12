var map = {
    tile: 16,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    blocks: [{
        char: 'M',
        color: '#f00'
    }, {
        char: 'B',
        color: '#fff'
    }],
    value: [],
    init: function () {
        this.height = this.value.length;
        this.width = this.value[0].length;
    },
    get: function (x, y) {
        return this.value[y].charAt(x);
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
    },
    test: function () {
        this.value = [
            ' MM MM ',
            'MBBMMMM',
            'MBMMMMM',
            ' MMMMM ',
            '  MMM  ',
            '   M   '];
    }
}
