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
    	initObjects(function () {
		    onAnimationFrame();
		});
	};

	function initEngine() {
	    var viewWidth = containerEl.offsetWidth;
	    var viewHeight = containerEl.offsetHeight;

	    // instantiate the WebGL Renderer
	    renderer = new THREE.WebGLRenderer();
	    renderer.setSize(viewWidth, viewHeight);
	    renderer.setClearColor( 0xE7E0D0, 1);

	    // create the scene
	    scene = new THREE.Scene();

	    // create camera
	    camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
	    camera.position.set(0, 120, 150);
	    cameraController = new THREE.OrbitControls(camera, containerEl);

	    scene.add(camera);

	    containerEl.appendChild(renderer.domElement);
	}

	function initLights() {
	    // top light
	    lights.topLight = new THREE.PointLight();
	    lights.topLight.position.set(0, 150, 0);
	    lights.topLight.intensity = 1.0;

	    // add the lights in the scene
	    scene.add(lights.topLight);
	}

	function initObjects(callback) {
		var geometry = new THREE.BoxGeometry( 5, 5, 5 );
		var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );
		callback();
	}

	function onAnimationFrame() {
	    requestAnimationFrame(onAnimationFrame);
	    cameraController.update();
	    renderer.render(scene, camera);
	}
};

