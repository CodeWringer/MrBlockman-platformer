// Include namespaces. 
var interfaces = interfaces || {}; 

/**
* @desc An interface to be given to entities to allow them to be reset to their level init Position. 
* @namespace
*/
interfaces.IReset = function() 
{
    Crafty.c("IReset", 
    {
        init: function() 
        {
            /**
            * @desc Position to place the object at when it is reset. 
            * @memberof interfaces.IReset
            * @private
            */
            this.resetPos = { x: 0, y: 0 };

            if (typeof this.reset === 'undefined') {
                /**
                * @desc Resets the entity. 
                * @memberof interfaces.IReset
                * @public
                */
                this.reset = function() {
                    this.x = this.resetPos.x;
                    this.y = this.resetPos.y;
                };
            }

            if (typeof this.setResetPos === 'undefined') {
                /**
                * @desc Overrides the current reset coordinates. 
                * @memberof interfaces.IReset
                * @public
                */
                this.setResetPos = function(xIn, yIn) {
                    this.resetPos.x = xIn;
                    this.resetPos.y = yIn;
                };
            }
        },
    });
}();