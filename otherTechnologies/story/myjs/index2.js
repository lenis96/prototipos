;(function(){
	var angulo=function(x1,y1,x2,y2){
		var y=y2-y1,x=x2-x1
		var res=(Math.atan(y/x)*(180/Math.PI));
		if(x<0){res+=180;}
		if(res<0){res+=360;}
		return res;
	}
	// var minDistAlign=4;
	// var minDistNear=5;

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
	// function isOrtogonal(element1,element2){
	// 	ans=false;
	// 	console.log({dx:Math.abs(element1.position.x-element2.position.x),dy:Math.abs(element1.position.y-element2.position.y)})
	// 	if(Math.abs(element1.position.x-element2.position.x)<minDistAlign){
	// 		if(Math.abs(element1.position.y-element2.position.y)<minDistNear){
	// 			ans=true;
	// 		}
	// 		else{
	// 			ans=false;
	// 		}
	// 	}
	// 	else if(Math.abs(element1.position.y-element2.position.y)<minDistAlign){
	// 		if(Math.abs(element1.position.x-element2.position.x)<minDistNear){
	// 			ans=true;
	// 		}
	// 		else{
	// 			ans=false;
	// 		}
	// 	}
	// 	return ans;
	// }
	console.log(markers)
	var dist=1.5;
	var game={
		question:0,questions:["La vaca tiene sed, mueve la vaca","Ahora la vaca tiene hambre, mueve la vaca","la vaca tiene sueño, mueve la vaca"], nextQuestion:function(){
			this.question++;
		},getQuestion:function(){
			if(this.question>=this.questions.length){
				return "has compleatado el juego";
			}
			return this.questions[this.question];
		},
		isCorrect(res){
			var r=["A","B","C"];
			if(r[this.question]==res){
				return true;
			}
			else{
				return false
			}
		},isEnd(){
			if(this.question>=this.questions.length){
				return true;
			}
			return false;
		}
	}
	var player={score:0,addScore:function(){
		this.score++;
	},getScore:function(){
		return this.score;
	}};
	document.getElementById("mensaje").innerText=game.getQuestion();
	this.out=true;
	isNear=function(x1,y1,x2,y2){
		console.log(Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2))));
		if(Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2)))<=dist){
			return true;
		}
		else{
			return false;
		}
	}
	var showCorrect=function(){
		document.getElementById("correct").classList.remove("hidden");
					setTimeout(function(){
						document.getElementById("correct").classList.add("hidden");
					},2000);
	}
	var showIncorrect=function(){
		document.getElementById("incorrect").classList.remove("hidden");
					setTimeout(function(){
						document.getElementById("incorrect").classList.add("hidden");
					},2000);
	}
	onRenderFcts.push(function(){
		markers.forEach(function(element){
			// console.log(element.name);
			if(element.visible){
				// var x=(element[0].position.x+element[1].position.x)/2;
				// var y=(element[0].position.y+element[1].position.y)/2;
				// var currentAng=(Math.PI*angulo(element[0].position.x,element[0].position.y,element[1].position.x,element[1].position.y))/180;
				element.grid.position.set(element.position.x,0,element.position.y);
				// element[1].grid.position.set(x-(0.5*Math.sin(currentAng)),0,y-(0.5*Math.cos(currentAng)));
				// element[0].grid.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0),currentAng);
				// element[1].grid.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0),currentAng);
	
			}

		})
		console.log(this.out)
		if(!isNear(markers[0].position.x,markers[0].position.y,markers[1].position.x,markers[1].position.y) && !isNear(markers[0].position.x,markers[0].position.y,markers[2].position.x,markers[2].position.y)){
			this.out=true;

		}
		if(!game.isEnd() && this.out && markers[0].visible && markers[1].visible && isNear(markers[0].position.x,markers[0].position.y,markers[1].position.x,markers[1].position.y)){
			if(game.isCorrect("A")){
				showCorrect();
				game.nextQuestion();
				this.out=false;
				document.getElementById("mensaje").innerText=game.getQuestion();
			}
			else{
				showIncorrect();
			}
		}
		else if(!game.isEnd() && this.out && markers[0].visible && markers[2].visible && isNear(markers[0].position.x,markers[0].position.y,markers[2].position.x,markers[2].position.y)){
			if(game.isCorrect("B")){
				showCorrect();
				game.nextQuestion();
				this.out=false;
				document.getElementById("mensaje").innerText=game.getQuestion();
			}
			else{
				showIncorrect();
			}
		}
		else if(!game.isEnd() && this.out && markers[0].visible && markers[3].visible && isNear(markers[0].position.x,markers[0].position.y,markers[3].position.x,markers[3].position.y)){
			if(game.isCorrect("C")){
				showCorrect();
				game.nextQuestion();
				this.out=false;
				document.getElementById("mensaje").innerText=game.getQuestion();
			}
			else{
				showIncorrect();
			}
		}
	})
})()
	