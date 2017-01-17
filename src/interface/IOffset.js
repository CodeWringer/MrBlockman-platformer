// Include namespaces. 
var interfaces = interfaces || {}; 

/**
* @desc Serves as a way of centering an object on another. 
* @namespace
*/
interfaces.IOffset = function() 
{
    Crafty.c("IOffset", 
    {
        init: function() {
            /**
            * @desc The object to move along with. 
            * @memberof interfaces.IOffset
            * @public
            */
            this.movParent = null;
            /**
            * @desc An offset relative to the parent object that this object will be placed at. 
            * @memberof interfaces.IOffset
            * @public
            */
            this.offset = { x: 0, y: 0 };
            this.requires("2D");

            this.bind("EnterFrame", function(frameData) 
            {
                if (this.movParent == null)
                    return;

                this.x = this.movParent.x + this.offset.x;
                this.y = this.movParent.y + this.offset.y;
            });
        },

        /**
        * @desc Overrides the current offset for this object with the given offset. 
        * This centers the sprite on its parent, if no offset is given. 
        * @memberof interfaces.IOffset
        * @param {Point} offset - A point. 
        * @public
        */
        setOffset: function(offset) {
            if (this.movParent == null) 
                return;

            if (offset == null) { // Center on movParent. 
                this.offset.x = (this.movParent.w - this.w) / 2;
                this.offset.y = (this.movParent.h - this.h) / 2;
            } else { // Use given offset. 
                this.offset.x = offset.x;
                this.offset.y = offset.y;
            }
        },
    });
}();