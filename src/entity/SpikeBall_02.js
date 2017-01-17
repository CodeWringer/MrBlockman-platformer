/*
* Spike ball hazard. Has a Spike ball spinning in circles on a chain. 
*/
Crafty.c("SpikeBall_02", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, IReset");
        this.attr({ w: 1, h: 1 });

        this.rotationDir = "clockwise"; // clockwise, counterClockwise
        this.rotationSpeed = 3;
        this.curRotationAngle = 0;
        this.chainLength = 5; // Number of chain segments. 
        this.radius = 1;
        this.refRotPoint = { x: this.x + this.radius, y: this.y }; // Point from default position. 
        this.nextRotPoint = { x: this.x + this.radius, y: this.y };

        this.chainSegArray = [];
        this.chainDistanceSegment = { x: 0, y: 0 };

        this.spikeBall = Crafty.e("SpikeBallHitBox_02");
        this.spikeBallOrigin = Crafty.e("SpriteSpikeBallOrigin_02");
        
        this.bind("EnterFrame", function(frameData) 
        {
            // ---- Calculate_Rotation_Point ---- //
            if (this.rotationDir == "clockwise")
                this.curRotationAngle += this.rotationSpeed * deltaTime;
            else if (this.rotationDir == "counterClockwise")
                this.curRotationAngle -= this.rotationSpeed * deltaTime;

            this.nextRotPoint = Maths.getPointOnCircle({ x: this.x, y: this.y }, this.refRotPoint, this.curRotationAngle);

            // ---- Update_spikeBall ---- //
            this.spikeBall.x = this.nextRotPoint.x - this.spikeBall.w/2;
            this.spikeBall.y = this.nextRotPoint.y - this.spikeBall.h/2;

            // ---- Update_spikeBallChains ---- //
            this.updateChain();
        });
    },

    /*
    * Initilizes the segments of the chain. 
    */
    createChain: function() 
    {
        var newSegment = Crafty.e("SpikeBallChainAnchor_02");
        var segmentsCount = Math.abs(this.radius/newSegment.spriteObj.w);

        for (var i = 0; i < segmentsCount; i++) {
            newSegment = Crafty.e("SpikeBallChainAnchor_02");
            this.chainSegArray[i] = newSegment;
        };
    },

    /*
    * Updates each chain segment. 
    */
    updateChain: function() 
    {
        // Divide distance between origin and nextRotPoint by length of chain
        this.chainDistanceSegment.x = (this.x - this.nextRotPoint.x) / this.chainSegArray.length;
        this.chainDistanceSegment.y = (this.y - this.nextRotPoint.y) / this.chainSegArray.length;

        this.degAngle = Maths.getAtan2DegAngle({ x: this.x, y: this.y }, this.nextRotPoint);
        
        for (var i = 0; i < this.chainSegArray.length; i++) 
        {
            var curSeg = this.chainSegArray[i];

            // Update location
            curSeg.x = this.x - (this.chainDistanceSegment.x * i);
            curSeg.y = this.y - (this.chainDistanceSegment.y * i);
            // Update rotation
            curSeg.updateRot(this.degAngle);
        }
    },

    /*
    * Initilization function. 
    */
    setUp: function(propertiesIn) 
    {
        if (propertiesIn.rotationDir) 
        {
            this.rotationDir = propertiesIn.rotationDir;
            this.spikeBall.rotationDir = propertiesIn.rotationDir;
        } 
        else 
        {
            this.rotationDir = "clockwise";
            this.spikeBall.rotationDir = "clockwise";
        }

        if (propertiesIn.rotationSpeed) 
            this.rotationSpeed = propertiesIn.rotationSpeed;
        else 
            this.rotationSpeed = 3;

        if (propertiesIn.chainLength) 
            this.chainLength = propertiesIn.chainLength;
        else 
            this.chainLength = 1;

        this.radius = (this.chainLength * Crafty.e("SpriteSpikeBallChain_02").w * worldScale);
        this.refRotPoint = { x: this.x + this.radius, y: this.y};
        this.nextRotPoint = { x: this.x + this.radius, y: this.y};
        this.createChain();
        this.spikeBallOrigin.x = this.x - (this.spikeBallOrigin.w/2);
        this.spikeBallOrigin.y = this.y - (this.spikeBallOrigin.h/2);
    },

    /*
    * Resets this object. 
    */
    reset: function() 
    {
        this.x = this.resetPos.x;
        this.y = this.resetPos.y;
        this.refRotPoint.x = this.x + this.radius;
        this.refRotPoint.y = this.y;
        this.curRotationAngle = 0;
        this.nextRotPoint.x = this.refRotPoint.x;
        this.nextRotPoint.y = this.refRotPoint.y;
    },
});