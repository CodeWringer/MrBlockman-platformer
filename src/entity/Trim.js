/*
* Defines a decorative trim as an overlay for blocks. 
*/
Crafty.c("Trim", 
{
    init: function() 
    {
        this.requires("2D, IBase, Canvas, SpriteAnimation");
    },

    /*
    * Defines the appearance for this trim. 
    */
    setAppearance: function() {
        this.requires("spr_solidBlocks_trims_02");
        this.reel("T", 1, 0, 0, 1);
        this.reel("B", 1, 1, 0, 1);
        this.reel("L", 1, 2, 0, 1);
        this.reel("R", 1, 3, 0, 1);
        this.reel("TLc", 1, 4, 0, 1);
        this.reel("TRc", 1, 5, 0, 1);
        this.reel("BLc", 1, 6, 0, 1);
        this.reel("BRc", 1, 7, 0, 1);
        this.reel("TRr", 1, 8, 0, 1);
        this.reel("TLr", 1, 9, 0, 1);
        this.reel("BRr", 1, 10, 0, 1);
        this.reel("BLr", 1, 11, 0, 1);
        this.animate("T", 1);
        this.pauseAnimation();
        this.setScale(90, 90);
    },
});