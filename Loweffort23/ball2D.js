var Ball2D = {
	version:0.1,
	balls:[],
	rods:[],
	friction:.7,
	gravity:.3,
	id:0,
	hardness:.5,//0.1-very soft, 0.5-good, 1-rigid
	AABB:{
		left:-9999,
		right:9999,
		top:-9999,
		bottom:9999
	},
	setAABB:function(left,right,top,bottom){
		this.AABB.left = left;
		this.AABB.right = right;
		this.AABB.top = top;
		this.AABB.bottom = bottom;
	},
	addBall:function(x,y,d,fixed,name,offset){
		let ball={
			id:this.id,
			x:x,
			y:y,
			d:d,
			r:d/2,
			visible:true,
			fixed:fixed,
			offset:offset,
			xv:0,
			yv:0,
			name:name,
			spin:0,
			spinv:0
		}
		this.id++;
		this.balls.push(ball);
		return ball;
	},
	removeBall:function(ball){
		for(let i=0;i<this.balls.length;i++){
			if(ball.id == this.balls[i].id){
				this.balls.splice(i,1);
			}
		}
	},
	addRod:function(ball1,ball2){
		let xd = ball1.x - ball2.x;
		let yd = ball1.y - ball2.y;
		let rod={
			ball1:ball1,
			ball2:ball2,
			distance:Math.sqrt(xd*xd+yd*yd)
		}
		this.rods.push(rod);
	},
	notvisible:function(){
		this.balls[this.balls.length-1].visible = false;
	},
	set:function(n,x,y){
		this.balls[n].x = x;
		this.balls[n].y = y;
	},
	getAllBalls:function(){
		return this.balls;
	},
	getBallById:function(id){
		for(let i=0;i<this.balls.length;i++){
			if(this.balls[i].id == id){
				return this.balls[i];
			}
		}
		return false;
	},
	getAllRods:function(){
		return this.rods;
	},
	update:function(){
		//forces
		for(let i=0;i<this.balls.length;i++){
			let ball = this.balls[i];
			for(let j=0;j<this.balls.length;j++){
				let ball2 = this.balls[j];
				if(j!=i){
					let connected = this.getRod(ball,ball2);
					if(this.overlapped(ball,ball2) || connected.result){
						let force;
						if(connected.result){
							force = this.force(ball,ball2,true,connected.distance);
						}else{
							force = this.force(ball,ball2,false,0);
						}
						ball2.xv += force.x * this.friction;
						ball2.yv += force.y * this.friction;
						ball2.spinv = (ball.spinv + ball2.spinv)/2;
						
						ball2.spinv += (force.x + force.y) / ball2.r/Math.PI/2;
						//ball2.spinv -= Math.sqrt(force.x*force.x+force.y*force.y)/ball2.r/Math.PI/2;
						if (ball2.fixed){
							ball2.xv = 0;
							ball2.yv = 0;
							ball2.spinv = 0;
						}
					}
				}
			}
			ball.yv += this.gravity;
			if(ball.y + ball.r + ball.yv > this.AABB.bottom || ball.y - ball.r + ball.yv < this.AABB.top){
				ball.xv *= this.friction;
				ball.yv *= -this.friction;
				ball.spinv = ball.xv/ball.r/Math.PI/2;
			}
			if(ball.x + ball.r + ball.xv > this.AABB.right || ball.x - ball.r + ball.xv < this.AABB.left){
				ball.xv *= -this.friction;
				ball.spinv = ball.yv/ball.r/Math.PI/2;
			}
			if (ball.fixed){
				ball.xv=0;
				ball.yv=0;
				ball.spinv=0;
			}
		}
		//apply forces
		for(let i=0;i<this.balls.length;i++){
			let ball = this.balls[i];
			//if(!ball.fixed){
				ball.x += ball.xv;
				ball.y += ball.yv;
				ball.spin += ball.spinv;
			//}
			if(ball.x-ball.r < this.AABB.left){
				ball.x = this.AABB.left + ball.r;
			}else if(ball.x + ball.r > this.AABB.right){
				ball.x = this.AABB.right - ball.r;
			}
			if(ball.y < this.AABB.top){
				ball.y = this.AABB.top;
			}else if(ball.y + ball.r > this.AABB.bottom){
				ball.y = this.AABB.bottom - ball.r;
			}
		}
		
	},
	overlapped:function(a,b){
		let xd = a.x - b.x;
		let yd = a.y - b.y;
		let rd = a.r + b.r;
		return xd*xd+yd*yd<rd*rd;
	},
	getRod:function(a,b){
		for(let i=0;i<this.rods.length;i++){
			let b1 = this.rods[i].ball1;
			let b2 = this.rods[i].ball2;			
			if((b1.id == a.id) && (b2.id == b.id)){
				return {result:true, distance:this.rods[i].distance};
			}else if((b1.id == b.id) && (b2.id == a.id)){
				//return {result:false};
				return {result:true, distance:this.rods[i].distance};
			}
		}
		return {result:false};
	},
	force:function(a,b,connected,required_distance){
		let xd = a.x - b.x;
		let yd = a.y - b.y;
		let distance = Math.sqrt(xd*xd+yd*yd);//small
		let min_distance = a.r + b.r;
		if(connected){
			min_distance = required_distance;
		}
		let diff_distance = min_distance - distance;
		let ratio = diff_distance/distance;
		let x = -xd*ratio*this.hardness;
		let y = -yd*ratio*this.hardness;
		return {x:x,y:y}
	},
	debug:function(){
		return "balls:" + this.balls.length;
	}
}
