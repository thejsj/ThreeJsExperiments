var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();
var objects = [];
var ray;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var cubes = [];
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
var addedSphere = false; 

var Options = function() {
	this.debugMode = false;
	this.cubeSize = 10;
	this.distance = 30;
};

var options = new Options();

var cubeGeometry = new THREE.CubeGeometry( options.cubeSize, options.cubeSize, options.cubeSize ); 
var cubeMatrial = new THREE.MeshLambertMaterial({color: 0x0000bb}); 

var clock = new THREE.Clock();

var uniforms1 = {
	time: { type: "f", value: 999999 },
	resolution: { type: "v2", value: new THREE.Vector2() }
};

var uniforms2  = {
	time: { type: "f", value: 1.0 },
	resolution: { type: "v2", value: new THREE.Vector2() },
	texture: { type: "t", value: THREE.ImageUtils.loadTexture( "textures/disturb.jpg" ) }
};

var lineMaterial = new THREE.LineBasicMaterial({
	color: 0x0000ff
});

 var lineGeometry = new THREE.Geometry();
lineGeometry.vertices.push(new THREE.Vector3(0, 200, 0));
lineGeometry.vertices.push(new THREE.Vector3(0, -200, 0));

if ( havePointerLock ) {
	var element = document.body;
	var pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			controls.enabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	}
	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	}
	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
	instructions.addEventListener( 'click', function ( event ) {
		instructions.style.display = 'none';
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		if ( /Firefox/i.test( navigator.userAgent ) ) {
			var fullscreenchange = function ( event ) {
				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					element.requestPointerLock();
				}
			}
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			element.requestPointerLock();
		}
	}, false );
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}
function init() {

	// Create Scene and Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	scene = new THREE.Scene();

	// Add Scene
	scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

	// Add Light
	var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );

	// Add Controls
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

	// Add RayCaster
	ray = new THREE.Raycaster();
	ray.ray.direction.set( 0, -1, 0 );

	// Floor
	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		var vertex = geometry.vertices[ i ];
		vertex.x += 20;
		vertex.y += 1;
		vertex.z += 20;
	}
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var color = 0xffffff; 
		if( i % 2 == 0){
			color = 0x000000;
		}
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHex( color, 0.1 );
		face.vertexColors[ 1 ] = new THREE.Color().setHex( color, 0.1 );
		face.vertexColors[ 2 ] = new THREE.Color().setHex( color, 0.1 );
	}
	material = new THREE.MeshBasicMaterial( { 
		wireframe: true, 
		transparency:true, 
		opacity: 0.5,
		vertexColors: THREE.VertexColors, 
	} );

	// init the Stats and append it to the Dom - performance vuemeter
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	

	// Render the Scene
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff ); // Background color, Does not work well with Fog
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	var delta = clock.getDelta();

	uniforms1.time.value += delta * 5;
	uniforms2.time.value = clock.elapsedTime;

	requestAnimationFrame( animate );

	controls.isOnObject( false );
	ray.ray.origin.copy( controls.getObject().position );
	ray.ray.origin.y -= 10;
	var intersections = ray.intersectObjects( objects );
	if ( intersections.length > 0 ) {
		var intersection_distance = intersections[ 0 ].distance;
		if ( intersection_distance > 0 && intersection_distance < 10 ) {
			controls.isOnObject( true );
		}
	}

	// Objects
	var ControlsPosition = controls.getObject().position ;
	
	var position_start_x = getPos(ControlsPosition.x, options.cubeSize,  -options.distance);
	var position_start_z = getPos(ControlsPosition.z, options.cubeSize, -options.distance);
	var position_end_x   = getPos(ControlsPosition.x, options.cubeSize, options.distance);
	var position_end_z   = getPos(ControlsPosition.z, options.cubeSize, options.distance);
	if(options.debugMode){
		console.time("materialGeometry");
	}
	
	if(options.debugMode){
		console.timeEnd("materialGeometry");
	}
	if(options.debugMode){
		console.time("calcDist");
	}
	for(var x = position_start_x;  x < position_end_x; x += options.cubeSize){
		for(var z = position_start_z;  z < position_end_z; z += options.cubeSize){
			if(calcDistance(ControlsPosition, x, z) < (options.cubeSize * 5)){
				// Add Cubes if they don't exists
				if(cubes[x] === undefined){
					cubes[x] = [];
				}
				if(cubes[x][z] === undefined){
					cubes[x][z] = new THREE.Mesh( 
						cubeGeometry, 
						cubeMatrial
					);
					cubes[x][z].position.y = -options.cubeSize; 
					cubes[x][z].position.x = x;// options.cubeSize; 
					cubes[x][z].position.z = z; // options.cubeSize;
					console.log("Adding Object");
					scene.add( cubes[x][z] );
				}
			}
		}
	}
	if(options.debugMode){
		console.timeEnd("calcDist");
	}

	controls.update( Date.now() - time );
	if(options.debugMode){
		console.time("renderScene");
	}
	renderer.render( scene, camera );
	if(options.debugMode){
		console.timeEnd("renderScene");
	}
	time = Date.now();

	// update the stats
	stats.update();
}

/* Utilities */

function calcDistance(point1, x, z){
  var xs = 0;
  var zs = 0;
 
  xs = point1.x - x;
  xs = xs * xs;
 
  zs = point1.z - z;
  zs = zs * zs;
 
  return Math.sqrt( xs + zs );
}

function getPos(x, cube_size, distance){
	var x = Math.floor(x);
	return x - (x % cube_size) + distance; 
}

init();
animate();
