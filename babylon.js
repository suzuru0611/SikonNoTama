
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

var scrambleUp = function(data) {
    for (index = 0; index < data.length; index ++) {
        data[index] += 0.4 * Math.random();
    }
}

var scrambleDown = function(data) {
    for (index = 0; index < data.length; index ++) {
        data[index] -= 0.4 * Math.random();
    }
}

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("camera1", 1.14, 1.13, 10, BABYLON.Vector3.Zero(), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1",16, 2, scene);

   var hdrTexture = new BABYLON.HDRCubeTexture("shelter_4k.hdr", scene, 512);

    var exposure = 0.6;
    var contrast = 1.6;
    var glass = new BABYLON.PBRMaterial("glass", scene);
        glass.reflectionTexture = hdrTexture;
    glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.cameraExposure = exposure;
    glass.cameraContrast = contrast;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.54, 0.03, 0.55);
    glass.albedoColor = new BABYLON.Color3(0.99, 0.15, 0.15);
    
    sphere.material = glass; 

    var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 2, scene);
    sphere2.setEnabled(false);
    sphere2.updateMeshPositions(scrambleUp);

    var sphere3 = BABYLON.Mesh.CreateSphere("sphere3", 16, 2, scene);
    sphere3.setEnabled(false);

    sphere3.scaling = new BABYLON.Vector3(2.1, 3.5, 1.0);
    sphere3.bakeCurrentTransformIntoVertices();

    var sphere4 = BABYLON.Mesh.CreateSphere("sphere4", 16, 2, scene);
    sphere4.setEnabled(false);
    sphere4.updateMeshPositions(scrambleDown);

    var sphere5 = BABYLON.Mesh.CreateSphere("sphere5", 16, 2, scene);
    sphere5.setEnabled(false);

    sphere5.scaling = new BABYLON.Vector3(1.0, 0.1, 1.0);
    sphere5.bakeCurrentTransformIntoVertices();    

    var manager = new BABYLON.MorphTargetManager();
    sphere.morphTargetManager = manager;

    var target0 = BABYLON.MorphTarget.FromMesh(sphere2, "sphere2", 0);
    manager.addTarget(target0);

    var target1 = BABYLON.MorphTarget.FromMesh(sphere3, "sphere3", 0);
    manager.addTarget(target1);

    var target2 = BABYLON.MorphTarget.FromMesh(sphere4, "sphere4", 0);
    manager.addTarget(target2);   

    var target3 = BABYLON.MorphTarget.FromMesh(sphere5, "sphere5", 0);
    manager.addTarget(target3);       

    var oldgui = document.querySelector("#datGUI");
	if (oldgui != null){
		oldgui.remove();
	}
	
	var gui = new dat.GUI();	
	gui.domElement.style.marginTop = "100px";
	gui.domElement.id = "datGUI";
    var options = {
	    變數1: 0.25,
        變數2: 0.25,
        變數3: 0.25,
        變數4: 0.25,
    }

    gui.add(options, "變數1", 0, 1).onChange(function(value) {
		target0.influence = value;
    });

    gui.add(options, "變數2", 0, 1).onChange(function(value) {
		target1.influence = value;
    });

    gui.add(options, "變數3", 0, 1).onChange(function(value) {
		target2.influence = value;
    });  

    gui.add(options, "變數4", 0, 1).onChange(function(value) {
		target3.influence = value;
    });        

    var beta;
    var gamma;

    window.addEventListener('deviceorientation', function(ev){
        beta = ev.beta;
        gamma = ev.gamma;
    });

    
   

    return scene;

};


const sceneToRender = createScene();
engine.runRenderLoop(function(){
    sceneToRender.render();
});


