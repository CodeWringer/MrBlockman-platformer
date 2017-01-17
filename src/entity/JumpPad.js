/*
* An entity that launches the player character upwards. 
*/
Crafty.c("JumpPad", 
{
    init: function() 
    {
        this.requires("IBase, Canvas, IReset, SpriteAnimation, spr_jumpPad_01");
        this.setScale(90, 90);

        this.reel("Idle", 1000, 0, 0, 1);
        this.reel("uncompress_00r", 1000, 0, 0, 12);
        this.reel("uncompress_00l", 1000, 0, 1, 12);
        this.reel("recompress_00r", 500, 0, 2, 7);
        this.reel("recompress_00l", 500, 0, 3, 7);

        this.isActive = false;
        this.resetTime = 0; // In ms, how long to wait before the jump pad becomes available again. 

        this.hitBox = Crafty.e("IBase, Canvas, Collision");
        this.hitBox.attr({ w: this.w - (10 * worldScale), h: (10 * worldScale) });
        // this.hitBox.color("red");
        this.hitBox.parentObj = this;
        this.hitBox.onHit("Player", function(collData)
        {
            var curObj = collData[0].obj;

            // this.color("blue");

            if (typeof curObj.jump !== 'undefined') 
            {
                curObj.jump(1200 * worldScale);
                this.parentObj.activate();
            }
        }, function() 
        {
            // this.color("red");
        });
        
        this.bind("EnterFrame", function(frameData) 
        {
            if (this.resetTime > 0) {
                this.resetTime -= 1000 * deltaTime;
            } else if (this.isActive == true && this.getReel().currentFrame == this.getReel().frames.length-1) {
                this.animate("recompress_00r", 1);
                this.isActive = false;
            }
        });
    },

    /*
    * Launches the currently overlapped object upwards. 
    */
    activate: function() 
    {
        this.isActive = true;
        this.animate("uncompress_00r", 1);
        this.resetTime = 1000;
    },

    /*
    * Initilization function. 
    */
    setUp: function() 
    {
        this.hitBox.x = this.x + (5 * worldScale);
        this.hitBox.y = (this.y + this.h) - this.hitBox.h;
    },

    reset: function() 
    {
        this.animate("Idle");
    },
});