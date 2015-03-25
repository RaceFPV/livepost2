var THREEx = THREEx || {}

/**
 * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
 * @return {[type]} [description]
 */
THREEx.createAtmosphereMaterial	= function(){
	var vertexShader	= [
		'varying vec3	vVertexWorldPosition;',
		'varying vec3	vVertexNormal;',

		'void main(){',
		'	vVertexNormal	= normalize(normalMatrix * normal);',

		'	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',

		'	// set gl_Position',
		'	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}',

		].join('\n')
	var fragmentShader	= [
		'uniform vec3	glowColor;',
		'uniform float	coeficient;',
		'uniform float	power;',

		'varying vec3	vVertexNormal;',
		'varying vec3	vVertexWorldPosition;',

		'void main(){',
		'	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',
		'	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',
		'	viewCameraToVertex	= normalize(viewCameraToVertex);',
		'	float intensity		= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
		'	gl_FragColor		= vec4(glowColor, intensity);',
		'}',
	].join('\n')

	// create custom material from the shader code above
	//   that is within specially labeled script tags
	var material	= new THREE.ShaderMaterial({
		uniforms: { 
			coeficient	: {
				type	: "f", 
				value	: 1.0
			},
			power		: {
				type	: "f",
				value	: 2
			},
			glowColor	: {
				type	: "c",
				value	: new THREE.Color('pink')
			},
		},
		vertexShader	: vertexShader,
		fragmentShader	: fragmentShader,
		//blending	: THREE.AdditiveBlending,
		transparent	: true,
		depthWrite	: false,
	});
	return material
}
/**
 * vendor.js framework definition
 * @type {Object}
 */
var THREEx	= THREEx || {};

/**
 * add a THREEx.AtmosphereMaterial to Dat.DUI
 * 
 * @param  {THREE.ShaderMaterial}	material	the material to handle
 * @param  {dat.GUI+}			datGui		the dat.GUI to which we need to add
 */
THREEx.addAtmosphereMaterial2DatGui	= function(material, datGui){
	datGui		= datGui || new dat.GUI()
	var uniforms	= material.uniforms
	// options
	var options  = {
		coeficient	: uniforms['coeficient'].value,
		power		: uniforms['power'].value,
		glowColor	: '#'+uniforms.glowColor.value.getHexString(),
		presetFront	: function(){
			options.coeficient	= 1
			options.power		= 2
			onChange()
		},
		presetBack	: function(){
			options.coeficient	= 0.5
			options.power		= 4.0
			onChange()
		},
	}
	var onChange = function(){
		uniforms['coeficient'].value	= options.coeficient
		uniforms['power'].value		= options.power
		uniforms.glowColor.value.set( options.glowColor ); 
	}
	onChange()
	
	// config datGui
	datGui.add( options, 'coeficient'	, 0.0 , 2)
		.listen().onChange( onChange )
	datGui.add( options, 'power'		, 0.0 , 30)
		.listen().onChange( onChange )
	datGui.addColor( options, 'glowColor' )
		.listen().onChange( onChange )
	datGui.add( options, 'presetFront' )
	datGui.add( options, 'presetBack' )
}