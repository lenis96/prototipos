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
	//TODO logic about distance betwen marker

	console.log(scene.children)
	markers=[];
	for(var i=0;i<scene.children.length;i++){
		if(scene.children[i].isMarker){
			markers.push(scene.children[i]);
		}
	}
	pieces=[];
	for (var i=0;i<markers.length;){
		pieces.push([markers[i],markers[i+1]])
		i+=2
	}
	console.log(pieces)
	texto=document.getElementById("texto");
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
	var animals=[];
	var timeVisible=30
	var score=0;
	document.getElementById("score").innerText="Puntaje: "+score;
	var showCorrect=function(){
		score++;
		document.getElementById("score").innerText="Puntaje: "+score;
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
	// 	var geometry = lineMesh.geometry
	// 	geometry.vertices[0].copy(markerRoot1.position)
		pieces.forEach(function(element){
			if(!element[0].visible){
				element[0].timeVisible=0;
			}
			else{
				element[0].timeVisible++;
			}
			if(!element[1].visible){
				element[1].timeVisible=0;
			}
			else{
				element[1].timeVisible++;
			}
			//TODO logica para ver si el marcador se encuentra estatico, (parece que no se requiere)
			if(element[0].timeVisible>=timeVisible && element[1].timeVisible>=timeVisible && animals.length==0){
				animals.push(element[0]);
				animals.push(element[1]);
				console.log(animals.map(function(x){return x.shape}));
				element.used=true;
			}
			else if(element[0].timeVisible>=timeVisible && !element.used && animals.length>0){
				console.log(isOrtogonal(element[0],animals[0]));
				if(element[0].shape==animals[0].shape && isOrtogonal(element[0],animals[0])){
					animals.splice(0,1);
					animals.push(element[1]);
					element.used=true;
					console.log(animals.map(function(x){return x.shape}));
					showCorrect();
				}
				else if(element[0].shape==animals[1].shape && isOrtogonal(element[0],animals[0])){
					animals.splice(1,1);animals.push(element[1]);element.used=true;
					showCorrect();
				}
			}
			else if(element[1].timeVisible>=timeVisible && !element.used && animals.length>0){
				if(element[1].shape==animals[0].shape && isOrtogonal(element[1],animals[0])){
					animals.splice(0,1);animals.push(element[0]);element.used=true;
					showCorrect();
				}
				else if(element[1].shape==animals[1].shape && isOrtogonal(element[1],animals[1])){
					showCorrect();
					animals.splice(1,1);animals.push(element[0]);element.used=true;
				}
			}
		})
		var angulo=function(x1,y1,x2,y2){
			var y=y2-y1,x=x2-x1
			var res=(Math.atan(y/x)*(180/Math.PI));
			if(x<0){res+=180;}
			if(res<0){res+=360;}
			return res;
	}
		texto.innerHTML=angulo(markers[0].position.x,markers[0].position.y,markers[1].position.x,markers[1].position.y)
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
	