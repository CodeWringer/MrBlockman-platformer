/*
* Sprite for spike ball on chain hazard. 
*/
Crafty.c("SpriteSpikeBall_02", 
{
    init: function()
    {
        this.rotationSpeed = -150;

        this.requires("2D, Canvas, IBase, IOffset, spr_spikeBall_02");
        this.setScale(120, 120);
        this.z = 8000;
    },
});