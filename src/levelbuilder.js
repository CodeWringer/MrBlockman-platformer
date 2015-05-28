/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

// This defines the grid size and the size of each tile
var tileSize = {w: (90 * worldScale), h: (90 * worldScale)},

    solidBlockList = [],
    solidBlockListIndex = 0,

    solidRampList = [],
    solidRampListIndex = 0,

    entitiesList = [],
    entitiesListIndex = 0,

    clipList = [],
    clipListIndex = 0,

    pcClipList = [],
    pcClipListIndex = 0,

    hazardClipList = [],
    hazardClipListIndex = 0;

// -------------------- Init_Level -------------------- //
function initLevel(levelNum) {
    var yPosIndex = 0, /*The yPosIndex represents the position of each element in the nums array. The nums array contains more arrays that store the tilemap
                    * I refer to these arrays as the "y pos" elements. Inside each "y pos" element are the values actually used to instance the level */
        xPosIndex = 0,  /*The xPosIndex represents the position of each value inside the "y pos" elements that store the tilemap;
                        * i.e. the "0" and "1" values that get used when instancing the level */
        tileX = 0, //Where an enitity's x pos will be when instanced
        tileY = 0; //Where an entitiy's y pos will be when instanced

    for (var i = 0; i < maps[levelNum].length; i++) { //Accesses the current level to load
        xPosIndex = 0;  //Reset xPosIndex for each new "y pos" element in maps
        tileX = 0;      //Reset tileX, so it's back at 0 when the next "y pos" element gets read
        for (var u = 0; u < maps[levelNum][yPosIndex].length; u++) { //Accesses the current "y pos" element inside the current level to load
            switch (maps[levelNum][yPosIndex][xPosIndex]) { //Checks every element's value inside the "y pos" array
                // ------ Air/Nothing ------ //
                case 0:
                    // Reserved for later (possibly)
                    break;
                // ------ SolidBlock ------ //
                case 1:
                    addSolidBlock(tileX, tileY);
                    break;
                // ------ Player_Character ------ //
                case 2:
                    PC = Crafty.e("PC")
                        .attr({ x: tileX, y: tileY - tileSize.h });
                    PC.resetPosCoords = { x: tileX, y: tileY - tileSize.h };
                    break;
                // ------ Block_Door ------ //
                case 3:
                    addEntity({ x: tileX, y: (tileY+tileSize.h) - (180 * worldScale), entType: "BlockDoor", hasResetPos: true,
                        entProperties: {} });
                    break;
                // ------ Hazard_Floor ------ //
                case 4:
                    Crafty.e("Hazard_Block")
                        .attr({ x: tileX, y: (tileY + (20 * worldScale)), w: tileSize.w, h: (tileSize.h - (20 * worldScale)) });
                    break;
                // ------ SolidRamp ------ //
                case 5:
                    addSolidRamp(tileX, tileY);
                    break;
                // ------ Checkpoint ------ //
                case 6:
                    addEntity({ x: tileX, y: (tileY+tileSize.h) - (200 * worldScale), entType: "Checkpoint", hasResetPos: true,
                        entProperties: {} });
                    break;
                // ------ JumpPad ------ //
                case 8:
                    addEntity({ x: tileX, y: tileY, w: tileSize.w, h: tileSize.h, entType: "JumpPad", hasResetPos: true,
                        entProperties: {} });
                    break;
                // ------ PlayerClip ------ //
                case 9:
                    addPlayerClip(tileX, tileY, tileSize.w, tileSize.h, {  });
                    break;
                // ------ HazardClip ------ //
                case 10:
                    addHazardClip(tileX, tileY, tileSize.w, tileSize.h, {  });
                    break;
                // ------ Clip ------ //
                case 11:
                    addClip(tileX, tileY, tileSize.w, tileSize.h, {  });
                    break;
                // ------ Spike_Ball_01 ------ //
                case 20: // float, right
                    addEntity({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale), entType: "Spike_Ball_01", hasResetPos: true,
                        entProperties: { collType: "float", velocity: { x: 200, y: 0 } } });
                    break;
                case 21: // float, left
                    addEntity({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale), entType: "Spike_Ball_01", hasResetPos: true,
                        entProperties: { collType: "float", velocity: { x: -200, y: 0 } } });
                    break;
                case 22: // roll, right
                    addEntity({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale), entType: "Spike_Ball_01", hasResetPos: true,
                        entProperties: { collType: "roll", velocity: { x: 200, y: 0 } } });
                    break;
                case 23: // roll, left
                    addEntity({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale), entType: "Spike_Ball_01", hasResetPos: true,
                        entProperties: { collType: "roll", velocity: { x: -200, y: 0 } } });
                    break;
                case 24: // bounce, right
                    addEntity({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale), entType: "Spike_Ball_01", hasResetPos: true,
                        entProperties: { collType: "bounce", velocity: { x: 200, y: 0 } } });
                    break;
                case 25: // bounce, left
                    addEntity({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale), entType: "Spike_Ball_01", hasResetPos: true,
                        entProperties: { collType: "bounce", velocity: { x: -200, y: 0 } } });
                    break;
                // ------ Spike_Ball_02 ------ //
                case 26: // clockwise
                    addEntity({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2), entType: "Spike_Ball_02", hasResetPos: true,
                        entProperties: { rotationDir: "clockwise" } });
                    addSolidBlock(tileX, tileY);
                    break;
                case 27: // counterClockwise
                    addEntity({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2), entType: "Spike_Ball_02", hasResetPos: true,
                        entProperties: { rotationDir: "counterClockwise" } });
                    addSolidBlock(tileX, tileY);
                    break;
                case 28: // clockwise, longer chain
                    addEntity({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2), entType: "Spike_Ball_02", hasResetPos: true,
                        entProperties: { rotationDir: "clockwise", radiusMultiplier: 2 } });
                    addSolidBlock(tileX, tileY);
                    break;
                case 29: // counterClockwise, longer chain
                    addEntity({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2), entType: "Spike_Ball_02", hasResetPos: true,
                        entProperties: { rotationDir: "counterClockwise", radiusMultiplier: 2 } });
                    addSolidBlock(tileX, tileY);
                    break;
                // ------ ProjectileShooter ------ //
                case 30: // left
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "left" }, 
                        entClip: { clipType: "pcClip", solidTypes: { isWallR: false } } });
                    break;
                case 31: // right
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "right" }, 
                        entClip: { clipType: "pcClip", solidTypes: { isWallL: false } } });
                    break;
                case 32: // up
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "up" }, 
                        entClip: { clipType: "pcClip", solidTypes: { isCeiling: false } } });
                    break;
                case 33: // down
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "down" }, 
                        entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } });
                    break;
                case 34: // chase, left
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "left", projectileType: "chase" },
                        entClip: { clipType: "pcClip", solidTypes: { isWallR: false } } });
                    break;
                case 35: // chase, right
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "right", projectileType: "chase" },
                        entClip: { clipType: "pcClip", solidTypes: { isWallL: false } } });
                    break;
                case 36: // chase, up
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "up", projectileType: "chase" },
                        entClip: { clipType: "pcClip", solidTypes: { isCeiling: false } } });
                    break;
                case 37: // chase, down
                    addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", entProperties: { direction: "down", projectileType: "chase" },
                        entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } });
                    break;
                // ------ SpikeBallLauncher_01 ------ //
                case 40: // roll, left
                    addEntity({ x: tileX, y: tileY, entType: "Spike_Ball_Launcher_01", entProperties: { direction: "left", collType: "roll", postImpactVel: { x: -200, y: 0 },
                        entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } } });
                    break;
                case 41: // roll, right
                    addEntity({ x: tileX, y: tileY, entType: "Spike_Ball_Launcher_01", entProperties: { direction: "right", collType: "roll", postImpactVel: { x: 200, y: 0 },
                        entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } } });
                    break;
                // ------ Crusher_01 ------ //
                case 42: // crushing left
                    addEntity({ x: tileX, y: tileY, entType: "Crusher_01", entProperties: { direction: "left" } });
                    break;
                case 43: // crushing right
                    addEntity({ x: tileX, y: tileY, entType: "Crusher_01", entProperties: { direction: "right" } });
                    break;
                case 44: // crushing up
                    addEntity({ x: tileX, y: tileY, entType: "Crusher_01", entProperties: { direction: "up" } });
                    break;
                case 45: // crushing down
                    addEntity({ x: tileX, y: tileY, entType: "Crusher_01", entProperties: { direction: "down" } });
                    break;
                default:
                    console.log("Could not find case for number: " + maps[levelNum][yPosIndex][xPosIndex])
            }
            tileX += tileSize.w; // Add to tileX
            xPosIndex++; // Add to the xPosIndex when done evaluating an element of the "y pos" array;
        };
        tileY += tileSize.h; // Add to the tileY each time the for loop passes this line; Whenever a new "y pos" element is reached
        yPosIndex++; // Add to the yPosIndex; In the end this will be the length of the maps array, which holds the "y pos" arrays
    };

    setSolidRampCollBools();
    setSolidBlockCollBools();
    setSolidsAppearance("brick");

    Game.bindViewport(PC);
    // worldGravity = mapProperties[curLevel][0];
    console.log("Current level: " + curLevel);
};

