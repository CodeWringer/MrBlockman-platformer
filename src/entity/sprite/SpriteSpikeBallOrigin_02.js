/*
* Sprite for the point around which the spinning spike ball revolves. 
*/
Crafty.c("SpriteSpikeBallOrigin_02", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, IOffset, spr_SpikeBallOrigin_02");
        this.setScale(120, 120);
        this.z = 8000;
    },
});