/*
* Sprite for the chain of the spinning spike ball. 
*/
Crafty.c("SpriteSpikeBallChain_02", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, IOffset, spr_SpikeBallChain_02");
        this.setScale(20, 12);
        this.origin(0, this.h/2);
        this.z = 6000;

        this.angle = 0;
    },
});