function addSolidRamp(xIn, yIn) {
    solidRampList[solidRampListIndex] = Crafty.e("SolidBlock_ramp")
        .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 });
    solidRampListIndex++;
};

function addSolidBlock(xIn, yIn) {
    solidBlockList[solidBlockListIndex] = Crafty.e("SolidBlock_backGround")
        .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 });
    solidBlockListIndex++;
};

function addEntity(args) {
    entitiesList[entitiesListIndex] = Crafty.e(args.entType);
    entitiesList[entitiesListIndex].attr({ x: args.x, y: args.y });
    if (args.w) {
        entitiesList[entitiesListIndex].w = args.w;
    }
    if (args.h) {
        entitiesList[entitiesListIndex].h = args.h;
    }
    if (args.hasResetPos) {
        entitiesList[entitiesListIndex].resetPosCoords = { x: args.x, y: args.y };
    }
    if (args.entProperties) {
        entitiesList[entitiesListIndex].setProperties(args.entProperties);
    }
    if (args.entClip) {
        if (args.entClip.clipType == "pcClip") {
            addPlayerClip(args.x, args.y, entitiesList[entitiesListIndex].w, entitiesList[entitiesListIndex].h, args.entClip.solidTypes );
        } else if (args.entClip.clipType == "hazardClip") {
            addHazardClip(args.x, args.y, entitiesList[entitiesListIndex].w, entitiesList[entitiesListIndex].h, args.entClip.solidTypes );
        } else if (args.entClip.clipType == "clip") {
            addClip(args.x, args.y, entitiesList[entitiesListIndex].w, entitiesList[entitiesListIndex].h, args.entClip.solidTypes );
        }
    }
    entitiesListIndex++;
};

