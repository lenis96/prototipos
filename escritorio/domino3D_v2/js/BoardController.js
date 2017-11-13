DOMINO.BoardController = function (options) {
    'use strict';

    options = options || {};

    var containerEl = options.containerEl || null;

    var assetsUrl = options.assetsUrl || '';

    this.drawBoard = function () {
        console.log('drawBoard');
    };
};

