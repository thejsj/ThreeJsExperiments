// This source is the javascript needed to build a simple moving
// cube in **three.js** based on this
// [example](https://raw.github.com/mrdoob/three.js/r44/examples/canvas_geometry_cube.html)
// It is the source about this [blog post](/blog/2011/08/06/lets-do-a-cube/).

// ## Now lets start

// declare a bunch of variable we will need later
var startTime = Date.now();
var container;
var camera, scene, renderer, stats;
var cube;

var cubes = []; 

// ## bootstrap functions
// initialiaze everything
init();
// make it move			
animate();

// ## Initialize everything
function init() {
	console.log(cubes);
	// test if webgl is supported
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	// create the camera
	camera = new THREE.Camera( 90, window.innerWidth / window.innerHeight, 0.7, 1000 );
	camera.position.z = 300; // How Far Away
	camera.position.x = 300; // How Far Away
	camera.position.y = 300; // How Far Away

	// create the Scene
	scene = new THREE.Scene();

	var light = new THREE.PointLight(0xffffff, 1);
	light.position.set(50, 150, 150);
	scene.addObject( light );

	var howmany = 50; 
	for(var i = 0; i < howmany; i++){
		cubes.push([]);
		for(var ii = 0; ii < howmany; ii++){
			cubes[i].push( new THREE.Mesh( 
				new THREE.CubeGeometry( 100, 100, 100 ), 
				new THREE.MeshLambertMaterial({
					color: 0x0000bb
				})
			));
			cubes[i][ii].position.x = i * -100 + 700;
			cubes[i][ii].position.z = ii * -100 + 600;

			cubes[i][ii].rotation.x += 0;
			cubes[i][ii].rotation.y += 0;
			cubes[i][ii].rotation.z += 0;
			cubes[i][ii].renderRate = Math.random() * 200 + 200;

			scene.addObject( cubes[i][ii] );
		}
	}

	// get the container element
	container = document.getElementById( 'main' );

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColorHex( 0x000000, 1 );
	container.appendChild( renderer.domElement );
	
	// init the Stats and append it to the Dom - performance vuemeter
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	
}

// ## Animate and Display the Scene
function animate() {
	// render the 3D scene
	render();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
	// update the stats
	stats.update();
}


// ## Render the 3D Scene
function render() {
	// animate the cube

	//cube.scale.x += 0.02;
	//cube.scale.y += 0.0225;
	//cube.scale.z += 0.0175;
	// make the cube bounce
	//cube.scale.x	= 1.0 + 0.3*Math.sin(dtime/300);
	var dtime	= Date.now() - startTime;
	for(i in cubes){
		for(ii in cubes[i]){
			cubes[i][ii].scale.y = 1 + 0.3*Math.sin(dtime/cubes[i][ii].renderRate);
		}
	}
	renderer.render( scene, camera );
}