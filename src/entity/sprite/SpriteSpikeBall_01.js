/*
* Sprite for spike ball hazard. 
*/
Crafty.c("SpriteSpikeBall_01", 
{
    init: function() 
    {
        this.requires("Canvas, IBase, IOffset, spr_spikeBall_01");
        this.setScale(150, 150);
        this.z = 5000;
    },
});