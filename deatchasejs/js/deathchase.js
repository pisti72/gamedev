 const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var trees =[];
var moto=0;
// Add your code here matching the playground format
const createScene = function () {

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0.8, 1);

    //scene.debugLayer.show();
    
    BABYLON.SceneLoader.ImportMeshAsync("", "./assets/", "scene.obj").then((result) => {
      const tree = scene.getMeshByName("Tree_Cylinder");
      for (var i=0;i<100;i++){
         t = tree.clone();
         t.position.x = (i%10)*10-50;
         t.position.z = Math.floor(i/10)*10-50;
      }
      const ground = scene.getMeshByName("Ground_Plane");
      ground.scaling.x = 5;
      ground.scaling.z = 5;
      
    });

    //const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 1, 0));
    const camera = new BABYLON.FollowCamera("FollowCamera", new BABYLON.Vector3(0, 0, 0), scene)
    //const camera = new BABYLON.DeviceOrientationCamera("FollowCamera", new BABYLON.Vector3(0, 0, 0), scene)
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    //camera.setTarget(BABYLON.Vector3.Zero());
    camera.rotationOffset = 0;
    //camera.attachControl(canvas, true);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * .9;
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 0, 0));
    

    var xd = 0;
    var speed = 0;
    scene.registerAfterRender(function () {
        var moto = scene.getMeshByName("Motor_Torus");
        var ground = scene.getMeshByName("Ground_Plane");
        var camera2 = scene.getMeshByName("Camera_Cube");
        //camera.position.x = moto.position.x;
        //camera.position.z = moto.position.z;
        //if(moto && ground){
            //moto.moveWithCollisions(xd);
            moto.movePOV(0,0,-speed);
            moto.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(xd * speed * 15), BABYLON.Space.LOCAL);
            camera.lockedTarget = moto;
            ground.position = moto.position;
            
        //}
     
    });

    scene.onKeyboardObservable.add((kbInfo) => {
        var key = kbInfo.event.keyCode;
        
        switch (kbInfo.type) {
  
        case BABYLON.KeyboardEventTypes.KEYDOWN:
          if ( key == 65){
            xd = -0.5;
          }
          if (key == 68){
            xd = 0.5;
          }
          if ( key == 87){
            speed += 0.1;
            if(speed>1){
              speed=1;
            }
            console.log(speed);
          }
          if ( key == 83){
            speed -= 0.1;
            if(speed<0){
                speed=0;
            }
          }
          console.log("KEY DOWN: ", kbInfo.event.keyCode);
          break;
        case BABYLON.KeyboardEventTypes.KEYUP:
          
          if (key == 65 || key == 68){
                xd = 0;
            }   
          console.log("KEY UP: ", kbInfo.event.code);
          break;
      }
    });

    return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        //document.getElementById('debug').innerHTML=scene.camera.position.x;
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
