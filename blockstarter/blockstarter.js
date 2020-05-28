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
        {
            name: 'GRAY',
            rgb: '#888',
            letter: 'G'
        },
        {
            name: 'GREY',
            rgb: '#888',
            letter: 'G'
        },
        {
            name: 'CYAN',
            rgb: '#2eb',
            letter: 'c'
        }, {
            name: 'MAGENTA',
            rgb: '#f2f',
            letter: 'm'
        }, {
            name: 'ROSE',
            rgb: '#f7b',
            letter: 'R'
        }, {
            name: 'SKIN',
            rgb: '#da6',
            letter: 's'
        },
        {
            name: 'PINK',
            rgb: '#d06',
            letter: 'p'
        }, {
            name: 'BROWN',
            rgb: '#842',
            letter: 'B'
        }, {
            name: 'BLUE',
            rgb: '#22d',
            letter: 'b'
        }, {
            name: 'ORANGE',
            rgb: '#f82',
            letter: 'o'
        },
        {
            name: 'YELLOW',
            rgb: '#dd2',
            letter: 'y'
        }, {
            name: 'DARK',
            rgb: '#222',
            letter: 'd'
        },
        {
            name: 'WHITE',
            rgb: '#fff',
            letter: 'w'
        }
    ],
    tile: {},
    state: 'title',
    stage: [],
    KEY_A: 'a',
    KEY_D: 'd',
    hero: {},
    paper: {},
    size: {},
    ctx: {},
    start: function () {
        console.log('Started');
        this.createCanvas();
        this.drawStage();
        //this.hero.x = this.size.w / 2;
        //this.hero.y = this.size.h / 2;
        //this.hero.xmove = 0;
        //var hero = this.hero;
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
    drawStage: function () {
        var stage = this.getStageByName(this.state);
        console.log(this.getColorByName('w').rgb);
        this.ctx.fillStyle = this.getColorByName(stage.paper).rgb;
        this.ctx.fillRect(0, 0, this.size.width, this.size.height);
        stage.height = stage.shape.length;
        stage.tile = Math.floor(this.size.height / stage.height);
        for (var j = 0; j < stage.shape.length; j++) {
            var row = stage.shape[j];
            for (var i = 0; i < row.length; i++) {
                if (row.charAt(i) != ' ') {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.fillRect(i * stage.tile, j * stage.tile, stage.tile, stage.tile);
                }
            }
        }
        //console.log(stage.tile);
    },
    getStageByName: function (name) {
        for (var i = 0; i < this.stage.length; i++) {
            if (this.stage[i].name == name) {
                return this.stage[i];
            }
        }
        return false;
    },
    getColorByName: function (name) {
        for (var i = 0; i < this.color.length; i++) {
            var color = this.color[i];
            if (color.name == name || color.letter == name) {
                return color;
            }
        }
        return false;
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
        this.size.width = canvas.width = window.innerWidth;
        this.size.height = canvas.height = window.innerHeight;
        //this.size.pixel = Math.floor(this.size.h / 12 / 8);
        //this.size.tile = this.size.pixel * 8;
    }
}