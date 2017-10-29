(function () {
    'use strict';
    
    var game = new DOMINO.Game({
        // The DOM element where elements will be drawn.
        containerEl: document.getElementById('boardContainer'),
        
        // Data for the BoardController.
        assetsUrl: '3d_assets/'
    });
    
})();