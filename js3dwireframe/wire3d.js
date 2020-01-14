console.log('wire loaded');

var Wire3d = {
    ctx: {},
    w: 0,
    h: 0,
    player: {
        x: 0,
        y: 0,
        acc: 0,
        speed: 0,
        rot: 0
    },
    init: function () {
        var canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width = document.body.clientWidth;
        this.h = canvas.height = document.body.clientHeight;
    },
    addCube: function (x, y, z) {
        console.log('cube added');
    },
    debug: function (n) {
        this.ctx.fillStyle = '#000';
        this.ctx.font = "30px Arial";
        this.ctx.fillText(n, 10, 40);
    },
    render: function () {
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = '#000';
        this.playerUpdate();
        console.log('rendered');
    },
    playerUpdate: function(){
        this.player.x += Math.cos(this.player.rot) * this.player.speed;
        this.player.y += Math.sin(this.player.rot) * this.player.speed;
        this.player.speed *= .99;
    },
    playerForward: function(){
        this.player.speed += 1;
    },
    playerBackward: function(){

    },
    playerLeft: function(){

    },
    playerRight: function(){

    },
    getPlayerSpeed:function(){
        return this.player.speed;
    }
}