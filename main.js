var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
var createScene = function() {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // VR Camera
    //var vrHelper = scene.createDefaultVRExperience();
    

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -1), scene);
    var camera2 = new BABYLON.WebVRFreeCamera("camera2", new BABYLON.Vector3(0, 5, -1), scene);
    
    camera.inputs.addGamepad();

    // This targets the camera to scene origin
    //camera.setTarget(BABYLON.Vector3.Zero());
    
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera2.attachControl(canvas,true);
    // Set camera speed
    camera.speed = 0.5;
    camera2.speed = 0.5;


    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    //import maze from github, and add to scene
    var baseURL = "https://raw.githubusercontent.com/WeibelLab-Teaching/CSE_218_118_Fa20_Team_N/main/src/assets/";
    var cm = "thinMaze.glb";
    BABYLON.SceneLoader.ImportMesh("", baseURL, cm, scene );
    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

    // Skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    var skyBoxURL = baseURL + "/nebula/nebula";
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(skyBoxURL, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Gravity
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    camera.applyGravity = false;
    camera2.applyGravity = false;
    
    // camera collision hitbox
    camera.ellipsoid = new BABYLON.Vector3(1, 3, 1);
    camera2.ellipsoid = new BABYLON.Vector3(1, 3, 1);

    // Enable collisions
    BABYLON.Mesh.checkCollisions = true;
    scene.collisionsEnabled = true;
    camera.checkCollisions = true;
    camera2.checkCollisions = true;
    ground.checkCollisions = true;

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var stackPanel = new BABYLON.GUI.StackPanel();
    stackPanel.isVertical = false;
    stackPanel.height = "100px";
    //stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    stackPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

    var stackOutside = new BABYLON.GUI.StackPanel();
    //stackOutside.isVertical = false;
    stackOutside.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    //stackOutside.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    stackOutside.addControl(stackPanel)

    advancedTexture.addControl(stackOutside);  

    /*
    var button = BABYLON.GUI.Button.CreateImageOnlyButton("but", "Gravity");
    button.paddingBottomInPixels = 
    button.width = "80px";
    button.height = "80px";
    button.color = "transparent"
    button.onPointerUpObservable.add(function() {
        alert("button");
    });*/


    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Gravity");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        if(camera.applyGravity == true){
            camera.applyGravity = false;
            camera2.applyGravity = false;
        }else{
            camera.applyGravity = true;
            camera2.applyGravity = true;
        }
    });
    stackPanel.addControl(button1);
    
    var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Camera");
    button2.width = "150px"
    button2.height = "40px";
    button2.color = "white";
    button2.cornerRadius = 20;
    button2.background = "green";
    button2.onPointerUpObservable.add(function() {
        if(scene.activeCamera == camera){
            camera2.position = camera.position.clone();
            camera2.rotation = camera.rotation.clone();
            camera2.upVector = camera.upVector.clone();
            scene.activeCamera = camera2;
        }else{
            camera.position = camera2.position.clone();
            camera.rotation = camera2.rotation.clone();
            camera.upVector = camera2.upVector.clone();
            scene.activeCamera = camera;
        }
        
    });

    
    stackPanel.addControl(button2);  
    /*
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Gravity");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        if(camera.applyGravity == true)
            camera.applyGravity = false;
        else
            camera.applyGravity = true;
    });
    advancedTexture.addControl(button1);    */


    
    return scene;
};

/*
function onClick() 
{
    if (typeof DeviceMotionEvent.requestPermission === 'function') 
    {
        DeviceMotionEvent.requestPermission()
        .then(permissionState => {
            if (permissionState === 'granted') 
            {
                // DeviceMotionEvent.requestPermission() has been granted
            }
        })
        .catch(console.error);
       }
}   */

var engine;
try {
    engine = createDefaultEngine();
} catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    engine = createDefaultEngine();
}
if (!engine) throw 'engine should not be null.';
scene = createScene();;
sceneToRender = scene

engine.runRenderLoop(function() {
    if (sceneToRender && sceneToRender.activeCamera) {
        sceneToRender.render();
    }
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});