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
	    lights.topLight.intensity = 1.0;

	    // add the lights in the scene
	    scene.add(lights.topLight);
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

	    // pieces shadow plane material
	    materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
	        transparent: true,
	        map: loader.load(assetsUrl + 'piece_shadow.png')
	    });
	}

	function initObjects(callback) {
		var loader = new THREE.JSONLoader();
		var loadedObjects = 0;
		var totalObjects = 1;

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