function addClip(xIn, yIn, wIn, hIn, settingsIn) {
    clipList[clipListIndex] = Crafty.e("ClipBlock")
        .attr({ x: xIn, y: yIn, w: wIn, h: hIn });
    if (settingsIn.isCeiling) {
        clipList[clipListIndex].isCeiling = settingsIn.isCeiling;
    } else if (settingsIn.isFloor) {
        clipList[clipListIndex].isFloor = settingsIn.isFloor;
    } else if (settingsIn.isWallL) {
        clipList[clipListIndex].isWallL = settingsIn.isWallL;
    } else if (settingsIn.isWallR) {
        clipList[clipListIndex].isWallR = settingsIn.isWallR;
    }
    clipListIndex++;
};

function addPlayerClip(xIn, yIn, wIn, hIn, settingsIn) {
    pcClipList[pcClipListIndex] = Crafty.e("ClipBlock_Player")
        .attr({ x: xIn, y: yIn, w: wIn, h: hIn });
    if (settingsIn.isCeiling) {
        pcClipList[pcClipListIndex].isCeiling = settingsIn.isCeiling;
    } else if (settingsIn.isFloor) {
        pcClipList[pcClipListIndex].isFloor = settingsIn.isFloor;
    } else if (settingsIn.isWallL) {
        pcClipList[pcClipListIndex].isWallL = settingsIn.isWallL;
    } else if (settingsIn.isWallR) {
        pcClipList[pcClipListIndex].isWallR = settingsIn.isWallR;
    }
    if (settingsIn.w) {
        pcClipList[pcClipListIndex].w = settingsIn.w;
    }
    if (settingsIn.h) {
        pcClipList[pcClipListIndex].h = settingsIn.h;
    }
    pcClipListIndex++;
};

