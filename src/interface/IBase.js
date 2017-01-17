/*
* A component that offers some basic and common operations. 
* The members provided by this component can be locally overridden by the implementing objects. 
*/
Crafty.c("IBase", 
{
    init: function() {
        this.requires("2D");

        if (typeof this.initOffset === 'undefined') {
            this.initOffset = { x: 0, y: 0 };  // Initial position of the object, in coordinates. 
        }
        if (typeof this.levelTile === 'undefined') {
            this.levelTile = { x: -1, y: -1 }; // Position of the object, in level tiles. 
        }
        if (typeof this.levelSize === 'undefined') {
            this.levelSize = { w: 1, h: 1 };  // Size of the object, in level tiles. 
        }

        if (typeof this.setPosition === 'undefined') {
            /*
            * Sets the absolute position coordinates of this object. 
            */
            this.setPosition = function(x, y) {
                this.attr({ x: x, y: y });
            };
        }

        if (typeof this.setScale === 'undefined') {
            /*
            * Overrides the scaling of this object. 
            * Takes world scale into consideration. 
            */
            this.setScale = function(w, h) {
                this.attr({ w: (w * worldScale) + 1, h: (h * worldScale) + 1 }); // plus 1 to stuff gaps between blocks. 
            };
        }

        if (typeof this.movePosition === 'undefined') {
            /*
            * Sets the position coordinates of this object, relative to its current position coordinates. 
            */
            this.movePosition = function(x, y) {
                this.attr({ x: this.x + x, y: this.y + y });
            };
        }

        if (typeof this.setInitOffset === 'undefined') {
            /*
            * Sets the initilization offset of this object. 
            */
            this.setInitOffset = function(x, y) {
                this.initOffset = { x: x, y: y };
            };
        }
    },
});