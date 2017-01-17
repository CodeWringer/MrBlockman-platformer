// Include namespaces. 
var interfaces = interfaces || {}; 
interfaces.IClip = interfaces.IClip || {};

/**
* @namespace
* @desc Base component for clips. 
*/
interfaces.IClip.IClip = function() 
{
    Crafty.c("IClip", 
    {
        init: function() 
        {
            this.requires("IBase, IBlock");
            this.setScale(90, 90);
        },
    });
}();

/**
* @namespace
* @desc Defines a clip, that blocks all objects. 
*/
interfaces.IClip.IClipAll = function() 
{
    Crafty.c("IClipAll", 
    {
        init: function() 
        {
            this.requires("IClip");
        },
    });
}();
 
/**
* @namespace
* @desc Defines a clip, to block the player from passing through. 
*/
interfaces.IClip.IClipPlayer = function() 
{
    Crafty.c("IClipPlayer", 
    {
        init: function() 
        {
            this.requires("IClip");
        },
    });
}();

/**
* @namespace
* @desc Defines a clip, to block monsters/enemies from passing through. 
*/
interfaces.IClip.IClipMonster = function() 
{
    Crafty.c("IClipMonster", 
    {
        init: function() 
        {
            this.requires("IClip");
        },
    });
}();

/**
* @namespace
* @desc Defines a clip, to block dynamic hazard objects from passing through. 
*/
interfaces.IClip.IClipHazard = function() 
{
    Crafty.c("IClipHazard", 
    {
        init: function() 
        {
            this.requires("IClip");
        },
    });
}();