/*
* A component that offers basic debug drawing capabilities. 
*/
Crafty.c("IDebug", 
{
    init: function() {
        this.lDebugDraw = []; // Array for debug draw objects. 

        if (typeof this.showDebugDraw === 'undefined') {
            /**
            * Draws in the bounds of this object. 
            */
            this.showDebugDraw = function() 
            {
                this.hideDebugDraw();
                var lineWidth = 5 * worldScale; // Width of the lines. 

                this.lDebugDraw.push(
                    Crafty.e("2D, Canvas, Color")
                    .attr({ x: this.x, y: this.y, w: this.w, h: lineWidth })
                    .color("blue")
                );
                this.lDebugDraw.push(
                    Crafty.e("2D, Canvas, Color")
                    .attr({ x: this.x, y: this.y + this.h - lineWidth, w: this.w, h: lineWidth })
                    .color("red")
                );
                this.lDebugDraw.push(
                    Crafty.e("2D, Canvas, Color")
                    .attr({ x: this.x, y: this.y, w: lineWidth, h: this.h })
                    .color("green")
                );
                this.lDebugDraw.push(
                    Crafty.e("2D, Canvas, Color")
                    .attr({ x: this.x + this.w - lineWidth, y: this.y, w: lineWidth, h: this.h })
                    .color("yellow")
                );
            };
        }

        if (typeof this.hideDebugDraw === 'undefined') {
            /**
            * Hides the debug drawing. 
            */
            this.hideDebugDraw = function()
            {
                for (var i = this.lDebugDraw.length - 1; i >= 0; i--) {
                    this.lDebugDraw[i].destroy();
                };
            };
        }
    },
});