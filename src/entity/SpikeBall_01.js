/*
* Spike ball hazard. Rolls or floats around and bounces off of walls and ramps. 
*/
Crafty.c("SpikeBall_01", 
{
    init: function() 
    {
        this.requires("IBase, Canvas, Delay, ICollisionDetection, Collision, IBase, IReset, IMortal");
        this.setScale(70, 70);
        this.curVel = { x: 0, y: 0 };
        this.resetVel = { x: 0, y: 0 };
        this.resetPosCoords = { x: 0, y: 0};
        this.collType = "float"; // Allowed: float, roll, bounce
        this.bounceImpulse = -600;
        this.isDead = false;
        this.isSpawned = false;
        this.lClipped = ["IClipAll", "IClipHazard"];

        this.waitForImpact = false;
        this.affectCurVel = false;

        this.spriteObj = Crafty.e("SpriteSpikeBall_01");
        this.spriteObj.movParent = this;
        this.spriteObj.setOffset();
        this.spriteObj.rotationSpeed = 180;
        this.spriteObj.origin("center");

        this.onHit("Player", function(collData) 
        {
            var curObj = collData[0].obj;
            curObj.die();
        }, function() 
        {
            // 
        });

        this.bind("EnterFrame", function(frameData) 
        {
            // Apply gravity. 
            if (this.collType == "roll" || this.collType == "bounce") 
                this.curVel.y += worldGravity * deltaTime;

            if (this.curVel.x > 0)
                this.spriteObj.rotation += this.spriteObj.rotationSpeed * deltaTime;
            else if (this.curVel.x < 0)
                this.spriteObj.rotation -= this.spriteObj.rotationSpeed * deltaTime;

            this.checkCollisions();

            // Apply velocities. 
            if (this.waitForImpact == false)
                this.x += this.curVel.x * deltaTime;
            this.y += this.curVel.y * deltaTime;
        });
    },

    /*
    *   Mandatory method, must be called manually after the init method
    */
    setUp: function(propertiesIn) 
    {
        if (propertiesIn.collType) 
            this.collType = propertiesIn.collType;
        else
            this.collType = "float";

        if (propertiesIn.velocity) 
        {
            this.curVel.x = propertiesIn.velocity.x;
            this.curVel.y = propertiesIn.velocity.y;
            this.resetVel.x = propertiesIn.velocity.x;
            this.resetVel.y = propertiesIn.velocity.y;
        }
    },

    /*
    * Resets the spike ball. 
    * If the spike ball was created by a launcher, it is destroyed instead. 
    */
    reset: function() 
    {
        if (!this.isSpawned)
        {
            this.x = this.resetPosCoords.x;
            this.y = this.resetPosCoords.y;
            this.curVel.x = this.resetVel.x;
            this.curVel.y = this.resetVel.y;
        }
        else 
        {
            this.die();
        }
    },

    /*
    * Sets a new reset position and velocity. 
    */
    setResetPos: function(x, y) 
    {
        this.resetPosCoords.x = x;
        this.resetPosCoords.y = y;

        this.resetVel.x = this.curVel.x;
        this.resetVel.y = this.curVel.y;
    },

    /*
    * Destroys the object, after the given delay has expired. 
    */
    die: function(delayIn) 
    {
        if (!delayIn) 
            var delayIn = 0;

        if (!this.isDead) 
        {
            this.delay(function() 
            {
                this.spriteObj.destroy();
                this.destroy();
            }, delayIn, 0);
        }
        this.isDead = true;
    },

    callbackPostResolution: function(args) {
        var velX = this.curVel.x;
        var velY = this.curVel.y;

        if (this.collType == "float") 
        {
            if (args.direction == "wallL")
            {
                this.curVel.x = -this.resetVel.x;
            }
            else if (args.direction == "wallR")
            {
                this.curVel.x = this.resetVel.x;
            }
            else if (args.direction == "ceiling")
            {
                this.curVel.y = this.resetVel.y;
            }
            else if (args.direction == "floor")
            {
                this.curVel.y = -this.resetVel.y;
            }
        }
        else if (this.collType == "roll") 
        {
            if (args.direction == "wallL" || args.direction == "wallR")
            {
                this.curVel.x = -this.curVel.x;
            }
            else if (args.direction == "floor")
            {
                if (this.waitForImpact == true) 
                {
                    this.curVel.x = this.resetVel.x;
                }

                this.waitForImpact = false;
                this.curVel.y = 0;
            }
            else if (args.direction == "rampBl")
            {
                if (this.curVel.x < 0 && this.x < args.obj.x + args.obj.w/2) 
                    this.curVel.x = this.resetVel.x;
            }
            else if (args.direction == "rampBr")
            {
                if (this.curVel.x > 0 && this.x + this.w > args.obj.x + args.obj.w/2) 
                    this.curVel.x = -this.resetVel.x;
            }
        }
        else if (this.collType == "bounce") 
        {
            if (args.direction == "wallL" || args.direction == "wallR")
            {
                this.curVel.x = -this.curVel.x;
            }
            else if (args.direction == "ceiling")
            {
                this.curVel.y = 0;
            }
            else if (args.direction == "floor")
            {
                this.curVel.y = -this.resetVel.y;
            }
        }
    },

    callbackPreResolution: function(args) {
        var velX = this.curVel.x;
        var velY = this.curVel.y;

        if (this.collType == "float") 
        {
            if (args.direction == "rampBl" || args.direction == "rampTr")
            {
                this.curVel.x = velY;
                this.curVel.y = velX;
            }
            else if (args.direction == "rampBr" || args.direction == "rampTl")
            {
                this.curVel.x = -velY;
                this.curVel.y = -velX;
            }
        }
        else if (this.collType == "bounce") 
        {
            if (args.direction == "rampBl" || args.direction == "rampBr" || args.direction == "rampTl" || args.direction == "rampTr")
            {
                this.curVel.x = -this.curVel.x;
                this.curVel.y = this.resetVel.y;
            }
        }
    },
});