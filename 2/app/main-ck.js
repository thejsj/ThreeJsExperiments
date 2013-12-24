function init(){camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1e3);scene=new THREE.Scene;scene.fog=new THREE.Fog(16777215,0,750);var e=new THREE.DirectionalLight(16777215,1.5);e.position.set(1,1,1);scene.add(e);var e=new THREE.DirectionalLight(16777215,.75);e.position.set(-1,-0.5,-1);scene.add(e);controls=new THREE.PointerLockControls(camera);scene.add(controls.getObject());ray=new THREE.Raycaster;ray.ray.direction.set(0,-1,0);geometry=new THREE.PlaneGeometry(2e3,2e3,100,100);geometry.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2));for(var t=0,n=geometry.vertices.length;t<n;t++){var r=geometry.vertices[t];r.x+=20;r.y+=1;r.z+=20}for(var t=0,n=geometry.faces.length;t<n;t++){var i=16777215;t%2==0&&(i=0);var s=geometry.faces[t];s.vertexColors[0]=(new THREE.Color).setHex(i,.1);s.vertexColors[1]=(new THREE.Color).setHex(i,.1);s.vertexColors[2]=(new THREE.Color).setHex(i,.1)}material=new THREE.MeshBasicMaterial({wireframe:!0,transparency:!0,opacity:.5,vertexColors:THREE.VertexColors});stats=new Stats;stats.domElement.style.position="absolute";stats.domElement.style.top="0px";document.body.appendChild(stats.domElement);renderer=new THREE.WebGLRenderer;renderer.setClearColor(16777215);renderer.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(renderer.domElement);window.addEventListener("resize",onWindowResize,!1)}function onWindowResize(){camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)}function animate(){var e=clock.getDelta();uniforms1.time.value+=e*5;uniforms2.time.value=clock.elapsedTime;requestAnimationFrame(animate);controls.isOnObject(!1);ray.ray.origin.copy(controls.getObject().position);ray.ray.origin.y-=10;var t=ray.intersectObjects(objects);if(t.length>0){var n=t[0].distance;n>0&&n<10&&controls.isOnObject(!0)}var r=controls.getObject().position,i=getPos(r.x,options.cubeSize,-options.distance),s=getPos(r.z,options.cubeSize,-options.distance),o=getPos(r.x,options.cubeSize,options.distance),u=getPos(r.z,options.cubeSize,options.distance);options.debugMode&&console.time("materialGeometry");options.debugMode&&console.timeEnd("materialGeometry");options.debugMode&&console.time("calcDist");for(var a=i;a<o;a+=options.cubeSize)for(var f=s;f<u;f+=options.cubeSize)if(calcDistance(r,a,f)<options.cubeSize*5){cubes[a]===undefined&&(cubes[a]=[]);if(cubes[a][f]===undefined){cubes[a][f]=new THREE.Mesh(cubeGeometry,cubeMatrial);cubes[a][f].position.y=-options.cubeSize;cubes[a][f].position.x=a;cubes[a][f].position.z=f;console.log("Adding Object");scene.add(cubes[a][f])}}options.debugMode&&console.timeEnd("calcDist");controls.update(Date.now()-time);options.debugMode&&console.time("renderScene");renderer.render(scene,camera);options.debugMode&&console.timeEnd("renderScene");time=Date.now();stats.update()}function calcDistance(e,t,n){var r=0,i=0;r=e.x-t;r*=r;i=e.z-n;i*=i;return Math.sqrt(r+i)}function getPos(e,t,n){var e=Math.floor(e);return e-e%t+n}var camera,scene,renderer,geometry,material,mesh,controls,time=Date.now(),objects=[],ray,blocker=document.getElementById("blocker"),instructions=document.getElementById("instructions"),cubes=[],havePointerLock="pointerLockElement"in document||"mozPointerLockElement"in document||"webkitPointerLockElement"in document,addedSphere=!1,Options=function(){this.debugMode=!1;this.cubeSize=25;this.distance=25},options=new Options,cubeGeometry=new THREE.CubeGeometry(options.cubeSize,options.cubeSize,options.cubeSize),cubeMatrial=new THREE.MeshLambertMaterial({color:187}),clock=new THREE.Clock;if(havePointerLock){var element=document.body,pointerlockchange=function(e){if(document.pointerLockElement===element||document.mozPointerLockElement===element||document.webkitPointerLockElement===element){controls.enabled=!0;blocker.style.display="none"}else{controls.enabled=!1;blocker.style.display="-webkit-box";blocker.style.display="-moz-box";blocker.style.display="box";instructions.style.display=""}},pointerlockerror=function(e){instructions.style.display=""};document.addEventListener("pointerlockchange",pointerlockchange,!1);document.addEventListener("mozpointerlockchange",pointerlockchange,!1);document.addEventListener("webkitpointerlockchange",pointerlockchange,!1);document.addEventListener("pointerlockerror",pointerlockerror,!1);document.addEventListener("mozpointerlockerror",pointerlockerror,!1);document.addEventListener("webkitpointerlockerror",pointerlockerror,!1);instructions.addEventListener("click",function(e){instructions.style.display="none";element.requestPointerLock=element.requestPointerLock||element.mozRequestPointerLock||element.webkitRequestPointerLock;if(/Firefox/i.test(navigator.userAgent)){var t=function(e){if(document.fullscreenElement===element||document.mozFullscreenElement===element||document.mozFullScreenElement===element){document.removeEventListener("fullscreenchange",t);document.removeEventListener("mozfullscreenchange",t);element.requestPointerLock()}};document.addEventListener("fullscreenchange",t,!1);document.addEventListener("mozfullscreenchange",t,!1);element.requestFullscreen=element.requestFullscreen||element.mozRequestFullscreen||element.mozRequestFullScreen||element.webkitRequestFullscreen;element.requestFullscreen()}else element.requestPointerLock()},!1)}else instructions.innerHTML="Your browser doesn't seem to support Pointer Lock API";init();animate();