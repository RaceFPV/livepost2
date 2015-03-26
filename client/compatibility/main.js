function showearth() {
var renderer	= new THREE.WebGLRenderer({
		antialias	: true
	});
  var earthid = document.getElementById('earth')
	renderer.setSize( earthid.offsetWidth, earthid.offsetHeight);
	earthid.appendChild( renderer.domElement );
	renderer.shadowMapEnabled	= true
	
	var onRenderFcts= [];
	var scene	= new THREE.Scene();
	var camera	= new THREE.PerspectiveCamera(45, earthid.offsetWidth /  earthid.offsetHeight );
	camera.position.z = 1.1;
	var light	= new THREE.AmbientLight( 0x222222 )
	scene.add( light )
	var light	= new THREE.DirectionalLight( 0xffffff, 1 )
	light.position.set(5,5,5)
	scene.add( light )
	light.castShadow	= true
	light.shadowCameraNear	= 0.01
	light.shadowCameraFar	= 15
	light.shadowCameraFov	= 45
	light.shadowCameraLeft	= -1
	light.shadowCameraRight	=  1
	light.shadowCameraTop	=  1
	light.shadowCameraBottom= -1
	// light.shadowCameraVisible	= true
	light.shadowBias	= 0.001
	light.shadowDarkness	= 0.2
	light.shadowMapWidth	= 1024
	light.shadowMapHeight	= 1024
	
	//////////////////////////////////////////////////////////////////////////////////
	//		added starfield							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var starSphere	= THREEx.Planets.createStarfield()
	scene.add(starSphere)
  starSphere.receiveShadow = false
	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////
	// var datGUI	= new dat.GUI()
	var containerEarth	= new THREE.Object3D()
	containerEarth.rotateZ(-23.4 * Math.PI/180)
	containerEarth.position.z	= 0
	scene.add(containerEarth)
	var moonMesh	= THREEx.Planets.createMoon()
	moonMesh.position.set(0.5,0.5,0.5)
	moonMesh.scale.multiplyScalar(1/5)
	moonMesh.receiveShadow	= true
	moonMesh.castShadow	= true
	containerEarth.add(moonMesh)
	var earthMesh	= THREEx.Planets.createEarth()
	earthMesh.receiveShadow	= true
	earthMesh.castShadow	= true
	containerEarth.add(earthMesh)
	onRenderFcts.push(function(delta, now){
		earthMesh.rotation.y += 1/32 * delta;		
	})
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value.set(0x00b3ff)
	material.uniforms.coeficient.value	= 0.5
	material.uniforms.power.value		= 3.8
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.01);
	containerEarth.add( mesh );
	// new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= THREEx.createAtmosphereMaterial()
	material.side	= THREE.BackSide
	material.uniforms.glowColor.value.set(0x00b3ff)
	material.uniforms.coeficient.value	= 0.5
	material.uniforms.power.value		= 13.0
	var mesh	= new THREE.Mesh(geometry, material );
	mesh.scale.multiplyScalar(1.15);
	containerEarth.add( mesh );
	// new THREEx.addAtmosphereMaterial2DatGui(material, datGUI)
	var earthClouds	= THREEx.Planets.createEarthClouds()
	earthClouds.receiveShadow	= true
	earthClouds.castShadow	= true
	containerEarth.add(earthClouds)
	onRenderFcts.push(function(delta, now){
		earthClouds.rotation.y += 1/8 * delta;		
	})
  //////////////////////////////////////////////////////////////////////////////////
  //    Add the ISS                                                               //
  //////////////////////////////////////////////////////////////////////////////////
	var containerEarth2	= new THREE.Object3D()
	containerEarth2.rotateZ(35.4 * Math.PI/180)
	containerEarth2.position.z	= 0
	scene.add(containerEarth2)
  //var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
 // var material  = new THREE.MeshPhongMaterial()
  //material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png')
  //material.side  = THREE.BackSide
  //var issMesh = new THREE.Mesh(geometry, material)
  var issTexture = THREE.ImageUtils.loadTexture( 'images/iss.png' );
	var issMaterial = new THREE.SpriteMaterial( { map: issTexture, useScreenCoordinates: true} );
	var issSprite = new THREE.Sprite( issMaterial );
	issSprite.position.set(0.38,0.38,0.38)
	issSprite.scale.set( 0.12, 0.12, 1.0 );
	issSprite.receiveShadow	= true
	issSprite.castShadow	= true
	containerEarth2.add(issSprite)
	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0}
	earthid.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX /  earthid.offsetWidth ) - 0.5
		mouse.y	= (event.clientY /  earthid.offsetHeight) - 0.5
	}, false)
	onRenderFcts.push(function(delta, now){
		camera.position.x += (mouse.x*4 - camera.position.x) * (delta*3)
		camera.position.y += (mouse.y*4 - camera.position.y) * (delta*3)
		camera.lookAt( issSprite.position )
	})
	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );		
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})
	};