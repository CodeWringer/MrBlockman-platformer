/*
* Sprite object for player character. 
*/
Crafty.c("SpritePlayerSleep", 
{
    init: function() 
    {
        this.requires("IBase, Canvas, SpriteAnimation, IOffset, spr_PC_Sleep");
        this.setScale(70, 95);
        this.z = 9001;

        // ------ Define_Animations ------ //
        this.reel("PC_LongInvisible", 1000, 117, 0, 1);     // An unused spot in the tilemap
        this.reel("PC_IdleBored00r", 4000, 0, 0, 116);      // IdleBored, facing right
        this.reel("PC_IdleBored00l", 4000, 0, 1, 116);      // IdleBored, facing left
    },
});