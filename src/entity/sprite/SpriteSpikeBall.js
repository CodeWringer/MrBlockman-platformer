/*
* Sprite for spike ball hazard. 
*/
Crafty.c("SpriteSpikeBall", 
{
    init: function() 
    {
        this.requires("2D, Canvas, SpriteAnimation, IBase, IOffset, spr_spikeBall_01");
        this.setScale(150, 150);
        this.z = 5000;
    },
});