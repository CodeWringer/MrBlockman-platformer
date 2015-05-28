/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

// -------------------------- Loading_Scene -------------------------- //
Crafty.defineScene("loading", function() 
{
    var LoadText = Crafty.e("Game_Text");
    LoadText.text("Loading...");
    LoadText.attr({ x: 150, y: 120 });

    Crafty.load([
        // Files to load
        "assets/Blockman_01.png",
        "assets/Blockman_01_Parachute.png",
        "assets/Blockman_01_Long.png",
        "assets/BlockDoor_01.png",

        "assets/solidBlocks_02_Ramps.png",
        "assets/solidBlocks_trims_02.png",
        "assets/solidBlock_bg_02.png",

        "assets/dirtBlock_01_ramps.png",
        "assets/dirtBlock_01_trims.png",
        "assets/dirtBlock_bg_01.png",

        "assets/checkPoint_01.png",
        "assets/SpikeBall_01.png",
        "assets/JumpPad_01.png",
        "assets/ProjectileShooter_01.png",
        "assets/Projectile_01.png",
        "assets/dust_01.png",

        "assets/SpikeBall_02.png",
        "assets/SpikeBallOrigin_02.png",
        "assets/SpikeBallChain_02.png",
        "assets/SpikeBallLauncher_01.png",

        "assets/glow_red.png",
        "assets/crusher_01.png",
        ], function() // Things to do after all files have been loaded
        {
        // -------- Define_Sprite_Maps -------- //
        // ---- Player_Character ---- //
        Crafty.sprite(150, 200, "assets/Blockman_01_Parachute.png", {
            spr_PC_Parachute: [0, 0]
        });
        Crafty.sprite(150, 200, "assets/Blockman_01.png", {
            spr_PC: [0, 0]
        });
        Crafty.sprite(150, 200, "assets/Blockman_01_Long.png", {
            spr_PC_Long: [0, 0]
        });
        // ---- BlockDoor ---- //
        Crafty.sprite(128, 180, "assets/BlockDoor_01.png", {
            spr_BlockDoor: [0, 0]
        });
        // ---- checkPoint ---- //
        Crafty.sprite(100, 200, "assets/checkPoint_01.png", {
            spr_checkPoint_01: [0, 0]
        });
        // ---- solidBlock ---- //
        Crafty.sprite(96, 96, "assets/solidBlocks_trims_02.png", {
            spr_solidBlocks_trims_02: [0, 0]
        });
        Crafty.sprite(96, 96, "assets/solidBlock_bg_02.png", {
            spr_solidBlock_bg_02: [0, 0]
        });
        Crafty.sprite(96, 96, "assets/solidBlocks_02_Ramps.png", {
            spr_solidBlock_ramps_02: [0, 0]
        });
        // ---- dirtBlock ---- //
        Crafty.sprite(96, 96, "assets/dirtBlock_01_trims.png", {
            spr_dirtBlock_01_trims: [0, 0]
        });
        Crafty.sprite(96, 96, "assets/dirtBlock_bg_01.png", {
            spr_dirtBlock_bg_01: [0, 0]
        });
        Crafty.sprite(96, 96, "assets/dirtBlock_01_ramps.png", {
            spr_dirtBlock_01_ramps: [0, 0]
        });
        // ---- SpikeBall_01 ---- //
        Crafty.sprite(200, 200, "assets/SpikeBall_01.png", {
            spr_spikeBall_01: [0, 0]
        });
        Crafty.sprite(200, 200, "assets/SpikeBallLauncher_01.png", {
            spr_spikeBallLauncher_01: [0, 0]
        });
        // ---- SpikeBall_02 ---- //
        Crafty.sprite(200, 200, "assets/SpikeBall_02.png", {
            spr_spikeBall_02: [0, 0]
        });
        Crafty.sprite(200, 200, "assets/SpikeBallOrigin_02.png", {
            spr_SpikeBallOrigin_02: [0, 0]
        });
        Crafty.sprite(46, 28, "assets/SpikeBallChain_02.png", {
            spr_SpikeBallChain_02: [0, 0]
        });
        // ---- JumpPad_01 ---- //
        Crafty.sprite(96, 96, "assets/JumpPad_01.png", {
            spr_jumpPad_01: [0, 0]
        });
        // ---- ProjectileShooter_01 ---- //
        Crafty.sprite(90, 90, "assets/ProjectileShooter_01.png", {
            spr_projectileShooter_01: [0, 0]
        });
        // ---- Projectile_01 ---- //
        Crafty.sprite(200, 200, "assets/Projectile_01.png", {
            spr_projectile_01: [0, 0]
        });
        // ---- Projectile_01 ---- //
        Crafty.sprite(180, 180, "assets/crusher_01.png", {
            spr_crusher_01: [0, 0]
        });

        // ---- General_Effects ---- //
        Crafty.sprite(200, 200, "assets/dust_01.png", {
            spr_dust_01: [0, 0]
        });
        Crafty.sprite(64, 64, "assets/glow_red.png", {
            spr_glowRed_01: [0, 0]
        });

        Crafty.enterScene("Game");
    });
});

// -------------------------- Game_Scene -------------------------- //
Crafty.defineScene("Game", function() 
{
    // ------ Level_To_Instance ------ //
    initLevel(curLevel);
});