/*
* An interface for all entities that have health and can die. 
*/
Crafty.c("IMortal", 
{
    init: function() 
    {
        this.isImmortal = false; // If true, entity will not die. 
        this.healthMax = 1; // Maximum health the entity can have. 
        this.health = 1;    // Amount of remaining health. 
        this.isDead = false;// Becomes true upon death. 

        // Provide die function, if it isn't alrady defined. 
        if (typeof this.die === 'undefined') {
            /*
            * Makes the entity expire. 
            */
            this.die = function() {
                if (this.isImmortal == false) {
                    this.destroy();
                    this.isDead = true;
                }
            };
        }
    },

    /*
    * Overrides the entity's current health. Can not be more than the maximum. 
    */
    setHealth: function(healthIn) {
        if (healthIn <= this.healthMax)
            this.health = healthIn;
        else
            this.health = this.healthMax;
    },

    /*
    * Applies damage to an entity's health. 
    */
    applyDamage: function(damageIn) {
        this.health -= damageIn;

        if (this.health <= 0)
            this.die();
    },
});