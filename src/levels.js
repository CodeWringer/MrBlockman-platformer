/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

var oLevelBuilder = Crafty.e("LevelBuilder");

// -------------------- Level_List -------------------- //
var maps = [
    // Level 0 - Testlevel
    [
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    [01,02,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,02,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,26,00,00,00,01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,11,00,01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,01,01,01,01,01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,02,00,00,02,01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,21,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,02,01,00,00,00,00,00,00,00,01,02,00,00,00,00,00,00,00,00,01],
    [01,02,03,00,06,00,02,01,01,00,00,00,01,00,00,00,01,01,02,00,00,00,04,00,00,00,01],
    [01,01,01,01,01,01,01,01,01,05,05,05,01,05,05,05,01,01,01,01,01,01,01,01,01,01,01],
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    ],
    // Level 1 - Intro to movement
    [
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    [01,02,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,02,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,02,00,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,01,01,00,00,00,00,00,00,00,01,01,02,00,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,01,01,00,00,00,00,00,00,00,01,01,01,02,00,00,00,00,00,00,00,01],
    [01,00,03,00,00,00,01,01,00,00,00,00,00,00,00,01,01,01,01,02,00,00,04,00,00,00,01],
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    ],
    // Level 2 - Make you jump
    [
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    [01,02,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,00,00,00,00,00,02,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,00,00,00,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,01,00,01,01,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,01,00,00,00,00,00,00,00,01,00,01,02,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,01,00,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,00,01,01,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,01,00,00,00,00,01,00,01,02,00,00,01,00,00,00,01],
    [01,00,00,00,00,00,00,00,00,00,00,01,00,00,00,00,01,00,00,00,00,00,01,00,00,00,01],
    [01,00,03,00,00,00,00,02,01,05,05,01,05,05,05,05,01,01,01,01,00,00,01,00,04,00,01],
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
    ],
];

// Level template
// [
// [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
// [01,02,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,02,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01],
// [01,00,03,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,04,00,00,00,01],
// [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
// [01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01],
// ],