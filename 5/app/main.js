// This source is the javascript needed to build a simple moving
// cube in **three.js** based on this
// [example](https://raw.github.com/mrdoob/three.js/r44/examples/canvas_geometry_cube.html)
// It is the source about this [blog post](/blog/2011/08/06/lets-do-a-cube/).

// ## Now lets start

// declare a bunch of variable we will need later
var startTime = Date.now();
var camera, scene, renderer, stats, light;
var cubes = [];

var cameraXPositionAnimation = new SoftFloat();

var starting_camera_position = -2000;
var end_camera_position = -1000;

cameraXPositionAnimation.set(starting_camera_position);
cameraXPositionAnimation.setTarget(end_camera_position);

// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

var Options = function() {
	this.debugMode = false;
	this.cameraPositionX = -3603.308633465448;
	this.cameraPositionY = 100;
	this.cameraPositionZ = 367.05152507323874;
	this.cameraRotationX = 178.66620713424092;
	this.cameraRotationY = 0;
	this.cameraRotationZ = 0;

	this.lightPositionX = -1618;
	this.lightPositionY = 150;
	this.lightPositionZ = -100;

	this.cubeSize = 100; 
};

var options = new Options();
var gui = new dat.GUI();


var cameraGuiGroup = gui.addFolder('Camera');
cameraGuiGroup.add(options, 'cameraPositionX', -10000, 10000);
cameraGuiGroup.add(options, 'cameraPositionY', -10000, 10000);
cameraGuiGroup.add(options, 'cameraPositionZ', -10000, 10000);
cameraGuiGroup.add(options, 'cameraRotationX', 0, 360);
cameraGuiGroup.add(options, 'cameraRotationY', 0, 360);
cameraGuiGroup.add(options, 'cameraRotationZ', 0, 360);

var lightGuiGroup = gui.addFolder('Light');
lightGuiGroup.add(options, 'lightPositionX', -10000, 10000);
lightGuiGroup.add(options, 'lightPositionY', -10000, 10000);
lightGuiGroup.add(options, 'lightPositionZ', -10000, 10000);

var otherGuiGroup = gui.addFolder('Other');
otherGuiGroup.add(options, 'debugMode');
otherGuiGroup.add(options, 'cubeSize', 5, 500);

var uniforms1 = {
	time: { type: "f", value: 999999 },
	resolution: { type: "v2", value: new THREE.Vector2() }
};

var cubeGeometry = new THREE.CubeGeometry( options.cubeSize, options.cubeSize, options.cubeSize ); 

var shaderMaterial = new THREE.ShaderMaterial( {
	uniforms: uniforms1,
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragment_shader4' ).textContent,
	transparent: true
} );


// ## bootstrap functions
// initialiaze everything
init();
// make it move			
animate();

// ## Initialize everything
function init() {

	// test if webgl is supported
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	// camera
	camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
	scene = new THREE.Scene();

	// Add Light
	light = new THREE.PointLight(0xffffff, 1);
	light.position.set(options.lightPositionX, options.lightPositionY, options.lightPositionZ);
	scene.add( light );

	// Objects	
	var howmany = 40; 
	for(var i = 0; i < howmany; i++){
		cubes.push([]);
		for(var ii = 0; ii < howmany; ii++){
			cubes[i].push([]);
			for(var iii = 0; iii < 2; iii++){

				cubes[i][ii][iii] = new THREE.Mesh( 
					new THREE.CubeGeometry( 100, 100, 100 ), 
					shaderMaterial
				);
				cubes[i][ii][iii].position.x = i * -100;
				cubes[i][ii][iii].position.z = ii * 100;
				cubes[i][ii][iii].position.y = iii * 200; 

				cubes[i][ii][iii].rotation.x += 0;
				cubes[i][ii][iii].rotation.y += 0;
				cubes[i][ii][iii].rotation.z += 0;
				cubes[i][ii][iii].renderRate = Math.random() * 200 + 200;

				scene.add( cubes[i][ii][iii] );
			}
		}
	}

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000 );
	document.body.appendChild( renderer.domElement );

	// init the Stats and append it to the Dom - performance vuemeter
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

}

// ## Animate and Display the Scene
function animate() {
	
	// Camera
	camera.position.z = options.cameraPositionZ;
	camera.position.y = options.cameraPositionY;
	
	console.log(cameraXPositionAnimation.get() + ' - ' + cameraXPositionAnimation.getTarget());

	camera.position.x = cameraXPositionAnimation.get();
	// -4265 - 808
	cameraXPositionAnimation.update();
	if(cameraXPositionAnimation.get() > end_camera_position){
		cameraXPositionAnimation.setTarget(starting_camera_position);
	}
	if(cameraXPositionAnimation.get() < starting_camera_position){
		cameraXPositionAnimation.setTarget(end_camera_position);
	}

	camera.rotation.z = Math.radians(options.cameraRotationZ);
	camera.rotation.y = Math.radians(options.cameraRotationY);
	camera.rotation.x = Math.radians(options.cameraRotationX); 

	// Light
	light.position.z = options.lightPositionZ;
	light.position.y = options.lightPositionY;
	light.position.x = options.lightPositionX;

	// Animate 
	var dtime	= Date.now() - startTime;
	for(i in cubes){
		for(ii in cubes[i]){
			for(iii in cubes[i][ii]){
				cubes[i][ii][iii].scale.y = 1 + 0.3*Math.sin(dtime/cubes[i][ii][iii].renderRate);
			}
		}
	}

	// relaunch the 'timer' 
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	// update the stats
	stats.update();

}
