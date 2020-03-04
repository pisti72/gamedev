var Wire3d = {
    mode: {
        WALK: 0,
        RUN: 1,
        FLY: 2
    },
    debug: false,
    wasd: false,
    sky: '#EEE',
    ground: '#AAA',
    ctx: {},
    objects: [],
    meshes: [],
    w: 0,
    h: 0,
    player: {
        ctrlMode: 0,
        x: 0,
        y: 0,
        z: 0,
        height: 10,
        fov: 0,
        speed: 0,
        acc: .1,
        loss: .9,
        rot: 0,
        pull: 0,
        roll: 0,
        rotAcc: .005,
        speedOfRot: 0,
        speedOfPull: 0,
        speedOfRoll: 0,
        isForward: false,
        isBackward: false,
        isRotRight: false,
        isRotLeft: false,
        isPushDown: false,
        isPullUp: false,
        isRollRight: false,
        isRollLeft: false
    },
    keypressed: function (e) {
        if (e.key == 'w') {
            if (this.player.ctrlMode == this.mode.WALK) {
                this.playerForward();
                console.log('w pressed');
            } else if (this.player.ctrlMode == this.mode.FLY) {
                this.playerPushDown();
            }
        } else if (e.key == 's') {
            if (this.player.ctrlMode == this.mode.WALK) {
                this.playerBackward();
            } else if (this.player.ctrlMode == this.mode.FLY) {
                this.playerPullUp();
            }

        }
        if (e.key == 'a') {
            this.playerLeft();
        } else if (e.key == 'd') {
            this.playerRight();
        }
    },
    keyreleased: function (e) {
        if (e.key == 'w' || e.key == 's') {
            if (this.player.ctrlMode == this.mode.WALK) {
                this.playerNotForward();
            } else if (this.player.ctrlMode == this.mode.FLY) {
                this.playerNotPull();
            }
        }
        if (e.key == 'a' || e.key == 'd') {
            this.playerDoNotRot();
        }
    },
    init: function () {
        var canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width = document.body.clientWidth;
        this.h = canvas.height = document.body.clientHeight;
        this.player.fov = this.w / 2;
        this.player.z = this.player.height;
        this.meshes = [];
        //key handling
        document.onkeydown = function (e) {
            Wire3d.keypressed(e);
        };
        document.onkeyup = function (e) {
            Wire3d.keyreleased(e);
        }
        //create primitives
        for (var i = 0; i < this.primitives.length; i++) {
            var primitive = this.primitives[i];
            this.addMesh(primitive.name, primitive.points, primitive.edges);
        }
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
    addTree: function (x, y) {
        this.addObject('tree', 1, x, y, 0);
    },
    print: function (n, line) {
        this.ctx.fillStyle = '#000';
        this.ctx.font = "30px Arial";
        this.ctx.fillText(n, 10, line);
    },
    render: function () {
        this.drawHorizon();
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
        if (this.wasd) {
            this.drawWASD();
        }
        if (this.debug) {
            this.drawDebug();
        }
    },
    renderRectangles: function () {
        this.drawHorizon();
        this.playerUpdate();
        if (this.debug) {
            this.drawDebug();
        }
    },
    drawDebug: function () {
        this.print('speed: ' + this.getPlayerSpeed(), 40);
        this.print('rotation: ' + this.getPlayerDegree(), 80);
    },
    drawHorizon: function () {
        this.ctx.fillStyle = this.sky;
        //this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = this.ground;
        //this.ctx.fillRect(0, this.h / 2, this.w, this.h / 2);
        var p11 = {
            x: -this.w,
            y: this.player.fov,
            z: 0
        }
        var p12 = this.rotateAxisY(p11, this.player.roll);
        var p4 = this.rotateAxisX(p12, this.player.pull);
        var left = {};
        var right = {};
        left.x = p4.x * this.player.fov / p4.y + this.w / 2;// x/z=xs/f
        left.y = this.h / 2 - p4.z * this.player.fov / p4.y;
        p11 = {
            x: this.w,
            y: this.player.fov,
            z: 0
        }
        p12 = this.rotateAxisY(p11, this.player.roll);
        p4 = this.rotateAxisX(p12, this.player.pull);
        right.x = p4.x * this.player.fov / p4.y + this.w / 2;// x/z=xs/f
        right.y = this.h / 2 - p4.z * this.player.fov / p4.y;
        //this.ctx.fillRect(x, y, 10, 10);
        this.ctx.beginPath();
        this.ctx.moveTo(left.x, left.y);
        this.ctx.lineTo(right.x, right.y);
        this.ctx.lineTo(this.w, this.h);
        this.ctx.lineTo(0, this.h);
        this.ctx.closePath();
        this.ctx.fill();
    },
    drawWASD: function () {
        var u = Math.floor(this.w / 30);
        var f = Math.floor(u * 0.75);
        var m = Math.floor(u / 4);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.rect(u, this.h - 2 * u, u, u);
        this.ctx.rect(2 * u + m, this.h - 2 * u, u, u);
        this.ctx.rect(3 * u + 2 * m, this.h - 2 * u, u, u);
        this.ctx.rect(2 * u + m, this.h - 3 * u - m, u, u);
        this.ctx.stroke();
        this.ctx.fillStyle = '#000';
        this.ctx.font = f + 'px Arial';
        this.ctx.fillText('A', u + f / 4, this.h - u - f / 2);
        this.ctx.fillText('S', 2 * u + m + f / 4, this.h - u - f / 2);
        this.ctx.fillText('D', 3 * u + 2 * m + f / 4, this.h - u - f / 2);
        this.ctx.fillText('W', 2 * u + m + f / 4, this.h - 2 * u - m - f / 2);
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
    subPoints: function (p1, p2) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y,
            z: p1.z - p2.z
        };
    },
    rotateAxisX: function (p, rad) {
        return {
            x: p.x,
            y: p.y * Math.cos(rad) - p.z * Math.sin(rad),
            z: p.y * Math.sin(rad) + p.z * Math.cos(rad)
        };
    },
    rotateAxisY: function (p, rad) {
        return {
            x: p.x * Math.cos(rad) - p.z * Math.sin(rad),
            y: p.y,
            z: p.x * Math.sin(rad) + p.z * Math.cos(rad)
        };
    },
    rotateAxisZ: function (p, rad) {
        return {
            x: p.x * Math.cos(rad) - p.y * Math.sin(rad),
            y: p.x * Math.sin(rad) + p.y * Math.cos(rad),
            z: p.z
        };
    },
    isFrontOfMe: function (object) {
        var p1 = this.subPoints(object, this.player);
        var p2 = this.rotateAxisZ(p1, this.player.rot);
        return p2.y + object.scale > 0;
    },
    getProjected: function (mesh, object) {
        var p1 = this.scalePoint(mesh, object.scale);
        var p2 = this.addPoints(p1, object);
        var p3 = this.subPoints(p2, this.player);
        var p11 = this.rotateAxisZ(p3, this.player.rot);
        var p12 = this.rotateAxisY(p11, this.player.roll);
        var p4 = this.rotateAxisX(p12, this.player.pull);
        if (p4.y <= 0) {
            p4.y = .001;
        }
        var x = p4.x * this.player.fov / p4.y + this.w / 2;// x/z=xs/f
        var y = this.h / 2 - p4.z * this.player.fov / p4.y;
        if (x < -40 * this.w) {
            x = -40 * this.w;
        } else if (x > 50 * this.w) {
            x = 50 * this.w;
        }
        if (y < -40 * this.h) {
            y = -40 * this.h;
        } else if (y > 50 * this.h) {
            y = 50 * this.h;
        }
        var p5 = {
            x: x,
            y: y
        };
        return p5;
    },
    playerUpdate: function () {
        var speed = {
            x: 0,
            y: 0,
            z: 0
        };
        speed.y = this.player.speed;
        var speed2 = this.rotateAxisZ(speed, -this.player.rot);
        var speed3 = this.rotateAxisX(speed2, -this.player.pull);
        this.player.x += speed3.x;
        this.player.y += speed3.y;
        this.player.z += speed3.z;
        this.player.rot += this.player.speedOfRot;
        this.player.pull += this.player.speedOfPull;


        if (this.player.ctrlMode == this.mode.WALK) {
            this.player.speed *= this.player.loss;
        } else if (this.player.ctrlMode == this.mode.FLY) {
            this.player.roll = this.player.speedOfRot * 4;
        }
        this.player.speedOfRot *= this.player.loss;
        this.player.speedOfPull *= this.player.loss;
        this.player.speedOfRoll *= this.player.loss;

        if (this.player.isForward) {
            this.player.speed += this.player.acc;
        } else if (this.player.isBackward) {
            this.player.speed -= this.player.acc;
        }
        if (this.player.isRotLeft) {
            this.player.speedOfRot -= this.player.rotAcc;
        } else if (this.player.isRotRight) {
            this.player.speedOfRot += this.player.rotAcc;
        }
        if (this.player.isPushDown) {
            this.player.speedOfPull += this.player.rotAcc;
            //this.player.speed -= this.player.acc;
        } else if (this.player.isPullUp) {
            this.player.speedOfPull -= this.player.rotAcc;
            this.player.speed += this.player.acc;
        }
        // if (this.player.isRollLeft) {
        //     this.player.speedOfRoll += this.player.rotAcc;
        // } else if (this.player.isRollRight) {
        //     this.player.speedOfRoll -= this.player.rotAcc;
        // }
        if (this.player.rot < 0) {
            this.player.rot += Math.PI * 2;
        }
    },
    playerForward: function () {
        this.player.isForward = true;
    },
    playerPushDown: function () {
        this.player.isPushDown = true;
    },
    playerPullUp: function () {
        this.player.isPullUp = true;
    },
    playerNotPull: function () {
        this.player.isPushDown = false;
        this.player.isPullUp = false;
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
    playerDoNotPull: function () {
        this.player.isPullUp = false;
        this.player.isPushDown = false;
    },
    playerDoNotRoll: function () {
        this.player.isRollLeft = false;
        this.player.isRollLeft = false;
    },
    getPlayerSpeed: function () {
        return Math.floor(this.player.speed * 10);
    },
    getPlayerRot: function () {
        return this.player.rot;
    },
    getPlayerDegree: function () {
        return Math.floor(this.player.rot / Math.PI * 180) % 360;
    },
    getPlayer: function () {
        return this.player;
    },
    primitives: [
        {
            name: 'cube',
            points: [
                -1, -1, -1,
                1, -1, -1,
                1, 1, -1,
                -1, 1, -1,
                -1, -1, 1,
                1, -1, 1,
                1, 1, 1,
                -1, 1, 1
            ],
            edges: [
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
                7, 4]
        },
        {
            name: 'pyramid',
            points: [
                -1, -1, 0,
                1, -1, 0,
                1, 1, 0,
                -1, 1, 0,
                0, 0, 1.5
            ],
            edges: [
                0, 1,
                1, 2,
                2, 3,
                3, 0,
                0, 4,
                1, 4,
                2, 4,
                3, 4]
        },
        {
            name: 'tree',
            width: 10,
            height: 10
        },
        {
            name: 'null',
            points: [],
            edges: []
        }
    ]
}