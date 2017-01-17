/*
* Base component for clips. 
*/
Crafty.c("IClip", 
{
    init: function() 
    {
        this.requires("IBase, IBlock");
        this.setScale(90, 90);

        // this.isFloor = true;
        // this.isCeiling = true;
        // this.isWallL = true;
        // this.isWallR = true;
        // this.isValid = true;
    },
});

/*
* Defines a clip, to block all objects from passing through. 
*/
Crafty.c("IClipAll", 
{
    init: function() 
    {
        this.requires("IClip");
    },
});

/*
* Defines a clip, to block the player from passing through. 
*/
Crafty.c("IClipPlayer", 
{
    init: function() 
    {
        this.requires("IClip");
    },
});

/*
* Defines a clip, to block monsters/enemies from passing through. 
*/
Crafty.c("IClipMonster", 
{
    init: function() 
    {
        this.requires("IClip");
    },
});

/*
* Defines a clip, to block dynamic hazard objects from passing through. 
*/
Crafty.c("IClipHazard", 
{
    init: function() 
    {
        this.requires("IClip");
    },
});