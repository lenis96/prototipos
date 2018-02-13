	
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
	paths=[THREEx.ArToolkitContext.baseURL + '../data/data/marker0.pat',THREEx.ArToolkitContext.baseURL + '../data/data/marker1.pat',THREEx.ArToolkitContext.baseURL + '../data/data/marker2.pat',THREEx.ArToolkitContext.baseURL + '../data/data/marker3.pat'];
	names=["marker0","marker1","marker2","marker3"];
	shapes=[[{shape:"LOBO",blocked:false},{shape:"GATO",blocked:false}],[{shape:"GATO",blocked:false},{shape:"PAJARO",blocked:false}],[{shape:"LOBO",blocked:false},{shape:"OSO",blocked:false}],[{shape:"PAJARO",blocked:false},{shape:"JIRAFA",blocked:false}]]
	objPaths=["p1.obj","p2.obj","p3.obj","p4.obj"];
	mtlPaths=["p1.mtl","p2.mtl","p3.mtl","p4.mtl"];
    var objLoader = new THREE.OBJLoader();
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('./../../assets/');
	objLoader.setPath("./../../assets/");
	var loadOBJMarker=function(objPath,mtlPath,marker){
		// adaptado de https://stackoverflow.com/questions/17712857/how-to-load-textures-from-objmtl-files-in-three-js
		mtlLoader.load(mtlPath, function(materials) {
  			materials.preload();
  			objLoader.setMaterials(materials);
			objLoader.load(objPath,function(object){
				marker.add(object);
			})
		})
	}
	for(var i=0;i<paths.length;i++){
		markerRoot=new THREE.Group;
		markerRoot.name=names[i];
		markerRoot.isMarker=true;
		markerRoot.shapes=shapes[i];
		markerRoot.used=false;
		scene.add(markerRoot);
		var markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type : 'pattern',
			patternUrl :  paths[i],
			// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
			})
		loadOBJMarker(objPaths[i],mtlPaths[i],markerRoot);
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
