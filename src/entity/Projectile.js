/**
* Projectile that flies in a straight line. 
*/
Crafty.c("Projectile", 
{
    init: function() 
    {
        this.requires("IBase, IReset, Collision, Delay, ICollisionDetection, IProjectile");
        this.setScale(50, 50);
        this.origin("center");

        this.spriteObj = Crafty.e("SpriteSpikeBall_01");
        this.spriteObj.setScale(50, 50);
        this.spriteObj.movParent = this;
        this.spriteObj.origin("center");

        this.bind("EnterFrame", function(frameData) 
        {
            this.spriteObj.rotation += 180 * deltaTime;
        });
    },
});