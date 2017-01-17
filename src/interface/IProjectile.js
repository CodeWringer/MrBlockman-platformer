// Include namespaces. 
var Interfaces = Interfaces || {}; 

/**
* @desc Interface for projectiles. 
* @namespace
*/
Interfaces.IProjectile = function() 
{
    Crafty.c("IProjectile", 
    {
        init: function() 
        {
            this.requires("IBase, IReset, Collision, Delay, ICollisionDetection");
            this.setScale(50, 50);
            this.origin("center");

            /**
            * @desc Time this projectile can live, in milliseconds. 
            * @memberof Interfaces.IProjectile
            * @public
            */
            this.lifeTime = 10000;
            /**
            * @desc Current velocity of the object. 
            * @memberof Interfaces.IProjectile
            * @private
            */
            this.curVel = { x: 0, y: 0 };
            /**
            * @desc True, if the projectile has expired. 
            * @memberof Interfaces.IProjectile
            * @private
            */
            this.isDead = false;

            this.onHit("IMortal", function(collData) 
            {
                var curObj = collData[0].obj;
                curObj.die();
                this.die();
            }, null);

            this.deathEmitter = Crafty.e("ParticleEmitter");
            this.deathEmitterSettings = { emitW: 40, emitH: 60, emitVel: { xMin: -80, xMax: -10, yMin: 60, yMax: 80 }, 
            emitRandNegY: true, gravityType: "decelerate", emitExpire: true, emitLifeTime: 1000, sprite: "spr_glowRed_01", fadeOutTime: 1000 };

            this.tailEmitter = Crafty.e("ParticleEmitter");
            this.tailEmitterSettings = { emitW: 30, emitH: 30, emitVel: { xMin: -20, xMax: -10, yMin: 10, yMax: 20 }, 
            emitRandNegY: true, gravityType: "decelerate", emitExpire: true, emitLifeTime: 500, sprite: "spr_glowRed_01", fadeOutTime: 500 };

            this.tailEmitterWaitTime = 0;

            this.pointFront = { x: 0, y: 0 };
            this.pointBack = { x: 0, y: 0 };

            this.bind("EnterFrame", function(frameData) 
            {
                this.tailEmitterWaitTime += 1000 * deltaTime;
                if (this.tailEmitterWaitTime >= 60) 
                {
                    this.tailEmitter.emitParticles(this.tailEmitterSettings, 1, 1);
                    this.tailEmitterWaitTime = 0;
                }

                // Update and check lifeTime
                this.lifeTime -= 1000 * deltaTime;
                if (this.lifeTime <= 0) 
                    this.die();

                var vecVelocity = { x: this.curVel.x, y: this.curVel.y };
                var vecFront = Maths.getNormalizedVector(vecVelocity);
                var vecBack = Maths.getScaledVector(vecFront, -this.w/2);
                vecFront = Maths.getScaledVector(vecFront, this.w/2);

                var pntCenter = { x: (this.x + this.w/2), y: (this.y + this.h/2) };
                var pntFront = { x: (pntCenter.x + vecFront.x), y: (pntCenter.y + vecFront.y) };
                var pntBack = { x: (pntCenter.x + vecBack.x), y: (pntCenter.y + vecBack.y) };

                var pntVelocity = { x: (pntCenter.x + vecVelocity.x), y: (pntCenter.y + vecVelocity.y) };
                
                this.pointFront.x = pntFront.x;
                this.pointFront.y = pntFront.y;
                this.pointBack.x = pntBack.x;
                this.pointBack.y = pntBack.y;

                this.deathEmitter.setPosition(this.pointFront.x, this.pointFront.y);
                this.tailEmitter.setPosition(this.pointBack.x, this.pointBack.y);

                // ---- Collision_Detection ---- //
                this.checkCollisions();

                // Apply velocities
                this.x += this.curVel.x * deltaTime;
                this.y += this.curVel.y * deltaTime;
            });

            if (typeof this.reset === 'undefined') {
                /**
                * @desc Resets the projectile. 
                * @memberof interfaces.IProjectile
                * @override
                * @augments interfaces.IReset.reset
                * @public
                */
                this.reset = function() {
                    this.die();
                };
            }
        },

        /**
        * @desc Callback function post resolution. 
        * @memberof Interfaces.IProjectile
        * @param {Object} args
        * @override
        * @augments interfaces.ICollisionDetection.callbackPostResolution
        * @private
        */
        callbackPostResolution: function(args) 
        {
            this.die();
        },

        /**
        * @desc Makes the projectile expire. 
        * @memberof Interfaces.IProjectile
        * @public
        */
        die: function() 
        {
            if (this.isDead == false) 
            {
                this.isDead = true;
                this.deathEmitter.emitParticles(this.deathEmitterSettings, 1, 6);

                this.delay(function() 
                {
                    if (this.spriteObj !== 'undefined')
                        this.spriteObj.destroy();

                    this.deathEmitter.destroy();
                    this.tailEmitter.destroy();
                    this.destroy();
                }, 100, 0);
            }
        },
    });
}();