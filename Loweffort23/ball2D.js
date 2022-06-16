var Ball2D = {
	version:0.1,
	balls:[],
	friction:.7,
	gravity:.3,
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
	add:function(x,y,d,fixed,name,offset){
		var ball={
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
		this.balls.push(ball);
	},
	remove:function(ball){
				for(let i=0;i<this.balls.length;i++){
					if(ball.x == this.balls[i].x && ball.y == this.balls[i].y){
						this.balls.splice(i,1);
					}
				}
			},
	notvisible:function(){
		this.balls[this.balls.length-1].visible = false;
	},
	set:function(n,x,y){
		this.balls[n].x = x;
		this.balls[n].y = y;
	},
	getAll:function(){
		return this.balls;
	},
	update:function(){
		//forces
		for(let i=0;i<this.balls.length;i++){
			let ball = this.balls[i];
			for(let j=0;j<this.balls.length;j++){
				let ball2 = this.balls[j];
				if(j!=i){
					if(this.overlapped(ball,ball2)){
						let force = this.force(ball,ball2);
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
	force:function(a,b){
		let xd = a.x - b.x;
		let yd = a.y - b.y;
		let distance = Math.sqrt(xd*xd+yd*yd);//small
		let min_distance = a.r + b.r;
		let diff_distance = min_distance - distance;
		let ratio = diff_distance/distance;
		let x = -xd*ratio/2;
		let y = -yd*ratio/2;
		return {x:x,y:y}
	},
	debug:function(){
		return "balls:" + this.balls.length;
	}
}
