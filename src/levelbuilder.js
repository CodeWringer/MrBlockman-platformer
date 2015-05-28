/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

// This defines the grid size and the size of each tile
var tileSize = {w: (90 * worldScale), h: (90 * worldScale)};

var solidBlockList = [];
var solidBlockListIndex = 0;

var solidRampList = [];
var solidRampListIndex = 0;

var entitiesList = [];
var entitiesListIndex = 0;

var clipList = [];
var clipListIndex = 0;

var pcClipList = [];
var pcClipListIndex = 0;

var hazardClipList = [];
var hazardClipListIndex = 0;

// -------------------- Init_Level -------------------- //
/*
*   Takes an int of a level to jump to
*   Loads up the tiles from the maps[levelNum] array and places them in the scene
*   Also instantiates all the entities as defined in the maps[levelNum] array
*   Then calls some functions to have solidBlock and solidRamp collisions and appearances updated
*/
function initLevel(levelNum) 
{
    if (maps[levelNum]) 
    {
        // The yPosIndex represents the position of each element in the nums array. The nums array contains more arrays that store the tilemap
        // I refer to these arrays as the "y pos" elements. Inside each "y pos" element are the values actually used to instance the level
        var yPosIndex = 0;

        // The xPosIndex represents the position of each value inside the "y pos" elements that store the tilemap;
        // i.e. the "0" and "1" values that get used when instancing the level
        var xPosIndex = 0;
                            
        var tileX = 0; // Where an enitity's x pos will be when instanced
        var tileY = 0; // Where an entitiy's y pos will be when instanced

        for (var i = 0; i < maps[levelNum].length; i++) // Accesses the current level to load
        { 
            for (var u = 0; u < maps[levelNum][yPosIndex].length; u++) // Accesses the current "y pos" element inside the current level to load
            { 
                switch (maps[levelNum][yPosIndex][xPosIndex]) // Checks every element's value inside the "y pos" array
                { 
                    // ------ Air/Nothing ------ //
                    case 0:
                        // Reserved for later (possibly)
                        break;
                    // ------ solidBlock ------ //
                    case 1:
                        addSolidBlock(tileX, tileY, mapProperties[curLevel][0]);
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
                    // ------ solidRamp ------ //
                    case 5:
                        addSolidRamp(tileX, tileY, mapProperties[curLevel][0]);
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
                        addClip(tileX, tileY, tileSize.w, tileSize.h, { clipType: "pcClip", solidTypes: {  } });
                        break;
                    // ------ HazardClip ------ //
                    case 10:
                        addClip(tileX, tileY, tileSize.w, tileSize.h, { clipType: "hazardClip", solidTypes: {  } });
                        break;
                    // ------ Clip ------ //
                    case 11:
                        addClip(tileX, tileY, tileSize.w, tileSize.h, { clipType: "clip", solidTypes: {  } });
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
                        addSolidBlock(tileX, tileY, mapProperties[curLevel][0]);
                        break;
                    case 27: // counterClockwise
                        addEntity({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2), entType: "Spike_Ball_02", hasResetPos: true,
                            entProperties: { rotationDir: "counterClockwise" } });
                        addSolidBlock(tileX, tileY, mapProperties[curLevel][0]);
                        break;
                    case 28: // clockwise, longer chain
                        addEntity({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2), entType: "Spike_Ball_02", hasResetPos: true,
                            entProperties: { rotationDir: "clockwise", radiusMultiplier: 2 } });
                        addSolidBlock(tileX, tileY, mapProperties[curLevel][0]);
                        break;
                    case 29: // counterClockwise, longer chain
                        addEntity({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2), entType: "Spike_Ball_02", hasResetPos: true,
                            entProperties: { rotationDir: "counterClockwise", radiusMultiplier: 2 } });
                        addSolidBlock(tileX, tileY, mapProperties[curLevel][0]);
                        break;
                    // ------ ProjectileShooter ------ //
                    case 30: // left
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "left" }, 
                            entClip: { clipType: "pcClip", solidTypes: { isWallR: false } } });
                        break;
                    case 31: // right
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "right" }, 
                            entClip: { clipType: "pcClip", solidTypes: { isWallL: false } } });
                        break;
                    case 32: // up
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "up" }, 
                            entClip: { clipType: "pcClip", solidTypes: { isCeiling: false } } });
                        break;
                    case 33: // down
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "down" }, 
                            entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } });
                        break;
                    case 34: // chase, left
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "left", projectileType: "chase" },
                            entClip: { clipType: "pcClip", solidTypes: { isWallR: false } } });
                        break;
                    case 35: // chase, right
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "right", projectileType: "chase" },
                            entClip: { clipType: "pcClip", solidTypes: { isWallL: false } } });
                        break;
                    case 36: // chase, up
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "up", projectileType: "chase" },
                            entClip: { clipType: "pcClip", solidTypes: { isCeiling: false } } });
                        break;
                    case 37: // chase, down
                        addEntity({ x: tileX, y: tileY, entType: "ProjectileShooter", 
                            entProperties: { direction: "down", projectileType: "chase" },
                            entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } });
                        break;
                    // ------ SpikeBallLauncher_01 ------ //
                    case 40: // roll, left
                        addEntity({ x: tileX, y: tileY, entType: "Spike_Ball_Launcher_01", 
                            entProperties: { direction: "left", collType: "roll", postImpactVel: { x: -200, y: 0 } },
                            entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } });
                        break;
                    case 41: // roll, right
                        addEntity({ x: tileX, y: tileY, entType: "Spike_Ball_Launcher_01", 
                            entProperties: { direction: "right", collType: "roll", postImpactVel: { x: 200, y: 0 } },
                            entClip: { clipType: "pcClip", solidTypes: { isFloor: false } } });
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
                        console.log("Could not find case for number: " + maps[levelNum][yPosIndex][xPosIndex]);
                }
                tileX += tileSize.w; // Add to tileX
                xPosIndex++; // Add to the xPosIndex when done evaluating an element of the "y pos" array;
            }
            tileX = 0;          // Reset tileX, so it's back at 0 when the next "y pos" element gets read
            tileY += tileSize.h;// Add to the tileY each time the for loop passes this line; Whenever a new "y pos" element is reached

            xPosIndex = 0;  // Reset xPosIndex for each new "y pos" element in maps
            yPosIndex++;    // Add to the yPosIndex; In the end this will be the length of the maps array, which holds the "y pos" arrays
        }

        setSolidRampCollBools();
        setSolidBlockCollBools();
        setSolidsAppearance(mapProperties[curLevel][0]);

        Game.bindViewport(PC);

        console.log("Current level: " + curLevel);
    } 
    else 
    {
        console.log("Could not load level at levelNum " + levelNum);
    }
};

