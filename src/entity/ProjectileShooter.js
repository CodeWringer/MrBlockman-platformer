/**
* Launches projectiles that pose a hazard to the player. 
*/
Crafty.c("ProjectileShooter", 
{
    init: function() 
    {
        this.requires("IBase, Delay, IReset");
        this.setScale(90, 90);

        this.shootVel = 200;
        this.direction = "left"; // Recognized: "left", "right", "up", "down"
        this.projectileType = "default"; // Recognized: "default", "chase"
        this.shootDelay = 5000; // In ms, time between shots
        this.lifeTime = 10000;  // In ms, how long the projectile can exist at maximum. 

        this.shootDelayTime = 0;
        this.spriteObj = Crafty.e("SpriteProjectileShooter");
        this.spriteObj.movParent = this;
        this.spriteObj.setOffset();
        this.spriteObj.animate("Idle", 1);

        this.bind("EnterFrame", function(frameData) 
        {
            if (this.shootDelayTime < this.shootDelay)
                this.shootDelayTime += 1000 * deltaTime;

            if (this.shootDelayTime >= this.shootDelay - 700 && !this.spriteObj.isPlaying("Shoot"))
            {
                this.spriteObj.animate("Shoot", 1);
            }
            if (this.shootDelayTime >= this.shootDelay) 
            {
                this.shootProjectile(this.projectileType);
                this.shootDelayTime = 0;
            }
        });
    },

    shootProjectile: function(projectileTypeIn) 
    {
        var projectile = null; 

        if (projectileTypeIn == "default") 
            projectile = Crafty.e("Projectile");
        else if (projectileTypeIn == "chase")
            projectile = Crafty.e("ProjectileChaser");
        else
            return;

        projectile.lifeTime = this.lifeTime;
        projectile.setPosition(this.x + this.w/4, this.y + this.h/4);

        if (this.direction == "left") 
        {
            projectile.curVel = { x: -this.shootVel, y: 0};
            projectile.rotation = 0;
        }
        else if (this.direction == "right") 
        {
            projectile.curVel = { x: this.shootVel, y: 0 };
            projectile.rotation = 180;
        }
        else if (this.direction == "up") 
        {
            projectile.curVel = { x: 0, y: -this.shootVel };
            projectile.rotation = 90;
        }
        else if (this.direction == "down") 
        {
            projectile.curVel = { x: 0, y: this.shootVel };
            projectile.rotation = 270;
        }

        oLevelBuilder.lEntity.push(projectile);
    },

    reset: function() 
    {
        this.shootDelayTime = 0;
    },

    setUp: function(prop)
    {
        this.origin("center");

        if (prop.shootVel)
            this.shootVel = prop.shootVel;
        else
            this.shootVel = 200;

        if (prop.direction)
            this.direction = prop.direction;
        else
            this.direction = "left";

        if (prop.projectileType)
            this.projectileType = prop.projectileType;
        else
            this.projectileType = "default";

        if (prop.shootDelay)
            this.shootDelay = prop.shootDelay;
        else
            this.shootDelay = 5000;

        if (prop.lifeTime)
            this.lifeTime = prop.lifeTime;
        else
            this.lifeTime = 10000;
    },
});