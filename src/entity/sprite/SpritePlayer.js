/*
* Sprite object for player character. 
*/
Crafty.c("SpritePlayer", 
{
    init: function() 
    {
        this.requires("2D, Canvas, SpriteAnimation, IBase, IOffset, spr_PC");
        this.setScale(70, 95);
        this.z = 9001;

        // ------ Define_Animations ------ //
        this.reel("PC_Idle00r", 2000, 0, 0, 47);    // Idle, facing right
        this.reel("PC_Idle00l", 2000, 0, 1, 47);    // Idle, facing left
        this.reel("PC_Walk00r", 1000, 0, 6, 23);    // Walking, facing right
        this.reel("PC_Walk00l", 1000, 0, 7, 23);    // Walking, facing left
        this.reel("PC_Run00r", 500, 0, 2, 11);      // Running, facing right
        this.reel("PC_Run00l", 500, 0, 3, 11);      // Running, facing left
        this.reel("PC_Jump00r_st", 500, 0, 4, 12);  // Jumping start, facing right
        this.reel("PC_Jump00l_st", 500, 0, 5, 12);  // Jumping start, facing left
        this.reel("PC_Jump00r_mid", 1000, 12, 4, 1);// Falling, facing right
        this.reel("PC_Jump00l_mid", 1000, 12, 5, 1);// Falling, facing left
        this.reel("PC_Bloat00r", 750, 0, 8, 18);    // Bloating, facing right
        this.reel("PC_Bloat00l", 750, 0, 9, 18);    // Bloating, facing left
        this.reel("PC_Invisible", 2000, 47, 3, 1);  // An unused spot in the tilemap
    },
});