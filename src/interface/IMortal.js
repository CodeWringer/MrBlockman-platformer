// Include namespaces. 
var interfaces = interfaces || {}; 

/**
* @desc An interface for all entities that have health and can die. 
* @namespace
*/
interfaces.IMortal = function() 
{
    Crafty.c("IMortal", 
    {
        init: function() 
        {
            /**
            * @desc If true, the entity can not die. 
            * @memberof interfaces.IMortal
            * @public
            */
            this.isImmortal = false;
            /**
            * @desc Maximum health the entity can have. 
            * @memberof interfaces.IMortal
            * @public 
            */
            this.healthMax = 1;
            /**
            * @desc Amount of remaining health. 
            * @memberof interfaces.IMortal
            * @private
            */
            this.health = 1;
            /**
            * @desc Becomes true upon death. 
            * @memberof interfaces.IMortal
            * @private
            */
            this.isDead = false;

            // Provide die function, if it isn't alrady defined. 
            if (typeof this.die === 'undefined') {
                /**
                * @desc Makes the entity expire. 
                * @memberof interfaces.IMortal
                * @public
                */
                this.die = function() {
                    if (this.isImmortal == false) {
                        this.destroy();
                        this.isDead = true;
                    }
                };
            }
        },

        /**
        * @desc Overrides the entity's current health. Can not be more than the maximum. 
        * @memberof interfaces.IMortal
        * @param {Number} healthIn - The health to set. 
        * @public
        */
        setHealth: function(healthIn) {
            if (healthIn <= this.healthMax)
                this.health = healthIn;
            else
                this.health = this.healthMax;
        },

        /**
        * @desc Applies damage to an entity's health. 
        * @memberof interfaces.IMortal
        * @param {Number} damageIn - The amount of damage to apply. 
        * @public
        */
        applyDamage: function(damageIn) {
            this.health -= damageIn;

            if (this.health <= 0)
                this.die();
        },
    });
}();