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
	
	// Board square size.
	var squareSize = 10;
	
    //The board representation.
    var board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    
    // Draws the board.
    this.drawBoard = function () {
        initEngine();
        initLights();
        initMaterials();
        
        initObjects(function () {
            onAnimationFrame();   
        });
    };
    
    //Initialize some basic 3D engine elements. 
    function initEngine() {
        var viewWidth = containerEl.offsetWidth;
        var viewHeight = containerEl.offsetHeight;
        
        // instantiate the WebGL Renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(viewWidth, viewHeight);
        
        // create the scene
        scene = new THREE.Scene();
        
        // create camera
		camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
		camera.position.set(squareSize * 4, 120, 150);
		cameraController = new THREE.OrbitControls(camera, containerEl);
		cameraController.center = new THREE.Vector3(squareSize * 4, 0, squareSize * 4);
        //
        scene.add(camera);
        
        containerEl.appendChild(renderer.domElement);
    }
    
    /**
     * Initialize the lights.
     */
	function initLights() {
	    // top light
        lights.topLight = new THREE.PointLight();
        lights.topLight.position.set(squareSize * 4, 150, squareSize * 4);
        lights.topLight.intensity = 0.4;
        
        // white's side light
        lights.topSideLight = new THREE.SpotLight();
        lights.topSideLight.position.set( squareSize * 4, 100, squareSize * 4 + 200);
        lights.topSideLight.intensity = 0.8;
        lights.topSideLight.shadowCameraFov = 55;

        // black's side light
        lights.bottomSideLight = new THREE.SpotLight();
        lights.bottomSideLight.position.set( squareSize * 4, 100, squareSize * 4 - 200);
        lights.bottomSideLight.intensity = 0.8;
        lights.bottomSideLight.shadowCameraFov = 55;
        
        // light that will follow the camera position
        lights.movingLight = new THREE.PointLight(0xf9edc9);
        lights.movingLight.position.set(0, 10, 0);
        lights.movingLight.intensity = 0.5;
        lights.movingLight.distance = 500;
        
        // add the lights in the scene
        scene.add(lights.topLight);
        scene.add(lights.topSideLight);
        scene.add(lights.bottomSideLight);
        scene.add(lights.movingLight);
	}
	
    //Initialize the materials.
	function initMaterials() {
	    // board material
	    materials.boardMaterial = new THREE.MeshLambertMaterial({
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'board_texture.jpg')
	    });
	 
	    // ground material
	    materials.groundMaterial = new THREE.MeshBasicMaterial({
	        transparent: true,
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'ground.png')
	    });
	 
	    // dark square material
	    materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_dark_texture.jpg')
	    });
	    //
	    // light square material
	    materials.lightSquareMaterial = new THREE.MeshLambertMaterial({
	        map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_light_texture.jpg')
	    });
	}
    
    
    //Initialize the objects.
	function initObjects(callback) {
	    var loader = new THREE.JSONLoader();
	    var totalObjectsToLoad = 1; // board
        var loadedObjects = 0; // count the loaded objects
	 
	    // checks if all the objects have been loaded
	    function checkLoad() {
	        loadedObjects++;
	 
	        if (loadedObjects === totalObjectsToLoad && callback) {
	            callback();
	        }
	    }
	 
	    // load board
	    loader.load(assetsUrl + 'board.js', function (geom) {
	        boardModel = new THREE.Mesh(geom, materials.boardMaterial);
	        boardModel.position.y = -0.02;
	 
	        scene.add(boardModel);
	 
	        checkLoad();
	    });
	    
	    // add ground
		groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), materials.groundMaterial);
		groundModel.position.set(squareSize * 4, -1.52, squareSize * 4);
		groundModel.rotation.x = -90 * Math.PI / 180;
		//
		scene.add(groundModel);
		 
		// create the board squares
		var squareMaterial;
		//
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
    
    // Render loop.
    function onAnimationFrame() {
        requestAnimationFrame(onAnimationFrame);
        
        cameraController.update();
        
        // update moving light position
        lights.movingLight.position.x = camera.position.x;
        lights.movingLight.position.z = camera.position.z;
        
        renderer.render(scene, camera);
    }
    
    // Converts a board position to a 3D world position.
    function boardToWorld (pos) {
	    var x = (1 + pos[1]) * squareSize - squareSize / 2;
	    var z = (1 + pos[0]) * squareSize - squareSize / 2;
	 
	    return new THREE.Vector3(x, 0, z);
	}
};

