// ------------- collisionDetection ------------- //
Crafty.c("collisionDetection", {
    init: function() {
        this.broadphasebox = {x: 0, y: 0, w: 0, h: 0 };
        this.requires("HelperMaths");
    },

    checkCollisions: function(args) {
        // ------------ Collision_Detection ------------ //
        this.updateBroadphasebox(this.milliDT);

        // ---- solidBlocks ---- //
        if (args.checkSolids == true) 
        {
            for (var i = solidBlockList.length-1; i > -1; --i) 
            {
                var tile = solidBlockList[i];
                if (tile.x+tile.w > this.broadphasebox.x && tile.x < this.broadphasebox.x+this.broadphasebox.w) 
                {
                    if (tile.y+tile.h > this.broadphasebox.y && tile.y < this.broadphasebox.y+this.broadphasebox.h) 
                        this.checkCollisionSweptAABB(tile, this.milliDT);
                }
            }
        }
        // ---- ramps ---- //
        if (args.checkRamps == true) 
        {
            for (var i = solidRampList.length-1; i > -1; --i) 
            {
                var rampTile = solidRampList[i];
                if (rampTile.x+rampTile.w > this.broadphasebox.x && rampTile.x < this.broadphasebox.x+this.broadphasebox.w) 
                {
                    if (rampTile.y+rampTile.h > this.broadphasebox.y && rampTile.y < this.broadphasebox.y+this.broadphasebox.h) 
                        this.checkCollisionSweptRamp(rampTile, this.milliDT);
                }
            }
        }
        // ---- clips ---- //
        if (args.checkClips == true) 
        {
            for (var i = clipList.length-1; i > -1; --i) 
            {
                var clipTile = clipList[i];
                if (clipTile.x+clipTile.w > this.broadphasebox.x && clipTile.x < this.broadphasebox.x+this.broadphasebox.w) 
                {
                    if (clipTile.y+clipTile.h > this.broadphasebox.y && clipTile.y < this.broadphasebox.y+this.broadphasebox.h) 
                        this.checkCollisionSweptAABB(clipTile, this.milliDT);
                }
            }
        }
        // ---- pcClips ---- //
        if (args.checkPCclips == true) 
        {
            for (var i = pcClipList.length-1; i > -1; --i) 
            {
                var pcClipTile = pcClipList[i];
                if (pcClipTile.x+pcClipTile.w > this.broadphasebox.x && pcClipTile.x < this.broadphasebox.x+this.broadphasebox.w) 
                {
                    if (pcClipTile.y+pcClipTile.h > this.broadphasebox.y && pcClipTile.y < this.broadphasebox.y+this.broadphasebox.h) 
                        this.checkCollisionSweptAABB(pcClipTile, this.milliDT);
                }
            }
        }
        // ---- hazardClips ---- //
        if (args.checkHazardClips == true) 
        {
            for (var i = hazardClipList.length-1; i > -1; --i) 
            {
                var hazardClipTile = hazardClipList[i];
                if (hazardClipTile.x+hazardClipTile.w > this.broadphasebox.x && hazardClipTile.x < this.broadphasebox.x+this.broadphasebox.w) 
                {
                    if (hazardClipTile.y+hazardClipTile.h > this.broadphasebox.y && hazardClipTile.y < this.broadphasebox.y+this.broadphasebox.h) 
                        this.checkCollisionSweptAABB(hazardClipTile, this.milliDT);
                }
            }
        }
        // ---- entities ---- //
        if (args.checkEnts == true) 
        {
            for (var i = entitiesList.length-1; i > -1; --i) 
            {
                var curEnt = entitiesList[i];
                if (curEnt.x+curEnt.w > this.broadphasebox.x && curEnt.x < this.broadphasebox.x+this.broadphasebox.w) 
                {
                    if (curEnt.y+curEnt.h > this.broadphasebox.y && curEnt.y < this.broadphasebox.y+this.broadphasebox.h) 
                        this.checkCollisionSweptAABB(curEnt, this.milliDT);
                }
            }
        }
    },

    updateBroadphasebox: function(milliDT) 
    {
        var xVel = this.curVel.x * milliDT;
        var yVel = this.curVel.y * milliDT;
        this.broadphasebox.x = xVel >= 0 ? this.x + xVel : this.x + xVel*2;
        this.broadphasebox.y = yVel >= 0 ? this.y + yVel : this.y + yVel*2;
        this.broadphasebox.w = xVel >= 0 ? this.w + xVel : this.w - xVel;
        this.broadphasebox.h = yVel >= 0 ? this.h + yVel : this.h - yVel;
    },

    getlastCollObj: function(objDirTypeIn) 
    {
        if (objDirTypeIn == "isWallL")
            return "wallL";
        else if (objDirTypeIn == "isWallR")
            return "wallR";
        else if (objDirTypeIn == "isFloor")
            return "floor";
        else if (objDirTypeIn == "isCeiling")
            return "ceiling";
        else if (objDirTypeIn == "isRampBL")
            return "rampBL";
        else if (objDirTypeIn == "isRampBR")
            return "rampBR";
        else if (objDirTypeIn == "isRampTL")
            return "rampTL";
        else if (objDirTypeIn == "isRampTR")
            return "rampTR";
    },

    // Attempts to predict this object's location in the next frame and prevent collisions beforehand
    // Uses the swept method, to deal with very fast objects (Currently still flawed)
    checkCollisionSweptAABB: function(obj, milliDT) 
    {
        // Declare vars
        var thisVelX = this.curVel.x * milliDT;
        var thisVelY = this.curVel.y * milliDT;

        var thisL = this.x;
        var thisR = (this.x + this.w);
        var thisT = this.y;
        var thisB = (this.y + this.h);

        var thisHalfH = (this.y + this.h/2);
        var thisHalfW = (this.x + this.w/2);

        var thisNextL = this.x + thisVelX;
        var thisNextT = this.y + thisVelY;
        var thisNextR = thisNextL + this.w;
        var thisNextB = thisNextT + this.h;

        var objL = obj.x;
        var objR = (obj.x + obj.w);
        var objT = obj.y;
        var objB = (obj.y + obj.h);

        // Find entry and exit points on both axes
        var xEntry = thisVelX > 0 ? objL : objR;
        var yEntry = thisVelY > 0 ? objT : objB;

        // Formulas
        // a = (y2-y1) / (x2-x1)
        // b = y1 - ax1 or b = y2 - ax2
        // y = ax + b
        // x = (y - b) / a

        // Detect collisions
        
        // ---- Bi_Directional_Movement ---- //
        if (thisVelX != 0 && thisVelY != 0) 
        {
            // Determine b for each of the linear functions
            var a = ((thisNextT - thisT) / (thisNextL - thisL));
            var b_TL = thisT - a*thisL; // top left corner
            var b_TR = thisT - a*thisR; // top right corner
            var b_BL = thisB - a*thisL; // bottom left corner
            var b_BR = thisB - a*thisR; // bottom right corner
            var b_halfHL = thisHalfH - a*thisL; // middle left
            var b_halfHR = thisHalfH - a*thisR; // middle right
                
            // Calculate x and y coords based on the linear functions
            // Entry point
            var xLinF_TL = (yEntry - b_TL) / a;
            var yLinF_TL = a*xEntry + b_TL;

            // Useful for getting on which axis the linear function has a value
            // in the expected range, if any. 
            var boolLinF_TL = this.getLinFisInRange(xLinF_TL, yLinF_TL, obj); 

            var xLinF_TR = (yEntry - b_TR) / a;
            var yLinF_TR = a*xEntry + b_TR;
            var boolLinF_TR = this.getLinFisInRange(xLinF_TR, yLinF_TR, obj);

            var xLinF_BL = (yEntry - b_BL) / a;
            var yLinF_BL = a*xEntry + b_BL;
            var boolLinF_BL = this.getLinFisInRange(xLinF_BL, yLinF_BL, obj);

            var xLinF_BR = (yEntry - b_BR) / a;
            var yLinF_BR = a*xEntry + b_BR;
            var boolLinF_BR = this.getLinFisInRange(xLinF_BR, yLinF_BR, obj);

            var xLinF_halfHL = (yEntry - b_halfHL) / a;
            var yLinF_halfHL = a*xEntry + b_halfHL;
            var boolLinF_halfHL = this.getLinFisInRange(xLinF_halfHL, yLinF_halfHL, obj);

            var xLinF_halfHR = (yEntry - b_halfHR) / a;
            var yLinF_halfHR = a*xEntry + b_halfHR;
            var boolLinF_halfHR = this.getLinFisInRange(xLinF_halfHR, yLinF_halfHR, obj);

            // Determine vectors and vector lengths
            var xVectorLengths = [];
            var yVectorLengths = [];
            // TL
            if (boolLinF_TL.xInRange == true) // X
            { 
                if (thisVelY < 0) // Moving up
                { 
                    if (obj.isCeiling) 
                    {
                        var xVector_TL = this.getVector({ x: thisL, y: thisT }, { x: xLinF_TL, y: yEntry });
                        var xVectorLength_TL = this.getVectorLength(xVector_TL);
                        xVectorLengths.push({ len: xVectorLength_TL, xCoord: xLinF_TL, origin: "TL" });
                    }
                }
            }
            if (boolLinF_TL.yInRange == true) // Y
            { 
                if (thisVelX < 0) // Moving left
                { 
                    if (obj.isWallR) 
                    {
                        var yVector_TL = this.getVector({ x: thisL, y: thisT }, { x: xEntry, y: yLinF_TL });
                        var yVectorLength_TL = this.getVectorLength(yVector_TL);
                        yVectorLengths.push({ len: yVectorLength_TL, yCoord: yLinF_TL, origin: "TL" });
                    }
                }
            }
            // TR
            if (boolLinF_TR.xInRange == true) // X
            {
                if (thisVelY < 0) // Moving up
                {
                    if (obj.isCeiling) 
                    {
                        var xVector_TR = this.getVector({ x: thisR, y: thisT }, { x: xLinF_TR, y: yEntry });
                        var xVectorLength_TR = this.getVectorLength(xVector_TR);
                        xVectorLengths.push({ len: xVectorLength_TR, xCoord: xLinF_TR, origin: "TR" });
                    }
                }
            }
            if (boolLinF_TR.yInRange == true) // Y
            {
                if (thisVelX > 0) // Moving right
                {
                    if (obj.isWallL) 
                    {
                        var yVector_TR = this.getVector({ x: thisR, y: thisT }, { x: xEntry, y: yLinF_TR });
                        var yVectorLength_TR = this.getVectorLength(yVector_TR);
                        yVectorLengths.push({ len: yVectorLength_TR, yCoord: yLinF_TR, origin: "TR" });
                    }
                }
            }
            // BL
            if (boolLinF_BL.xInRange == true) // X
            {
                if (thisVelY > 0) // Moving down
                {
                    if (obj.isFloor) 
                    {
                        var xVector_BL = this.getVector({ x: thisL, y: thisB }, { x: xLinF_BL, y: yEntry });
                        var xVectorLength_BL = this.getVectorLength(xVector_BL);
                        xVectorLengths.push({ len: xVectorLength_BL, xCoord: xLinF_BL, origin: "BL" });
                    }
                }
            }
            if (boolLinF_BL.yInRange == true) // Y
            {
                if (thisVelX < 0) // Moving left
                {
                    if (obj.isWallR) 
                    {
                        var yVector_BL = this.getVector({ x: thisL, y: thisB }, { x: xEntry, y: yLinF_BL });
                        var yVectorLength_BL = this.getVectorLength(yVector_BL);
                        yVectorLengths.push({ len: yVectorLength_BL, yCoord: yLinF_BL, origin: "BL" });
                    }
                }
            }
            // BR
            if (boolLinF_BR.xInRange == true) // X
            {
                if (thisVelY > 0) // Moving down
                {
                    if (obj.isFloor) 
                    {
                        var xVector_BR = this.getVector({ x: thisR, y: thisB }, { x: xLinF_BR, y: yEntry });
                        var xVectorLength_BR = this.getVectorLength(xVector_BR);
                        xVectorLengths.push({ len: xVectorLength_BR, xCoord: xLinF_BR, origin: "BR" });
                    }
                }
            }
            if (boolLinF_BR.yInRange == true) // Y
            {
                if (thisVelX > 0) // Moving right
                {
                    if (obj.isWallL) 
                    {
                        var yVector_BR = this.getVector({ x: thisR, y: thisB }, { x: xEntry, y: yLinF_BR });
                        var yVectorLength_BR = this.getVectorLength(yVector_BR);
                        yVectorLengths.push({ len: yVectorLength_BR, yCoord: yLinF_BR, origin: "BR" });
                    }
                }
            }
            // halfHL
            if (boolLinF_halfHL.yInRange == true) // Y
            {
                if (thisVelX < 0) // Moving left
                {
                    if (obj.isWallR) 
                    {
                        var yVector_halfHL = this.getVector({ x: thisL, y: thisHalfH }, { x: xEntry, y: yLinF_halfHL });
                        var yVectorLength_halfHL = this.getVectorLength(yVector_halfHL);
                        yVectorLengths.push({ len: yVectorLength_halfHL, yCoord: yLinF_halfHL, origin: "halfHL" });
                    }
                }
            }
            // halfHR
            if (boolLinF_halfHR.yInRange == true) // Y
            {
                if (thisVelX > 0) // Moving right
                {
                    if (obj.isWallL) 
                    {
                        var yVector_halfHR = this.getVector({ x: thisR, y: thisHalfH }, { x: xEntry, y: yLinF_halfHR });
                        var yVectorLength_halfHR = this.getVectorLength(yVector_halfHR);
                        yVectorLengths.push({ len: yVectorLength_halfHR, yCoord: yLinF_halfHR, origin: "halfHR" });
                    }
                }
            }
            
            // Find shortest vector length
            // Check x vector lengths
            if (xVectorLengths.length > 0) 
            {
                if (!shortestVector) 
                    var shortestVector = xVectorLengths[0];

                for (var i = xVectorLengths.length-1; i > -1; --i) 
                {
                    var curVectorX = xVectorLengths[i];

                    if (curVectorX.len < shortestVector.len)
                        shortestVector = curVectorX;
                }
            }
            // Check y vector lengths
            if (yVectorLengths.length > 0) 
            {
                if (!shortestVector)
                    var shortestVector = yVectorLengths[0];

                for (var u = yVectorLengths.length-1; u > -1; --u) 
                {
                    var curVectorY = yVectorLengths[u];

                    if (curVectorY.len < shortestVector.len)
                        shortestVector = curVectorY;
                }
            }
        }

        if (obj.curVel) 
            var isStatic = false;
        else 
            var isStatic = true;

        if (shortestVector) 
        {
            if (shortestVector.yCoord) // Collision on x axis, because a y coordinate is returned from the linear functions
            {
                if (thisVelX > 0) // Moving right
                    this.respondToCollision({ direction: "wallL", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
                else // Moving left
                    this.respondToCollision({ direction: "wallR", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
            } 
            else // Collision on y axis, because a x coordinate is returned from the linear functions
            {
                if (thisVelY > 0) // Moving down
                    this.respondToCollision({ direction: "floor", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
                else // Moving up
                    this.respondToCollision({ direction: "ceiling", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
            }
        }
        // ---- Mono_Directional_Movement ---- //
        // Moving only along y axis
        else if (thisVelX == 0) 
        {
            if (thisVelY > 0) // Moving down
            { 
                if (obj.isFloor) 
                {
                    if (thisL > objL && thisL < objR || thisR > objL && thisR < objR) 
                    {
                        if (thisNextB >= objT || thisB >= objT) 
                            this.respondToCollision({ direction: "floor", isStatic: isStatic, obj: obj });
                    }
                }
            } 
            else if (thisVelY < 0) // Moving up
            { 
                if (obj.isCeiling) 
                {
                    if (thisL > objL && thisL < objR || thisR > objL && thisR < objR) 
                    {
                        if (thisNextT <= objB || thisT <= objB)
                            this.respondToCollision({ direction: "ceiling", isStatic: isStatic, obj: obj });
                    }
                }
            }
        // Moving only along x axis
        } 
        else if (thisVelY == 0) 
        {
            if (thisVelX > 0) // Moving right
            { 
                if (obj.isWallL) 
                {
                    if (thisT > objT && thisT < objB || thisB > objT && thisB < objB) 
                    {
                        if (thisNextR >= objL || thisR >= objL)
                            this.respondToCollision({ direction: "wallL", isStatic: isStatic, obj: obj });
                    }
                }
            } 
            else if (thisVelX < 0) // Moving left
            { 
                if (obj.isWallR) 
                {
                    if (thisT > objT && thisT < objB || thisB > objT && thisB < objB) 
                    {
                        if (thisNextL <= objR || thisL <= objR) 
                            this.respondToCollision({ direction: "wallR", isStatic: isStatic, obj: obj });
                    }
                }
            }
        }
    },

    // Checks which points are in expected value range
    getLinFisInRange: function(xLinFIn, yLinFIn, obj) 
    {
        var boolResultOut = { xInRange: true, yInRange: true },
            objL = obj.x,
            objR = (obj.x + obj.w),
            objT = obj.y,
            objB = (obj.y + obj.h);
        // Check x axis
        if (xLinFIn < objL || xLinFIn > objR) // Checks if received x is outside expected range
            boolResultOut.xInRange = false;
        // Check y axis
        if (yLinFIn < objT || yLinFIn > objB) // Checks if received y is outside expected range
            boolResultOut.yInRange = false;

        return boolResultOut;
    },
    
    // Checks if a collision with a ramp has occurred
    checkLinFAndCallResponse: function(yIn, xIn, obj, objDirTypeIn, yChecksSmallerThan) 
    {
        if (yChecksSmallerThan == true) 
        {
            // Check against the ramp linear function
            if (yIn < obj.getyLinF(xIn)) 
            {
                this.respondToRampCollision(obj, objDirTypeIn);
                this.lastCollObj = this.getlastCollObj(objDirTypeIn);
            }
        } 
        else 
        {
            // Check against the ramp linear function
            if (yIn > obj.getyLinF(xIn)) 
            {
                this.respondToRampCollision(obj, objDirTypeIn);
                this.lastCollObj = this.getlastCollObj(objDirTypeIn);
            }
        }
    },

    checkCollisionSweptRamp: function(obj, milliDT) 
    {
        // Declare vars
        var xVel = this.curVel.x * milliDT;
        var yVel = this.curVel.y * milliDT;

        var curL = this.x;
        var curR = (this.x + this.w);
        var curT = this.y;
        var curB = (this.y + this.h);

        var objL = obj.x;
        var objR = (obj.x + obj.w);
        var objT = obj.y;
        var objB = (obj.y + obj.h);

        var nextL = this.x + xVel;
        var nextT = this.y + yVel;

        var nextR = nextL + this.w;
        var nextB = nextT + this.h;

        // Formulas
        // a = (y2-y1) / (x2-x1)
        // b = y1 - ax1 or b = y2 - ax2
        // y = ax + b
        // x = (y - b) / a

        // Find obj type
        // ---------------- Ramp_BL ---------------- //
        if (obj.isBL) 
        {
            if (this.lastCollObj == "wallR") // Check if the last collision was with a wall
            {
                // ---- X_Axis_Check ---- //
                if (curL >= objL && curL < objR && nextL <= objR) 
                    this.checkLinFAndCallResponse(nextB, nextL, obj, "isRampBL", false);
            } 
            else 
            {
                // ---- X_Axis_Check ---- //
                if (curL >= objL && nextL <= objR)
                    this.checkLinFAndCallResponse(nextB, nextL, obj, "isRampBL", false);
            }
        // ---------------- Ramp_BR ---------------- //
        }
        else if (obj.isBR) 
        {
            if (this.lastCollObj == "wallL") // Check if the last collision was with a wall
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && curR > objL && nextR >= objL)
                    this.checkLinFAndCallResponse(nextB, nextR, obj, "isRampBR", false);
            } 
            else
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && nextR >= objL)
                    this.checkLinFAndCallResponse(nextB, nextR, obj, "isRampBR", false);
            }
        // ---------------- Ramp_TL ---------------- //
        } 
        else if (obj.isTL) 
        {
            if (this.lastCollObj == "wallR") // Check if the last collision was with a wall
            { 
                // ---- X_Axis_Check ---- //
                if (curL >= objL && curL < objR && nextL <= objR)
                    this.checkLinFAndCallResponse(nextT, nextL, obj, "isRampTL", true);
            } 
            else 
            {
                // ---- X_Axis_Check ---- //
                if (curL >= objL && nextL <= objR)
                    this.checkLinFAndCallResponse(nextT, nextL, obj, "isRampTL", true);
            }
        // ---------------- Ramp_TR ---------------- //
        } 
        else if (obj.isTR) 
        {
            if (this.lastCollObj == "wallL") // Check if the last collision was with a wall
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && curR > objL && nextR >= objL)
                    this.checkLinFAndCallResponse(nextT, nextR, obj, "isRampTR", true);
            }
            else
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && nextR >= objL)
                    this.checkLinFAndCallResponse(nextT, nextR, obj, "isRampTR", true);
            }
        }
    },

    getIsValidCollType: function(args) 
    {
        for (var i = this.collisionTypes.length-1; i > -1; --i) 
        {
            var curCollType = this.collisionTypes[i];

            if (args.obj.has(curCollType)) 
                return true;
        }
        return false;
    },
});