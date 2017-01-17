/*
* Interface that allows an object to have multiple animateable sprites. 
*/
Crafty.c("IReelManager", 
{
    init: function() 
    {
        this.requires("2D, Canvas, SpriteAnimation");
        this.lReel = [];        // A list of reels to animate with.
        this.lSpritesheet = []; // A list of spritesheets for reels. 
        this.reelCurrent = null;// The currently playing reel. 
        this.reelPrev = null;   // The previously played reel. 

        // this.bind("EnterFrame", function(frameData) 
        // {
        //     this.reelCurrent.
        // });
    },

    /*
    * Adds a given reel to the reel list. 
    * Returns the id of the newly added reel, or -1 if the given 
    * reel is already contained. 
    */
    addReel: function(reel, spritesheet) {
        if (this.containsReel(reel))
            return -1;

        var id = this.lReel.length;
        var idSpritesheet = this.getSpritesheetId(spritesheet);
        
        if (idSpritesheet < 0)
            idSpritesheet = this.addSpritesheet(spritesheet);

        this.lReel.push({ id: id, reel: reel, idSpritesheet: idSpritesheet });

        return id;
    },

    /*
    * Removes a given reel from the list, if it can. 
    * Returns true, if the given reel could be removed. 
    */
    removeReel: function(reel) {
        for (var i = this.lReel.length - 1; i >= 0; i--) {
            if (this.lReel[i].reel == reel) {
                this.lReel.splice(i, 1);
                return true;
            }
        };
        return false;
    },

    /*
    * Returns true, if the given reel is contained in the reel list.
    */
    containsReel: function(reel) {
        for (var i = this.lReel.length - 1; i >= 0; i--) {
            if (this.lReel[i].reel == reel)
                return true;
        };
        return false;
    },

    /*
    * Returns the id of a given reel. 
    * Returns -1 if the given reel is not contained. 
    */
    getReelId: function(reel) {
        for (var i = this.lReel.length - 1; i >= 0; i--) {
            if (this.lReel[i].reel == reel)
                return this.lReel[i].id;
        };
        return -1;
    },

    /*
    * Adds a given spritesheet to the spritesheet list. 
    * Returns the id of the newly added spritesheet, or -1 if the 
    * spritesheet is alread contained. 
    */
    addSpritesheet: function(spritesheet) {
        if (this.containsSpritesheet(spritesheet))
            return -1;

        var id = this.lSpritesheet.length;
        this.lReel.push({ id: id, spritesheet: spritesheet });

        return id;
    },

    /*
    * Removes a given spritesheet from the list, if it can. 
    * Returns true, if the given spritesheet could be removed. 
    * Also removes reels that reference the given spritesheet. 
    */
    removeSpritesheet: function(spritesheet) {
        for (var i = this.lSpritesheet.length - 1; i >= 0; i--) {
            if (this.lSpritesheet[i].spritesheet == spritesheet) {
                var id = this.lSpritesheet[i].id;

                for (var u = this.lReel.length - 1; u >= 0; u--) {
                    if (this.lReel[u].spritesheet == id)
                        this.lReel.splice(u, 1);
                };

                this.lSpritesheet.splice(i, 1);

                return true;
            }
        };
        return false;
    },

    /*
    * Returns true, if the given spritesheet is contained in the spritesheet list.
    */
    containsSpritesheet: function(spritesheet) {
        for (var i = this.lSpritesheet.length - 1; i >= 0; i--) {
            if (this.lSpritesheet[i].spritesheet == spritesheet)
                return true;
        };
        return false;
    },

    /*
    * Returns the id of a given spritesheet. 
    * Returns -1 if the given spritesheet is not contained. 
    */
    getSpritesheetId: function(spritesheet) {
        for (var i = this.lSpritesheet.length - 1; i >= 0; i--) {
            if (this.lSpritesheet[i].spritesheet == spritesheet)
                return this.lSpritesheet[i].id;
        };
        return -1;
    },

    /*
    * Stops the playback of the given reel and plays the given reel instead. 
    */
    playReel: function(reel) {
        // 
    },

    /*
    * Stops the playback of the currently active reel.
    */
    stopReel: function() {
        // 
    },

    /*
    * Stops playback of the current reel and switches to the given reel. 
    * Once playback of the given reel finishes, returns to the previous reel. 
    */
    injectReel: function(reel) {
        // 
    },
});