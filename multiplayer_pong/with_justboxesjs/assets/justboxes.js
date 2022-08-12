JustBoxes={
  INFINITY:9999,
  actors:[],
  addActor: function (name,left,top,w,h){
    let actor={
      name:name,
      left:left,
      top:top,
      x:left + w/2,
      y:top + h/2,
      w:w,
      h:h,
      m:w*h,
      xv:0,
      yv:0,
      overlapped:false,
      xforce:0,
      yforce:0,
      friction:0,
      score:0,
      fixed:false
    }
    this.actors.push(actor);
  },
  getActorByName: function (name){
    for(let i=0;i<this.actors.length;i++){
      if(this.actors[i].name == name){
        return this.actors[i];
      }
    }
  },
  updateActors: function (){
    //calculate forces
    for(let i=0;i<this.actors.length;i++){
      let actor = this.actors[i];
      actor.overlapped = false;
    }
    for(let i=0;i<this.actors.length;i++){
      let actor = this.actors[i];
      for(let j=0;j<this.actors.length;j++){
        let actor2 = this.actors[j];
        if(i != j){
          let ol = this.overlap(actor,actor2);
          if(ol.x !=0 || ol.y != 0){
            actor.overlapped = true;
            //actor2.ovelapped = true;
            if(ol.y != 0){
              actor.yv += (ol.y/actor.m)*1000;
            }
            if(ol.x != 0){
              actor.xv += (ol.x/actor.m)*1000;
            }
            
            //actor.yforce = 0;
            //actor.xv = 0;
            //actor.yv = 0;
          }
          /*
          if(this.isOverlappedX(actor,actor2)){
            let mu = actor.m * actor.xv + actor2.m * actor2.xv;
            let u = mu/(actor.m + actor2.m);
            actor.xv = 2 * u - actor.xv;
            actor2.xv = 2 * u - actor2.xv;
            
            u = actor2.yv - actor.yv;
            actor.yv += u/2;
            actor2.yv -= u/2;
          }
          
          if(this.isOverlappedY(actor,actor2)){
            let mu = actor.m * actor.yv + actor2.m * actor2.yv;
            let u = mu/(actor.m + actor2.m);
            actor.yv = 2 * u - actor.yv;
            actor2.yv = 2 * u - actor2.yv;
            */
          }
      }
      //apply moves
      if(actor.fixed){
        actor.xv = 0;
        actor.yv = 0;
      }else{
        actor.xv += actor.xforce;
        actor.yv += actor.yforce;
        actor.xv *= 1-actor.friction;
        actor.yv *= 1-actor.friction;
        actor.x += actor.xv;
        actor.y += actor.yv;
      }
      actor.left = actor.x - actor.w/2;
      actor.top = actor.y - actor.h/2;
    }
  },
  overlap: function(a,b){
    let x=y=0;
    let xisinside = (Math.abs(a.x - b.x) < (a.w + b.w)/2);
    let yisinside = (Math.abs(a.y - b.y) < (a.h + b.h)/2);
    
    if(xisinside && yisinside){
      y = a.y - b.y;
      x = a.x - b.x;
      if(Math.abs(x) < Math.abs(y)){
        y=0;
      }else{
        x=0;
      }
    }
    
    return {x:x, y:y}
  },
  isOverlappedX: function (actor,actor2){
    let a={
      x:actor.x + actor.xv,
      y:actor.y,
      w:actor.w,
      h:actor.h
    }
    return this.isOverlapped(a,actor2);
  },
  isOverlappedY: function (actor,actor2){
    let a={
      x:actor.x,
      y:actor.y + actor.yv,
      w:actor.w,
      h:actor.h
    }
    return this.isOverlapped(a,actor2);
  },
  isOverlapped: function (a,b){
    if(a.x > b.x && a.x < b.x + b.w){
      if(a.y > b.y && a.y < b.y + b.h){ 
        return true;
      }
    }
    if(a.x + a.w > b.x && a.x + a.w < b.x + b.w){
      if(a.y > b.y && a.y < b.y + b.h){ 
        return true;
      }
    }
    if(a.x > b.x && a.x < b.x + b.w){
      if(a.y + a.h > b.y && a.y + a.h < b.y + b.h){ 
        return true;
      }
    }
    if(a.x + a.w > b.x && a.x + a.w < b.x + b.w){
      if(a.y + a.h > b.y && a.y + a.h < b.y + b.h){ 
        return true;
      }
    }
    return false;
  },
  getAllActors: function(){
    return this.actors;
  }
}
