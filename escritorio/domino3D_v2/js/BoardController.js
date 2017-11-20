DOMINO.BoardController = function (options) {
    'use strict';

    options = options || {};

    var containerEl = options.containerEl || null;
    var assetsUrl = options.assetsUrl || '';

	var renderer;
	var scene;
	var camera;
	var cameraController;	
	var lights = {};
	var materials = {};
	var boardModel;
	var groundModel;
	var pieceModel;
	var squareSize = 10;

    this.drawBoard = function () {
    	initEngine();
    	initLights();
    	initMaterials();
    	initObjects(function () {
		    onAnimationFrame();
		});
	};

	function initEngine() {
	    var viewWidth = containerEl.offsetWidth;
	    var viewHeight = containerEl.offsetHeight;

	    // instantiate the WebGL Renderer
	    renderer = new THREE.WebGLRenderer({
	    	antialias: true
	    });
	    renderer.setSize(viewWidth, viewHeight);
	    renderer.setClearColor( 0xE7E0D0, 1);

	    // create the scene
	    scene = new THREE.Scene();

	    // create camera
	    camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
	    camera.position.set(squareSize * 4, 120, 150);
	    cameraController = new THREE.OrbitControls(camera, containerEl);
	    cameraController.target.set(squareSize * 4, 0, squareSize * 4)

	    scene.add(camera);

	    containerEl.appendChild(renderer.domElement);
	}

	function initLights() {
	    // top light
	    lights.topLight = new THREE.PointLight();
	    lights.topLight.position.set(squareSize * 4, 150, squareSize * 4);
	    lights.topLight.intensity = 0.8;

		lights.ambientLight = new THREE.AmbientLight(0x404040);
		lights.ambientLight.intensity = 0.4;

	    // add the lights in the scene
	    scene.add(lights.topLight);
	    scene.add(lights.ambientLight);
	}

	function initMaterials() {
		var loader = new THREE.TextureLoader();

	    // board material
	    materials.boardMaterial = new THREE.MeshLambertMaterial({
	        map: loader.load(assetsUrl + 'board_texture.jpg')
	    });

	    // ground material
	    materials.groundMaterial = new THREE.MeshBasicMaterial({
	    	transparent: true,
	    	map: loader.load(assetsUrl + 'ground.png')
	    });

	    // dark square material
	    materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
	    	map: loader.load(assetsUrl + 'square_dark_texture.jpg')
	    });
	    //
	    // light square material
	    materials.lightSquareMaterial = new THREE.MeshLambertMaterial({
	    	map: loader.load(assetsUrl + 'square_light_texture.jpg')
	    });

	    // piece material
	    materials.pieceMaterial = new THREE.MeshPhongMaterial({
	    	color: 0xd3d3d3,
	    	shininess: 20
	    });
	}

	function initObjects(callback) {
		var loader = new THREE.JSONLoader();
		var loadedObjects = 0;
		var totalObjects = 2;

		function checkLoad() {
	        loadedObjects++;

	        if (loadedObjects === totalObjects && callback) {
	            callback();
	        }
	    }

	    // load board	    
		loader.load(assetsUrl + 'board.js', function (geom) {
		    boardModel = new THREE.Mesh(geom, materials.boardMaterial);

		    // avoid interception with other models
		    boardModel.position.y = -0.02;

		    scene.add(boardModel);
		    checkLoad();
		});

		// load piece	    
		loader.load(assetsUrl + 'domino.js', function (geom) {
		    pieceModel = new THREE.Mesh(geom, materials.pieceMaterial);

		    pieceModel.scale.set(5,5,5);
		    pieceModel.position.z = 4 * squareSize;
		    pieceModel.position.x = 7 * squareSize / 2;
		    pieceModel.position.y = 4.0;

		    scene.add(pieceModel);
		    checkLoad();
		});

		// add ground
		groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), materials.groundMaterial);
		groundModel.position.set(squareSize * 4, -1.52, squareSize * 4);
		groundModel.rotation.x = -90 * Math.PI / 180;
		scene.add(groundModel);

		// create the board squares
		var squareMaterial;

		for (var row = 0; row < 8; row++) {
		    for (var col = 0; col < 8; col++) {
		        if ((row + col) % 2 === 0) { // light square
		            squareMaterial = materials.lightSquareMaterial;
		        } else { // dark square
		            squareMaterial = materials.darkSquareMaterial;
		        }

		        var square = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), squareMaterial);

		        square.position.x = col * squareSize + squareSize / 2;
		        square.position.z = row * squareSize + squareSize / 2;
		        square.position.y = -0.01;

		        square.rotation.x = -90 * Math.PI / 180;

		        scene.add(square);
		    }
		}

	}

	function onAnimationFrame() {
	    requestAnimationFrame(onAnimationFrame);
	    cameraController.update();
	    renderer.render(scene, camera);
	}
};