/*
*   Adds a block at the given coordinates and with the appearances based on the String given as typeIn
*/
function addSolidRamp(xIn, yIn, typeIn) 
{
    if (typeIn == "brick") 
    {
        solidRampList[solidRampListIndex] = Crafty.e("SolidBlock_ramp")
            .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 });
    } 
    else if (typeIn == "dirt") 
    {
        solidRampList[solidRampListIndex] = Crafty.e("DirtBlock_ramp")
            .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 });
    }

    solidRampListIndex++;
};

/*
*   Adds a ramp at the given coordinates and with the appearances based on the String given as typeIn
*/
function addSolidBlock(xIn, yIn, typeIn) 
{
    if (typeIn == "brick") 
    {
        solidBlockList[solidBlockListIndex] = Crafty.e("SolidBlock_backGround")
            .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 });
    } 
    else if (typeIn == "dirt") 
    {
        solidBlockList[solidBlockListIndex] = Crafty.e("DirtBlock_backGround")
            .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 });
    }

    solidBlockListIndex++;
};

/*
*   Adds a given entity to the current scene and level
*   Expects arguments in the form:
*   { entType: String, x: int, y: int[, w: int, h: int, hasResetPos: bool, entProperties: object, entClip: object] }
*   Expeced form of entProperties:
*   { <Any amount of arbitrary data> }
*   Expected form of entClip:
*   { clipType: String, x: int, y: int, w: int, h: int, solidTypes: object }
*   Expected form of solidTypes:
*   {[ isCeiling: bool, isFloor: bool, isWallL: bool, isWallR: bool ]}
*/
function addEntity(args) 
{
    entitiesList[entitiesListIndex] = Crafty.e(args.entType);
    entitiesList[entitiesListIndex].attr({ x: args.x, y: args.y });

    if (args.w) 
        entitiesList[entitiesListIndex].w = args.w;
    if (args.h) 
        entitiesList[entitiesListIndex].h = args.h;

    if (args.hasResetPos) 
        entitiesList[entitiesListIndex].resetPosCoords = { x: args.x, y: args.y };
    if (args.entProperties) 
        entitiesList[entitiesListIndex].setProperties(args.entProperties);
    if (args.entClip) 
        addClip(args.x, args.y, entitiesList[entitiesListIndex].w, entitiesList[entitiesListIndex].h, args.entClip );

    entitiesListIndex++;
};

