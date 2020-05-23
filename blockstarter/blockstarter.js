/**
 * VGDL
 */

BS = {
    MIDDLE: 0,
    color: [
        {
            name: 'RED',
            rgb: '#d22',
            letter: 'r'
        },
        {
            name: 'GREEN',
            rgb: '#2d2',
            letter: 'g'
        },
    ],
    tile:{},
    stage: 'title',
    GRAY: '#888',
    GREY: '#888',
    CYAN: '#2eb',
    MAGENTA: '#f2f',
    ROSE: '#f7b',
    BODY: '#da6',
    PINK: '#d06',
    BROWN: '#842',
    BLUE: '#22d',
    ORANGE: '#f82',
    YELLOW: '#dd2',
    BLACK: '#222',
    WHITE: '#fff',
    KEY_A: 'a',
    KEY_D: 'd',
    hero: {},
    paper: {},
    size: {},
    ctx: {},
    start: function () {
        console.log('Started');
        this.createCanvas();
        this.ctx.fillStyle = this.paper.color;
        this.ctx.fillRect(0, 0, this.size.w, this.size.h);
        this.hero.x = this.size.w / 2;
        this.hero.y = this.size.h / 2;
        this.hero.xmove = 0;
        var hero = this.hero;
        document.addEventListener("keydown", function (e) {
            if (e.key == hero.left) {
                hero.xmove = -1;
            } else if (e.key == hero.right) {
                hero.xmove = 1;
            }
        });
        document.addEventListener("keyup", function (e) {
            if (e.key == hero.left || e.key == hero.right) {
                hero.xmove = 0;
            }
        });
    },
    update: function () {
        this.clearHero();
        if (this.hero.xmove == -1) {
            this.hero.x -= this.hero.speed * this.size.pixel;
        } else if (this.hero.xmove == 1) {
            this.hero.x += this.hero.speed * this.size.pixel;
        }
        this.drawHero();
    },
    clearHero: function () {
        this.ctx.fillStyle = this.paper.color;
        this.ctx.fillRect(
            this.hero.x,
            this.hero.y,
            this.size.tile + this.size.pixel,
            this.size.tile + this.size.pixel);
    },
    drawHero: function () {
        //this.ctx.fillStyle = '#444';
        //this.ctx.fillRect(this.hero.x, this.hero.y, this.size.tile, this.size.tile);
        this.ctx.fillStyle = this.hero.color;
        for (var j = 0; j < this.hero.shape.length; j++) {
            var line = this.hero.shape[j];
            for (var i = 0; i < line.length; i++) {
                var point = line.charAt(i);
                if (point == '0') {
                    this.ctx.fillRect(
                        this.hero.x + i * this.size.pixel,
                        this.hero.y + j * this.size.pixel,
                        this.size.pixel + 1,
                        this.size.pixel + 1);
                }
            }
        }
        //
    },
    createCanvas: function () {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        document.body.style = document.style = 'height: 100%';
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        this.ctx = canvas.getContext('2d');
        this.size.w = canvas.width = window.innerWidth;
        this.size.h = canvas.height = window.innerHeight;
        this.size.pixel = Math.floor(this.size.h / 12 / 8);
        this.size.tile = this.size.pixel * 8;
    }
}