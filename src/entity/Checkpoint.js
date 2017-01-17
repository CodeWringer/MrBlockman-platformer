Crafty.c("Checkpoint", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, SpriteAnimation, spr_checkPoint_01");
        this.setScale(100, 200);
        this.setInitOffset(0, -(this.h - 90 * worldScale));

        this.isActive = false;
        
        this.reel("unfold_00r", 500, 0, 0, 9);
        this.reel("unfold_00l", 500, 0, 1, 9);

        this.hitBox = Crafty.e("2D, Collision");
        this.hitBox.oParent = this;
        this.hitBox.attr({ w: this.w - 10, h: this.h })
        this.hitBox.onHit("Player", function(collData) 
        {
            var curObj = collData[0].obj;
            this.oParent.activate(curObj);
        }, function() 
        {
            // 
        });
    },

    /*
    * Switches the state of this checkpoint to activated. 
    */
    activate: function(activatingObj) 
    {
        if (!this.isActive) 
        {
            this.isActive = true;
            this.animate("unfold_00r", 1);

            if (activatingObj.has("IReset")) {
                activatingObj.setResetPos(
                    (this.x + (14 * worldScale)), 
                    (this.y + this.h - activatingObj.h - 10)
                );
            }
        }
    },

    /*
    * Switches the state of this checkpoint to deactivated. 
    */
    deactivate: function() {
        this.isActive = false;
    },

    /*
    * Overrides the current position of this entity. 
    */
    setPosition: function(x, y) 
    {
        this.x = x;
        this.y = y;

        this.hitBox.x = x;
        this.hitBox.y = y;
        console.log("setPosition from Checkpoint called");
    },

    /*
    * Performs initial setup of this object. 
    */
    setUp: function() {
        this.hitBox.x = this.x;
        this.hitBox.y = this.y;
    },
});