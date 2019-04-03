bitmap = {
    byte: [],
    width: 1,
    height: 8,
    text: '',
    pixel: 40,
    size: 8,
    init: function () {
        console.log('init..');
        this.size = this.width * this.height;
        for (var i = 0; i < this.size; i++) {
            this.byte[i] = i;
        }
    },
    put: function (x, y) {
        console.log(x + ' , ' + y);
        var row = Math.floor(y / this.pixel);
        var column = Math.floor(x / this.pixel);
        var bit = Math.pow(2, 7 - column) ^ this.byte[row];//xor
        this.byte[row] = bit;
    },
    draw: function (ctx) {
        for (var i = 0; i < this.size; i++) {
            var b = this.byte[i];
            for (var j = 0; j < 8; j++) {
                if (b & Math.pow(2, 7 - j)) {
                    ctx.fillStyle = 'black';
                } else {
                    ctx.fillStyle = 'white';
                }
                if(this.width == 1){
                    ctx.fillRect(j * this.pixel, Math.floor(i / this.width) * this.pixel, this.pixel - 4, this.pixel - 4);
                    ctx.fillRect(j * 2 + 400, i * 2, 2, 2);
                }else if(this.width ==2){
                    ctx.fillRect(j * this.pixel + (i % 2) * this.pixel * 8, Math.floor(i / this.width) * this.pixel, this.pixel - 4, this.pixel - 4);
                    ctx.fillRect(j * 2 + 400, i * 2, 2, 2);
                }
                
            }
        }
    },
    export: function () {
        var t = '';
        for (var i = 0; i < this.size; i++) {
            t += '<div>defb ' + this.byte[i] + '</div>';
        }
        return t;
    }
}