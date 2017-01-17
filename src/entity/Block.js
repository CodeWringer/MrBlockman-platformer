/*
* Defines a block to build the level geometry with. 
*/
Crafty.c("Block", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, SpriteAnimation");
        this.setScale(90, 90);
        this.isValid = true;
    },

    /*
    * Defines the appearance for this block. 
    */
    setAppearance: function(spriteIn) {
        this.requires(spriteIn);
        this.reel("default", 2000, 0, 0, 12);
        this.animate("default", 1);
        this.pauseAnimation();
        this.setScale(90, 90);
    },
});