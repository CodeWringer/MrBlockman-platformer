/*
* Represents the spinning spike ball at the end of a chain. 
*/
Crafty.c("SpikeBallHitBox_02", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, Collision");
        this.setScale(60, 60);

        this.rotationDir = "clockwise"; // clockwise, counterClockwise

        this.spriteObj = Crafty.e("SpriteSpikeBall_02");
        this.spriteObj.movParent = this;
        this.spriteObj.setOffset();
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
            // Apply spriteObj rotation
            if (this.rotationDir == "clockwise") 
                this.spriteObj.rotation += this.spriteObj.rotationSpeed * deltaTime;
            else if (this.rotationDir == "counterClockwise")
                this.spriteObj.rotation -= this.spriteObj.rotationSpeed * deltaTime;
        });
    },
});