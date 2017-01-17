/*
* Defines a ramp's properties for use in collision detection. 
*/
Crafty.c("IRamp", 
{
    init: function() 
    {
        this.requires("IBase, IDebug");
        this.setScale(90, 90);

        this.isBL = false; // This is in a left corner, on the floor
        this.isBR = false; // This is in a right corner, on the floor
        this.isTL = false; // This is in a left corner, on the ceiling
        this.isTR = false; // This is in a right corner, on the ceiling
        this.a;
        this.b;
    },

    /*
    * Defines the linear function describing this ramp
    */
    setLinF: function() 
    {
        // Formulae
        // a = (y2-y1) / (x2-x1)
        // b = y1 - ax1 or b = y2 - ax2
        // y = ax + b
        // x = (y - b) / a

        if (this.isBL) 
        {
            var x2 = this.x;
            var x1 = this.x + this.w;
            var y2 = this.y;
            var y1 = this.y + this.h;
        } 
        else if (this.isBR) 
        {
            var x1 = this.x;
            var x2 = this.x + this.w;
            var y2 = this.y;
            var y1 = this.y + this.h;
        } 
        else if (this.isTL) 
        {
            var x2 = this.x;
            var x1 = this.x + this.w;
            var y1 = this.y;
            var y2 = this.y + this.h;
        } 
        else if (this.isTR) 
        {
            var x1 = this.x;
            var x2 = this.x + this.w;
            var y1 = this.y;
            var y2 = this.y + this.h;
        }
        this.a = (y2 - y1) / (x2 - x1);
        this.b = y1 - this.a*x1;
    },

    /*
    * Returns a y coordinate on the slope, based on the given x coordinate. 
    */
    getY: function(xIn) 
    {
        return this.a*xIn + this.b;
    },

    /**
    * Draws in the edges of this IRamp. 
    */
    showDebugDraw: function() 
    {
        this.hideDebugDraw();
        var lineWidth = 5 * worldScale; // Width of the lines. 

        var yStart = this.getY(this.x);
        var yEnd = this.getY(this.x + this.w);
        var pntStart = { x: this.x, y: yStart };
        var pntEnd = { x: this.x + this.w, y: yEnd };
        var vecSurface = Maths.getVector(pntStart, pntEnd);
        var surfaceLength = Maths.getVectorLength(vecSurface);
        var angle = Maths.getAtan2DegAngle(pntStart, pntEnd);

        this.lDebugDraw.push(
            Crafty.e("2D, Canvas, Color")
            .attr({ x: pntStart.x, y: pntStart.y, w: surfaceLength, h: lineWidth, rotation: angle })
            .color("blue")
        );

        var yLineBT = this.y;
        var xLineLR = this.x;

        if (this.isBR || this.isBL)
        {
            yLineBT = this.y + this.h - lineWidth;
        }

        this.lDebugDraw.push(
            Crafty.e("2D, Canvas, Color")
            .attr({ x: this.x, y: yLineBT, w: this.w, h: lineWidth })
            .color("red")
        );

        if (this.isBR || this.isTR)
        {
            xLineLR = this.x + this.w - lineWidth;
        }

        this.lDebugDraw.push(
            Crafty.e("2D, Canvas, Color")
            .attr({ x: xLineLR, y: this.y, w: lineWidth, h: this.h })
            .color("green")
        );
    },
});