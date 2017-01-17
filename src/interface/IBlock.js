// Include namespaces. 
var interfaces = interfaces || {}; 

/**
* @namespace
* @desc Defines a block's properties for use in collision detection. 
*/
interfaces.IBlock = function()
{
    Crafty.c("IBlock", 
    {
        init: function() 
        {
            /**
            * @desc Crafty component includes. 
            * @private 
            */
            this.requires("IBase, IDebug");
            this.setScale(90, 90);

            /** 
            * @desc Boolean that determines whether this block is a floor. 
            * @memberof interfaces.IBlock
            * @public
            */
            this.isFloor = true;
            /** 
            * @desc Boolean that determines whether this block is a ceiling. 
            * @memberof interfaces.IBlock
            * @public
            */
            this.isCeiling = true;
            /** 
            * @desc Boolean that determines whether this block is a wall left. 
            * @memberof interfaces.IBlock
            * @public
            */
            this.isWallL = true;
            /** 
            * @desc Boolean that determines whether this block is a wall right. 
            * @memberof interfaces.IBlock
            * @public
            */
            this.isWallR = true;

            /** 
            * @desc Boolean that determines whether this block is at all active. 
            * @memberof interfaces.IBlock
            * @private
            */
            this.isValid = true;
        },
    });
}();