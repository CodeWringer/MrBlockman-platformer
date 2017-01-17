// Include namespaces. 
var interfaces = interfaces || {}; 

/**
* @namespace
* @desc A component that offers some basic and common operations. 
* The members provided by this component can be locally overridden by the implementing objects. 
*/
interfaces.IBase = function() 
{
    Crafty.c("IBase", 
    {
        init: function() {
            /**
            * @desc Crafty component includes. 
            * @private 
            */
            this.requires("2D");

            if (typeof this.initOffset === 'undefined') {
                /** 
                * @desc Initial position of the object, in coordinates. 
                * @memberof interfaces.IBase
                * @public
                */
                this.initOffset = { x: 0, y: 0 }; 
            }
            if (typeof this.levelTile === 'undefined') {
                /** 
                * @desc Position of the object, in level tiles. 
                * @memberof interfaces.IBase
                * @public
                */
                this.levelTile = { x: -1, y: -1 }; 
            }
            if (typeof this.levelSize === 'undefined') {
                /** 
                * @desc Size of the object, in level tiles. 
                * @memberof interfaces.IBase
                * @public
                */
                this.levelSize = { w: 1, h: 1 }; 
            }

            if (typeof this.setPosition === 'undefined') {
                /** 
                * @desc Sets the absolute position coordinates of this object. 
                * @memberof interfaces.IBase
                * @param {Number} x - X coordinate to position the object at. 
                * @param {Number} y - Y coordinate to position the object at. 
                * @public
                */
                this.setPosition = function(x, y) {
                    this.attr({ x: x, y: y });
                };
            }

            if (typeof this.setScale === 'undefined') {
                /** 
                * @desc Overrides the scaling of this object. 
                * Takes world scale into consideration. 
                * @memberof interfaces.IBase
                * @param {Number} w - Width to set for the object. 
                * @param {Number} h - Height to set for the object
                * @public
                */
                this.setScale = function(w, h) {
                    this.attr({ w: (w * worldScale) + 1, h: (h * worldScale) + 1 }); // plus 1 to stuff gaps between blocks. 
                };
            }

            if (typeof this.movePosition === 'undefined') {
                /** 
                * @desc Sets the position coordinates of this object, relative to its current position coordinates. 
                * @memberof interfaces.IBase
                * @param {Number} x - X coordinate to move the position of the object by. 
                * @param {Number} y - Y coordinate to move the position of the object by. 
                * @public
                */
                this.movePosition = function(x, y) {
                    this.attr({ x: this.x + x, y: this.y + y });
                };
            }

            if (typeof this.setInitOffset === 'undefined') {
                /** 
                * @desc Sets the initilization offset of this object. 
                * @memberof interfaces.IBase
                * @param {Number} x - X coordinate to set the initial position of the object to. 
                * @param {Number} y - Y coordinate to set the initial position of the object to. 
                * @public
                */
                this.setInitOffset = function(x, y) {
                    this.initOffset = { x: x, y: y };
                };
            }
        },
    });
}();