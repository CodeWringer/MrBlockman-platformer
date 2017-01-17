/*
* Defines a block's properties for use in collision detection. 
*/
Crafty.c("IBlock", 
{
    init: function() 
    {
        this.requires("IBase, IDebug");
        this.setScale(90, 90);

        this.isFloor = true;
        this.isCeiling = true;
        this.isWallL = true;
        this.isWallR = true;
        this.isValid = true;
    },
});