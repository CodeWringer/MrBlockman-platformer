// Include namespaces. 
var entities = entities || {};

/**
* @namespace
* @desc Contains the "LevelBuilder" Crafty object. 
*/
entities.levelBuilder = function() 
{
    /** 
    * Enum of possible relative position values. 
    * @enum {Number}
    * @readonly 
    * @public
    */
    this.eRelativePositions = {
        left: 0,
        right: 1,
        above: 2,
        below: 3,
        aboveLeft: 4,
        aboveRight: 5,
        belowLeft: 6,
        belowRight: 7
    };

    /**
    * @class
    * @desc Instantiates and manages levels. 
    * @memberof entities.levelBuilder
    */
    Crafty.c("LevelBuilder", 
    {
        /**
        * Define grid size and the size of each tile. 
        * @memberof entities.levelBuilder
        * @public
        */
        tileSize: {w: (90 * worldScale), h: (90 * worldScale)},

        /**
        * List of all contained objects. 
        * @memberof entities.levelBuilder
        * @private
        */
        lObject: [], 
        /**
        * List of solid blocks. 
        * @memberof entities.levelBuilder
        * @private
        */
        lBlock: [], 
        /**
        * List of solid ramps. 
        * @memberof entities.levelBuilder
        * @private
        */
        lRamp: [], 
        /**
        * List of clip blocks.
        * @memberof entities.levelBuilder
        * @private
        */
        lClip: [], 
        /**
        * List of entities. 
        * @memberof entities.levelBuilder
        * @private
        */
        lEntity: [],
        /**
        * List of trim objects. 
        * @memberof entities.levelBuilder
        * @private
        */
        lTrim: [], 
        /**
        * List of collision objects (IBlock, IRamp, etc.). 
        * @memberof entities.levelBuilder
        * @private
        */
        lCollision: [],
        /**
        * List of IBlock objects. 
        * @memberof entities.levelBuilder
        * @private
        */
        lIBlock: [], 
        /**
        * List of IRamp objects. 
        * @memberof entities.levelBuilder
        * @private
        */
        lIRamp: [], 

        /**
        * The number of the currently initialized level. 
        * @memberof entities.levelBuilder
        * @private
        */
        curLevel: -1,
        /**
        * Last x and y tile index of the current level. 
        * @memberof entities.levelBuilder
        * @private
        */
        levelBounds: { x: -1, y: -1 }, 

        // -------------------- Init_Level -------------------- //
        /** 
        * Sets up the given level. 
        * @param {Number} levelNum - Number of the level to initialize. 
        * @memberof entities.levelBuilder
        * @public
        */
        initLevel: function(levelNum) 
        {
            if (!maps[levelNum]) {
                console.log("Could not load level at levelNum " + levelNum);
                return;
            }

            this.curLevel = levelNum;
            this.levelBounds = { x: maps[levelNum][0].length - 1, y: maps[levelNum].length - 1 };

            for (var tileY = 0; tileY < maps[levelNum].length; tileY++)
            { 
                for (var tileX = 0; tileX < maps[levelNum][tileY].length; tileX++)
                {
                    var tileValue = maps[levelNum][tileY][tileX];
                    var obj = this.getObjectInit(tileValue, tileX, tileY);

                    if (obj == null)
                        continue;

                    if (obj.has("IReset")) {
                        obj.setResetPos(obj.x, obj.y);
                    }

                    if (obj.has("Block")) {
                        obj.setAppearance("spr_solidBlock_bg_02");
                        this.lBlock.push(obj);

                        var IBlock = this.getObjectInit(1000, tileX, tileY);
                        this.lIBlock.push(IBlock);
                        this.lCollision.push(IBlock);
                        this.lObject.push(IBlock);
                    } else if (obj.has("Ramp")) {
                        obj.setAppearance("spr_solidBlock_ramps_02");
                        this.lRamp.push(obj);

                        var IRamp = this.getObjectInit(1001, tileX, tileY);
                        this.lIRamp.push(IRamp);
                        this.lCollision.push(IRamp);
                        this.lObject.push(IRamp);
                    } else if (obj.has("IClip")) {
                        this.lClip.push(obj);
                    } else {
                        this.lEntity.push(obj);
                    }

                    this.lObject.push(obj);
                }
            }

            this.setRampCollisions();
            this.setBlockCollisions();
            this.setBlockAppearances();
            this.setBlockAppearancesCorners();
            this.setRampAppearances();
            this.setRampAppearancesCorners();
            this.setClipCollisions();
            this.optimizeCollisions();

            Crafty("Player").each(function(i) {
                Game.bindViewport(this);
            });

            console.log("Current level: " + this.curLevel);
        },

        /** 
        * Creates and returns a new object, based on the given number. 
        * @param {Number} tileX - X level tile position the object will be placed at. 
        * @param {Number} tileY - Y level tile position the object will be placed at. 
        * @memberof entities.levelBuilder
        * @private
        * @returns {Object} An object, corresponding to the given number. 
        */
        getObjectInit: function(objNum, tileX, tileY) {
            var obj = null;
            var prop = null;

            switch(objNum) {
                case 0:
                    break;
                case 1:
                    obj = Crafty.e("Block");
                    break;
                case 2:
                    obj = Crafty.e("Ramp");
                    break;
                case 3:
                    obj = Crafty.e("Player");
                    break;
                case 4:
                    obj = Crafty.e("LevelExit");
                    break;
                case 5:
                    obj = Crafty.e("BlockLava");
                    break;
                case 6:
                    obj = Crafty.e("Checkpoint");
                    break;
                case 7:
                    obj = Crafty.e("IClipAll");
                    break;
                case 8:
                    obj = Crafty.e("IClipPlayer");
                    break;
                case 9:
                    obj = Crafty.e("IClipMonster");
                    break;
                case 10:
                    obj = Crafty.e("IClipHazard");
                    break;
                case 11:
                    obj = Crafty.e("SpikeBall_01");
                    prop = { collType: "roll", velocity: { x: 100, y: 0 } };
                    break;
                case 12:
                    obj = Crafty.e("SpikeBall_01");
                    prop = { collType: "float", velocity: { x: 100, y: 0 } };
                    break;
                case 13:
                    obj = Crafty.e("SpikeBall_01");
                    prop = { collType: "bounce", velocity: { x: 100, y: -400 } };
                    break;
                case 14:
                    obj = Crafty.e("SpikeBall_01");
                    prop = { collType: "roll", velocity: { x: -100, y: 0 } };
                    break;
                case 15:
                    obj = Crafty.e("SpikeBall_01");
                    prop = { collType: "float", velocity: { x: -100, y: 0 } };
                    break;
                case 16:
                    obj = Crafty.e("SpikeBall_01");
                    prop = { collType: "bounce", velocity: { x: -100, y: -400 } };
                    break;
                case 17:
                    obj = Crafty.e("LauncherSpikeBall");
                    prop = { collType: "roll", velocity: { x: 100, y: 0 }, launchDelay: 5000 };
                    break;
                case 18:
                    obj = Crafty.e("LauncherSpikeBall");
                    prop = { collType: "roll", velocity: { x: -100, y: 0 }, launchDelay: 5000 };
                    break;
                case 19:
                    obj = Crafty.e("SpikeBall_02");
                    prop = { rotationDir: "clockwise", rotationSpeed: 2, chainLength: 15 };
                    obj.initOffset.x = this.tileSize.w / 2;
                    obj.initOffset.y = this.tileSize.h / 2;
                    break;
                case 20:
                    obj = Crafty.e("SpikeBall_02");
                    prop = { rotationDir: "counterClockwise", rotationSpeed: 2, chainLength: 15 };
                    obj.initOffset.x = this.tileSize.w / 2;
                    obj.initOffset.y = this.tileSize.h / 2;
                    break;
                case 21:
                    obj = Crafty.e("JumpPad");
                    break;
                case 22:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "left", projectileType: "default" };
                    break;
                case 23:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "right", projectileType: "default" };
                    break;
                case 24:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "up", projectileType: "default" };
                    break;
                case 25:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "down", projectileType: "default" };
                    break;
                case 26:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "left", projectileType: "chase" };
                    break;
                case 27:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "right", projectileType: "chase" };
                    break;
                case 27:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "up", projectileType: "chase" };
                    break;
                case 29:
                    obj = Crafty.e("ProjectileShooter");
                    prop = { direction: "down", projectileType: "chase" };
                    break;
                case 1000:
                    obj = Crafty.e("IBlock");
                    break;
                case 1001:
                    obj = Crafty.e("IRamp");
                    break;
                default:
                    console.log("Could not find entity for id: " + objNum);
                    return;
            }

            if (obj != null)
            {
                obj.x = tileX * this.tileSize.w + obj.initOffset.x;
                obj.y = tileY * this.tileSize.h + obj.initOffset.y;
                obj.levelTile = { x: tileX, y: tileY };
                
                if (typeof obj.setUp !== 'undefined')
                {
                    if (prop == null)
                        obj.setUp();
                    else
                        obj.setUp(prop);
                }
            }

            return obj;
        },

        // -------------------- Solids_Collision_Booleans -------------------- //
        /** 
        * Sets up the collision bools for all ramps. 
        * @memberof entities.levelBuilder
        * @private
        */
        setRampCollisions: function() 
        {
            var setUpCount = 0; // Count of set up ramp collisions. 

            // Check every ramp. 
            for (var i = this.lIRamp.length-1; i > -1; --i) 
            {
                var curRamp = this.lIRamp[i];

                // -------- Checking_Bools -------- //
                var tileL = this.getTile(curRamp, eRelativePositions.left, this.lCollision);
                var tileR = this.getTile(curRamp, eRelativePositions.right, this.lCollision);
                var tileT = this.getTile(curRamp, eRelativePositions.above, this.lCollision);
                var tileB = this.getTile(curRamp, eRelativePositions.below, this.lCollision);            

                // -------- CurRamp_Bools -------- //
                if (tileL != null && tileB != null) 
                    curRamp.isBL = true;
                else if (tileL != null && tileT != null) 
                    curRamp.isTL = true;
                else if (tileR != null && tileB != null) 
                    curRamp.isBR = true;
                else if (tileR != null && tileT != null) 
                    curRamp.isTR = true;

                // Calls a function that determines how collisions with this ramp will be calculated
                curRamp.setLinF();

                setUpCount++;
            }
            console.log("Set up collision data for " + setUpCount + " ramps.");
        },

        /** 
        * Sets up the collision bools for all blocks. 
        * @memberof entities.levelBuilder
        * @private
        */
        setBlockCollisions: function() 
        {
            var count = 0; // Count of set up block collisions. 

            for (var i = this.lIBlock.length-1; i > -1; --i) 
            {
                var curBlock = this.lIBlock[i];

                var tileL = this.getTile(curBlock, eRelativePositions.left, this.lCollision);
                var tileR = this.getTile(curBlock, eRelativePositions.right, this.lCollision);
                var tileT = this.getTile(curBlock, eRelativePositions.above, this.lCollision);
                var tileB = this.getTile(curBlock, eRelativePositions.below, this.lCollision);

                if (tileL != null) 
                    curBlock.isWallL = false;
                if (tileR != null) 
                    curBlock.isWallR = false;
                if (tileB != null) 
                    curBlock.isCeiling = false;
                if (tileT != null) 
                    curBlock.isFloor = false;

                if (curBlock.levelTile.x == 0)
                    curBlock.isWallL = false;
                else if (curBlock.levelTile.x == this.levelBounds.x) 
                    curBlock.isWallR = false;

                if (curBlock.levelTile.y == 0) 
                    curBlock.isFloor = false;
                else if (curBlock.levelTile.y == this.levelBounds.y)
                    curBlock.isCeiling = false;

                count++;
            }
            console.log("Set up collision data for " + count + " blocks.");
        },

        /** 
        * Sets up the collision bools for all clips. 
        * @memberof entities.levelBuilder
        * @private
        */
        setClipCollisions: function() {
            var count = 0; // Count of set up block collisions. 

            for (var i = this.lClip.length-1; i > -1; --i) 
            {
                var curClip = this.lClip[i];

                var tileL = this.getTile(curClip, eRelativePositions.left, this.lCollision);
                var tileR = this.getTile(curClip, eRelativePositions.right, this.lCollision);
                var tileA = this.getTile(curClip, eRelativePositions.above, this.lCollision);
                var tileB = this.getTile(curClip, eRelativePositions.below, this.lCollision);

                if (curClip.levelTile.x == 0)
                    curClip.isWallL = false;
                else if (curClip.levelTile.x == this.levelBounds.x) 
                    curClip.isWallR = false;

                if (curClip.levelTile.y == 0) 
                    curClip.isFloor = false;
                else if (curClip.levelTile.y == this.levelBounds.y)
                    curClip.isCeiling = false;

                if (tileL != null && (tileL.has("IBlock") || tileL.has("IRamp") || tileL.has("IClip")))
                    curClip.isWallL = false;

                if (tileR != null && (tileR.has("IBlock") || tileR.has("IRamp") || tileR.has("IClip")))
                    curClip.isWallR = false;

                if (tileA != null && (tileA.has("IBlock") || tileA.has("IRamp") || tileA.has("IClip")))
                    curClip.isFloor = false;

                if (tileB != null && (tileB.has("IBlock") || tileB.has("IRamp") || tileB.has("IClip")))
                    curClip.isCeiling = false;

                count++;
            }
            console.log("Set up collision data for " + count + " clips.");
        },

        /**
        * Combines and removes collision objects when possible to allow collision checking to run faster. 
        * @memberof entities.levelBuilder
        * @private
        */
        optimizeCollisions: function()
        {
            var countRemoved = 0;
            var countRemovedLast = 0;

            var countRemovedEmpty = this.removeEmptyBlocks();

            do
            {
                countRemovedLast = this.combineBlocks();
                countRemoved += countRemovedLast;
            } while (countRemovedLast > 0)

            console.log("Optimization: Removed " + countRemovedEmpty + " empty blocks.");
            console.log("Optimization: Combined " + countRemoved + " blocks.");
            console.log("Optimization: " + this.lIBlock.length + " remaining blocks.");
            console.log("Optimization: " + this.lIRamp.length + " remaining ramps.");
            console.log("Optimization: " + this.lCollision.length + " remaining collision objects.");
        },

        /**
        * Removes all empty "IBlock" objects and returns the number removed. 
        * An "IBlock" is considered empty if it has no active collisions. 
        * @memberof entities.levelBuilder
        * @private
        */
        removeEmptyBlocks: function()
        {
            var countRemovedEmpty = 0;

            for (var i = this.lIBlock.length - 1; i >= 0; i--) {
                var curIBlock = this.lIBlock[i];

                if (!curIBlock.isWallL && !curIBlock.isWallR && !curIBlock.isFloor && !curIBlock.isCeiling) {
                    this.lCollision.splice(this.lCollision.indexOf(curIBlock), 1);
                    this.lIBlock.splice(this.lIBlock.indexOf(curIBlock), 1);
                    curIBlock.destroy();
                    curIBlock = null;
                    countRemovedEmpty++;
                }
            };

            return countRemovedEmpty;
        },

        /**
        * Combines blocks when possible. 
        * @memberof entities.levelBuilder
        * @private
        * @returns {Number} Number of removed (combined) blocks. 
        */
        combineBlocks: function()
        {
            var countRemoved = 0;

            // for (var i = this.lIBlock.length - 1; i >= 0; i--) {
            //     var curIBlock = this.lIBlock[i];

            //     var tileL = this.getTile(curIBlock, eRelativePositions.left, this.lCollision);
            //     var tileR = this.getTile(curIBlock, eRelativePositions.right, this.lCollision);
            //     var tileB = this.getTile(curIBlock, eRelativePositions.below, this.lCollision);
            //     var tileT = this.getTile(curIBlock, eRelativePositions.above, this.lCollision);

                
            // };

            return countRemoved;
        },

        // -------------------- Solids_Appearance -------------------- //
        /** 
        * Adds a trim object at the given coordinates. 
        * @memberof entities.levelBuilder
        * @private
        */
        addTrim: function(xIn, yIn, reel)
        {
            var trim = Crafty.e("Trim");
            trim.attr({ x: xIn, y: yIn, w: this.tileSize.w+1, h: this.tileSize.h+1 });
            trim.setAppearance();
            trim.animate(reel);
            trim.pauseAnimation();
            this.lTrim.push(trim);
            this.lObject.push(trim);
        },

        /**
        * Sets the current animated frame of the curSolid tile, 
        * the animation is actually paused so it's changing the appearance of the block permanently. 
        * @memberof entities.levelBuilder
        * @private
        */
        setBlockAppearances: function() 
        {
            var count = 0; // Counter for set up blocks. 

            for (var i = this.lBlock.length-1; i > -1; --i) 
            {
                var curBlock = this.lBlock[i];
                var curIBlock = this.getTile(curBlock, null, this.lCollision);

                if (curIBlock === null)
                    continue;

                // Adds a trim object to the location of the curBlock and 
                // makes sure the curBlock has at least one true bool
                if (curIBlock.isWallL) 
                    this.addTrim(curBlock.x, curBlock.y, "L");
                if (curIBlock.isWallR) 
                    this.addTrim(curBlock.x, curBlock.y, "R");
                if (curIBlock.isFloor) 
                    this.addTrim(curBlock.x, curBlock.y, "T");
                if (curIBlock.isCeiling) 
                    this.addTrim(curBlock.x, curBlock.y, "B");

                count++;
            }
            
            console.log("Set up appearances for " + count + " blocks.");
        },

        /**
        * Sets the current animated frame of the curSolidCorner tile, 
        * the animation is actually paused so it's changing the appearance of the block permanently
        * This one sets the appearance of the corner pieces of the solidBlocks
        * @memberof entities.levelBuilder
        * @private
        */
        setBlockAppearancesCorners: function() 
        {
            var count = 0;

            // Check against IBlock objects. 
            for (var i = this.lBlock.length-1; i > -1; --i) 
            {
                var curBlock = this.lBlock[i];
                var createdCorner = false;

                var tileL = this.getTile(curBlock, eRelativePositions.left, this.lCollision);
                var tileR = this.getTile(curBlock, eRelativePositions.right, this.lCollision);
                var tileA = this.getTile(curBlock, eRelativePositions.above, this.lCollision);
                var tileB = this.getTile(curBlock, eRelativePositions.below, this.lCollision);
                
                //    [A]
                // [L][ ]
                if (tileL != null && (tileL.isFloor || tileL.isBR) && tileA != null && tileA.isWallL) {
                    this.addTrim(curBlock.x, curBlock.y, "TLc");
                    createdCorner = true;
                }
                // [A]
                // [ ][R]
                if (tileR != null && (tileR.isFloor || tileR.isBL) && tileA != null && tileA.isWallR) {
                    this.addTrim(curBlock.x, curBlock.y, "TRc");
                    createdCorner = true;
                }
                // [L][ ]
                //    [B]
                if (tileL != null && (tileL.isCeiling || tileL.isTR) && tileB != null && tileB.isWallL) {
                    this.addTrim(curBlock.x, curBlock.y, "BLc");
                    createdCorner = true;
                }
                // [ ][R]
                // [B]
                if (tileR != null && (tileR.isCeiling || tileR.isTL) && tileB != null && tileB.isWallR) {
                    this.addTrim(curBlock.x, curBlock.y, "BRc");
                    createdCorner = true;
                }

                if (createdCorner)
                    count++;
            }

            console.log("Set up appearances for " + count + " block corners.");
        },

        /**
        * Sets the current animated frame of the curRamp tile, 
        * the animation is actually paused so it's changing the appearance of the block permanently
        * This one sets the appearance of the solidRamps
        * @memberof entities.levelBuilder
        * @private
        */
        setRampAppearances: function() 
        {
            var count = 0; // Counter for set up ramp appearances. 

            for (var i = this.lRamp.length-1; i > -1; --i) 
            {
                var curRamp = this.lRamp[i];
                var curIRamp = this.getTile(curRamp, null, this.lCollision);

                if (curIRamp.isBL) 
                {
                    curRamp.animate("BL");
                    curRamp.pauseAnimation();
                }
                else if (curIRamp.isBR) 
                {
                    curRamp.animate("BR");
                    curRamp.pauseAnimation();
                }
                else if (curIRamp.isTL) 
                {
                    curRamp.animate("TL");
                    curRamp.pauseAnimation();
                }
                else if (curIRamp.isTR) 
                {
                    curRamp.animate("TR");
                    curRamp.pauseAnimation();
                }

                count++;
            }

            console.log("Set up appearances for " + count + " ramps.");
        },


        /**   
        * Sets the current animated frame of the curRampCorner tile, 
        * the animation is actually paused so it's changing the appearance of the block permanently
        * This one sets the appearance of the solidRamps
        * @memberof entities.levelBuilder
        * @private
        */
        setRampAppearancesCorners: function() 
        {
            var count = 0;

            for (var i = this.lRamp.length-1; i > -1; --i) 
            {
                var curRamp = this.lRamp[i];
                var createdCorner = false;

                var curIRamp = this.getTile(curRamp, null, this.lCollision);
                var tileB = this.getTile(curRamp, eRelativePositions.below, this.lCollision);
                var tileT = this.getTile(curRamp, eRelativePositions.above, this.lCollision);

                if (tileB != null) 
                {
                    if (curIRamp.isBL) {
                        this.addTrim(tileB.x, tileB.y, "TRr");
                        createdCorner = true;
                    }
                    else if (curIRamp.isBR) {
                        this.addTrim(tileB.x, tileB.y, "TLr");
                        createdCorner = true;
                    }
                }
                if (tileT != null) 
                {
                    if (curIRamp.isTL) {
                        this.addTrim(tileT.x, tileT.y, "BRr");
                        createdCorner = true;
                    }
                    else if (curIRamp.isTR) {
                        this.addTrim(tileT.x, tileT.y, "BLr");
                        createdCorner = true;
                    }
                }

                if (createdCorner)
                    count++;
            }

            console.log("Set up appearances for " + count + " ramp corners.");
        },

        // -------------------- General_Level_Functions -------------------- //
        /**
        * Clears all entities in the current scene and level and resets the lists. 
        * @memberof entities.levelBuilder
        * @public
        */
        destroyLevel: function() 
        {
            Crafty("*").each(function(i) {
                this.destroy();
            });

            this.lObject = null; 
            this.lBlock = null; 
            this.lRamp = null; 
            this.lClip = null; 
            this.lEntity = null; 
            this.lTrim = null; 
            this.lCollision = null; 
            this.lIBlock = null; 
            this.lIRamp = null;

            this.lObject = []; 
            this.lBlock = []; 
            this.lRamp = []; 
            this.lClip = []; 
            this.lEntity = []; 
            this.lTrim = []; 
            this.lCollision = []; 
            this.lIBlock = []; 
            this.lIRamp = [];

            this.curLevel = -1;
        },

        /**
        * Advances to the next level. 
        * Does nothing, if there is no next level. 
        * @memberof entities.levelBuilder
        * @public
        */
        advanceLevel: function() 
        {
            if (maps[this.curLevel + 1]) // Next level exists. 
            {
                this.destroyLevel();
                this.initLevel(this.curLevel + 1);
            } 
            else // Next level does not exist. 
            {
                console.log("No level at num: " + (this.curLevel + 1) + "!")
            }
        },

        /**
        * Does clean up of the current level. 
        * @memberof entities.levelBuilder
        * @public
        */
        restartLevel: function() 
        {
            for (var i = this.lObject.length - 1; i >= 0; i--) {
                var obj = this.lObject[i];

                if (obj.has("IReset"))
                    obj.reset();
            };
        },

        /**
        * Returns a tile relative to the given object. 
        * @param {IBase} relObj - The object relative to which will be searched. 
        * @param {eRelativePositions} relPosition - Enum value indicating in which direction to search. 
        * @param {Array} searchList - List of "IBase" implementing objects. 
        * @memberof entities.levelBuilder
        * @public
        * @return {IBase} An "IBase" implementing object or null. 
        */
        getTile: function(relObj, relPosition, searchList) 
        {
            if (searchList == null)
                return null;

            var x = relObj.levelTile.x;
            var y = relObj.levelTile.y;
            var w = relObj.levelSize.w;
            var h = relObj.levelSize.h;

            if (relPosition == eRelativePositions.left) {
                x = x - 1;
            } else if (relPosition == eRelativePositions.right) {
                x = x + w;
            } else if (relPosition == eRelativePositions.above) {
                y = y - 1;
            } else if (relPosition == eRelativePositions.below) {
                y = y + h;
            } else if (relPosition == eRelativePositions.aboveLeft) {
                x = x - 1;
                y = y - 1;
            } else if (relPosition == eRelativePositions.aboveRight) {
                x = x + w;
                y = y - 1;
            } else if (relPosition == eRelativePositions.belowLeft) {
                x = x - 1;
                y = y + h;
            } else if (relPosition == eRelativePositions.belowRight) {
                x = x + w;
                y = y + h;
            }
     
            for (var i = searchList.length-1; i > -1; --i) 
            {
                var curObj = searchList[i];

                // "Comp" shorthand for "comparison object". 
                var xComp = curObj.levelTile.x;
                var yComp = curObj.levelTile.y;
                var wComp = curObj.levelSize.w;
                var hComp = curObj.levelSize.h;

                // -1 to width and height because the position x and y are included. 
                // Ex.: xComp = 1; wComp = 2;
                // Occupied x level tiles: 
                //  0, 1, 2, 3, 4, ...  - index
                // [-, X, X, -, -, ...] - occupied marked with "X"
                if (x < xComp || x > xComp + (wComp - 1) ||
                    y < yComp || y > yComp + (hComp - 1)) 
                {
                    continue;
                }
                else
                {
                    return curObj;
                }
            }
            return null;
        },

        /**
        * Returns an object from the given list at the given coordinates. 
        * @param {Number} x - X coordinate at which to search. 
        * @param {Number} y - Y coordinate at which to search. 
        * @param {Array} searchList - Array of "IBase" implementing objects. 
        * @memberof entities.levelBuilder
        * @public
        * @return {IBase} An "IBase" implementing object or null. 
        */
        getObjectAt: function(x, y, searchList) 
        {
            for (var i = searchList.length - 1; i >= 0; i--) {
                var objAt = searchList[i];

                if (objAt.x == x && objAt.y == y)
                    return objAt;
            };
        },
    });
}();