function addHazardClip(xIn, yIn, wIn, hIn, settingsIn) {
    hazardClipList[hazardClipListIndex] = Crafty.e("ClipBlock_Hazard")
        .attr({ x: xIn, y: yIn, w: wIn, h: hIn });
    if (settingsIn.isCeiling) {
        hazardClipList[hazardClipListIndex].isCeiling = settingsIn.isCeiling;
    } else if (settingsIn.isFloor) {
        hazardClipList[hazardClipListIndex].isFloor = settingsIn.isFloor;
    } else if (settingsIn.isWallL) {
        hazardClipList[hazardClipListIndex].isWallL = settingsIn.isWallL;
    } else if (settingsIn.isWallR) {
        hazardClipList[hazardClipListIndex].isWallR = settingsIn.isWallR;
    }
    hazardClipListIndex++;
};

// -------------------- Solids_Collision_Booleans -------------------- //
function setSolidRampCollBools() {
    var hasLeft = false,
        hasRight = false,
        hasAbove = false,
        hasBelow = false;

    // Check every solidRamp
    for (var i = solidRampList.length-1; i > -1; --i) {
        var curRamp = solidRampList[i];

        // -------- Checking_Bools -------- //
        // Reset bools
        hasLeft = false;
        hasRight = false;
        hasAbove = false;
        hasBelow = false;
        
        if (getLeftSolidBlock(curRamp.x, curRamp.y) != null) {
            hasLeft = true;
        }
        if (getBelowSolidBlock(curRamp.x, curRamp.y) != null) {
            hasBelow = true;
        }

        if (getRightSolidBlock(curRamp.x, curRamp.y) != null) {
            hasRight = true;
        }

        if (getAboveSolidBlock(curRamp.x, curRamp.y) != null) {
            hasAbove = true;
        }

        // -------- CurRamp_Bools -------- //
        if (hasLeft) {
            if (hasBelow) {
                curRamp.isBL = true;
            } else if (hasAbove) {
                curRamp.isTL = true;
            }
        } else if (hasRight) {
            if (hasBelow) {
                curRamp.isBR = true;
            } else if (hasAbove) {
                curRamp.isTR = true;
            }
        }

        // Calls a function that determines how collisions with this ramp will be calculated
        curRamp.setLinF();
    }
};

function setSolidBlockCollBools() {
    var xBounds = (tileSize.w*maps[curLevel][0].length) - tileSize.w, /* The furthest x coordinate where a solid block could be.
        The assumption is that all the arrays in the curLevel have equal length */
        yBounds = (tileSize.h*maps[curLevel].length) - tileSize.h; // The furthest y coordinate where a solid block could be.
        
    setSolidBlockCollBools_RampCheck();
    setSolidBlockCollBools_BlockCheck();

    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) {
        var curSolid = solidBlockList[i];

        // Check curSolid if it is at the map bounds
        if (curSolid.x == 0) {
            curSolid.isWallL = false;
        } else if (curSolid.x == xBounds) {
            curSolid.isWallR = false;
        }
        if (curSolid.y == 0) {
            curSolid.isFloor = false;
        } else if (curSolid.y == yBounds) {
            curSolid.isCeiling = false;
        }
    }
    console.log("Set up solidBlock collision data!");
};

function setSolidBlockCollBools_BlockCheck() {
    // Check against solidRamps
    for (var i = solidBlockList.length-1; i > -1; --i) {
        var checkingRamp = solidBlockList[i];

        var checkingBlockL = getLeftSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockR = getRightSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockT = getAboveSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockB = getBelowSolidBlock(checkingRamp.x, checkingRamp.y);

        if (checkingBlockL != null) {
            // console.log(checkingBlockL);
            checkingBlockL.isWallR = false;
        }
        if (checkingBlockR != null) {
            // console.log(checkingBlockR);
            checkingBlockR.isWallL = false;
        }
        if (checkingBlockT != null) {
            // console.log(checkingBlockT);
            checkingBlockT.isCeiling = false;
        }
        if (checkingBlockB != null) {
            // console.log(checkingBlockB);
            checkingBlockB.isFloor = false;
        }
    }
};

