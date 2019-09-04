var TinyPhysic2D = {
    GRV: .2,
    FRC: .1,
    RGD: .3,
    BLUR: .8,
    AIR:.998,
    MAG: 24,
    BALL_IN_BOX:.5, 
    BOX_DRAW_METHOD: 0,
    CLS_METHOD:0,
    DEBUG: false,
    w:0,
    h:0,
    camera:{x:0,y:0,lookTo:0},
    lookTo:function(ballId){
        this.camera.lookTo = ballId; 
    },
    canvas:{},
    ctx:{},
    points:[],
    lines:[],
    sections:[],
    boxes:[],
    init:function(){
        this.canvas = document.getElementById('c');
        this.w = this.canvas.width = document.body.clientWidth;
        this.h = this.canvas.height = document.body.clientHeight-20;
        //create canvas here somehow
    },
    addBall:function(id,r,x,y,fixed,hardness){
        var ball = {
            id:id, 
            r:r, 
            x:x, 
            y:y, 
            fixed:fixed,
            hardness:hardness,
            xv:0, 
            yv:0, 
            collied:false, 
            linesCount:0, 
            visible:true,
            getDistanceDiff:function(p){
                return Math.sqrt((p.x-this.x)*(p.x-this.x)+(p.y-this.y)*(p.y-this.y))-this.r-p.r;
            },
            getVector:function(p){
                var distancePoints =  Math.sqrt((p.x-this.x)*(p.x-this.x)+(p.y-this.y)*(p.y-this.y));
                var diff = (p.r + this.r) - distancePoints;
                var xd = (this.x - p.x) / distancePoints * diff;
                var yd = (this.y - p.y) / distancePoints * diff;
                return {x:xd,y:yd};
            },
            getDistanceOfCenter:function(p){
                var x = p.x - this.x;
                var y = p.y - this.y;
                return Math.sqrt(x*x+y*y);
            }
        };
        this.points.push(ball);
    },
    getBallById:function(id){
        for(var i=0; i<this.points.length; i++){
            var point = this.points[i]
            if(point.id == id){return point;}
        }
    },
    notConnected:function(p,p_other){
        for(var i=0;i<this.lines.length;i++){
            var line = this.lines[i];
            if(line.id1 == p.id && line.id2 == p_other.id)return false;
            if(line.id1 == p_other.id && line.id2 == p.id)return false;
        }
        return true;
    },
    addLine:function(id,id1,id2){
        var p1 = this.getBallById(id1);
        var p2 = this.getBallById(id2);
        var line = {
            id:id, 
            id1:id1, 
            id2:id2, 
            length:Math.sqrt((p1.x - p2.x)*(p1.x - p2.x)+(p1.y - p2.y)*(p1.y - p2.y)), 
            active:true, 
            visible:true};
        this.lines.push(line);
    },
    getLineById:function (id){
        for(var i=0; i<this.lines.length; i++){
            if(this.lines[i].id == id){
                return this.lines[i];
            }
        }
    },
    disableLine:function(id){
        this.getLineById(id).active = false;
    },
    addTrack:function(x, y, w, h){
        var track = {x:x, y:y, w:w, h:h};
        this.sections.push(track);
    },
    addBox:function(x, y, w){
        var last_point_id = 0;
        var last_line_id = 0;
        var ball_size = w * this.BALL_IN_BOX;
        for(var i=0; i<this.points.length; i++){
            if(this.points[i].id > last_point_id){
                last_point_id = this.points[i].id;
            }
        }
        for(var i=0; i<this.lines.length; i++){
            if(this.lines[i].id > last_line_id){
                last_line_id = this.lines[i].id;
            }
        }
        this.addBall(++last_point_id,ball_size,x+w/2,y+w/2,false,0);
        this.addBall(++last_point_id,ball_size,x+w*1.5,y+w/2,false,0);
        this.addBall(++last_point_id,ball_size,x+w/2,y+w*1.5,false,0);
        this.addBall(++last_point_id,ball_size,x+w*1.5,y+w*1.5,false,0);
        this.addLine(++last_line_id,last_point_id-3,last_point_id-2);
        this.addLine(++last_line_id,last_point_id-0,last_point_id-1);
        this.addLine(++last_line_id,last_point_id-3,last_point_id-1);
        this.addLine(++last_line_id,last_point_id-2,last_point_id-0);
        this.addLine(++last_line_id,last_point_id-3,last_point_id-0);
        this.addLine(++last_line_id,last_point_id-2,last_point_id-1);
        if(!this.DEBUG){
            this.getBallById(last_point_id-3).visible = false;
            this.getBallById(last_point_id-2).visible = false;
            this.getBallById(last_point_id-1).visible = false;
            this.getBallById(last_point_id).visible = false;
            this.getLineById(last_line_id-5).visible = false;
            this.getLineById(last_line_id-4).visible = false;
            this.getLineById(last_line_id-3).visible = false;
            this.getLineById(last_line_id-2).visible = false;
            this.getLineById(last_line_id-1).visible = false;
            this.getLineById(last_line_id).visible = false;
        }
        this.boxes.push({first_point_id:last_point_id-3,size:w});
    },
    draw:function(){
        var ctx = this.canvas.getContext('2d');
        this.clearCanvas(ctx);
        this.drawBalls(ctx);
        this.drawLines(ctx);
        this.drawTrack(ctx);
        this.drawGround(ctx);
        this.drawBoxes(ctx);
    },
    clearCanvas:function(ctx){
        ctx.lineWidth = 2;
        if(this.CLS_METHOD == 1){
            var x,y;
            for(var i=0; i<200; i++){
                x = Math.floor(Math.random()*this.w);
                y = Math.floor(Math.random()*this.h);
                ctx.clearRect(0, y, this.w, 2);
                ctx.clearRect(x, 0, 2, this.h);
            }
        }else if(this.CLS_METHOD == 2){
            ctx.fillStyle = 'rgba(255,255,255,'+this.BLUR+')';
            ctx.fillRect(0,0,this.w,this.h);
        }else{
            ctx.clearRect(0, 0, this.w, this.h);
        }
    },
    drawBalls:function(ctx){
        for(var i=0; i<this.points.length; i++){
            var p = this.points[i];
            ctx.strokeStyle = '#000';
            if(p.collied && this.DEBUG){
                ctx.strokeStyle = '#0f0';
            }
            if(p.visible){
                ctx.beginPath();
                ctx.arc(p.x + this.camera.x, this.h - p.y - this.camera.y, p.r, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
    },
    drawLines:function(ctx){
        ctx.strokeStyle = '#f00';
        for(var i=0; i<this.lines.length; i++){
            var line = this.lines[i];
            if(line.active && line.visible){
                ctx.beginPath();
                var p1 = this.getBallById(line.id1);
                var p2 = this.getBallById(line.id2);
                ctx.moveTo(p1.x + this.camera.x, this.h - p1.y - this.camera.y);
                ctx.lineTo(p2.x + this.camera.x, this.h - p2.y - this.camera.y);
                ctx.stroke();
            }
        }
    },
    drawTrack:function(ctx){
        for(var i=0; i<this.sections.length; i++){
            var track = this.sections[i];
            var translate_x = track.x + this.camera.x;
            if(translate_x > -track.w && translate_x + track.w < this.w + track.w){  
                ctx.strokeStyle = '#00f';
                ctx.beginPath();
                ctx.moveTo(translate_x, this.h - this.camera.y);
                ctx.lineTo(translate_x, this.h - track.y - this.camera.y);
                ctx.lineTo(translate_x + track.w, this.h - track.y - track.h - this.camera.y);
                ctx.lineTo(translate_x + track.w, this.h - this.camera.y);
                ctx.stroke();
                if(i==0){
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
    drawGround:function(ctx){
        ctx.strokeStyle = '#080';
        ctx.beginPath();
        ctx.moveTo(0,this.h - this.camera.y);
        ctx.lineTo(this.w,this.h - this.camera.y);
        ctx.stroke();
    },
    drawBoxes:function(ctx){
        ctx.strokeStyle = '#000';
        for(var i=0;i<this.boxes.length;i++){
            var box = this.boxes[i];
            var p1 = this.getBallById(box.first_point_id);
            var p2 = this.getBallById(box.first_point_id+1);
            var p3 = this.getBallById(box.first_point_id+2);
            var p4 = this.getBallById(box.first_point_id+3);
            
            var c = {x:(p1.x+p2.x+p3.x+p4.x)/4,y:(p1.y+p2.y+p3.y+p4.y)/4};
            var f = this.BALL_IN_BOX * 2 + 1;
            var b1 = {x:c.x+(p1.x-c.x)*f, y:c.y+(p1.y-c.y)*f};
            var b2 = {x:c.x+(p2.x-c.x)*f, y:c.y+(p2.y-c.y)*f};
            var v = {x:b2.x-b1.x,y:b2.y-b1.y};
            var v_length = Math.sqrt(v.x*v.x+v.y*v.y);
            var v2 = {x:v.x/v_length*box.size*2 , y:v.y/v_length*box.size*2};
            
            ctx.beginPath();
            if(this.BOX_DRAW_METHOD == 0){
                var b = [
                    {x:c.x+(p1.x-c.x)*f, y:c.y+(p1.y-c.y)*f},
                    {x:c.x+(p2.x-c.x)*f, y:c.y+(p2.y-c.y)*f},
                    {x:c.x+(p3.x-c.x)*f, y:c.y+(p3.y-c.y)*f},
                    {x:c.x+(p4.x-c.x)*f, y:c.y+(p4.y-c.y)*f},
                ];
                ctx.moveTo(b[0].x + this.camera.x, this.h - b[0].y - this.camera.y);
                ctx.lineTo(b[1].x + this.camera.x, this.h - b[1].y - this.camera.y);
                ctx.lineTo(b[3].x + this.camera.x, this.h - b[3].y - this.camera.y);
                ctx.lineTo(b[2].x + this.camera.x, this.h - b[2].y - this.camera.y);
                ctx.lineTo(b[0].x + this.camera.x, this.h - b[0].y - this.camera.y);
            }
            if(this.BOX_DRAW_METHOD == 1){
                ctx.moveTo(b1.x + this.camera.x, this.h - b1.y - this.camera.y);
                ctx.lineTo(b1.x + v2.x + this.camera.x, this.h - (b1.y+v2.y) - this.camera.y);
                ctx.lineTo(b1.x + v2.x - v2.y + this.camera.x, this.h - (b1.y+v2.y+v2.x) - this.camera.y);
                ctx.lineTo(b1.x - v2.y + this.camera.x, this.h - (b1.y+v2.x) - this.camera.y);
                ctx.lineTo(b1.x + camera.x, this.h - b1.y - this.camera.y);
            }
            ctx.stroke();
        }
    },
    drawText:function(text,x,y){
        var ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.font = "20px Arial";
        ctx.fillText(text, x, y);
    },
    collition:function(){
        for(var i=0; i<this.points.length; i++){
            var p = this.points[i];
            p.collied = false;
            //with ground
            if(p.y-p.r<0){
                p.y -=p.y-p.r;
                p.yv=-(p.y-p.r)*.6;
                p.collied = true;
                if(p.id!=102 && p.id!=103 && p.id != 106){// friction if p not front and not rear wheel
                    p.xv *= .9;
                }
            }
            //with track
            
            for(var j=0; j<this.sections.length; j++){
                var track = this.sections[j];
                var translate_x = track.x;
                if(p.x >= translate_x && p.x < translate_x + track.w){
                    var p_other = this.getBallFromSection(translate_x, track.y, track.w, track.h);
                    if(p.getDistanceDiff(p_other) < 0){
                        var v = p.getVector(p_other);
                        if(p.id == 106){//bouncing
                            p.x += v.x * .1;
                            p.y += v.y * .1;
                        }else{
                            p.x += v.x;
                            p.y += v.y;
                        }
                        p.xv += v.x;
                        p.yv += v.y;
                        if(p.id!=102 && p.id!=103 && p.id != 106){// friction
                            p.xv *= .9;
                        }
                        p.collied = true;
                    }
                }
            }
            
            //with others
            for(var j=0; j<this.points.length; j++){
                var p_other = this.points[j];
                if(j!=i && this.notConnected(p,p_other) && p.getDistanceDiff(p_other) < 0){
                    var v = p.getVector(p_other);
                    p.x += v.x * .5;
                    p.y += v.y * .5;
                    p.xv += v.x;
                    p.yv += v.y;
                    //p.xv *= .9;
                    //p.yv *= .9;
                    p.collied = true;
                }
            }
        }
    },
    getBallFromSection:function(x, y, w, h){
        const M = 100;
        var center = {
            x: x + w/2 + h*M,
            y: y + h/2 - w*M};//calculate center
        var vector = {
            x: x - center.x,
            y: y - center.y};
        var r = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        return {x: center.x, y: center.y, r: r};
    },
    forces:function(){
        for(var i=0; i<this.points.length; i++){
            this.points[i].linesCount = 0;
        }
        for(var i=0; i<this.lines.length; i++){
            var line = this.lines[i];
            var p1 = this.getBallById(line.id1);
            var p2 = this.getBallById(line.id2);
            if(line.active){
                p1.linesCount++;
                p2.linesCount++;
            }
        }
        for(var i=0; i<this.lines.length; i++){
            var line = this.lines[i];
            if(line.active){
                var p1 = this.getBallById(line.id1);
                var p2 = this.getBallById(line.id2);
                var newDistance = p1.getDistanceOfCenter(p2);
                var diff = newDistance - line.length;
                var xa = (p2.x - p1.x) / newDistance * diff;
                var ya = (p2.y - p1.y) / newDistance * diff;
                if(!p1.fixed){
                    p1.xv += xa / p1.linesCount;
                    p1.yv += ya / p1.linesCount;
                }
                if(!p2.fixed){
                    p2.xv -= xa / p2.linesCount;
                    p2.yv -= ya / p2.linesCount;
                }
            }
        }
        for(var i=0; i<this.points.length; i++){
            var p = this.points[i];
            if(!p.fixed){
                p.yv -= this.GRV;
                p.x += p.xv;
                p.y += p.yv;
                p.xv *= this.AIR;//air resist
                p.yv *= this.AIR;
            }
        }
    },
    update:function(){
        this.camera.x = -this.getBallById(this.camera.lookTo).x + this.w/2;
        this.camera.y = -this.getBallById(this.camera.lookTo).y + this.h/2;
        this.collition();
        this.forces();
    }
}