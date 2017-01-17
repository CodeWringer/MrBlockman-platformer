/*
* Represents a particle emitter, to create particles at runtime. 
*/
Crafty.c("ParticleEmitter", 
{
    init: function() 
    {
        this.requires("IBase, Collision, Delay");

        this.lParticle = [];
    },

    /*
    * Creates particles at this emitter, with the specified settings
    */
    emitParticles: function(emitSettingsIn, emitDelay, emitCount) 
    {
        this.delay(function() 
        {
            // ---- Set_Optional_Params ---- //
            var emitVelOut = { x: 0, y: 0 };

            if (emitSettingsIn.color) 
                var colorOut = emitSettingsIn.color;
            else 
                var colorOut = null;

            if (emitSettingsIn.sprite) 
                var spriteOut = emitSettingsIn.sprite;
            else 
                var spriteOut = null;

            if (emitSettingsIn.rotationSpeed) 
                var rotationSpeedOut = emitSettingsIn.rotationSpeed;
            else 
                var rotationSpeedOut = 0;

            if (emitSettingsIn.fadeOutTime) 
                var fadeOutTimeOut = emitSettingsIn.fadeOutTime;
            else
                var fadeOutTimeOut = 0;

            if (emitSettingsIn.fadeInTime)
                var fadeInTimeOut = emitSettingsIn.fadeInTime;
            else
                var fadeInTimeOut = 0;

            if (emitSettingsIn.gravityType != "decelerate" && emitSettingsIn.gravityType != "slowFall") 
                var gravityTypeOut = "ignore";
            else
                var gravityTypeOut = emitSettingsIn.gravityType;

            if (emitSettingsIn.emitStrength)
                var emitStrength = emitSettingsIn.emitStrength;
            else
                var emitStrength = 1;

            if (emitSettingsIn.emitRandom)
                var emitRandom = emitSettingsIn.emitRandom;
            else
                var emitRandom = true;

            if (emitSettingsIn.emitRandNegX) // Setting allows x velocity to be multiplied by -1 randomly
                var emitRandNegX = emitSettingsIn.emitRandNegX;
            else
                var emitRandNegX = false;

            if (emitSettingsIn.emitRandNegY) // Setting allows y velocity to be multiplied by -1 randomly
                var emitRandNegY = emitSettingsIn.emitRandNegY;
            else
                var emitRandNegY = false;

            if (emitSettingsIn.emitVel) 
            {
                if (emitRandom == true) 
                {
                    emitVelOut.x = Maths.getRandomArbitrary(
                        (emitSettingsIn.emitVel.xMin * emitStrength), 
                        (emitSettingsIn.emitVel.xMax * emitStrength)
                    );

                    emitVelOut.y = Maths.getRandomArbitrary(
                        (emitSettingsIn.emitVel.yMin * emitStrength), 
                        (emitSettingsIn.emitVel.yMax * emitStrength)
                    );

                    emitVelOut.y *= (-1);

                    if (emitRandNegX == true && Math.random() < 0.5) 
                        emitVelOut.x *= (-1);

                    if (emitRandNegY == true && Math.random() < 0.5) 
                        emitVelOut.y *= (-1);
                }
            }
            // ---- Particle_Creation ---- //
            var propertiesOut = { 
                x: this.x, 
                y: this.y, 
                w: (emitSettingsIn.emitW * worldScale), 
                h: (emitSettingsIn.emitH * worldScale), 
                xVel: (emitVelOut.x * worldScale), 
                yVel: (emitVelOut.y * worldScale), 
                velSlow: Maths.getRandomArbitrary(20, 60),
                gravityType: gravityTypeOut, 
                collSetting: emitSettingsIn.emitCollSetting, 
                expire: emitSettingsIn.emitExpire, 
                lifeTime: emitSettingsIn.emitLifeTime, 
                color: colorOut, 
                sprite: spriteOut, 
                rotationSpeed: rotationSpeedOut, 
                fadeOutTime: fadeOutTimeOut, 
                fadeInTime: fadeInTimeOut 
            };

            var lParticleIndex = this.lParticle.length;
            this.lParticle[lParticleIndex] = Crafty.e("Particle");
            this.lParticle[lParticleIndex].setProperties(propertiesOut);
        }, emitDelay, --emitCount);
    },
});