function setSolidBlockCollBools_RampCheck() {
    // Check against solidRamps
    for (var i = solidRampList.length-1; i > -1; --i) {
        var checkingRamp = solidRampList[i];

        var checkingBlockL = getLeftSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockR = getRightSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockT = getAboveSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockB = getBelowSolidBlock(checkingRamp.x, checkingRamp.y);

        if (checkingBlockL != null) {
            // console.log(checkingBlockL);
            checkingBlockL.isWallR = false;
        }
        if (checkingBlockR != null) {
            // console.log(checkingBlockR);
            checkingBlockR.isWallL = false;
        }
        if (checkingBlockT != null) {
            // console.log(checkingBlockT);
            checkingBlockT.isCeiling = false;
        }
        if (checkingBlockB != null) {
            // console.log(checkingBlockB);
            checkingBlockB.isFloor = false;
        }
    }
};

function optimizeSolidBlocks() {
    // Might not be necessary in the end, would have to rewrite how solidBlocks are added to the stage
    console.log("Optimized solidBlocks!");
};

// -------------------- Solids_Appearance -------------------- //
function addSolidBlockTrim(xIn, yIn, trimType, reelName) {
    Crafty.e("SolidBlock_trim")
        .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 })
        .reel(reelName)
        .reelPosition(trimType);
};

function getReelName(tileset) {
    var reelName;
    // Explicit "list" of recognized tilesets
    if (tileset == "brick") {
        return reelName = "solidBlock_brick";
    } else {
        console.log("Can't find tileset " + tileset + "! Using default tileset.");
        return reelName = "solidBlock_brick";
    }
}

function setSolidsAppearance(tileset) {
    for (var i = solidBlockList.length-1; i > -1; --i) {
        var curSolid = solidBlockList[i];

        // Switches the curSolid, which is the background of each tile to the desired tileset background
        curSolid.reel(getReelName(tileset));

        /* Adds a trim object to the location of the curSolid and makes sure the curSolid has at least one true bool
        It also needs to be told the currently desired tileset, as these objects are unlisted and can't be accessed after their creation,
        which means they must be told their appearance as soon as they are created */
        if (curSolid.isFloor || curSolid.isCeiling || curSolid.isWallL || curSolid.isWallR) {
            setSolidBlockSidesAppearance(curSolid, tileset);
        }
        /* Adds corner objects to the location of the curSolid
        It also needs to be told the currently desired tileset, as these objects are unlisted and can't be accessed after their creation,
        which means they must be told their appearance as soon as they are created */
        setSolidBlockCornersAppearance(curSolid, tileset);
    }
    // Changes the ramp appearance
    setSolidRampsAppearance(tileset);

    // Adds corner objects to below the solidRamps
    setSolidRampsCornersAppearance(tileset);

    console.log("Set up solidBlock appearances!");
};

// Sets the current animated frame of the curSolid tile, the animation is actually paused so it's changing the appearance of the block permanently
// This one sets the appearance of the corner pieces of the solidBlocks
function setSolidBlockCornersAppearance(curSolid, tileset) {
    // Check against other solidBlocks
    for (var u = solidBlockList.length-1; u > -1; --u) {
        var checkingSolid = solidBlockList[u];
        
        if (checkingSolid.x == curSolid.x && checkingSolid.y == (curSolid.y - tileSize.h)) { // above
            if (checkingSolid.isWallL && !curSolid.isWallL) {
                addSolidBlockTrim(curSolid.x, curSolid.y, 4, getReelName(tileset)); // tl
            }
            if (checkingSolid.isWallR && !curSolid.isWallR) {
                addSolidBlockTrim(curSolid.x, curSolid.y, 5, getReelName(tileset)); // tr
            }
        } else if (checkingSolid.x == curSolid.x && checkingSolid.y == (curSolid.y + tileSize.h)) { // below
            if (checkingSolid.isWallL && !curSolid.isWallL) {
                addSolidBlockTrim(curSolid.x, curSolid.y, 6, getReelName(tileset)); // bl
            }
            if (checkingSolid.isWallR && !curSolid.isWallR) {
                addSolidBlockTrim(curSolid.x, curSolid.y, 7, getReelName(tileset)); // br
            }
        }
    }
};

