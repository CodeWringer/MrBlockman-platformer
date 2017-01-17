Crafty.defineScene("Game", function() 
{
    oLevelBuilder.initLevel(2);
    
    this.bind("KeyDown", function(e) 
    {
        if (e.key == Crafty.keys.Q) 
        {
            oLevelBuilder.restartLevel();
        }
        else if (e.key == Crafty.keys.T)
        {
            Crafty("IDebug").each(function() {
                this.showDebugDraw();
            });
        }
        else if (e.key == Crafty.keys.Z)
        {
            Crafty("IDebug").each(function() {
                this.hideDebugDraw();
            });
        }
    });

    this.bind("EnterFrame", function(frameData) 
    {
        deltaTime = (frameData.dt/1000);
    });
});