/*
* Represents the player controllable character. 
*/
Crafty.c("Player", 
{
    init: function() 
    {
        this.requires("IBase, Canvas, Delay, ICollisionDetection, Keyboard, IReset, IMortal");
        this.setScale(35, 85);

        this.maxVel = (500 * worldScale);     // The maximum velocity the character can gain through normal movement. 
        this.moveSpeed = (this.maxVel * 4);   // Acceleration/Deceleration rate. 
        
        this.jumpImpulse = (850 * worldScale);
        this.curVel = { x: 0, y: 0 };
        this.lastDir = "right";
        this.isDead = false;
        this.canJump = true;
        this.idleTime = 0;
        this.lCollidesWith = ["IBlock", "IRamp", "IClipAll", "IClipPlayer"];
        this.lDebugDraw = []; // Array for debug draw objects. 

        this.collidedD = false;

        this.spriteObj = Crafty.e("SpritePlayer");
        this.spriteObj.movParent = this;
        this.spriteObj.setOffset();

        this.spriteObj2 = Crafty.e("SpritePlayerSleep");
        this.spriteObj2.movParent = this;
        this.spriteObj2.setOffset();
        this.spriteObj2.animate("PC_LongInvisible", 1);

        this.deathEmitter = Crafty.e("ParticleEmitter");

        // ------ Instance_Hitbox ------ //
        this.hitBox_down = Crafty.e("2D, Canvas, Collision");
        this.hitBox_down.parentObj = this;
        this.hitBox_down.attr({ x: this.x, y: this.y, w: this.w - 4, h: 5, z: 101 });
        this.hitBox_down.onHit("2D", function(collData) {
            for (var n = collData.length-1; n > -1; --n) {
                var curObj = collData[n].obj;

                if (curObj.has("IBlock") || this.parentObj.collidesWith(curObj)) 
                {
                    // this.color("blue");
                    this.parentObj.collidedD = true;
                    break;
                } 
                else if (curObj.has("IRamp")) 
                {
                    if ((this.y+this.h) > curObj.getY(this.x) ||
                        (this.y+this.h) > curObj.getY(this.x+this.w)) 
                    {
                        // this.color("blue");
                        this.parentObj.collidedD = true;
                        break;
                    }
                }
                else
                {
                    // this.color("red");
                    this.parentObj.collidedD = false;
                }
            }
        }, function() 
        {
            this.color("red");
            this.parentObj.collidedD = false;
        });

        // ------ Key_inputs ------ //
        this.bind("KeyDown", function(e) 
        {
            this.idleTime = 0;
            if (!this.isDead) 
            {
                if (e.key == Crafty.keys.SPACE || e.key == Crafty.keys.W)
                {
                    if (this.collidedD == true)
                        this.jump(this.jumpImpulse);
                } 
                else if (e.key == Crafty.keys.S) 
                {
                    this.canJump = false;
                }
            }
        });
        this.bind("KeyUp", function(e) 
        {
            this.idleTime = 0;
            if (!this.isDead) 
            {
                if (e.key == Crafty.keys.SPACE || e.key == Crafty.keys.W)
                {
                    if (this.curVel.y < 0) 
                        this.curVel.y = 0; // Resets y velocity, so max jump height can be controlled. 
                } 
                else if (e.key == Crafty.keys.S) 
                {
                    this.canJump = true;
                }
            }
        });

        this.bind("EnterFrame", function(frameData) 
        {
            // ------ PC_Movement ------ //
            if (!this.isDead) 
            {
                if (this.isDown("A")) // Moving left
                { 
                    if (this.curVel.x > 0) // Still moving right
                        this.curVel.x = 0;
                    else if (this.curVel.x > -this.maxVel) // If maxVel has not yet been reached, keep increasing curVel. 
                        this.curVel.x -= this.moveSpeed * deltaTime;
                } 
                else if (this.isDown("D")) // Moving right
                { 
                    if (this.curVel.x < 0) // Still moving left
                        this.curVel.x = 0;
                    else if (this.curVel.x < this.maxVel) // If maxVel has not yet been reached, keep increasing curVel. 
                        this.curVel.x -= -this.moveSpeed * deltaTime;
                } 
                else 
                {
                    // ----- X_Velocity_Decrease ----- //
                    if (this.curVel.x < -1) // Moving left
                        this.curVel.x += this.moveSpeed * deltaTime;
                    else if (this.curVel.x > 1) // Moving right
                        this.curVel.x -= this.moveSpeed * deltaTime;
                    else
                        this.curVel.x = 0;
                }
                
                // ----- Y_Velocity_Decrease ----- //
                this.curVel.y += worldGravity * deltaTime; // Gravity

                // ------ Set_Last_Movement_Direction ------ //
                if (this.curVel.x > 0)
                    this.lastDir = "right";
                else if (this.curVel.x < 0)
                    this.lastDir = "left";

                // ------ Play_Animations ------ //
                if (this.collidedD && !this.spriteObj.isPlaying("PC_Jump00r_st") && !this.spriteObj.isPlaying("PC_Jump00l_st")) 
                {
                    if (this.curVel.x > 0 && !this.spriteObj.isPlaying("PC_Run00r")) 
                    {
                        this.spriteObj.animate("PC_Run00r", 1);
                    } 
                    else if (this.curVel.x < 0 && !this.spriteObj.isPlaying("PC_Run00l")) 
                    {
                        this.spriteObj.animate("PC_Run00l", 1);
                    } 
                    else if (this.curVel.x == 0) 
                    {
                        if (!this.spriteObj2.isPlaying("PC_IdleBored00r") && !this.spriteObj2.isPlaying("PC_IdleBored00l")) 
                        {
                            if (this.lastDir == "right" && !this.spriteObj.isPlaying("PC_Idle00r")) 
                                this.spriteObj.animate("PC_Idle00r", 1);
                            else if (this.lastDir == "left" && !this.spriteObj.isPlaying("PC_Idle00l")) 
                                this.spriteObj.animate("PC_Idle00l", 1);
                        }
                    }
                } 
                else 
                {
                    if (this.curVel.y > 0) 
                    {
                        if (this.lastDir == "right" && !this.spriteObj.isPlaying("PC_Jump00r_mid")) 
                            this.spriteObj.animate("PC_Jump00r_mid", 1);
                        else if (this.lastDir == "left" && !this.spriteObj.isPlaying("PC_Jump00l_mid")) 
                            this.spriteObj.animate("PC_Jump00l_mid", 1);
                    }
                }
            }

            this.idleTime += 1000 * deltaTime;
            if (this.idleTime >= 20000) 
            {
                if (this.isDead == false) 
                {
                    this.spriteObj.animate("PC_Invisible", 1);
                    if (this.lastDir == "right") 
                        this.spriteObj2.animate("PC_IdleBored00r", 1);
                    else if (this.lastDir == "left") 
                        this.spriteObj2.animate("PC_IdleBored00l", 1);
                }
            }
            if (!this.spriteObj2.isPlaying("PC_IdleBored00r") && !this.spriteObj2.isPlaying("PC_IdleBored00l") || 
                this.curVel.x != 0 || this.curVel.y < 0 || this.curVel.y > 20) 
                this.spriteObj2.animate("PC_LongInvisible", 1);
            else
                this.idleTime = 0;

            this.checkCollisions();

            this.deathEmitter.setPosition(this.x + this.w/2, this.y + this.h/2);

            // Update hitbox. 
            this.hitBox_down.x = (this.x + 2) + this.curVel.x * deltaTime;
            this.hitBox_down.y = (this.y + this.h) + this.curVel.y * deltaTime;

            // Apply velocities. 
            this.x += this.curVel.x * deltaTime;
            this.y += this.curVel.y * deltaTime;
        });
    },

    /*
    * Plays the jumping animation and applies the jumping force on the character. 
    */
    jump: function(jumpImpulseIn) 
    {
        if (this.canJump == false)
            return;

        this.curVel.y = -jumpImpulseIn;

        if (this.lastDir == "right") 
            this.spriteObj.animate("PC_Jump00r_st", 1);
        else if (this.lastDir == "left") 
            this.spriteObj.animate("PC_Jump00l_st", 1);

        this.canJump = false;

        this.delay(function() 
        {
            this.canJump = true;
        }, 100, 0);
    },

    /*
    * Plays the dying animation and lets the level restart. 
    */
    die: function() 
    {
        // Make sure this isn't already dead, so this function does not get called multiple times
        if (!this.isDead) 
        {
            var delay = 0;
            this.isDead = true;

            if (this.lastDir == "right") 
            {
                // Float in the opposite direction. 
                this.curVel.x = -1400 * deltaTime;
                this.curVel.y = -2800 * deltaTime;
                this.spriteObj.animate("PC_Bloat00r", 1);
            } 
            else if (this.lastDir == "left") 
            {
                // Float in the opposite direction. 
                this.curVel.x = 1400 * deltaTime;
                this.curVel.y = -2800 * deltaTime;
                this.spriteObj.animate("PC_Bloat00l", 1);
            }

            // Delay invisibility. 
            this.delay(function() 
            {
                this.spriteObj.animate("PC_Invisible", 1);
                this.curVel.x = 0;
                this.curVel.y = 0;
            }, 900, 0);

            // Delay the deathEmitter
            this.delay(function() 
            {
                var deathEmitterSettings = { 
                    emitW: 40, 
                    emitH: 60, 
                    emitVel: { xMin: 0, xMax: 120, yMin: 100, yMax: 150 }, 
                    emitRandom: true, 
                    emitRandNegX: true, 
                    gravityType: "slowFall", 
                    emitCollSetting: "noCollide", 
                    emitExpire: true, 
                    emitLifeTime: 5000, 
                    sprite: "spr_PC_Parachute", 
                    fadeOutTime: 2000 
                };

                this.deathEmitter.emitParticles(deathEmitterSettings, 1, 12);
            }, 700, 0);

            this.delay(function() 
            {
                oLevelBuilder.restartLevel();
            }, 3000, 0);
        }
    },

    /*
    * Resets the character. 
    */
    reset: function()
    {
        this.x = this.resetPos.x;
        this.y = this.resetPos.y;
        this.curVel.x = 0;
        this.curVel.y = 0;

        this.isDead = false;
        this.canJump = true;
    },
});