// Sets the current animated frame of the curSolid tile, the animation is actually paused so it's changing the appearance of the block permanently
// This one sets the appearance of the sides of the solidBlocks
function setSolidBlockSidesAppearance(curSolid, tileset) {
    if (curSolid.isWallL) {
        addSolidBlockTrim(curSolid.x, curSolid.y, 2, getReelName(tileset));
    }
    if (curSolid.isWallR) {
        addSolidBlockTrim(curSolid.x, curSolid.y, 3, getReelName(tileset));
    }
    if (curSolid.isFloor) {
        addSolidBlockTrim(curSolid.x, curSolid.y, 0, getReelName(tileset));
    }
    if (curSolid.isCeiling) {
        addSolidBlockTrim(curSolid.x, curSolid.y, 1, getReelName(tileset));
    }
};

// Sets the current animated frame of the curRamp tile, the animation is actually paused so it's changing the appearance of the block permanently
// This one sets the appearance of the solidRamps
function setSolidRampsAppearance(tileset) {
    for (var i = solidRampList.length-1; i > -1; --i) {
        var curRamp = solidRampList[i];

        curRamp.reel(getReelName(tileset));
        if (curRamp.isBL) {
            curRamp.reelPosition(0);
        } else if (curRamp.isBR) {
            curRamp.reelPosition(1);
        } else if (curRamp.isTL) {
            curRamp.reelPosition(2);
        } else if (curRamp.isTR) {
            curRamp.reelPosition(3);
        }
    }
};

function setSolidRampsCornersAppearance(tileset) {
    for (var i = solidRampList.length-1; i > -1; --i) {
        var checkingRamp = solidRampList[i];

        var checkingBlockBelow = getBelowSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockAbove = getAboveSolidBlock(checkingRamp.x, checkingRamp.y);

        if (checkingBlockBelow != null) {
            if (checkingRamp.isBL) {
                addSolidBlockTrim(checkingBlockBelow.x, checkingBlockBelow.y, 8, getReelName(tileset));
            } else if (checkingRamp.isBR) {
                addSolidBlockTrim(checkingBlockBelow.x, checkingBlockBelow.y, 9, getReelName(tileset));
            }
        }
        if (checkingBlockAbove != null) {
            if (checkingRamp.isTL) {
                addSolidBlockTrim(checkingBlockAbove.x, checkingBlockAbove.y, 10, getReelName(tileset));
            } else if (checkingRamp.isTR) {
                addSolidBlockTrim(checkingBlockAbove.x, checkingBlockAbove.y, 11, getReelName(tileset));
            }
        }
    }
};

// -------------------- General_Level_Functions -------------------- //
function destroyLevel() {
    Crafty("2D").each(function(i) {
        this.destroy();
    });
    // solidBlocks
    solidBlockList = null;
    solidBlockList = [];
    solidBlockListIndex = 0;

    // solidRamps
    solidRampList = null;
    solidRampList = [];
    solidRampListIndex = 0;

    // entities
    entitiesList = null;
    entitiesList = [];
    entitiesListIndex = 0;

    // clips
    clipList = null;
    clipList = [];
    clipListIndex = 0;

    // hazardClips
    hazardClipList = null;
    hazardClipList = [];
    hazardClipListIndex = 0;

    // pcClips
    pcClipList = null;
    pcClipList = [];
    pcClipListIndex = 0;
};

function advanceLevel() {
    if (maps[curLevel + 1]) {
        destroyLevel();
        curLevel++;
        initLevel(curLevel);
    } else {
        console.log("No level at num: " + (curLevel + 1) + "!")
    }
};

function restartLevel() {
    resetEntities();
};

function resetEntities() {
    Crafty("Entity").each(function(i) {
        this.resetPos();
    });
};

// -------------------- Helper_Functions -------------------- //
// ---- Solid_Blocks ---- //
function getLeftSolidBlock(xIn, yIn) {
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn - tileSize.w && curSolid.y == yIn) {
            return curSolid;
        }
    }
    return null;
};

function getRightSolidBlock(xIn, yIn) {
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn + tileSize.w && curSolid.y == yIn) {
            return curSolid;
        }
    }
    return null;
};

function getAboveSolidBlock(xIn, yIn) {
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn && curSolid.y == yIn - tileSize.h) {
            return curSolid;
        }
    }
    return null;
};

function getBelowSolidBlock(xIn, yIn) {
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn && curSolid.y == yIn + tileSize.h) {
            return curSolid;
        }
    }
    return null;
};