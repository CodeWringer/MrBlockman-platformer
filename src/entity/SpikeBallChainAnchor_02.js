/*
* Anchor point for the chain sprite. 
*/
Crafty.c("SpikeBallChainAnchor_02", 
{
    init: function() 
    {
        this.requires("2D, IBase, IOffset");

        this.spriteObj = Crafty.e("SpriteSpikeBallChain_02");
        this.spriteObj.movParent = this;
        this.spriteObj.offset = { x: 0, y: -this.spriteObj.h/2 };
        this.attr({ w: 1, h: 1 });
    },

    /*
    * Updates the rotation on this object's sprite. 
    */
    updateRot: function(angleIn) 
    {
        this.spriteObj.rotation = angleIn;
    },
});