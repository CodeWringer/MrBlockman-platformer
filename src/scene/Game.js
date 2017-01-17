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
            // for (var i = oLevelBuilder.lIBlock.length - 1; i >= 0; i--) {
            //     oLevelBuilder.lIBlock[i].showDebugDraw();
            // };
        }
        else if (e.key == Crafty.keys.Z)
        {
            Crafty("IDebug").each(function() {
                this.hideDebugDraw();
            });
            // for (var i = oLevelBuilder.lIBlock.length - 1; i >= 0; i--) {
            //     oLevelBuilder.lIBlock[i].hideDebugDraw();
            // };
        }
    });

    this.bind("EnterFrame", function(frameData) 
    {
        deltaTime = (frameData.dt/1000);
    });
});