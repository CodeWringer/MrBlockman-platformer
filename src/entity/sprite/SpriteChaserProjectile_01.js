/**
* Sprite for chaser and non-chaser projectile. 
*/
Crafty.c("SpriteChaserProjectile_01", 
{
    init: function() 
    {
        this.requires("2D, Canvas, IBase, IOffset, spr_projectile_01");
        this.setScale(50, 50);
        this.z = 5000;
    },
});