/*
*   Takes a set of coordinates and settings of solidTypes, mostly useful for excluding a certain direction
*   from collisions, per default all directions will allow collisions
*   Also important is the clipTypeIn, as this will determine which entities will be excluded from collisions
*   Expected format of entClipSettingsIn:
*   {[ isCeiling: bool, isFloor: bool, isWallL: bool, isWallR: bool ]}
*/
function addClip(xIn, yIn, wIn, hIn, entClipSettingsIn) 
{
    // Determine what type or types of entity/entities this clip will prevent from passing through it
    if (entClipSettingsIn.clipType == "clip") 
    {
        clipList[clipListIndex] = Crafty.e("ClipBlock")
            .attr({ x: xIn, y: yIn, w: wIn, h: hIn });

        setClipCollisionDirs(clipList[clipListIndex], entClipSettingsIn.solidTypes);
        clipListIndex++;

    } 
    else if (entClipSettingsIn.clipType == "pcClip") 
    {
        pcClipList[pcClipListIndex] = Crafty.e("ClipBlock_Player")
            .attr({ x: xIn, y: yIn, w: wIn, h: hIn });

        setClipCollisionDirs(pcClipList[pcClipListIndex], entClipSettingsIn.solidTypes);
        pcClipListIndex++;

    } 
    else if (entClipSettingsIn.clipType == "hazardClip") 
    {
        hazardClipList[hazardClipListIndex] = Crafty.e("ClipBlock_Hazard")
            .attr({ x: xIn, y: yIn, w: wIn, h: hIn });

        setClipCollisionDirs(hazardClipList[hazardClipListIndex], entClipSettingsIn.solidTypes);
        hazardClipListIndex++;
    }
};

/*
*   Takes a clip object and a settings object and applies the according settings
*   Expected format of settings object:
*   {[ isCeiling: bool, isFloor: bool, isWallL: bool, isWallR: bool ]}
*   Giving no entries to the settings object is accepted, in that case all will default to true
*/
function setClipCollisionDirs(clipObjIn, settingsIn) 
{
    if (settingsIn.isCeiling)
        clipObjIn.isCeiling = settingsIn.isCeiling;
    else if (settingsIn.isFloor)
        clipObjIn.isFloor = settingsIn.isFloor;
    else if (settingsIn.isWallL)
        clipObjIn.isWallL = settingsIn.isWallL;
    else if (settingsIn.isWallR)
        clipObjIn.isWallR = settingsIn.isWallR;
};

