/**
* Projectile that turns towards the player. 
*/
Crafty.c("ProjectileChaser", 
{
    init: function() 
    {
        this.requires("IBase, IReset, Collision, Delay, ICollisionDetection, IProjectile");
        this.setScale(50, 50);

        this.origin("center");

        this.targetAngle = 0;
        this.rotSpeed = 150;
        this.angleDif = 0; // Is the difference between rotation and targetAngle
        this.angleInvDif = 0; // Is 360 - angleDif, basically the inverted distance from rotation to targetAngle
        this.radius = 200; // Is effectively the movement speed
        this.curRotPoint = { x: 0, y: 0 }; // Doesn't actually change, only gets used as a reference point
        this.nextRotPoint = { x: 0, y: 0 };

        this.curVel = { x: 0, y: 0 };
        this.lifeTime = 10000; // After time is up, projectile dies
        this.initialTime = 0; 
        this.activeDelay = 350; // In ms, how long to wait before chasing behavior becomes active. 
        this.isDead = false;

        this.spriteObj = Crafty.e("SpriteChaserProjectile_01");
        this.spriteObj.setScale(50, 50);
        this.spriteObj.movParent = this;
        this.spriteObj.origin("center");

        this.bind("EnterFrame", function(frameData) 
        {
            if (this.initialTime < this.activeDelay)
                this.initialTime += 1000 * deltaTime;

            this.targetAngle = Maths.getAtan2DegAngle({ x: this.x + this.w/2, y: this.y + this.h/2 }, { x: this.findTarget().x + this.findTarget().w/2, y: this.findTarget().y + this.findTarget().h/2 });
            // Prevent targetAngle from exiting the range of 0 to 360
            if (this.targetAngle < 0)
                this.targetAngle += 360;
            
            // Prevent this.rotation from exiting the range of 0 to 360
            if (this.rotation > 360)
                this.rotation -= 360;
            else if (this.rotation < 0)
                this.rotation += 360;
            
            if (this.initialTime >= this.activeDelay) 
            {
                // Check and apply rotation
                if (this.targetAngle > this.rotation && this.targetAngle - this.rotation > this.rotSpeed * deltaTime) // Check if rotation should be positive under normal circumstances
                { 
                    this.angleDif = this.targetAngle - this.rotation;
                    this.angleInvDif = 360 - this.angleDif;
                    /* Check for smaller angle difference, basically a check to see if rotation would leave 0 to 360 range
                    * I.e. if rotation is 11 and targetAngle is 350, then the smaller angle to rotate by would be the angleInvDif,
                    * which would be 21, whereas the angleDif would be 339 */
                    if (this.angleInvDif > this.angleDif) // Check if normal circumstances apply, i.e. rotation should be positive
                        this.rotation += this.rotSpeed * deltaTime;
                    else if (this.angleInvDif < this.angleDif) // Else go in opposite direction than under normal circumstances
                        this.rotation -= this.rotSpeed * deltaTime;
                }
                else if (this.targetAngle < this.rotation && this.rotation - this.targetAngle > this.rotSpeed * deltaTime) // Check if rotation should be negative under normal circumstances
                {
                    this.angleDif = this.rotation - this.targetAngle;
                    this.angleInvDif = 360 - this.angleDif;
                    /* Check for smaller angle difference, basically a check to see if rotation would leave 0 to 360 range
                    * I.e. if rotation is 332 and targetAngle is 13, then the smaller angle to rotate by would be the angleInvDif,
                    * which would be 41, whereas the angleDif would be 319 */
                    if (this.angleInvDif > this.angleDif)
                        this.rotation -= this.rotSpeed * deltaTime;
                    else if (this.angleInvDif < this.angleDif)
                        this.rotation += this.rotSpeed * deltaTime;
                }
            }

            // Update and check lifeTime
            this.lifeTime -= 1000 * deltaTime;
            if (this.lifeTime <= 0) 
                this.die();

            // Update rotPoints
            this.curRotPoint = { x: this.x + this.w/2 + this.radius, y: this.y + this.h/2 };
            this.nextRotPoint = Maths.getPointOnCircle(
                { x: this.x, y: this.y }, 
                this.curRotPoint, 
                (this.rotation * Math.PI/180)
            );

            this.spriteObj.rotation = this.rotation + 180;

            // Update curVel
            this.curVel.x = this.nextRotPoint.x - (this.x + this.w);
            this.curVel.y = this.nextRotPoint.y - (this.y + this.h);
        });
    },

    findTarget: function() 
    {
        return Crafty("Player").get(-1);
    },
});