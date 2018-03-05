;(function(){
	var angulo=function(x1,y1,x2,y2){
		var y=y2-y1,x=x2-x1
		var res=(Math.atan(y/x)*(180/Math.PI));
		if(x<0){res+=180;}
		if(res<0){res+=360;}
		return res;
	}
	var minDistAlign=4;
	var minDistNear=5;

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
					marker.grid=object;
					parent.add(object);
				})
		})
	}
	markers=[];
	for(var i=0;i<scene.children.length;i++){
		if(scene.children[i].isMarker){
			markers.push(scene.children[i]);
		}
	}
	for(var i=0;i<markers.length;i++){
		loadOBJMarker(objPaths[i],mtlPaths[i],scene,[0,0],markers[i])
	}
	var timeVisible=30
	var showCorrect=function(){
		document.getElementById("correct").classList.remove("hidden");
					setTimeout(function(){
						document.getElementById("correct").classList.add("hidden");
					},2000);
	}
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
	onRenderFcts.push(function(){
	
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
	