// -------------------- Solids_Collision_Booleans -------------------- //
function setSolidRampCollBools() 
{
    var hasLeft = false;
    var hasRight = false;
    var hasAbove = false;
    var hasBelow = false;

    // Check every solidRamp
    for (var i = solidRampList.length-1; i > -1; --i) 
    {
        var curRamp = solidRampList[i];

        // -------- Checking_Bools -------- //
        // Reset bools
        hasLeft = false;
        hasRight = false;
        hasAbove = false;
        hasBelow = false;
        
        if (getLeftSolidBlock(curRamp.x, curRamp.y) != null)
            hasLeft = true;
        if (getBelowSolidBlock(curRamp.x, curRamp.y) != null)
            hasBelow = true;
        if (getRightSolidBlock(curRamp.x, curRamp.y) != null)
            hasRight = true;
        if (getAboveSolidBlock(curRamp.x, curRamp.y) != null)
            hasAbove = true;

        // -------- CurRamp_Bools -------- //
        if (hasLeft) 
        {
            if (hasBelow) 
                curRamp.isBL = true;
            else if (hasAbove) 
                curRamp.isTL = true;
        } 
        else if (hasRight) 
        {
            if (hasBelow) 
                curRamp.isBR = true;
            else if (hasAbove) 
                curRamp.isTR = true;
        }

        // Calls a function that determines how collisions with this ramp will be calculated
        curRamp.setLinF();
    }
};

function setSolidBlockCollBools() 
{
    // The furthest x coordinate where a solid block could be.
    // The assumption is that all the arrays in the curLevel have equal length.
    var xBounds = (tileSize.w*maps[curLevel][0].length) - tileSize.w; 

    // The furthest y coordinate where a solid block could be.
    var yBounds = (tileSize.h*maps[curLevel].length) - tileSize.h; 
        
    setSolidBlockCollBools_RampCheck();
    setSolidBlockCollBools_BlockCheck();

    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) 
    {
        var curSolid = solidBlockList[i];

        // Check curSolid if it is at the map bounds
        if (curSolid.x == 0)
            curSolid.isWallL = false;
        else if (curSolid.x == xBounds) 
            curSolid.isWallR = false;

        if (curSolid.y == 0) 
            curSolid.isFloor = false;
        else if (curSolid.y == yBounds)
            curSolid.isCeiling = false;
    }
    console.log("Set up solidBlock collision data!");
};

function setSolidBlockCollBools_BlockCheck() 
{
    // Check against solidRamps
    for (var i = solidBlockList.length-1; i > -1; --i)
     {
        var checkingRamp = solidBlockList[i];

        var checkingBlockL = getLeftSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockR = getRightSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockT = getAboveSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockB = getBelowSolidBlock(checkingRamp.x, checkingRamp.y);

        if (checkingBlockL != null) 
            checkingBlockL.isWallR = false;
        if (checkingBlockR != null) 
            checkingBlockR.isWallL = false;
        if (checkingBlockT != null) 
            checkingBlockT.isCeiling = false;
        if (checkingBlockB != null) 
            checkingBlockB.isFloor = false;
    }
};

function setSolidBlockCollBools_RampCheck() 
{
    // Check against solidRamps
    for (var i = solidRampList.length-1; i > -1; --i) 
    {
        var checkingRamp = solidRampList[i];

        var checkingBlockL = getLeftSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockR = getRightSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockT = getAboveSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockB = getBelowSolidBlock(checkingRamp.x, checkingRamp.y);

        if (checkingBlockL != null) 
            checkingBlockL.isWallR = false;
        if (checkingBlockR != null) 
            checkingBlockR.isWallL = false;
        if (checkingBlockT != null) 
            checkingBlockT.isCeiling = false;
        if (checkingBlockB != null) 
            checkingBlockB.isFloor = false;
    }
};

