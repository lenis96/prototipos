;(function(){
	var angulo=function(x1,y1,x2,y2){
		var y=y2-y1,x=x2-x1
		var res=(Math.atan(y/x)*(180/Math.PI));
		if(x<0){res+=180;}
		if(res<0){res+=360;}
		return res;
	}
	var minDistAlign=0.4;
	var minDistNear=2;

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
					// object.rotateY(90);
					object.isShape=true;
					marker.grid=object;
					parent.add(object);
				})
		})
	}
	var markers=[];
	for(var i=0;i<scene.children.length;i++){
		if(scene.children[i].isMarker){
			markers.push(scene.children[i]);
		}
	}
	var pieces=[];
	for (var i=0;i<markers.length;){
		pieces.push([markers[i],markers[i+1],0])
		i+=2
	}
	for(var i=0;i<markers.length;i++){
		loadOBJMarker(objPaths[i],mtlPaths[i],scene,[0,0],markers[i])
	}
	var player={score:0,addScore:function(){
		var elem=document.createElement("img");
		elem.src="img/happy.png";
		elem.width="50";
		document.getElementById("scores").appendChild(elem);
		this.score++;
	},getScore:function(){
		return this.score;
	}};
	var animals=[];
	var timeVisible=30;
	var score=0;
	var turn={turn:"p1",changeTurn:function(){
		if(this.turn=="p1"){this.turn="p2";}
		else{this.turn="p1";}
	},
	getTurn:function(){
		return this.turn;
	}};
	// document.getElementById("score").innerText="Puntaje: "+player.getScore();
	var showCorrect=function(){
		// document.getElementById("score").innerText="Puntaje: "+player.getScore();
		document.getElementById("correct").classList.remove("hidden");
		document.getElementById("correct").classList.add("img");
					setTimeout(function(){
						document.getElementById("correct").classList.remove("img");
						document.getElementById("correct").classList.add("hidden");
					},2000);
	}
	function isOrtogonal(element1,element2){
		ans=false;
		console.log({dx:Math.abs(element1.position.x-element2.position.x),dy:Math.abs(element1.position.y-element2.position.y)})
		console.log('x',element1.position.x-element2.position.x);
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
	a=true;
	onRenderFcts.push(function(){
	// 	var geometry = lineMesh.geometry
	// 	geometry.vertices[0].copy(markerRoot1.position)
		// console.log(markerRoot1.position);
		pieces.forEach(function(element){
			// console.log(element.name);
			if(element[0].visible && element[1].visible){
				var x=(element[0].position.x+element[1].position.x)/2;
				var y=(element[0].position.y+element[1].position.y)/2;
				var currentAng=(Math.PI*angulo(element[0].position.x,element[0].position.y,element[1].position.x,element[1].position.y))/180;
				currentAng-=Math.PI/2;
				console.log('ang',currentAng);
				element[0].grid.position.set(x+(0.5*Math.sin(currentAng)),0,y+(0.5*Math.cos(currentAng)));
				element[1].grid.position.set(x-(0.5*Math.sin(currentAng)),0,y-(0.5*Math.cos(currentAng)));
				element[0].grid.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0),currentAng);
				element[1].grid.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0),currentAng);
			}
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
			//TODO logica para ver si el marcador se encuentra estatico
			if(element[0].timeVisible>=timeVisible && element[1].timeVisible>=timeVisible && animals.length==0){
				animals.push(element[0]);
				animals.push(element[1]);
				console.log(animals.map(function(x){return x.shape}));
				element.used=true;
				turn.changeTurn();
			}
			
			else if(element[0].timeVisible>=timeVisible && !element.used && animals.length>0){
				if(element[0].shape==animals[0].shape && isOrtogonal(element[0],animals[0])){
					animals.splice(0,1);
					animals.push(element[1]);
					element.used=true;
					console.log(animals.map(function(x){return x.shape}));
					if(turn.getTurn()=="p2"){
						player.addScore();
					}
					showCorrect();
					turn.changeTurn();
				}
				else if(element[0].shape==animals[1].shape && isOrtogonal(element[0],animals[0])){
					animals.splice(1,1);animals.push(element[1]);element.used=true;
					if(turn.getTurn()=="p2"){
						player.addScore();
					}
					showCorrect();
					turn.changeTurn();
				}
			}
			else if(element[1].timeVisible>=timeVisible && !element.used && animals.length>0){
				if(element[1].shape==animals[0].shape && isOrtogonal(element[1],animals[0])){
					animals.splice(0,1);animals.push(element[0]);element.used=true;
					if(turn.getTurn()=="p2"){
						player.addScore();
					}
					showCorrect();
					turn.changeTurn();
				}
				else if(element[1].shape==animals[1].shape && isOrtogonal(element[1],animals[1])){
					animals.splice(1,1);animals.push(element[0]);element.used=true;
					if(turn.getTurn()=="p2"){
						player.addScore();
					}
					showCorrect();
					turn.changeTurn();
				}
			}
				
		})
	})
})()
	