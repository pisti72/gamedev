console.log('wire loaded');

var Wire3d = {
    ctx: {},
    objects: [],
    meshes: [],
    w: 0,
    h: 0,
    player: {
        x: 0,
        y: 0,
        speed: 0,
        rot: 0,
        speedOfRot: 0,
        isForward: false,
        isBackward: false,
        isRotRight: false,
        isRotLeft: false
    },
    init: function () {
        var canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width = document.body.clientWidth;
        this.h = canvas.height = document.body.clientHeight;
        this.meshes = [];
        //create cube
        this.addMesh('cube', [
            -1, -1, -1,
            1, -1, -1,
            1, 1, -1,
            -1, 1, -1,
            -1, -1, 1,
            1, -1, 1,
            1, 1, 1,
            -1, 1, 1
        ], [
            0, 1,
            1, 2,
            2, 3,
            3, 0,
            0, 4,
            1, 5,
            2, 6,
            3, 7,
            4, 5,
            5, 6,
            6, 7,
            7, 4]);
    },
    addObject: function (name, scale, x, y, z) {
        var object = {
            name: name,
            scale: scale,
            x: x,
            y: y,
            z: z
        }
        this.objects.push(object);
    },
    addMesh: function (name, points, edges) {
        var p = [];
        var e = [];
        for (var i = 0; i < points.length; i += 3) {
            p.push(
                {
                    x: points[i],
                    y: points[i + 1],
                    z: points[i + 2]
                });
        }
        //console.log(p);
        for (var i = 0; i < edges.length; i += 2) {
            e.push(
                {
                    a: edges[i],
                    b: edges[i + 1]
                });
        }
        var mesh = {
            name: name,
            points: p,
            edges: e
        }
        this.meshes.push(mesh);
    },
    getMeshByName: function (name) {
        for (var i = 0; i < this.meshes.length; i++) {
            if (name == this.meshes[i].name) {
                return this.meshes[i];
            }
        }
    },
    addCube: function (scale, x, y, z) {
        this.addObject('cube', scale, x, y, z);
    },
    debug: function (n, line) {
        this.ctx.fillStyle = '#000';
        this.ctx.font = "30px Arial";
        this.ctx.fillText(n, 10, line);
    },
    render: function () {
        this.ctx.fillStyle = '#EEE';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = '#000';
        this.playerUpdate();
        for (var i = 0; i < this.objects.length; i++) {
            var object = this.objects[i];
            var mesh = this.getMeshByName(object.name);
            //look above
            var points2D = [];
            
            for (var j = 0; j < mesh.points.length; j++) {
                var point = mesh.points[j];
                this.ctx.fillRect(
                    point.x * object.scale + this.w / 2,
                    point.y * object.scale + this.h / 2, 4, 4);
            }
        }
    },
    playerUpdate: function () {
        this.player.x += Math.cos(this.player.rot) * this.player.speed;
        this.player.y += Math.sin(this.player.rot) * this.player.speed;
        this.player.rot += this.player.speedOfRot;
        this.player.speed *= .95;
        this.player.speedOfRot *= .95;
        if (Math.abs(this.player.speed) < 0.1) {
            this.player.speed = 0;
        }
        if (Math.abs(this.player.speedOfRot) < 0.01) {
            this.player.speedOfRot = 0;
        }
        if (this.player.isForward) {
            this.player.speed += 1;
        } else if (this.player.isBackward) {
            this.player.speed -= 1;
        }
        if (this.player.isRotLeft) {
            this.player.speedOfRot += .1;
        } else if (this.player.isRotRight) {
            this.player.speedOfRot -= .1;
        }
    },
    playerForward: function () {
        this.player.isForward = true;
    },
    playerBackward: function () {
        this.player.isBackward = true;
    },
    playerNotForward: function () {
        this.player.isForward = false;
        this.player.isBackward = false;
    },
    playerLeft: function () {
        this.player.isRotLeft = true;
    },
    playerRight: function () {
        this.player.isRotRight = true;
    },
    playerDoNotRot: function () {
        this.player.isRotLeft = false;
        this.player.isRotRight = false;
    },
    getPlayerSpeed: function () {
        return this.player.speed;
    },
    getPlayerRot: function () {
        return this.player.rot;
    },
    getPlayer: function () {
        return this.player;
    }
}