// -------------------- Solids_Appearance -------------------- //
/*
*   Adds a trim object at the given coordinates
*   trimType defines whether it will define its orientation
*   typeIn defines which kind of appearance object to use
*/
function addSolidBlockTrim(xIn, yIn, trimType, typeIn) 
{
    if (typeIn == "brick") 
    {
        Crafty.e("SolidBlock_trim")
            .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 })
            .reelPosition(trimType);
    } 
    else if (typeIn == "dirt") 
    {
        Crafty.e("DirtBlock_trim")
            .attr({ x: xIn, y: yIn, w: tileSize.w+1, h: tileSize.h+1 })
            .reelPosition(trimType);
    }
};

/*
*   Sets the current animated frame of the curSolid tile, 
*   the animation is actually paused so it's changing the appearance of the block permanently
*   This one sets the appearance of the corner pieces of the solidBlocks
*/
function setSolidsAppearance(typeIn) 
{
    for (var i = solidBlockList.length-1; i > -1; --i) 
    {
        var curSolid = solidBlockList[i];

        // Adds a trim object to the location of the curSolid and makes sure the curSolid has at least one true bool
        if (curSolid.isFloor || curSolid.isCeiling || curSolid.isWallL || curSolid.isWallR) 
            setSolidBlockSidesAppearance(curSolid, mapProperties[curLevel][0]);
        // Adds corner objects to the location of the curSolid
        setSolidBlockCornersAppearance(curSolid, mapProperties[curLevel][0]);
    }
    // Changes the ramp appearance
    setSolidRampsAppearance(mapProperties[curLevel][0]);

    // Adds corner objects to below the solidRamps
    setSolidRampsCornersAppearance(mapProperties[curLevel][0]);

    console.log("Set up solidBlock appearances!");
};

/*
*   Sets the current animated frame of the curSolidCorner tile, 
*   the animation is actually paused so it's changing the appearance of the block permanently
*   This one sets the appearance of the corner pieces of the solidBlocks
*/
function setSolidBlockCornersAppearance(curSolid, typeIn) 
{
    // Check against other solidBlocks
    for (var u = solidBlockList.length-1; u > -1; --u) 
    {
        var checkingSolid = solidBlockList[u];
        
        if (checkingSolid.x == curSolid.x && checkingSolid.y == (curSolid.y - tileSize.h)) // above
        { 
            if (checkingSolid.isWallL && !curSolid.isWallL) 
                addSolidBlockTrim(curSolid.x, curSolid.y, 4, typeIn); // tl
            if (checkingSolid.isWallR && !curSolid.isWallR) 
                addSolidBlockTrim(curSolid.x, curSolid.y, 5, typeIn); // tr
        } 
        else if (checkingSolid.x == curSolid.x && checkingSolid.y == (curSolid.y + tileSize.h)) // below
        { 
            if (checkingSolid.isWallL && !curSolid.isWallL) 
                addSolidBlockTrim(curSolid.x, curSolid.y, 6, typeIn); // bl
            if (checkingSolid.isWallR && !curSolid.isWallR) 
                addSolidBlockTrim(curSolid.x, curSolid.y, 7, typeIn); // br
        }
    }
};

/*
*   Sets the current animated frame of the curSolid tile, 
*   the animation is actually paused so it's changing the appearance of the block permanently
*   This one sets the appearance of the sides of the solidBlocks
*/
function setSolidBlockSidesAppearance(curSolid, typeIn) 
{
    if (curSolid.isWallL) 
        addSolidBlockTrim(curSolid.x, curSolid.y, 2, typeIn);
    if (curSolid.isWallR) 
        addSolidBlockTrim(curSolid.x, curSolid.y, 3, typeIn);
    if (curSolid.isFloor) 
        addSolidBlockTrim(curSolid.x, curSolid.y, 0, typeIn);
    if (curSolid.isCeiling) 
        addSolidBlockTrim(curSolid.x, curSolid.y, 1, typeIn);
};

/*
*   Sets the current animated frame of the curRamp tile, 
*   the animation is actually paused so it's changing the appearance of the block permanently
*   This one sets the appearance of the solidRamps
*/
function setSolidRampsAppearance() 
{
    for (var i = solidRampList.length-1; i > -1; --i) 
    {
        var curRamp = solidRampList[i];

        if (curRamp.isBL) 
            curRamp.reelPosition(0);
        else if (curRamp.isBR) 
            curRamp.reelPosition(1);
        else if (curRamp.isTL) 
            curRamp.reelPosition(2);
        else if (curRamp.isTR) 
            curRamp.reelPosition(3);
    }
};


