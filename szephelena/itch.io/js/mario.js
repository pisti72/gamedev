Mario = {
    map:[],
    actor:[],
    camera:{tile:'k',x:0,y:0},
    tile:12,
    gravity:.1,
    max_fall:2,
    pixel:4,
    background:'#000',
    charmap:' abcdefghijklmnopqrst',
    tileset:new Image(),
    setTileset:function(img){
        this.tileset.src = img.src;
    },
    setCanvas:function(ctx){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
    },
    addActor:function(t,x,y){
        var tile = this.tile;
        var a={
            tile:t,
            x:x * tile,
            y:y * tile,
            dx:0,
            dy:0,
            bound:{x:0,y:0,w:tile,h:tile}
        };
        this.actor.push(a);
    },
    getFirstActorByTile:function(t){
        for(var i=0;i<this.actor.length;i++){
            var a = this.actor[i];
            if(a.tile == t){
                return a;
            }
        }
    },
    setBackground:function(b){
        this.background = b;
    },
    setPixel:function(p){
        this.pixel = p;
    },
    setMapWidth:function(w){
        this.mw = w;
    },
    setMapHeight:function(h){
        this.mh = h;
    },
    setTileAt:function(t,x,y){
        this.map[x+y*this.mh] = t;
    },
    getTileAt:function(x,y){
        return this.map[x+y*this.mh];
    },
    setCamera:function(x,y){
        this.camera.x = x;
        this.camera.y = y;
    },
    update:function(){
        this.updateActors();
        this.drawMap();
        this.drawActors();
        this.followCamera();
    },
    drawMap:function(){
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0,0,this.w,this.h);
        for(var j=0;j<this.mh;j++){
            for(var i=0;i<this.mw;i++){
               var t = this.charmap.search(this.map[i+j*this.mh]);
               if( t > 0){
                   this.ctx.drawImage(this.tileset,
                    12 * (t-1),0,
                    this.tile, this.tile,
                    this.pixel * (this.tile * i - this.camera.x), this.pixel * (this.tile * j  - this.camera.y),
                    this.tile * this.pixel,    this.tile*this.pixel);
               }
            }
        }
        
    },
    updateActors:function(){
        //calculate forces
        for(var i=0;i<this.actor.length;i++){
            var a = this.actor[i];
            a.dy += this.gravity;
            if(a.dy>this.max_fall){a.dy=this.max_fall;}
            //collition with map
            var t = this.getTileAt(Math.floor((a.x+a.dx+this.tile/2)/this.tile), Math.floor((a.y+this.tile/2)/this.tile));
            if(t !=' '){
                a.dx = 0;
            }
            t = this.getTileAt(Math.floor((a.x + this.tile/2)/this.tile), Math.floor((a.y+a.dy+this.tile)/this.tile));
            if(t !=' '){
                a.dy = 0;
            }
            //apply forces
            a.x += a.dx;
            a.y += a.dy;
            
        }
    },
    drawActors:function(){
        for(var i=0;i<this.actor.length;i++){
            var a = this.actor[i];
            var t = this.charmap.search(a.tile);
            this.ctx.drawImage(this.tileset,
            12 * (t-1),0,
            this.tile, this.tile,
            this.pixel * (a.x - this.camera.x),this.pixel * (a.y  - this.camera.y),
            this.tile * this.pixel,    this.tile*this.pixel);               
        }
    },
    followCamera:function(){
        var actor = this.getFirstActorByTile(this.camera.tile);
        this.camera.x = actor.x-80;
        this.camera.y = actor.y-80;
    }
}