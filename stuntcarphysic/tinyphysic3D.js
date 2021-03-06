var TinyPhysic3D = {
    GRAVITY: -.25,
    FRICTION: .9,
    SOFTNESS: .1,
    BLUR: .8,
    AIR: .9995,
    MAG: 50,
    BOX_DRAW_METHOD: 0,
    CLS_METHOD: 0,
    DEBUG: false,
    w: 0,
    h: 0,
    camera: { x: 0, y: 0, z: 0, lookAt: 0, f: 0, lookAtDistance: 0 },
    lookAt: function (ballId) {
        this.camera.lookAt = ballId;
    },
    canvas: {},
    ctx: {},
    points: [],
    lines: [],
    sections: [],
    boxes: [],
    init: function () {
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.w = this.canvas.width = document.body.clientWidth;
        this.h = this.canvas.height = document.body.clientHeight - 20;
        this.camera.f = this.w / 2;//fov = 180 degree
        this.camera.lookAtDistance = this.camera.f * 1.5;
        //create canvas here somehow
    },
    addBall: function (id, r, x, y, z, fixed, wheel, soft) {
        var ball = {
            id: id,
            r: r,
            x: x,
            y: y,
            z: z,
            fixed: fixed,
            soft: soft,
            wheel: wheel,
            xv: 0,
            yv: 0,
            zv: 0,
            collied: false,
            linesCount: 0,
            visible: true,
            boxId: 9999,
            getDistanceDiff: function (p) {
                return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) + (p.z - this.z) * (p.z - this.z)) - this.r - p.r;
            },
            getVector: function (p) {
                var distancePoints = Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) + (p.z - this.z) * (p.z - this.z));
                var diff = p.r + this.r - distancePoints;
                var xd = (this.x - p.x) / distancePoints * diff;
                var yd = (this.y - p.y) / distancePoints * diff;
                var zd = (this.z - p.z) / distancePoints * diff;
                return { x: xd, y: yd, z: zd };
            },
            getDistanceOfCenter: function (p) {
                var x = p.x - this.x;
                var y = p.y - this.y;
                var z = p.z - this.z;
                return Math.sqrt(x * x + y * y + z * z);
            }
        };
        this.points.push(ball);
        console.log('ball created:' + y);
    },
    getBallById: function (id) {
        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i]
            if (point.id == id) { return point; }
        }
    },
    getNumberOfBalls: function () {
        return this.points.length;
    },
    addLine: function (id, id1, id2) {
        var p1 = this.getBallById(id1);
        var p2 = this.getBallById(id2);
        var line = {
            id: id,
            id1: id1,
            id2: id2,
            length: Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z)),
            active: true,
            visible: true
        };
        this.lines.push(line);
        this.calculateLineConnectionsToBalls();
    },
    getLineById: function (id) {
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].id == id) {
                return this.lines[i];
            }
        }
    },
    disableLine: function (id) {
        this.getLineById(id).active = false;
        this.calculateLineConnectionsToBalls();
    },
    addTrack: function (x, y, w, h) {
        var track = { x: x, y: y, w: w, h: h };
        this.sections.push(track);
    },
    addBox: function (x, y, z, w) {
        var last_point_id = 0;
        var last_line_id = 0;
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].id > last_point_id) {
                last_point_id = this.points[i].id;
            }
        }
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].id > last_line_id) {
                last_line_id = this.lines[i].id;
            }
        }

        //addBall(id,r,x,y,z,fixed,wheel,soft){

        var w2 = w / 2;
        this.addBall(++last_point_id, w2, x - w2, y - w2, z - w2, false, false, false);
        this.addBall(++last_point_id, w2, x + w2, y - w2, z - w2, false, false, false);
        this.addBall(++last_point_id, w2, x - w2, y + w2, z - w2, false, false, false);
        this.addBall(++last_point_id, w2, x + w2, y + w2, z - w2, false, false, false);
        this.addBall(++last_point_id, w2, x - w2, y - w2, z + w2, false, false, false);
        this.addBall(++last_point_id, w2, x + w2, y - w2, z + w2, false, false, false);
        this.addBall(++last_point_id, w2, x - w2, y + w2, z + w2, false, false, false);
        this.addBall(++last_point_id, w2, x + w2, y + w2, z + w2, false, false, false);
        this.addLine(++last_line_id, last_point_id - 3, last_point_id - 2);
        this.addLine(++last_line_id, last_point_id - 0, last_point_id - 1);
        this.addLine(++last_line_id, last_point_id - 3, last_point_id - 1);
        this.addLine(++last_line_id, last_point_id - 2, last_point_id - 0);

        this.addLine(++last_line_id, last_point_id - 7, last_point_id - 6);
        this.addLine(++last_line_id, last_point_id - 4, last_point_id - 5);
        this.addLine(++last_line_id, last_point_id - 7, last_point_id - 5);
        this.addLine(++last_line_id, last_point_id - 6, last_point_id - 4);

        this.addLine(++last_line_id, last_point_id - 0, last_point_id - 4);
        this.addLine(++last_line_id, last_point_id - 1, last_point_id - 5);
        this.addLine(++last_line_id, last_point_id - 2, last_point_id - 6);
        this.addLine(++last_line_id, last_point_id - 3, last_point_id - 7);

        this.addLine(++last_line_id, last_point_id - 3, last_point_id - 4);
        this.addLine(++last_line_id, last_point_id - 2, last_point_id - 5);
        this.addLine(++last_line_id, last_point_id - 1, last_point_id - 6);
        this.addLine(++last_line_id, last_point_id - 0, last_point_id - 7);

        this.getBallById(last_point_id - 7).boxId = last_point_id - 7;
        this.getBallById(last_point_id - 6).boxId = last_point_id - 7;
        this.getBallById(last_point_id - 5).boxId = last_point_id - 7;
        this.getBallById(last_point_id - 4).boxId = last_point_id - 7;
        this.getBallById(last_point_id - 3).boxId = last_point_id - 7;
        this.getBallById(last_point_id - 2).boxId = last_point_id - 7;
        this.getBallById(last_point_id - 1).boxId = last_point_id - 7;
        this.getBallById(last_point_id - 0).boxId = last_point_id - 7;
        if (!this.DEBUG) {
            this.getBallById(last_point_id - 7).visible = false;
            this.getBallById(last_point_id - 6).visible = false;
            this.getBallById(last_point_id - 5).visible = false;
            this.getBallById(last_point_id - 4).visible = false;
            this.getBallById(last_point_id - 3).visible = false;
            this.getBallById(last_point_id - 2).visible = false;
            this.getBallById(last_point_id - 1).visible = false;
            this.getBallById(last_point_id).visible = false;
            // this.getLineById(last_line_id-5).visible = false;
            // this.getLineById(last_line_id-4).visible = false;
            this.getLineById(last_line_id - 3).visible = false;
            this.getLineById(last_line_id - 2).visible = false;
            this.getLineById(last_line_id - 1).visible = false;
            this.getLineById(last_line_id).visible = false;
        }

        this.boxes.push({ first_point_id: last_point_id - 7, size: w });
    },
    getNumberOfBoxes: function () {
        return this.boxes.length;
    },
    draw: function () {
        var ctx = this.canvas.getContext('2d');
        this.clearCanvas(ctx);
        this.drawBalls(ctx);
        this.drawLines(ctx);
        //this.drawTrack(ctx);
        this.drawGround(ctx);
        // this.drawBoxes(ctx);
    },
    projectTo2D: function (p) {
        var divider = p.z - this.camera.z;
        if (divider == 0) divider = .0001;
        var x = (p.x - this.camera.x) * this.camera.f / divider + this.w / 2;
        var y = this.h / 2 - (p.y - this.camera.y) * this.camera.f / divider;
        var r = p.r * this.camera.f / divider;
        // console.log(p.z);
        return { x: x, y: y, r: r };
    },
    clearCanvas: function (ctx) {
        ctx.lineWidth = 2;
        if (this.CLS_METHOD == 1) {
            var x, y;
            for (var i = 0; i < 200; i++) {
                x = Math.floor(Math.random() * this.w);
                y = Math.floor(Math.random() * this.h);
                ctx.clearRect(0, y, this.w, 2);
                ctx.clearRect(x, 0, 2, this.h);
            }
        } else if (this.CLS_METHOD == 2) {
            ctx.fillStyle = 'rgba(255,255,255,' + this.BLUR + ')';
            ctx.fillRect(0, 0, this.w, this.h);
        } else {
            ctx.clearRect(0, 0, this.w, this.h);
        }
    },
    drawBalls: function (ctx) {
        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            ctx.strokeStyle = '#000';
            if (p.collied && this.DEBUG) {
                ctx.strokeStyle = '#0f0';
            }
            if (p.visible) {
                var p2D = this.projectTo2D(p);
                ctx.beginPath();
                ctx.arc(p2D.x, p2D.y, p2D.r, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    },
    drawLines: function (ctx) {
        ctx.strokeStyle = '#f00';
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.active && line.visible) {
                ctx.beginPath();
                var p1 = this.getBallById(line.id1);
                var p2 = this.getBallById(line.id2);
                var p12D = this.projectTo2D(p1);
                var p22D = this.projectTo2D(p2);
                ctx.moveTo(p12D.x, p12D.y);
                ctx.lineTo(p22D.x, p22D.y);
                ctx.stroke();
            }
        }
    },
    drawTrack: function (ctx) {
        for (var i = 0; i < this.sections.length; i++) {
            var track = this.sections[i];
            var translate_x = track.x + this.camera.x;
            if (translate_x > -track.w && translate_x + track.w < this.w + track.w) {
                ctx.strokeStyle = '#00f';
                ctx.beginPath();
                ctx.moveTo(translate_x, this.h - this.camera.y);
                ctx.lineTo(translate_x, this.h - track.y - this.camera.y);
                ctx.lineTo(translate_x + track.w, this.h - track.y - track.h - this.camera.y);
                ctx.lineTo(translate_x + track.w, this.h - this.camera.y);
                ctx.stroke();
                if (i == 0) {
                    //flag
                    ctx.strokeStyle = '#444';
                    ctx.beginPath();
                    ctx.moveTo(translate_x, this.h - track.y - this.camera.y);
                    ctx.lineTo(translate_x, this.h - track.y - this.camera.y - 60);
                    ctx.lineTo(translate_x + 40, this.h - track.y - this.camera.y - 50);
                    ctx.lineTo(translate_x, this.h - track.y - this.camera.y - 40);
                    ctx.stroke();
                }
            }
        }
    },
    drawGround: function (ctx) {
        ctx.strokeStyle = '#080';
        ctx.beginPath();
        ctx.moveTo(0, this.h / 2);
        ctx.lineTo(this.w, this.h / 2);
        ctx.stroke();
    },
    drawBoxes: function (ctx) {
        ctx.strokeStyle = '#000';
        for (var i = 0; i < this.boxes.length; i++) {
            var box = this.boxes[i];
            var p1 = this.getBallById(box.first_point_id);
            var p2 = this.getBallById(box.first_point_id + 1);
            var p3 = this.getBallById(box.first_point_id + 2);
            var p4 = this.getBallById(box.first_point_id + 3);

            var c = { x: (p1.x + p2.x + p3.x + p4.x) / 4, y: (p1.y + p2.y + p3.y + p4.y) / 4 };
            var f = 2;
            var b1 = { x: c.x + (p1.x - c.x) * f, y: c.y + (p1.y - c.y) * f };
            var b2 = { x: c.x + (p2.x - c.x) * f, y: c.y + (p2.y - c.y) * f };
            var v = { x: b2.x - b1.x, y: b2.y - b1.y };
            var v_length = Math.sqrt(v.x * v.x + v.y * v.y);
            var v2 = { x: v.x / v_length * box.size * 2, y: v.y / v_length * box.size * 2 };

            ctx.beginPath();
            if (this.BOX_DRAW_METHOD == 0) {
                var b = [
                    { x: c.x + (p1.x - c.x) * f, y: c.y + (p1.y - c.y) * f },
                    { x: c.x + (p2.x - c.x) * f, y: c.y + (p2.y - c.y) * f },
                    { x: c.x + (p3.x - c.x) * f, y: c.y + (p3.y - c.y) * f },
                    { x: c.x + (p4.x - c.x) * f, y: c.y + (p4.y - c.y) * f },
                ];
                ctx.moveTo(b[0].x, b[0].y);
                ctx.lineTo(b[1].x, b[1].y);
                ctx.lineTo(b[3].x, b[3].y);
                ctx.lineTo(b[2].x, b[2].y);
                ctx.lineTo(b[0].x, b[0].y);
            }
            if (this.BOX_DRAW_METHOD == 1) {
                ctx.moveTo(b1.x + this.camera.x, this.h - b1.y - this.camera.y);
                ctx.lineTo(b1.x + v2.x + this.camera.x, this.h - (b1.y + v2.y) - this.camera.y);
                ctx.lineTo(b1.x + v2.x - v2.y + this.camera.x, this.h - (b1.y + v2.y + v2.x) - this.camera.y);
                ctx.lineTo(b1.x - v2.y + this.camera.x, this.h - (b1.y + v2.x) - this.camera.y);
                ctx.lineTo(b1.x + camera.x, this.h - b1.y - this.camera.y);
            }
            ctx.stroke();
        }
    },
    drawText: function (text, x, y) {
        var ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.font = "20px Arial";
        ctx.fillText(text, x, y);
    },
    collition: function () {
        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            p.collied = false;

            //with ground
            var p_other = this.getBallFromPlane(p);
            this.collitionHelper(p, p_other);

            //with track
            // for(var j=0; j<this.sections.length; j++){
            // var track = this.sections[j];
            // var translate_x = track.x;
            // if(p.x >= translate_x && p.x < translate_x + track.w){
            // var p_other = this.getBallFromSection(translate_x, track.y, track.w, track.h);
            // this.collitionHelper(p,p_other);
            // }
            // }

            //with each others
            for (var j = 0; j < this.points.length; j++) {
                var p_other = this.points[j];
                if (j != i && (p.boxId == 9999 || p.boxId != p_other.boxId) && p.getDistanceDiff(p_other) < 0) {
                    var v = p.getVector(p_other);
                    p.x += v.x * .5;
                    p.y += v.y * .5;
                    p.z += v.z * .5;
                    p.xv += v.x;
                    p.yv += v.y;
                    p.zv += v.z;
                    //p.xv *= .9;
                    //p.yv *= .9;
                    p.collied = true;
                }
            }
        }
    },
    collitionHelper: function (p, p_other) {
        if (p.getDistanceDiff(p_other) < 0) {
            var v = p.getVector(p_other);
            if (p.soft) {//bouncing
                p.x += v.x * this.SOFTNESS;
                p.y += v.y * this.SOFTNESS;
                p.z += v.z * this.SOFTNESS;
            } else {
                p.x += v.x;
                p.y += v.y;
                p.z += v.z;
            }
            p.xv += v.x;
            p.yv += v.y;
            p.zv += v.z;
            if (!p.wheel) {
                p.xv *= this.FRICTION;
                p.zv *= this.FRICTION;
            }
            p.collied = true;
        }
    },
    getBallFromPlane: function (p) {
        return { x: p.x, y: -MAG, z: p.z, r: MAG };
    },
    getBallFromSection: function (x, y, w, h) {
        var center = {
            x: x + w / 2 + h * this.MAG,
            y: y + h / 2 - w * this.MAG
        };//calculate center
        var vector = {
            x: x - center.x,
            y: y - center.y
        };
        var r = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
        return { x: center.x, y: center.y, r: r };
    },
    forces: function () {
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.active) {
                var p1 = this.getBallById(line.id1);
                var p2 = this.getBallById(line.id2);
                var newDistance = p1.getDistanceOfCenter(p2);
                var diff = newDistance - line.length;
                var xa = (p2.x - p1.x) / newDistance * diff;
                var ya = (p2.y - p1.y) / newDistance * diff;
                var za = (p2.z - p1.z) / newDistance * diff;
                if (!p1.fixed) {
                    p1.xv += xa / p1.linesCount;
                    p1.yv += ya / p1.linesCount;
                    p1.zv += za / p1.linesCount;
                }
                if (!p2.fixed) {
                    p2.xv -= xa / p2.linesCount;
                    p2.yv -= ya / p2.linesCount;
                    p2.zv -= za / p2.linesCount;
                }
            }
        }
        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            if (!p.fixed) {
                p.yv += this.GRAVITY;
                p.x += p.xv;
                p.y += p.yv;
                p.z += p.zv;
                p.xv *= this.AIR;//air resist
                p.yv *= this.AIR;
                p.zv *= this.AIR;
            }
        }
    },
    calculateLineConnectionsToBalls: function () {
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].linesCount = 0;
        }
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var p1 = this.getBallById(line.id1);
            var p2 = this.getBallById(line.id2);
            if (line.active) {
                p1.linesCount++;
                p2.linesCount++;
            }
        }
    },
    update: function () {
        this.camera.x = this.getBallById(this.camera.lookAt).x;
        this.camera.y = this.getBallById(this.camera.lookAt).y;
        this.camera.z = this.getBallById(this.camera.lookAt).z - this.camera.lookAtDistance;
        this.collition();
        this.forces();
    }
}