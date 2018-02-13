;(function(){
	function getAngle(x){
		x=x*(180/Math.PI)
		if(x<0){
			x+=360;
		}
		// console.log(x)
		if(x<=45){
			return 0;
		}
		else if(x<=135){
			return 1;
		}
		else if(x<225){
			return 2;
		}
		else if(x<=315){
			return 3;
		}
		else{
			return 0;
		}
	}
	var minDistAlign=4;
	var minDistNear=5;

	console.log(scene.children)
	markers=[];
	for(var i=0;i<scene.children.length;i++){
		if(scene.children[i].isMarker){
			markers.push(scene.children[i]);
		}
	}
	texto=document.getElementById("texto");

	var geometry = new THREE.BoxGeometry( 100, 1, 100 );
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	var cube = new THREE.Mesh( geometry, material );
	cube.position.y=-1
	scene.add( cube );
	var objLoader = new THREE.OBJLoader();
    var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('./../../assets/');
	objLoader.setPath("./../../assets/");
	var loadOBJMarker=function(objPath,mtlPath,parent,position,marker){
		// adaptado de https://stackoverflow.com/questions/17712857/how-to-load-textures-from-objmtl-files-in-three-js
		mtlLoader.load(mtlPath, function(materials) {
			materials.preload();
				objLoader.setMaterials(materials);
				objLoader.load(objPath,function(object){
					object.position.set(0,0,10);
					object.rotateY(90);
					object.isShape=true;
					marker.shape=object;
					parent.add(object);
				})
		})
	}
	console.log(scene.children)
	markers=[];
	for(var i=0;i<scene.children.length;i++){
		if(scene.children[i].isMarker){
			markers.push(scene.children[i]);
		}
	}
	for(var i=0;i<markers.length;i++){
		loadOBJMarker(objPaths[i],mtlPaths[i],scene,[0,0],markers[i])
	}
	var animals=[];
	var timeVisible=30
	function isOrtogonal(element1,element2){
		ans=false;
		console.log({dx:Math.abs(element1.position.x-element2.position.x),dy:Math.abs(element1.position.y-element2.position.y)})
		if(Math.abs(element1.position.x-element2.position.x)<minDistAlign){
			if(Math.abs(element1.position.y-element2.position.y)<minDistNear){
				ans=true;
			}
			else{
				ans=false;
			}
		}
		else if(Math.abs(element1.position.y-element2.position.y)<minDistAlign){
			if(Math.abs(element1.position.x-element2.position.x)<minDistNear){
				ans=true;
			}
			else{
				ans=false;
			}
		}
		return ans;
	}
	// console.log(markers)
	// var markerRoot1 = scene.getObjectByName('marker1')
	// var markerRoot2 = scene.getObjectByName('marker2')
	
	// var container = new THREE.Group
	// scene.add(container)

	// // update container.visible and scanningSpinner visibility
	// onRenderFcts.push(function(){
	// 	if( markerRoot1.visible === true && markerRoot2.visible === true ){
	// 		container.visible = true
	// 		document.querySelector('.scanningSpinner').style.display = 'none'
	// 	}else{
	// 		container.visible = false
	// 		document.querySelector('.scanningSpinner').style.display = ''
	// 	}
	// })
	
	// //////////////////////////////////////////////////////////////////////////////
	// //		build lineMesh
	// //////////////////////////////////////////////////////////////////////////////
	// var material = new THREE.LineDashedMaterial( {
	// 	dashSize: 1,
	// 	gapSize: 1,
	// } );
	// var geometry = new THREE.Geometry();
	// geometry.vertices.push(new THREE.Vector3(1, 0, -3));
	// geometry.vertices.push(new THREE.Vector3(-1, 0, -3));
	// var lineMesh = new THREE.Line(geometry, material);
	// container.add(lineMesh)

	// // update lineMesh
	a=true;
	onRenderFcts.push(function(){
	// 	var geometry = lineMesh.geometry
	// 	geometry.vertices[0].copy(markerRoot1.position)
		// console.log(markerRoot1.position);
		markers.forEach(function(element){
			// console.log(element.name);
			if(element.visible){
				element.shape.position.set(element.position.x,0,element.position.y-10);
				// if(a){
					// a=false;
					// console.log(element)
					// }
					// console.log(element.rotation.x*(180/Math.PI));
				// console.log(element.rotation.x*(180));
				
				// console.log(element.visible,element.position.x,element.position.y,element.rotation.x);
			}
			if(!element.visible){
				element.timeVisible=0;
			}
			else{
				element.timeVisible++;
			}
			//TODO logica para ver si el marcador se encuentra estatico
			if(element.timeVisible>=timeVisible && animals.length==0){
				element.shapes[0].marker=element;
				element.shapes[1].marker=element;
				animals.push(element.shapes[0]);
				animals.push(element.shapes[1]);
				console.log(animals)
				element.used=true;
			}
			else if(element.timeVisible>=timeVisible && !element.used){//TODO condicion de distancia
				// console.log(animals[0].shapes[0].shape)
				console.log(isOrtogonal(element,animals[0].marker));
				if(element.shapes[0].shape==animals[0].shape && isOrtogonal(element,animals[0].marker)){
					animals.splice(0,1);
					element.shapes[1].marker=element;
					animals.push(element.shapes[1]);
					element.used=true;
					console.log(animals)
				}
				else if(element.shapes[0].shape==animals[1].shape && isOrtogonal(element,animals[1].marker)){
					animals.splice(1,1);
					element.shapes[1].marker=element;
					animals.push(element.shapes[1]);
					element.used=true;
					console.log(animals)
				}
				else if(element.shapes[1].shape==animals[0].shape && isOrtogonal(element,animals[0].marker)){
					animals.splice(0,1);
					element.shapes[0].marker=element;
					animals.push(element.shapes[0]);
					element.used=true;
					console.log(animals)
				}
				else if(element.shapes[1].shape==animals[1].shape && isOrtogonal(element,animals[1].marker)){
					animals.splice(1,1);
					element.shapes[1].marker=element;
					animals.push(element.shapes[0]);
					element.used=true;
					console.log(animals)
				}
				//TODO las otras condiciones
			}
			
				
		})

		if(animals.length>0){
			texto.innerHTML=JSON.stringify(animals.map(function(elem){return elem.shape}));
		}
	// 	geometry.vertices[1].copy(markerRoot2.position)
	// 	geometry.verticesNeedUpdate = true

	// 	geometry.computeBoundingSphere();
	// 	geometry.computeLineDistances();
		
	// 	var length = markerRoot1.position.distanceTo(markerRoot2.position)
	// 	lineMesh.material.scale = length * 10
	// 	lineMesh.material.needsUpdate = true
	})


	// //////////////////////////////////////////////////////////////////////////////
	// //		display the distance between the 2 markers
	// //////////////////////////////////////////////////////////////////////////////

	// // build texture
	// var canvas = document.createElement( 'canvas' );
	// canvas.width = 128;
	// canvas.height = 64;
	// var context = canvas.getContext( '2d' );
	// var texture = new THREE.CanvasTexture( canvas );

	// // build sprite
	// var material = new THREE.SpriteMaterial({
	// 	map: texture, 
	// 	color: 0xffffff, 
	// });
	// var sprite = new THREE.Sprite( material );
	// sprite.scale.multiplyScalar(0.5)
	// container.add(sprite)

	// // upload measure
	// onRenderFcts.push(function(){
	// 	// update sprite position
	// 	sprite.position.addVectors(markerRoot1.position, markerRoot2.position).multiplyScalar(1/2)

	// 	// get the text to display
	// 	var length = markerRoot1.position.distanceTo(markerRoot2.position)
	// 	var text = length.toFixed(2)
		
	// 	// put the text in the sprite
	// 	context.font = '40px monospace';
	// 	context.clearRect( 0, 0, canvas.width, canvas.height );
	// 	context.fillStyle = '#fff';
	// 	context.fillText(text, canvas.width/4, 3*canvas.height/4 )
	// 	sprite.material.map.needsUpdate = true
	// })
	
})()
	