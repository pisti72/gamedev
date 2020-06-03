Surf = {
    debug: {
        text: '',
        on: true
    },
    pressed: {
        leftKey: ['a','j'],
        righKey: ['d','l']
    },
    actors:[],
    ctx: {},
    size: {
        heightInPixel: 96
    },
    init: function () {
        this.createCanvas();
        this.createDebug();
        document.addEventListener("keydown", function (e) {
            if (e.key == pressed.leftKey) {
                pressed.left = true;
            } else if (e.key == pressed.rightKey) {
                pressed.right = true;
            }
        });
        this.print('Hello');
        this.print('Szabi');
        this.drawDebug();
        this.drawRect();
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
        console.log(this.size.pixel);
    },
    createDebug: function () {
        if (this.debug.on) {
            this.debug.elem = document.createElement('div');
            document.body.appendChild(this.debug.elem);
        }
    },
    print: function (line) {
        this.debug.text += line + '<br>';
    },
    drawDebug: function () {
        if (this.debug.on) {
            this.debug.elem.innerHTML = this.debug.text;
            this.debug.text = '';
        }
    },
    drawRect: function (){
        this.ctx.fillRect(0,0,100,100);
    }
}