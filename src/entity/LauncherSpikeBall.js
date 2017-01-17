/*
* Spawns spike balls at set intervals and passes on certain settings to the spike balls. 
*/
Crafty.c("LauncherSpikeBall", 
{
    init: function() 
    {
        this.requires("2D, Canvas, Delay, IReset, IBase, SpriteAnimation, spr_spikeBallLauncher_01");
        this.origin("center");
        this.setScale(180, 150);
        this.z = 8000;
        this.launchDelay = 5000; // In ms, time between launches. 
        this.shootDelayTime = 0;

        this.collType = "roll"; // float, roll, bounce for projectile. 
        this.velocity = { x: 2, y: 0 };

        this.bind("EnterFrame", function(frameData) 
        {
            this.shootDelayTime += 1000 * deltaTime;

            if (this.shootDelayTime >= this.launchDelay) 
            {
                this.launchProjectile();
                this.shootDelayTime = 0;
            }
        });
    },

    /*
    * Set up method for initilization. 
    */
    setUp: function(propertiesIn) 
    {
        if (propertiesIn.launchDelay)
            this.launchDelay = propertiesIn.launchDelay;
        else
            this.launchDelay = 5000;

        if (propertiesIn.collType)
            this.collType = propertiesIn.collType;
        else
            this.collType = "roll";

        if (propertiesIn.velocity)
            this.velocity = propertiesIn.velocity;
        else
            this.velocity = { x: 0, y: 0 };
    },

    /*
    * Creates a new projectile and passes settings on to it. 
    */
    launchProjectile: function() 
    {
        var projectile = Crafty.e("SpikeBall_01");
        projectile.setPosition(this.x + (this.w - projectile.w)/2, this.y + (this.h - projectile.h)/2);
        projectile.isSpawned = true;
        projectile.waitForImpact = true;
        projectile.setUp({ collType: this.collType, velocity: this.velocity });

        oLevelBuilder.lEntity.push(projectile);
    },

    /*
    * Resets the entity. 
    */
    reset: function() 
    {
        this.shootDelayTime = 0;
    },
});