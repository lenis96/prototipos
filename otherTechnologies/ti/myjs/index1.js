
;(function(){
	lights={};
	lights.topLight = new THREE.PointLight();
        lights.topLight.position.set(10 * 4, 150, 10 * 4);
		lights.topLight.intensity = 0.4;
	scene.add(lights.topLight);
	
	//////////////////////////////////////////////////////////////////////////////
	//		markerRoot1
	//////////////////////////////////////////////////////////////////////////////

	// build markerControls
    var markerRoots=[];
	paths=[];
	names=[];
	objPaths=[];
	mtlPaths=[];
	shapes=[{shape:"cat",blocked:false},
			{shape:"wolf",blocked:false},
			{shape:"cat",blocked:false},
			{shape:"bird",blocked:false},
			{shape:"cat",blocked:false},
			{shape:"bear",blocked:false},
			{shape:"cat",blocked:false},
			{shape:"jiraf",blocked:false},
			{shape:"wolf",blocked:false},
			{shape:"bird",blocked:false},
			{shape:"wolf",blocked:false},
			{shape:"bear",blocked:false},
			{shape:"wolf",blocked:false},
			{shape:"jiraf",blocked:false},
			{shape:"bird",blocked:false},
			{shape:"bear",blocked:false},
			{shape:"bird",blocked:false},
			{shape:"jiraf",blocked:false},
			{shape:"bear",blocked:false},
			{shape:"jiraf",blocked:false}]
	
	for(var i=0;i<20;i++){
		paths.push(THREEx.ArToolkitContext.baseURL+'../data/data/marker'+i+".pat");
		names.push("marker"+i);
		objPaths.push(shapes[i].shape+".obj");
		mtlPaths.push(shapes[i].shape+".mtl");
	}
	for(var i=0;i<paths.length;i++){
		markerRoot=new THREE.Group;
		markerRoot.name="marker"+i.toString();
		markerRoot.isMarker=true;
		markerRoot.shape=shapes[i].shape;
		markerRoot.used=false;
		scene.add(markerRoot);
		var markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type : 'pattern',
			patternUrl :  paths[i],
			// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
			})
		// loadOBJMarker("./../assets/cat.obj","cat.mtl",markerRoot);
	}

	// add a gizmo in the center of the marker
	// var geometry	= new THREE.OctahedronGeometry( 0.1, 0 )
	// var material	= new THREE.MeshNormalMaterial({
		// wireframe: true
	// }); 
	// var mesh	= new THREE.Mesh( geometry, material );
	
			// load a resource
			// objLoader.setMaterials(materials);

	//////////////////////////////////////////////////////////////////////////////
	//		markerRoot2
	//////////////////////////////////////////////////////////////////////////////

	// build markerControls
// 	var markerRoot2 = new THREE.Group
// 	markerRoot2.name = 'marker2'
// 	scene.add(markerRoot2)
// 	var markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot2, {
// 		type : 'pattern',
// 		// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
// 		patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
// 	})

// 	objLoader.load('dog.obj',function ( object ) {
//         markerRoot2.add( object );
//     }
// );
})()