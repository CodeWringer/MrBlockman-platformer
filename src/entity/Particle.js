/*
* Represents a particle to be emitted by a particle emitter. 
*/
Crafty.c("Particle", 
{
    init: function() 
    {
        this.requires("2D, Canvas, SpriteAnimation, Collision");
        this.origin("center");
        
        this.velSlow = 50; // How quickly velocity decreases, higher values are faster. 

        this.curVel = { x: 0, y: 0 };
        this.rotationSpeed = 0;
        this.lifeTime = 1000;               // In ms.
        this.expire = true;                 // Sets whether particle will die after lifeTime runs out.
        this.gravityType = "ignore";        // Allowed types: slowFall, decelerate, ignore.
        this.collisionSetting = "collide";  // Allowed types: dieCollide, noCollide, collide.

        this.alpha = 1;
        this.fadeOutTime = 0;       // In ms, how long it takes for this particle to fade out.
        this.fadeInTime = 0;        // In ms, how long it takes for this particle to fade in.
        this.framesToFadeOut = 0;   // Used for calculating alpha blending of the fade out effect.
        this.framesToFadeIn = 0;    // Used for calculating alpha blending of the fade in effect.
        this.fadeOutTimeInitial = 0;// Used for calculating alpha blending of the fade out effect.
        this.fadeInTimeInitial = 0; // Used for calculating alpha blending of the fade in effect.

        this.collObj; // Object to hold information used in collision detection

        this.bind("EnterFrame", function(frameData) 
        {
            // ---- Initial_Fade_In ---- //
            if (this.fadeInTime > 0) 
            {
                this.framesToFadeIn = (this.fadeInTimeInitial / frameData.dt);
                this.alpha += (1 / this.framesToFadeIn);
                this.fadeInTime -= 1000 * deltaTime;
            }

            // --------- Velocity_Changes --------- //
            if (this.gravityType == "slowFall") 
            {
                // ----- Velocity_x ----- //
                if (this.curVel.x < -0.1) 
                    this.curVel.x += this.velSlow * deltaTime;
                else if (this.curVel.x > 0.1) 
                    this.curVel.x -= this.velSlow * deltaTime;
                else 
                    this.curVel.x = 0;

                // ----- Velocity_y ----- //
                if (this.curVel.y < this.velSlow)
                    this.curVel.y += (worldGravity/4 * worldScale) * deltaTime; // Gravity
            }
            else if (this.gravityType == "decelerate")
            {
                this.curVel.x -= (this.curVel.x/25);
                this.curVel.y -= (this.curVel.y/25);
            }

            // ---- Apply_Velocities ---- //
            this.x += this.curVel.x * deltaTime;
            this.y += this.curVel.y * deltaTime;

            // --------- LifeTime --------- //
            if (this.expire == true && this.fadeInTime <= 0) 
            {
                this.lifeTime -= 1000 * deltaTime;
                if (this.lifeTime <= 0) 
                {

                    // ---- Fade_Out ---- //
                    this.framesToFadeOut = (this.fadeOutTimeInitial / frameData.dt);
                    this.alpha -= (1 / this.framesToFadeOut);
                    this.fadeOutTime -= 1000 * deltaTime;
                    if (this.fadeOutTime <= 0)
                        this.destroy();
                }
            }

            // --------- rotation --------- //
            this.rotation += this.rotationSpeed * deltaTime;
        });
    },

    setProperties: function( propertiesIn ) 
    {
        if (propertiesIn.color) 
        {
            this.requires("Color");
            this.color(propertiesIn.color);
        }
        
        if (propertiesIn.fadeOutTime) 
        {
            this.fadeOutTime = propertiesIn.fadeOutTime;
            this.fadeOutTimeInitial = propertiesIn.fadeOutTime;
        } 
        else 
        {
            this.fadeOutTime = 0;
            this.fadeOutTimeInitial = 0;
        }

        if (propertiesIn.fadeInTime) 
        {
            this.fadeInTime = propertiesIn.fadeInTime;
            this.fadeInTimeInitial = propertiesIn.fadeInTime;
            this.alpha = 0;
        } 
        else 
        {
            this.fadeInTime = 0;
            this.fadeInTimeInitial = 0;
        }

        // If there is a sprite given, assign the sprite to this particle. 
        if (propertiesIn.sprite) 
        {
            this.requires(propertiesIn.sprite);
            // If the sprite is recognized here, it will automatically play the correct animation at creation time. 
            // ---- Recognized_Sprites_List ---- //
            if (propertiesIn.sprite == "spr_PC_Parachute") 
            {
                this.reel("parachute_00r", 2000, 0, 0, 18);
                this.reel("parachute_00l", 2000, 0, 1, 18);
                if (propertiesIn.xVel < 0)
                    this.animate("parachute_00l", 1);
                else 
                    this.animate("parachute_00r", 1);
            }
        }

        if (propertiesIn.velSlow)
        {
            this.velSlow = propertiesIn.velSlow;
        }

        this.curVel.x = propertiesIn.xVel;
        this.curVel.y = propertiesIn.yVel;
        this.rotationSpeed = propertiesIn.rotationSpeed;
        this.collisionSetting = propertiesIn.collisionSetting;
        this.gravityType = propertiesIn.gravityType;
        this.expire = propertiesIn.expire;
        this.lifeTime = propertiesIn.lifeTime;
        this.x = propertiesIn.x - propertiesIn.w/2;
        this.y = propertiesIn.y - propertiesIn.h/2;
        this.w = propertiesIn.w;
        this.h = propertiesIn.h;
    },
});