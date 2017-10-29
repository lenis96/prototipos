var DOMINO = {};

DOMINO.Game = function (options) {
    'use strict';
    
    options = options || {};
    
    var boardController = null;
    
    // Initializer.
    function init() {
        boardController = new DOMINO.BoardController({
            containerEl: options.containerEl,
            assetsUrl: options.assetsUrl
        });
        
        boardController.drawBoard();
    }
    
    init();
};