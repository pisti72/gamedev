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
        z: 0,
        fov: 0,
        speed: 0,
        rot: 0,
        rotAcc: .005,
        rotLoss: .9,
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
        this.player.fov = this.w / 2;
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
        //create pyramid
        this.addMesh('pyramid', [
            -1, -1, 0,
            1, -1, 0,
            1, 1, 0,
            -1, 1, 0,
            0, 0, 1.5
        ], [
            0, 1,
            1, 2,
            2, 3,
            3, 0,
            0, 4,
            1, 4,
            2, 4,
            3, 4]);

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
    addPyramid: function (scale, x, y, z) {
        this.addObject('pyramid', scale, x, y, z);
    },
    debug: function (n, line) {
        this.ctx.fillStyle = '#000';
        this.ctx.font = "30px Arial";
        this.ctx.fillText(n, 10, line);
    },
    render: function () {
        this.ctx.fillStyle = '#EEE';
        //this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.playerUpdate();
        for (var i = 0; i < this.objects.length; i++) {
            var object = this.objects[i];
            if (this.isFrontOfMe(object)) {
                var mesh = this.getMeshByName(object.name);
                var points2D = [];
                for (var j = 0; j < mesh.points.length; j++) {
                    var point = mesh.points[j];
                    var point2 = this.getProjected(point, object);
                    points2D.push(point2);
                }

                for (var j = 0; j < mesh.edges.length; j++) {
                    var edge = mesh.edges[j];
                    this.ctx.beginPath();
                    this.ctx.moveTo(points2D[edge.a].x, points2D[edge.a].y);
                    this.ctx.lineTo(points2D[edge.b].x, points2D[edge.b].y);
                    this.ctx.stroke();
                }
            }
        }
    },
    scalePoint: function (p, scale) {
        return {
            x: p.x * scale,
            y: p.y * scale,
            z: p.z * scale
        };
    },
    addPoints: function (p1, p2) {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y,
            z: p1.z + p2.z
        };
    },
    differencePoints: function (p1, p2) {
        return {
            x: p2.x - p1.x,
            y: p2.y - p1.y,
            z: p2.z - p1.z
        };
    },
    rotateAxisZ: function (p, rad) {
        return {
            x: p.x * Math.cos(rad) - p.y * Math.sin(rad),
            y: p.x * Math.sin(rad) + p.y * Math.cos(rad),
            z: p.z
        };
    },
    isFrontOfMe: function(object){
        var p1 = this.differencePoints(object, this.player);
        var p2 = this.rotateAxisZ(p1, this.player.rot);
        return p2.y > 0;
    },
    getProjected: function (mesh, object) {
        var p1 = this.scalePoint(mesh, object.scale);
        var p2 = this.addPoints(p1, object);
        var p3 = this.differencePoints(p2, this.player);
        var p4 = this.rotateAxisZ(p3, this.player.rot);
        var p5 = {
            x: p4.x * this.player.fov / p4.y + this.w / 2,// x/z=xs/f
            y: this.h / 2 - p4.z * this.player.fov / p4.y
        };
        return p5;
    },
    playerUpdate: function () {
        this.player.x += Math.cos(this.player.rot) * this.player.speed;
        this.player.y += Math.sin(this.player.rot) * this.player.speed;
        this.player.rot += this.player.speedOfRot;
        this.player.speed *= .95;
        this.player.speedOfRot *= this.player.rotLoss;
       
        if (this.player.isForward) {
            this.player.speed += 1;
        } else if (this.player.isBackward) {
            this.player.speed -= 1;
        }
        if (this.player.isRotLeft) {
            this.player.speedOfRot += this.player.rotAcc;
        } else if (this.player.isRotRight) {
            this.player.speedOfRot -= this.player.rotAcc;
        }
        if (this.player.rot < 0) {
            this.player.rot += Math.PI * 2;
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
        return Math.floor(this.player.speed);
    },
    getPlayerRot: function () {
        return this.player.rot;
    },
    getPlayerDegree: function () {
        return Math.floor(this.player.rot / Math.PI * 180) % 360;
    },
    getPlayer: function () {
        return this.player;
    }
}