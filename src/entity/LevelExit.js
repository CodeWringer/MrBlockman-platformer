/*
* Represents the checkpoint the player character must reach to advance to the next level. 
*/
Crafty.c("LevelExit", 
{
    init: function() 
    {
        this.requires("IBase, Canvas, spr_BlockDoor");
        this.setScale(130, 180);
        this.setInitOffset(0, -(this.h - 90 * worldScale));
        this.activated = false;

        this.hitBox = Crafty.e("2D, Canvas, Collision, Color, IReset");
        this.hitBox.attr({ w: this.w - 10, h: 10 })
        this.hitBox.color("red")
        this.hitBox.onHit("Player", function() {
            this.color("blue");
            if (!this.activated) {
                oLevelBuilder.advanceLevel();
                this.activated = false;
            }
        }, function() 
        {
            this.color("red");
        });
    },

    /*
    * Performs initial setup of this object. 
    */
    setUp: function() 
    {
        this.hitBox.x = this.x + (5 * worldScale);
        this.hitBox.y = this.y + this.h - (10 * worldScale);
    },
});