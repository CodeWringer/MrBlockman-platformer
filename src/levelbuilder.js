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
	entitiesListIndex = 0;

// -------------------- Init_Level -------------------- //
function initLevel(levelNum) {
	var yPosIndex = 0, /*The yPosIndex represents the position of each element in the nums array. The nums array contains more arrays that store the tilemap
					* I refer to these arrays as the "y pos" elements. Inside each "y pos" element are the values actually used to instance the level */
		xPosIndex = 0,  /*The xPosIndex represents the position of each value inside the "y pos" elements that store the tilemap;
						* i.e. the "0" and "1" values that get used when instancing the level */
		tileX = 0, //Where an enitity's x pos will be when instanced
		tileY = 0; //Where an entitiy's y pos will be when instanced

	for (var i = 0; i < maps[levelNum].length; i++) { //Accesses the current level to load
		xPosIndex = 0; 	//Reset xPosIndex for each new "y pos" element in maps
		tileX = 0;		//Reset tileX, so it's back at 0 when the next "y pos" element gets read
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
						.attr({ x: tileX, y: tileY - tileSize.h * 2 });
					PC.resetPosCoords = { x: tileX, y: tileY - tileSize.h * 2 };
					break;
				// ------ Block_Door ------ //
				case 3:
					entitiesList[entitiesListIndex] = Crafty.e("BlockDoor")
						.attr({ x: tileX, y: (tileY+tileSize.h) - (180 * worldScale) });
					entitiesList[entitiesListIndex].setProperties({  });
					entitiesListIndex++;
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
					entitiesList[entitiesListIndex] = Crafty.e("Checkpoint")
						.attr({ x: tileX, y: (tileY+tileSize.h) - (200 * worldScale) });
						entitiesList[entitiesListIndex].setProperties({  });
					entitiesListIndex++;
					break;
				// ------ Spike_Ball_01 ------ //
				case 20: // float
					entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_01")
						.attr({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale) });
					entitiesList[entitiesListIndex].resetPosCoords = { x: tileX + (13 * worldScale), y: tileY + (13 * worldScale) };
					entitiesList[entitiesListIndex].setProperties({ collType: "float" });
					entitiesListIndex++;
					break;
				case 21: // roll
					entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_01")
						.attr({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale) });
					entitiesList[entitiesListIndex].resetPosCoords = { x: tileX + (13 * worldScale), y: tileY + (13 * worldScale) };
					entitiesList[entitiesListIndex].setProperties({ collType: "roll" });
					entitiesListIndex++;
					break;
				case 22: // bounce
					entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_01")
						.attr({ x: tileX + (13 * worldScale), y: tileY + (13 * worldScale) });
					entitiesList[entitiesListIndex].resetPosCoords = { x: tileX + (13 * worldScale), y: tileY + (13 * worldScale) };
					entitiesList[entitiesListIndex].setProperties({ collType: "bounce" });
					entitiesListIndex++;
					break;
				// ------ Spike_Ball_02 ------ //
				case 24: // clockwise
					addSolidBlock(tileX, tileY);
					entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_02")
						.attr({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) });
					entitiesList[entitiesListIndex].resetPosCoords = { x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) };
					entitiesList[entitiesListIndex].setProperties({ rotationDir: "clockwise" });
					entitiesListIndex++;
					break;
				case 25: // counterClockwise
					addSolidBlock(tileX, tileY);
					entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_02")
						.attr({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) });
					entitiesList[entitiesListIndex].resetPosCoords = { x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) };
					entitiesList[entitiesListIndex].setProperties({ rotationDir: "counterClockwise" });
					entitiesListIndex++;
					break;
				case 26: // clockwise, longer chain
					addSolidBlock(tileX, tileY);
					entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_02")
						.attr({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) });
					entitiesList[entitiesListIndex].resetPosCoords = { x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) };
					entitiesList[entitiesListIndex].setProperties({ rotationDir: "clockwise", radiusMultiplier: 2 });
					entitiesListIndex++;
					break;
				case 27: // counterClockwise, longer chain
					addSolidBlock(tileX, tileY);
					entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_02")
						.attr({ x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) });
					entitiesList[entitiesListIndex].resetPosCoords = { x: tileX + (tileSize.w/2), y: tileY+(tileSize.h/2) };
					entitiesList[entitiesListIndex].setProperties({ rotationDir: "counterClockwise", radiusMultiplier: 2 });
					entitiesListIndex++;
					break;
				// ------ JumpPad ------ //
				case 8:
					entitiesList[entitiesListIndex] = Crafty.e("JumpPad")
						.attr({ x: tileX, y: tileY , w: tileSize.w, h: tileSize.h });
						entitiesList[entitiesListIndex].setProperties({  });
					entitiesListIndex++;
					break;
				// ------ ProjectileShooter ------ //
				case 30: // left
					entitiesList[entitiesListIndex] = Crafty.e("ProjectileShooter")
						.attr({ x: tileX, y: tileY });
					entitiesList[entitiesListIndex].setProperties({ direction: "left" });
					entitiesListIndex++;
					break;
				case 31: // right
					entitiesList[entitiesListIndex] = Crafty.e("ProjectileShooter")
						.attr({ x: tileX, y: tileY });
					entitiesList[entitiesListIndex].setProperties({ direction: "right" });
					entitiesListIndex++;
					break;
				case 32: // up
					entitiesList[entitiesListIndex] = Crafty.e("ProjectileShooter")
						.attr({ x: tileX, y: tileY });
					entitiesList[entitiesListIndex].setProperties({ direction: "up" });
					entitiesListIndex++;
					break;
				case 33: // down
					entitiesList[entitiesListIndex] = Crafty.e("ProjectileShooter")
						.attr({ x: tileX, y: tileY });
					entitiesList[entitiesListIndex].setProperties({ direction: "down" });
					entitiesListIndex++;
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
	var	xBounds = (tileSize.w*maps[curLevel][0].length) - tileSize.w, /* The furthest x coordinate where a solid block could be.
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