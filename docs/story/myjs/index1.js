
;(function(){
	lights={};
	lights.topLight = new THREE.PointLight();
        lights.topLight.position.set(10 * 4, 150, 10 * 4);
		lights.topLight.intensity = 0.4;
	scene.add(lights.topLight);
    var markerRoots=[];
	paths=[THREEx.ArToolkitContext.baseURL + '../data/data/marker0.pat',THREEx.ArToolkitContext.baseURL + '../data/data/marker1.pat',THREEx.ArToolkitContext.baseURL + '../data/data/marker2.pat',THREEx.ArToolkitContext.baseURL + '../data/data/marker3.pat',
	THREEx.ArToolkitContext.baseURL + '../data/data/marker4.pat',THREEx.ArToolkitContext.baseURL + '../data/data/marker5.pat'];
	names=["player","option1A","option1B","marker3"];
	objPaths=["cow.obj","water.obj","grass.obj","house.obj","p1.obj","p2.obj"];
	mtlPaths=["cow.mtl","water.mtl","grass.mtl","house.mtl","p1.mtl","p2.mtl"];
	for(var i=0;i<paths.length;i++){
		markerRoot=new THREE.Group;
		markerRoot.name=names[i];
		markerRoot.isMarker=true;
		markerRoot.used=false;
		scene.add(markerRoot);
		var markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type : 'pattern',
			patternUrl :  paths[i],
			// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
			})
		// loadOBJMarker("./../assets/cat.obj","cat.mtl",markerRoot);
	}
})()