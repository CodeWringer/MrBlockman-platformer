/*
* An interface to be given to entities to allow them to be reset to their level init Position. 
*/
Crafty.c("IReset", 
{
    init: function() 
    {
        this.resetPos = { x: 0, y: 0 };

        if (typeof this.reset === 'undefined') {
            /*
            * Resets the entity. 
            */
            this.reset = function() {
                this.x = this.resetPos.x;
                this.y = this.resetPos.y;
            };
        }

        if (typeof this.setResetPos === 'undefined') {
            /*
            * Overrides the current reset coordinates. 
            */
            this.setResetPos = function(xIn, yIn) {
                this.resetPos.x = xIn;
                this.resetPos.y = yIn;
            };
        }
    },
});