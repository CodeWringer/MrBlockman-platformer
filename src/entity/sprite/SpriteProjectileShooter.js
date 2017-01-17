/*
* Sprite object for projectile shooters. 
*/
Crafty.c("SpriteProjectileShooter", 
{
    init: function() 
    {
        this.requires("IBase, Canvas, SpriteAnimation, IOffset, spr_projectileShooter_01");
        this.setScale(180, 150);
        this.z = 8000;

        this.reel("Idle", 1000, 0, 0, 1);   // Idle. 
        this.reel("Shoot", 1000, 0, 0, 13); // Shooting. 
    },
});