(function () {
    'use strict';

    var game = new DOMINO.Game({
        // The DOM element in which the drawing will happen.
        containerEl: document.getElementById('boardContainer'),

        // The base URL from where the BoardController will load its data.
        assetsUrl: 'assets/'
    });

})();
