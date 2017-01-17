/*
* A component to handle collision detection and response. 
* Response functions can be overwritten. 
*/
Crafty.c("ICollisionDetection", {
    init: function() {
        this.broadphasebox = {x: 0, y: 0, w: 0, h: 0 };
        this.affectCurVel = true; // If false, curVel of client object will not be affected by collision resolution. 
        
        if (typeof this.callbackPostResolution === 'undefined') {
            /*
            * Gets called at the end of collision resolution. 
            * Can be overridden by objects implementing this component. 
            */
            this.callbackPostResolution = function(args) {
                // Up to client what to do...
            };
        }

        if (typeof this.callbackPreResolution === 'undefined') {
            /*
            * Gets called at the start of collision resolution. 
            * Can be overridden by objects implementing this component. 
            */
            this.callbackPreResolution = function(args) {
                // Up to client what to do...
            };
        }

        if (typeof this.lCollidesWith === 'undefined') {
            this.lCollidesWith = ["IBlock", "IRamp", "IClipAll"]; // List of clip types to perform collision checking with. 
        }
    },

    /*
    * Performs a collision check of this object with all other objects. 
    */
    checkCollisions: function() {
        // ------------ Collision_Detection ------------ //
        this.updateBroadphasebox(deltaTime);

        for (var i = oLevelBuilder.lCollision.length - 1; i >= 0; i--) {
            var obj = oLevelBuilder.lCollision[i];

            // Check if object is outside broadphasebox. 
            if (obj.x > this.broadphasebox.x + this.broadphasebox.w ||
                obj.x + obj.w < this.broadphasebox.x ||
                obj.y > this.broadphasebox.y + this.broadphasebox.h ||
                obj.y + obj.h < this.broadphasebox.y)
            {
                continue;
            }

            if (this.collidesWith(obj)) {
                if (obj.has("IBlock")) {
                    this.checkCollisionSweptAABB(obj, deltaTime);
                } else if (obj.has("IRamp")) {
                    this.checkCollisionSweptRamp(obj, deltaTime);
                }
            } else {
                continue;
            }

        };
    },

    /*
    * Returns true if the given object has a component type that this object collides with. 
    */
    collidesWith: function(obj) {
        for (var i = this.lCollidesWith.length - 1; i >= 0; i--) {
            if (obj.has(this.lCollidesWith[i])) {
                return true;
            }
        };
        return false;
    },

    /*
    * Updates this object's broadphasebox position and scale. 
    */
    updateBroadphasebox: function(milliDT) 
    {
        var xVel = this.curVel.x * milliDT;
        var yVel = this.curVel.y * milliDT;

        this.broadphasebox.x = xVel >= 0 ? this.x + xVel : this.x + xVel*2;
        this.broadphasebox.y = yVel >= 0 ? this.y + yVel : this.y + yVel*2;
        this.broadphasebox.w = xVel >= 0 ? this.w + xVel : this.w - xVel;
        this.broadphasebox.h = yVel >= 0 ? this.h + yVel : this.h - yVel;
    },

    /*
    * Attempts to predict this object's location in the next frame and prevent collisions beforehand. 
    * Uses the swept method, to deal with very fast objects (Requires more testing). 
    */
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
            var lVectorLengthX = [];
            var lVectorLengthY = [];
            // TL
            if (boolLinF_TL.xInRange == true) // X
            { 
                if (thisVelY < 0 && obj.isCeiling) // Moving up.
                {
                    var xVector_TL = Maths.getVector({ x: thisL, y: thisT }, { x: xLinF_TL, y: yEntry });
                    var xVectorLength_TL = Maths.getVectorLength(xVector_TL);
                    lVectorLengthX.push({ len: xVectorLength_TL, xCoord: xLinF_TL, origin: "TL" });
                }
            }
            if (boolLinF_TL.yInRange == true) // Y
            { 
                if (thisVelX < 0 && obj.isWallR) // Moving left. 
                {
                    var yVector_TL = Maths.getVector({ x: thisL, y: thisT }, { x: xEntry, y: yLinF_TL });
                    var yVectorLength_TL = Maths.getVectorLength(yVector_TL);
                    lVectorLengthY.push({ len: yVectorLength_TL, yCoord: yLinF_TL, origin: "TL" });
                }
            }
            // TR
            if (boolLinF_TR.xInRange == true) // X
            {
                if (thisVelY < 0 && obj.isCeiling) // Moving up. 
                {
                    var xVector_TR = Maths.getVector({ x: thisR, y: thisT }, { x: xLinF_TR, y: yEntry });
                    var xVectorLength_TR = Maths.getVectorLength(xVector_TR);
                    lVectorLengthX.push({ len: xVectorLength_TR, xCoord: xLinF_TR, origin: "TR" });
                }
            }
            if (boolLinF_TR.yInRange == true) // Y
            {
                if (thisVelX > 0 && obj.isWallL) // Moving right. 
                {
                    var yVector_TR = Maths.getVector({ x: thisR, y: thisT }, { x: xEntry, y: yLinF_TR });
                    var yVectorLength_TR = Maths.getVectorLength(yVector_TR);
                    lVectorLengthY.push({ len: yVectorLength_TR, yCoord: yLinF_TR, origin: "TR" });
                }
            }
            // BL
            if (boolLinF_BL.xInRange == true) // X
            {
                if (thisVelY > 0 && obj.isFloor) // Moving down. 
                {
                    var xVector_BL = Maths.getVector({ x: thisL, y: thisB }, { x: xLinF_BL, y: yEntry });
                    var xVectorLength_BL = Maths.getVectorLength(xVector_BL);
                    lVectorLengthX.push({ len: xVectorLength_BL, xCoord: xLinF_BL, origin: "BL" });
                }
            }
            if (boolLinF_BL.yInRange == true) // Y
            {
                if (thisVelX < 0 && obj.isWallR) // Moving left. 
                {
                    var yVector_BL = Maths.getVector({ x: thisL, y: thisB }, { x: xEntry, y: yLinF_BL });
                    var yVectorLength_BL = Maths.getVectorLength(yVector_BL);
                    lVectorLengthY.push({ len: yVectorLength_BL, yCoord: yLinF_BL, origin: "BL" });
                }
            }
            // BR
            if (boolLinF_BR.xInRange == true) // X
            {
                if (thisVelY > 0 && obj.isFloor) // Moving down. 
                {
                    var xVector_BR = Maths.getVector({ x: thisR, y: thisB }, { x: xLinF_BR, y: yEntry });
                    var xVectorLength_BR = Maths.getVectorLength(xVector_BR);
                    lVectorLengthX.push({ len: xVectorLength_BR, xCoord: xLinF_BR, origin: "BR" });
                }
            }
            if (boolLinF_BR.yInRange == true) // Y
            {
                if (thisVelX > 0 && obj.isWallL) // Moving right. 
                {
                    var yVector_BR = Maths.getVector({ x: thisR, y: thisB }, { x: xEntry, y: yLinF_BR });
                    var yVectorLength_BR = Maths.getVectorLength(yVector_BR);
                    lVectorLengthY.push({ len: yVectorLength_BR, yCoord: yLinF_BR, origin: "BR" });
                }
            }
            // halfHL
            if (boolLinF_halfHL.yInRange == true) // Y
            {
                if (thisVelX < 0 && obj.isWallR) // Moving left. 
                {
                    var yVector_halfHL = Maths.getVector({ x: thisL, y: thisHalfH }, { x: xEntry, y: yLinF_halfHL });
                    var yVectorLength_halfHL = Maths.getVectorLength(yVector_halfHL);
                    lVectorLengthY.push({ len: yVectorLength_halfHL, yCoord: yLinF_halfHL, origin: "halfHL" });
                }
            }
            // halfHR
            if (boolLinF_halfHR.yInRange == true) // Y
            {
                if (thisVelX > 0 && obj.isWallL) 
                {
                    var yVector_halfHR = Maths.getVector({ x: thisR, y: thisHalfH }, { x: xEntry, y: yLinF_halfHR });
                    var yVectorLength_halfHR = Maths.getVectorLength(yVector_halfHR);
                    lVectorLengthY.push({ len: yVectorLength_halfHR, yCoord: yLinF_halfHR, origin: "halfHR" });
                }
            }
            
            // Find shortest vector length
            // Check x vector lengths
            if (lVectorLengthX.length > 0) 
            {
                if (!shortestVector) 
                    var shortestVector = lVectorLengthX[0];

                for (var i = lVectorLengthX.length-1; i > -1; --i) 
                {
                    var curVectorX = lVectorLengthX[i];

                    if (curVectorX.len < shortestVector.len)
                        shortestVector = curVectorX;
                }
            }
            // Check y vector lengths
            if (lVectorLengthY.length > 0) 
            {
                if (!shortestVector)
                    var shortestVector = lVectorLengthY[0];

                for (var u = lVectorLengthY.length-1; u > -1; --u) 
                {
                    var curVectorY = lVectorLengthY[u];

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
                    this.resolveCollision({ direction: "wallL", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
                else // Moving left
                    this.resolveCollision({ direction: "wallR", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
            } 
            else // Collision on y axis, because a x coordinate is returned from the linear functions
            {
                if (thisVelY > 0) // Moving down
                    this.resolveCollision({ direction: "floor", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
                else // Moving up
                    this.resolveCollision({ direction: "ceiling", isStatic: isStatic, shortestVector: shortestVector, obj: obj });
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
                            this.resolveCollision({ direction: "floor", isStatic: isStatic, obj: obj });
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
                            this.resolveCollision({ direction: "ceiling", isStatic: isStatic, obj: obj });
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
                            this.resolveCollision({ direction: "wallL", isStatic: isStatic, obj: obj });
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
                            this.resolveCollision({ direction: "wallR", isStatic: isStatic, obj: obj });
                    }
                }
            }
        }
    },

    /*
    * Checks which points are in expected value range. 
    */
    getLinFisInRange: function(xLinFIn, yLinFIn, obj) 
    {
        var bResultOut = { xInRange: true, yInRange: true };
        var objL = obj.x;
        var objR = (obj.x + obj.w);
        var objT = obj.y;
        var objB = (obj.y + obj.h);
        // Check x axis
        if (xLinFIn < objL || xLinFIn > objR) // Checks if received x is outside expected range. 
            bResultOut.xInRange = false;
        // Check y axis
        if (yLinFIn < objT || yLinFIn > objB) // Checks if received y is outside expected range. 
            bResultOut.yInRange = false;

        return bResultOut;
    },
    
    /*
    * 
    */
    checkLinFAndCallResponse: function(yIn, xIn, obj, objDirTypeIn, yCheckSmallerThan) 
    {
        if (yCheckSmallerThan == true && yIn < obj.getY(xIn)) 
            this.resolveCollisionRamp(obj, objDirTypeIn);
        else if (yIn > obj.getY(xIn)) 
            this.resolveCollisionRamp(obj, objDirTypeIn);

        this.lastCollObj = objDirTypeIn;
    },

    /*
    * 
    */
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
                    this.checkLinFAndCallResponse(nextB, nextL, obj, "rampBl", false);
            } 
            else 
            {
                // ---- X_Axis_Check ---- //
                if (curL >= objL && nextL <= objR)
                    this.checkLinFAndCallResponse(nextB, nextL, obj, "rampBl", false);
            }
        // ---------------- Ramp_BR ---------------- //
        }
        else if (obj.isBR) 
        {
            if (this.lastCollObj == "wallL") // Check if the last collision was with a wall
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && curR > objL && nextR >= objL)
                    this.checkLinFAndCallResponse(nextB, nextR, obj, "rampBr", false);
            } 
            else
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && nextR >= objL)
                    this.checkLinFAndCallResponse(nextB, nextR, obj, "rampBr", false);
            }
        // ---------------- Ramp_TL ---------------- //
        } 
        else if (obj.isTL) 
        {
            if (this.lastCollObj == "wallR") // Check if the last collision was with a wall
            { 
                // ---- X_Axis_Check ---- //
                if (curL >= objL && curL < objR && nextL <= objR)
                    this.checkLinFAndCallResponse(nextT, nextL, obj, "rampTl", true);
            } 
            else 
            {
                // ---- X_Axis_Check ---- //
                if (curL >= objL && nextL <= objR)
                    this.checkLinFAndCallResponse(nextT, nextL, obj, "rampTl", true);
            }
        // ---------------- Ramp_TR ---------------- //
        } 
        else if (obj.isTR) 
        {
            if (this.lastCollObj == "wallL") // Check if the last collision was with a wall
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && curR > objL && nextR >= objL)
                    this.checkLinFAndCallResponse(nextT, nextR, obj, "rampTr", true);
            }
            else
            {
                // ---- X_Axis_Check ---- //
                if (curR <= objR && nextR >= objL)
                    this.checkLinFAndCallResponse(nextT, nextR, obj, "rampTr", true);
            }
        }
    },

    /*
    * Resolves a collision with another AABB. 
    */
    resolveCollision: function(args) 
    {
        this.callbackPreResolution(args);

        var thisL = this.x;
        var thisR = (this.x + this.w);
        var thisT = this.y;
        var thisB = (this.y + this.h);

        var objL = args.obj.x;
        var objR = (args.obj.x + args.obj.w);
        var objT = args.obj.y;
        var objB = (args.obj.y + args.obj.h);

        if (args.direction == "wallL") 
        {
            this.lastCollObj = "wallL";
            if (this.affectCurVel == true)
                this.curVel.x = 0;
            this.x = objL - this.w;
        } 
        else if (args.direction == "wallR") 
        {
            this.lastCollObj = "wallR";
            if (this.affectCurVel == true)
                this.curVel.x = 0;
            this.x = objR;
        } 
        else if (args.direction == "ceiling") 
        {
            this.lastCollObj = "ceiling";
            if (this.affectCurVel == true)
                this.curVel.y = 0;
            this.y = objB;
        } 
        else if (args.direction == "floor") 
        {
            this.lastCollObj = "floor";
            if (this.affectCurVel == true)
                this.curVel.y = 0;
            this.y = objT - this.h;

            if (typeof args.obj.curVel !== 'undefined' && this.affectCurVel == true) 
                this.curVel.x += (args.obj.curVel.x * worldScale) * deltaTime; // Move with object if standing on it. 
        }

        this.callbackPostResolution(args);
    },

    /*
    * Resolves a collision with a ramp. 
    */
    resolveCollisionRamp: function(ramp, objDirType) 
    {
        var args = { direction: objDirType, isStatic: true, shortestVector: null, obj: ramp };
        var velX = this.curVel.x * deltaTime;
        var velY = this.curVel.y * deltaTime

        if (objDirType == "rampBl") 
        {
            var rampY = ramp.getY(this.x + velX);

            if (this.y + this.h + velY > rampY)
            {
                this.callbackPreResolution(args);
                this.y = rampY - this.h;
                if (this.affectCurVel == true)
                    this.curVel.y = 0;
            }
        }
        else if (objDirType == "rampBr") 
        {
            var rampY = ramp.getY(this.x + this.w + velX);

            if (this.y + this.h + velY > rampY)
            {
                this.callbackPreResolution(args);
                this.y = rampY - this.h;
                if (this.affectCurVel == true)
                    this.curVel.y = 0;
            }
        }
        else if (objDirType == "rampTl") 
        {
            var rampY = ramp.getY(this.x + velX);

            if (this.y + velY < rampY)
            {
                this.callbackPreResolution(args);
                this.y = rampY;
                if (this.affectCurVel == true)
                    this.curVel.y = 0;
            }
        }
        else if (objDirType == "rampTr") 
        {
            var rampY = ramp.getY(this.x + this.w + velX);

            if (this.y + velY < rampY)
            {
                this.callbackPreResolution(args);
                this.y = rampY;
                if (this.affectCurVel == true)
                    this.curVel.y = 0;
            }
        }

        this.callbackPostResolution(args);
    },
});