/*  Sets the current animated frame of the curRampCorner tile, 
*   the animation is actually paused so it's changing the appearance of the block permanently
*   This one sets the appearance of the solidRamps
*/
function setSolidRampsCornersAppearance(typeIn) 
{
    for (var i = solidRampList.length-1; i > -1; --i) 
    {
        var checkingRamp = solidRampList[i];

        var checkingBlockBelow = getBelowSolidBlock(checkingRamp.x, checkingRamp.y);
        var checkingBlockAbove = getAboveSolidBlock(checkingRamp.x, checkingRamp.y);

        if (checkingBlockBelow != null) 
        {
            if (checkingRamp.isBL) 
                addSolidBlockTrim(checkingBlockBelow.x, checkingBlockBelow.y, 8, typeIn);
            else if (checkingRamp.isBR) 
                addSolidBlockTrim(checkingBlockBelow.x, checkingBlockBelow.y, 9, typeIn);
        }
        if (checkingBlockAbove != null) 
        {
            if (checkingRamp.isTL) 
                addSolidBlockTrim(checkingBlockAbove.x, checkingBlockAbove.y, 10, typeIn);
            else if (checkingRamp.isTR) 
                addSolidBlockTrim(checkingBlockAbove.x, checkingBlockAbove.y, 11, typeIn);
        }
    }
};

// -------------------- General_Level_Functions -------------------- //
/*
*   Clears all entities in the current scene and level and resets the clips and entities lists
*/
function destroyLevel() 
{
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

/*
*   Advances to the next level
*   If there is no next level, will not ado anything
*/
function advanceLevel() 
{
    if (maps[curLevel + 1]) 
    {
        destroyLevel();
        curLevel++;
        initLevel(curLevel);
    } 
    else 
    {
        console.log("No level at num: " + (curLevel + 1) + "!")
    }
};

/*
*   Does clean up of the current level and resets entities
*/
function restartLevel() 
{
    resetEntities();
};

/*
*   Calls the resetPos() method on every object that has the "Entity" component
*   Must make sure every "Entity" object has a resetPos() method
*/
function resetEntities() 
{
    Crafty("Entity").each(function(i) {
        this.resetPos();
    });
};

// -------------------- Helper_Functions -------------------- //
// ---- Solid_Blocks ---- //
/*
*   Takes a set of coordinates and checks if a solid block is to the left of these
*   Returns the found solid, or null if none was found
*/
function getLeftSolidBlock(xIn, yIn) 
{
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) 
    {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn - tileSize.w && curSolid.y == yIn) 
            return curSolid;
    }
    return null;
};

/*
*   Takes a set of coordinates and checks if a solid block is to the right of these
*   Returns the found solid, or null if none was found
*/
function getRightSolidBlock(xIn, yIn) 
{
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) 
    {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn + tileSize.w && curSolid.y == yIn) 
            return curSolid;
    }
    return null;
};

/*
*   Takes a set of coordinates and checks if a solid block is above these
*   Returns the found solid, or null if none was found
*/
function getAboveSolidBlock(xIn, yIn) 
{
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) 
    {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn && curSolid.y == yIn - tileSize.h) 
            return curSolid;
    }
    return null;
};

/*
*   Takes a set of coordinates and checks if a solid block is below these
*   Returns the found solid, or null if none was found
*/
function getBelowSolidBlock(xIn, yIn) 
{
    // Check every solidBlock
    for (var i = solidBlockList.length-1; i > -1; --i) 
    {
        var curSolid = solidBlockList[i];

        if (curSolid.x == xIn && curSolid.y == yIn + tileSize.h) 
            return curSolid;
    }
    return null;
};