const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x69f3ef );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const loader = new THREE.ObjectLoader();

var scene2={};
var trees = [];
var grounds = [];
var tree = {};
var ground = {};
var numberOfTrees = 1000;
var numberOfGround = 200;
const DISTANCE = 100;
const DISTANCE_LOW = DISTANCE - 10;
var player={
	position : new THREE.Vector3(0,1,0),
	rotation: 0,
	rotationd: 0,
	speed : .2,
	velocity : 0,
	max_velocity : 1,
	acceleration: 0,
	force: .01}


//console.log(THREE.MathUtils.randFloat(-100,100));

loader.load(
	// resource URL
	"assets/scene.json",

	// onLoad callback
	// Here the loaded data is assumed to be an object
	function ( obj ) {
		// Add the loaded object to the scene
		scene2 = obj;
		
		tree = scene2.getObjectByName("Tree");
		ground = scene2.getObjectByName("Ground");
		ground.scale.x = 5;
		ground.scale.y = 5;
		//console.log (ground.scale.z)
		scene2.remove(tree);
		scene.add( scene2 );
		for(var i=0;i<numberOfTrees;i++){
			trees.push(tree.clone());
		}
		for(var i=0;i<trees.length;i++){
			trees[i].position.x = THREE.MathUtils.randFloat(-DISTANCE,DISTANCE);
			trees[i].position.z = THREE.MathUtils.randFloat(-DISTANCE,DISTANCE);
			trees[i].rotation.z = THREE.MathUtils.randFloat(0,10);
			scene.add( trees[i] );
		}
		for(var i=0;i<numberOfGround;i++){
			grounds.push(ground.clone());
		}
        for(var i=0;i<grounds.length;i++){
            grounds[i].position.x = (i%10)*73.6;
            grounds[i].position.z = Math.floor(i/10)*73.6;
            scene.add( grounds[i] );
        }
		
		
		console.log(scene2.getObjectByName("Tree").clone);
	},

	// onProgress callback
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.error( 'An error happened' );
	}
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

//const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
//scene.add( directionalLight );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
//const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

window.onresize = function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};

document.addEventListener('keypress', keypress);
document.addEventListener('keyup', keyrelease);

function keypress(e) {
  if(e.code=='KeyW'){
	 player.acceleration = player.force;
  };
  if(e.code=='KeyS'){
	 player.acceleration = -player.force;
  };
  if(e.code=='KeyA'){
	 player.rotationd = player.speed*0.1;
  };
  if(e.code=='KeyD'){
	 player.rotationd = -player.speed*0.1;
  };
}

function keyrelease(e) {
  if(e.code=='KeyW' || e.code=='KeyS'){
	player.acceleration = 0;
  };
  if(e.code=='KeyA' || e.code=='KeyD'){
	player.rotationd = 0;
  };
}


function animate() {
	requestAnimationFrame( animate );
	player.velocity += player.acceleration;
	if(player.velocity<0){
		player.velocity = 0;
	}else if(player.velocity>player.max_velocity){
		player.velocity=player.max_velocity;
	}
	
	
	var velocity3D = new THREE.Vector3(0, 0, -player.velocity);
	velocity3D = velocity3D.applyAxisAngle( new THREE.Vector3(0, 1, 0), player.rotation);
	player.position = player.position.add(velocity3D);
	player.rotation += player.rotationd;
	camera.position.copy(player.position);
	camera.rotation.y = player.rotation;
	
	renderer.render( scene, camera );
	for(var i=0;i<trees.length;i++){
		//trees repositioning
		if(trees[i].position.distanceToSquared(camera.position)>DISTANCE * DISTANCE){
			//console.log("repositioned");
            var x = THREE.MathUtils.randFloat(camera.position.x-DISTANCE,camera.position.x+DISTANCE);
            var z = THREE.MathUtils.randFloat(camera.position.z-DISTANCE,camera.position.z+DISTANCE);
            var distance = (z-camera.position.z)*(z-camera.position.z) + (x-camera.position.x)*(x-camera.position.x);            
            if ((distance < DISTANCE*DISTANCE) && (distance > DISTANCE_LOW*DISTANCE_LOW)){
			    trees[i].position.x = x;
			    trees[i].position.z = z;
			    trees[i].rotation.z = THREE.MathUtils.randFloat(0,10);
            }
		}
		//collition
		if(trees[i].position.distanceToSquared(camera.position)<(1.3 * 1.3)){
			player.velocity = 0;
		}
	}
};

animate();
