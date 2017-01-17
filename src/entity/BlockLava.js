/*
* Defines a block of lava, a hazard to certain entities. 
*/
Crafty.c("BlockLava", 
{
    init: function() 
    {
        this.requires("2D, Canvas, Color, Collision, IBase");
        this.color("rgb(255, 100, 100)");
        this.setScale(90, 70);
        this.setInitOffset(0, 90 * worldScale - this.h);

        this.onHit("IMortal", function(collData1) 
        {
            collData1[0].obj.die();
        }, function() 
        {
            // 
        });
    },
});