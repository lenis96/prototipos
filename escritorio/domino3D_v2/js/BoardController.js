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
	var projector;
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
    this.drawBoard = function () {
    	initEngine();
    	initLights();
    	initMaterials();
    	initObjects(function () {
		    onAnimationFrame();
		});

		initListeners();
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

		projector = new THREE.Projector();
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

	function initListeners() {
        var domElement = renderer.domElement;
     
        domElement.addEventListener('mousedown', onMouseDown, false);
        domElement.addEventListener('mouseup', onMouseUp, false);
    }

	function onAnimationFrame() {
	    requestAnimationFrame(onAnimationFrame);
	    cameraController.update();
	    renderer.render(scene, camera);
	}
	
	function onMouseDown(event) {
        var mouse3D = getMouse3D(event);
     
        if (isMouseOnBoard(mouse3D)) {
            if (isPieceOnMousePosition(mouse3D)) {
                selectPiece(mouse3D);
                renderer.domElement.addEventListener('mousemove', onMouseMove, false);
            }
         
			cameraController.userRotate = false;
			
        }
    }
    
    /**
     * On mouse up.
     * @param {MouseEvent} event
     */
    function onMouseUp(event) {
        renderer.domElement.removeEventListener('mousemove', onMouseMove, false);
     
        var mouse3D = getMouse3D(event);
     
        if (isMouseOnBoard(mouse3D) && selectedPiece) {
            var toBoardPos = worldToBoard(mouse3D);
     
            if (toBoardPos[0] === selectedPiece.boardPos[0] && toBoardPos[1] === selectedPiece.boardPos[1]) {
                deselectPiece();
            } else {
                if (callbacks.pieceCanDrop && callbacks.pieceCanDrop(selectedPiece.boardPos, toBoardPos, selectedPiece.obj.color)) {
                    instance.movePiece(selectedPiece.boardPos, toBoardPos);
     
                    if (callbacks.pieceDropped) {
                        callbacks.pieceDropped(selectedPiece.boardPos, toBoardPos, selectedPiece.obj.color);
                    }
     
                    selectedPiece = null;
                } else {
                    deselectPiece();
                }
            }
        } else {
            deselectPiece();
        }
     
        cameraController.userRotate = true;
    }

    /**
     * On mouse move.
     * @param {MouseEvent} event
     */
    function onMouseMove(event) {
        var mouse3D = getMouse3D(event);
        
        // drag selected piece
        if (selectedPiece) {
            selectedPiece.obj.position.x = mouse3D.x;
            selectedPiece.obj.position.z = mouse3D.z;
            
            // lift piece
            selectedPiece.obj.children[0].position.y = 0.75;
        }
    }
    
    /**
     * Converts the board position to 3D world position.
     * @param {Array} pos The board position.
     * @returns {THREE.Vector3}
     */
    function boardToWorld (pos) {
	    var x = (1 + pos[1]) * squareSize - squareSize / 2;
	    var z = (1 + pos[0]) * squareSize - squareSize / 2;
	 
	    return new THREE.Vector3(x, 0, z);
	}

    /**
     * Converts the world position to board position array.
     * @param {THREE.Vector3} pos
     * @returns {Array|Boolean} False if position was outside the board.
     */
    function worldToBoard(pos) {
        var i = 8 - Math.ceil((squareSize * 8 - pos.z) / squareSize);
        var j = Math.ceil(pos.x / squareSize) - 1;
     
        if (i > 7 || i < 0 || j > 7 || j < 0 || isNaN(i) || isNaN(j)) {
            return false;
        }
     
        return [i, j];
    }

    /**
     * Gets the mouse point in 3D for the XZ plane (Y == 0).
     * @param {MouseEvent} mouseEvent
     * @returns {THREE.Vector3}
     */
    function getMouse3D(mouseEvent) {
        var x, y;
        //
        if (mouseEvent.offsetX !== undefined) {
            x = mouseEvent.offsetX;
            y = mouseEvent.offsetY;
        } else {
            x = mouseEvent.layerX;
            y = mouseEvent.layerY;
        }
     
        var pos = new THREE.Vector3(0, 0, 0);
        var pMouse = new THREE.Vector3(
            (x / renderer.domElement.width) * 2 - 1,
           -(y / renderer.domElement.height) * 2 + 1,
           1
        );
        //
        projector.unprojectVector(pMouse, camera);
     
        var cam = camera.position;
        var m = pMouse.y / ( pMouse.y - cam.y );
     
        pos.x = pMouse.x + ( cam.x - pMouse.x ) * m;
        pos.z = pMouse.z + ( cam.z - pMouse.z ) * m;
     
        return pos;
    }

    /**
     * Test if the mouse position is on the board.
     * @param {THREE.Vector3} pos Mouse position.
     * @returns {Boolean}
     */
    function isMouseOnBoard(pos) {
        if (pos.x >= 0 && pos.x <= squareSize * 8 &&
            pos.z >= 0 && pos.z <= squareSize * 8) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test if there's a piece on mouse position.
     * @param {THREE.Vector3} pos Mouse position.
     * @returns {Boolean}
     */
    function isPieceOnMousePosition(pos) {
        var boardPos = worldToBoard(pos);
     
        if (boardPos && board[ boardPos[0] ][ boardPos[1] ] !== 0) {
            return true;
        }
     
        return false;
    }

    /**
     * Selects a piece on the board.
     * @param {THREE.Vector3} pos The projected mouse coordinates to 3D.
     * @returns {Boolean} False if there's no piece to select.
     */
    function selectPiece(pos) {
        var boardPos = worldToBoard(pos);
     
        // check for piece presence
        if (board[ boardPos[0] ][ boardPos[1] ] === 0) {
            selectedPiece = null;
            return false;
        }
     
        selectedPiece = {};
        selectedPiece.boardPos = boardPos;
        selectedPiece.obj = board[ boardPos[0] ][ boardPos[1] ];
        selectedPiece.origPos = selectedPiece.obj.position.clone();
     
        return true;
    }

    /**
     * Deselects the selected piece.
     */
    function deselectPiece() {
        if (!selectedPiece) {
            return;
        }
     
        selectedPiece.obj.position = selectedPiece.origPos;
        selectedPiece.obj.children[0].position.y = 0;
     
        selectedPiece = null;
	}
	console.log("lel")
};

