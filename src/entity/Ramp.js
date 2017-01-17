/*
* A ramp to build the level geometry with. 
*/
Crafty.c("Ramp", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, SpriteAnimation");
        this.setScale(90, 90);
    },

    /*
    * Defines the appearance for this ramp. 
    */
    setAppearance: function() {
        this.requires("spr_solidBlock_ramps_02");
        this.reel("BL", 1, 0, 0, 1);
        this.reel("BR", 1, 1, 0, 1);
        this.reel("TL", 1, 2, 0, 1);
        this.reel("TR", 1, 3, 0, 1);
        this.animate("BL", 1);
        this.pauseAnimation();
        this.setScale(90, 90);
    },
});