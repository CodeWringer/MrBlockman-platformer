/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

// ---------------------------------------- Helper_Components ---------------------------------------- //

// ------------- collisionDetection ------------- //
Crafty.c("collisionDetection", {
	init: function() {
		this.lastCollObj = "floor";
		this.broadphasebox = {x: 0, y: 0, w: 0, h: 0 };

		this.bind("EnterFrame", function(frameData) {
			// ------------ Collision_Detection ------------ //
			// ---- solidBlocks ---- //
			this.updateBroadphasebox(this.milliDT);
			for (var i = solidBlockList.length-1; i > -1; --i) {
				var tile = solidBlockList[i];
				if (tile.x+tile.w > this.broadphasebox.x && tile.x < this.broadphasebox.x+this.broadphasebox.w) {
					if (tile.y+tile.h > this.broadphasebox.y && tile.y < this.broadphasebox.y+this.broadphasebox.h) {
						this.checkCollisionSweptAABB(tile, this.milliDT);
					}
				}
			}
			// ---- ramps ---- //
			for (var i = solidRampList.length-1; i > -1; --i) {
				var rampTile = solidRampList[i];
				if (rampTile.x+rampTile.w > this.broadphasebox.x && rampTile.x < this.broadphasebox.x+this.broadphasebox.w) {
					if (rampTile.y+rampTile.h > this.broadphasebox.y && rampTile.y < this.broadphasebox.y+this.broadphasebox.h) {
						this.checkCollisionSweptRamp(rampTile, this.milliDT);
					}
				}
			}
			// ---- clips ---- //
			for (var i = clipList.length-1; i > -1; --i) {
				var clipTile = clipList[i];
				if (clipTile.x+clipTile.w > this.broadphasebox.x && clipTile.x < this.broadphasebox.x+this.broadphasebox.w) {
					if (clipTile.y+clipTile.h > this.broadphasebox.y && clipTile.y < this.broadphasebox.y+this.broadphasebox.h) {
						this.checkCollisionSweptAABB(clipTile, this.milliDT);
					}
				}
			}
		});	
	},

	updateBroadphasebox: function(milliDT) {
		var xVel = this.curVel.x * milliDT;
		var yVel = this.curVel.y * milliDT;
		this.broadphasebox.x = xVel >= 0 ? this.x + xVel : this.x + xVel*2;
		this.broadphasebox.y = yVel >= 0 ? this.y + yVel : this.y + yVel*2;
		this.broadphasebox.w = xVel >= 0 ? this.w + xVel : this.w - xVel;
		this.broadphasebox.h = yVel >= 0 ? this.h + yVel : this.h - yVel;
	},

	getlastCollObj: function(objDirTypeIn) {
		if (objDirTypeIn == "isWallL") {
			return "wallL";
		} else if (objDirTypeIn == "isWallR") {
			return "wallR";
		} else if (objDirTypeIn == "isFloor") {
			return "floor";
		} else if (objDirTypeIn == "isCeiling") {
			return "ceiling";

		} else if (objDirTypeIn == "isRampBL") {
			return "rampBL";
		} else if (objDirTypeIn == "isRampBR") {
			return "rampBR";
		} else if (objDirTypeIn == "isRampTL") {
			return "rampTL";
		} else if (objDirTypeIn == "isRampTR") {
			return "rampTR";
		}
	},

	// Attempts to predict this object's location in the next frame and prevent collisions beforehand
	// Uses the swept method, to deal with very fast objects (Currently still flawed, need to look into this more)
	checkCollisionSweptAABB: function(obj, milliDT) {
		// Declare vars
		var xVel = this.curVel.x * milliDT;
		var yVel = this.curVel.y * milliDT;

		var nextL = this.x + xVel;
		var nextT = this.y + yVel;

		// Find entry and exit points on both axes
		var xEntry = xVel > 0 ? obj.x : obj.x + obj.w;
		var yEntry = yVel > 0 ? obj.y : obj.y + obj.h;

		var b0,
			b1,
			b2,
			b3,
			l = this.x,
			r = (this.x + this.w),
			t = this.y,
			b = (this.y + this.h),
			halfH = (this.y + this.h/2),
			objL = obj.x,
			objR = obj.x + obj.w,
			objT = obj.y,
			objB = obj.y + obj.h,
			a = ((nextT - this.y) / (nextL - this.x));

		// Formulas
		// a = (y2-y1) / (x2-x1)
		// b = y1 - ax1 or b = y2 - ax2
		// y = ax + b
		// x = (y - b) / a
		
		if (xVel > 0) { // right
			if (yVel > 0) { // down
				// ---- Right_And_Down ---- //
				// Determine b for each of the linear functions
				b0 = t - a*r; // top right corner
				b1 = b - a*r; // bottom right corner
				b2 = b - a*l; // bottom left corner
				b3 = halfH - a*r; // middle right
				// Calculate x and y coords based on the linear functions
				var yLinF0 = a*xEntry + b0;
				var xLinF1 = (yEntry - b1) / a;
				var yLinF1 = a*xEntry + b1;
				var xLinF2 = (yEntry - b2) / a;
				var yLinF3 = a*xEntry + b3;
				// Resolve collisions
				if (yLinF0 >= objT && yLinF0 <= objB || yLinF1 >= objT && yLinF1 <= objB || yLinF3 >= objT && yLinF3 <= objB) { // Coming from the left
					if (obj.isWallL) {
						this.respondToCollision(obj, "isWallL");
						this.lastCollObj = "wallL";
					}
				} else if (xLinF2 >= objL && xLinF2 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from above
					if (obj.isFloor) {
						this.respondToCollision(obj, "isFloor");
						this.lastCollObj = "floor";
					}
				}
			} else if (yVel < 0) { // up
				// ---- Right_And_Up ---- //
				// Determine b for each of the linear functions
				b0 = t - a*l; // top left corner
				b1 = t - a*r; // top right corner
				b2 = b - a*r; // bottom right corner
				b3 = halfH - a*r; // middle right
				// Calculate x and y coords based on the linear functions
				var xLinF0 = (yEntry - b0) / a;
				var xLinF1 = (yEntry - b1) / a;
				var yLinF1 = a*xEntry + b1;
				var yLinF2 = a*xEntry + b2;
				var yLinF3 = a*xEntry + b3;
				// Resolve collisions
				if (yLinF1 >= objT && yLinF1 <= objB || yLinF2 >= objT && yLinF2 <= objB || yLinF3 >= objT && yLinF3 <= objB) { // Coming from the left
					if (obj.isWallL) {
						this.respondToCollision(obj, "isWallL");
						this.lastCollObj = "wallL";
					}
				} else if (xLinF0 >= objL && xLinF0 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from below
					if (obj.isCeiling) {
						this.respondToCollision(obj, "isCeiling");
						this.lastCollObj = "ceiling";
					}
				}
			} else if (yVel == 0) {
				// ---- Right ---- //
				// Determine b for each of the linear functions
				b0 = (t+2) - a*r; // top right corner
				b1 = (b-2) - a*r; // bottom right corner
				// Calculate coords based on the linear functions
				var yLinF0 = a*xEntry + b0;
				var yLinF1 = a*xEntry + b1;
				// Resolve collisions
				if (yLinF0 >= objT && yLinF0 <= objB || yLinF1 >= objT && yLinF1 <= objB) { // Coming from the left
					if (obj.isWallL) {
						this.respondToCollision(obj, "isWallL");
						this.lastCollObj = "wallL";
					}
				}
			}
		} else if (xVel < 0) { // left
			if (yVel > 0) { // down
				// ---- Left_And_Down ---- //
				// Determine b for each of the linear functions
				b0 = t - a*l; // top left corner
				b1 = b - a*l; // bottom left corner
				b2 = b - a*r; // bottom right corner
				b3 = halfH - a*l; // middle left
				// Calculate x and y coords based on the linear functions
				var yLinF0 = a*xEntry + b0;
				var xLinF1 = (yEntry - b1) / a;
				var yLinF1 = a*xEntry + b1;
				var xLinF2 = (yEntry - b2) / a;
				var yLinF3 = a*xEntry + b3;
				// Resolve collisions
				if (yLinF0 >= objT && yLinF0 <= objB || yLinF1 >= objT && yLinF1 <= objB || yLinF3 >= objT && yLinF3 <= objB) { // Coming from the right
					if (obj.isWallR) {
						this.respondToCollision(obj, "isWallR");
						this.lastCollObj = "wallR";
					}
				} else if (xLinF2 >= objL && xLinF2 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from above
					if (obj.isFloor) {
						this.respondToCollision(obj, "isFloor");
						this.lastCollObj = "floor";
					}
				}
			} else if (yVel < 0) { // up
				// ---- Left_And_Up ---- //
				// Determine b for each of the linear functions
				b0 = t - a*r; // top right corner
				b1 = t - a*l; // top left corner
				b2 = b - a*l; // bottom left corner
				b3 = halfH - a*l; // middle left
				// Calculate x and y coords based on the linear functions
				var xLinF0 = (yEntry - b0) / a;
				var xLinF1 = (yEntry - b1) / a;
				var yLinF1 = a*xEntry + b1;
				var yLinF2 = a*xEntry + b2;
				var yLinF3 = a*xEntry + b3;
				// Resolve collisions
				if (yLinF2 >= objT && yLinF2 <= objB || yLinF1 >= objT && yLinF1 <= objB || yLinF3 >= objT && yLinF3 <= objB) { // Coming from the right
					if (obj.isWallR) {
						this.respondToCollision(obj, "isWallR");
						this.lastCollObj = "wallR";
					}
				} else if (xLinF0 >= objL && xLinF0 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from below
					if (obj.isCeiling) {
						this.respondToCollision(obj, "isCeiling");
						this.lastCollObj = "ceiling";
					}
				}
			} else if (yVel == 0) {
				// ---- Left ---- //
				// Determine b for each of the linear functions
				b0 = (t+2) - a*l; // top left corner
				b1 = (b-2) - a*l; // bottom left corner
				// Calculate coords based on the linear functions
				var yLinF0 = a*xEntry + b0;
				var yLinF1 = a*xEntry + b1;
				// Resolve collisions
				if (yLinF0 >= objT && yLinF0 <= objB || yLinF1 >= objT && yLinF1 <= objB) { // Coming from the left
					if (obj.isWallR) {
						this.respondToCollision(obj, "isWallR");
						this.lastCollObj = "wallR";
					}
				}
			}
		} else if (xVel == 0) { // Up_Or_Down
			if (yVel > 0) {
				// ---- Down ---- //
				// Resolve collisions
				if (r-2 >= objL && l+2 <= objR) { // Coming from above
					if (obj.isFloor) {
						this.respondToCollision(obj, "isFloor");
						this.lastCollObj = "floor";
					}
				}
			} else if (yVel < 0) {
				// ---- Up ---- //
				// Resolve collisions
				if (r-2 >= objL && l+2 <= objR) { // Coming from below
					if (obj.isCeiling) {
						this.respondToCollision(obj, "isCeiling");
						this.lastCollObj = "ceiling";
					}
				}
			}
		}
	},

	checkLinFAndCallResponse: function(yIn, xIn, obj, objDirTypeIn, yChecksSmallerThan) {
		if (yChecksSmallerThan == true) {
			// Check against the ramp linear function
			if (yIn < obj.getyLinF(xIn)) {
				this.respondToCollision(obj, objDirTypeIn);
				this.lastCollObj = this.getlastCollObj(objDirTypeIn);
			}
		} else {
			// Check against the ramp linear function
			if (yIn > obj.getyLinF(xIn)) {
				this.respondToCollision(obj, objDirTypeIn);
				this.lastCollObj = this.getlastCollObj(objDirTypeIn);
			}
		}
	},

	checkCollisionSweptRamp: function(obj, milliDT) {
		// Declare vars
		var xVel = this.curVel.x * milliDT,
			yVel = this.curVel.y * milliDT,

			curL = this.x,
			curR = (this.x + this.w),
			curT = this.y,
			curB = (this.y + this.h),

			objL = obj.x,
			objR = (obj.x + obj.w),
			objT = obj.y,
			objB = (obj.y + obj.h),

			nextL = this.x + xVel,
			nextT = this.y + yVel,

			nextR = nextL + this.w,
			nextB = nextT + this.h;

		// Formulas
		// a = (y2-y1) / (x2-x1)
		// b = y1 - ax1 or b = y2 - ax2
		// y = ax + b
		// x = (y - b) / a

		// Find obj type
		// ---------------- Ramp_BL ---------------- //
		if (obj.isBL) {
			if (this.lastCollObj == "wallR") { // Check if the last collision was with a wall
				// ---- X_Axis_Check ---- //
				if (curL >= objL && curL < objR && nextL <= objR) {
					this.checkLinFAndCallResponse(nextB, nextL, obj, "isRampBL", false);
				}
			} else {
				// ---- X_Axis_Check ---- //
				if (curL >= objL && nextL <= objR) {
					this.checkLinFAndCallResponse(nextB, nextL, obj, "isRampBL", false);
				}
			}
		// ---------------- Ramp_BR ---------------- //
		} else if (obj.isBR) {
			if (this.lastCollObj == "wallL") { // Check if the last collision was with a wall
				// ---- X_Axis_Check ---- //
				if (curR <= objR && curR > objL && nextR >= objL) {
					this.checkLinFAndCallResponse(nextB, nextR, obj, "isRampBR", false);
				}
			} else {
				// ---- X_Axis_Check ---- //
				if (curR <= objR && nextR >= objL) {
					this.checkLinFAndCallResponse(nextB, nextR, obj, "isRampBR", false);
				}
			}
		// ---------------- Ramp_TL ---------------- //
		} else if (obj.isTL) {
			if (this.lastCollObj == "wallR") { // Check if the last collision was with a wall
				// ---- X_Axis_Check ---- //
				if (curL >= objL && curL < objR && nextL <= objR) {
					this.checkLinFAndCallResponse(nextT, nextL, obj, "isRampTL", true);
				}
			} else {
				// ---- X_Axis_Check ---- //
				if (curL >= objL && nextL <= objR) {
					this.checkLinFAndCallResponse(nextT, nextL, obj, "isRampTL", true);
				}
			}
		// ---------------- Ramp_TR ---------------- //
		} else if (obj.isTR) {
			if (this.lastCollObj == "wallL") { // Check if the last collision was with a wall
				// ---- X_Axis_Check ---- //
				if (curR <= objR && curR > objL && nextR >= objL) {
					this.checkLinFAndCallResponse(nextT, nextR, obj, "isRampTR", true);
				}
			} else {
				// ---- X_Axis_Check ---- //
				if (curR <= objR && nextR >= objL) {
					this.checkLinFAndCallResponse(nextT, nextR, obj, "isRampTR", true);
				}
			}
		}
	},
});

// ------------- Actor ------------- //
Crafty.c("Actor", {
	init: function() {
		this.requires("2D, Canvas");
	},
});

// ------------- SprLocOffset ------------- //
Crafty.c("SprLocOffset", {
	setOffset: function() {
		if (this.movParent != null) {
			this.offset.x = (this.w - this.movParent.w) / 2;
			this.offset.y = (this.h - this.movParent.h) / 2;
		} else {
			console.log("No movparent for sprite, can't set offset!");
		}
	},
});

// ---- HelperMaths ---- //
Crafty.c("HelperMaths", {
	getPointOnCirlce: function(originPointIn, curPointIn, curAngleIn) {
		var resultPoint = { x: 0, y: 0 };
		// u = originPoint.x
		// v = originPoint.y
		// x' = (x-u) cos(beta) - (y-v) sin(beta) + u
		// y' = (x-u) sin(beta) + (y-v) cos(beta) + v
		resultPoint.x = (curPointIn.x - originPointIn.x) * Math.cos(curAngleIn) - (curPointIn.y - originPointIn.y) * Math.sin(curAngleIn) + originPointIn.x;
		resultPoint.y = (curPointIn.x - originPointIn.x) * Math.sin(curAngleIn) + (curPointIn.y - originPointIn.y) * Math.cos(curAngleIn) + originPointIn.y;
		return resultPoint;
	},

	getVector: function(pointA, pointB) {
		// pointA = origin
		// pointB = target
		return { x: (pointB.x - pointA.x), y: (pointB.y - pointA.y) };
	},

	getCosAngle: function(vectorA, vectorB) { // cos alpha, range from -1 to 1
		// cos alpha = (vectorA*vectorB) / (|vectorA|*|vectorB|)
		// cos alpha = ((a.x*b.x) + (a.y*b.y)) / (Math.sqrt(a.x²+a.y²) * Math.sqrt(b.x²+b.y²))
		return (this.getScalarProduct(vectorA, vectorB) / (this.getVectorLength(vectorA) * this.getVectorLength(vectorB)));
	},

	getCosDegAngle: function(angleIn) {
		return (Math.acos(angleIn) * (180/Math.PI));
	},

	getAtan2DegAngle: function(pointA, pointB) {
		// pointA = origin
		// pointB = target
		return (Math.atan2((pointB.y - pointA.y), (pointB.x - pointA.x)) * (180/Math.PI));
	},

	getScalarProduct: function(vectorA, vectorB) { // vector²
		// (vectorA*vectorB)
		// (a.x*b.x) + (a.y*b.y)
		return ((vectorA.x * vectorB.x) + (vectorA.y * vectorB.y));
	},

	getVectorLength: function(vector) { // |vector|
		// Math.sqrt(vectorA²)
		return (Math.sqrt(vector.x*vector.x + vector.y*vector.y));
	},
});

// ---------------------------------------- Entities ---------------------------------------- //

// ------------- Game_Text ------------- //
Crafty.c("Game_Text", {
	init: function() {
		this.requires("2D, DOM, Text")
			.attr({ w: 800, h: 20 })
			.textFont($text_css);
	},
});

// -------- SolidBlock_ramp -------- //
Crafty.c("SolidBlock_ramp", {
	init: function() {
		this.isBL = false; // This is in a left corner, on the floor
		this.isBR = false; // This is in a right corner, on the floor
		this.isTL = false; // This is in a left corner, on the ceiling
		this.isTR = false; // This is in a right corner, on the ceiling
		this.a;
		this.b;

		this.requires("Actor, Solid, Ramp, SpriteAnimation, spr_solidBlock_ramps_02");
		// ------ Define_Appearance ------ //
		this.reel("solidBlock_brick", 2000, 0, 0, 4) // brick tileset
		this.animate("solidBlock_brick", 1);
		this.pauseAnimation();
	},

	// Defines the linear function describing this ramp
	setLinF: function() {
		// Formulas
		// a = (y2-y1) / (x2-x1)
		// b = y1 - ax1 or b = y2 - ax2
		// y = ax + b
		// x = (y - b) / a

		if (this.isBL) {
			var x2 = this.x,
				x1 = this.x + this.w,
				y2 = this.y,
				y1 = this.y + this.h;
		} else if (this.isBR) {
			var x1 = this.x,
				x2 = this.x + this.w,
				y2 = this.y,
				y1 = this.y + this.h;
		} else if (this.isTL) {
			var x2 = this.x,
				x1 = this.x + this.w,
				y1 = this.y,
				y2 = this.y + this.h;
		} else if (this.isTR) {
			var x1 = this.x,
				x2 = this.x + this.w,
				y1 = this.y,
				y2 = this.y + this.h;
		}
		this.a = (y2 - y1) / (x2 - x1);
		this.b = y1 - this.a*x1;
	},

	getyLinF: function(xIn) {
		return this.a*xIn + this.b;
	},
});

// -------- SolidBlock_trim -------- //
Crafty.c("SolidBlock_trim", {
	init: function() {
		this.requires("Actor, Trim, SpriteAnimation, spr_solidBlocks_trims_02");
		// ------ Define_Appearance ------ //
		this.reel("solidBlock_brick", 2000, 0, 0, 12) // brick tileset
		this.animate("solidBlock_brick", 1);
		this.pauseAnimation();
	},
});

// -------- SolidBlock_backGround -------- //
Crafty.c("SolidBlock_backGround", {
	init: function() {
		this.isFloor = true;
		this.isCeiling = true;
		this.isWallL = true;
		this.isWallR = true;
		this.isValid = true;
		this.requires("Actor, Solid, BackGround, SpriteAnimation, spr_solidBlock_bg_02");
		// ------ Define_Appearance ------ //
		this.reel("solidBlock_brick", 2000, 0, 0, 1) // brick tileset
		this.animate("solidBlock_brick", 1);
		this.pauseAnimation();
	},
});

// -------- ClipBlock -------- //
Crafty.c("ClipBlock", {
	init: function() {
		this.isFloor = true;
		this.isCeiling = true;
		this.isWallL = true;
		this.isWallR = true;
		this.isValid = true;
		this.requires("Actor, Solid");
	},
});

// -------- ClipBlock_Player -------- //
Crafty.c("ClipBlock_Player", {
	init: function() {
		this.isFloor = true;
		this.isCeiling = true;
		this.isWallL = true;
		this.isWallR = true;
		this.isValid = true;
		this.requires("Actor, Solid");
	},
});

// -------- ClipBlock_Hazard -------- //
Crafty.c("ClipBlock_Hazard", {
	init: function() {
		this.isFloor = true;
		this.isCeiling = true;
		this.isWallL = true;
		this.isWallR = true;
		this.isValid = true;
		this.requires("Actor, Solid");
	},
});

// ------------- Hazard_Block ------------- //
Crafty.c("Hazard_Block", {
	init: function() {
		this.requires("Actor, Color, Collision")
			.color("rgb(255, 100, 100)");
		this.onHit("PC", function(collData1) {
			collData1[0].obj.die();
		}, function() {
			// 
		});
		this.onHit("Spike_Ball_01", function(collData2) {
			collData2[0].obj.die();
		}, function() {
			// 
		});
	},
});

// ------------- dotThing ------------- //
Crafty.c("dotThing", {
	init: function() {
		this.requires("Actor, Color")
			.attr({ w: 4, h: 4 })
			.color("red");
	},
});

// ------------- Player_Character_Sprite ------------- //
Crafty.c("PC_Sprite", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };

		this.requires("Actor, SpriteAnimation, SprLocOffset, spr_PC")
			.attr({w: (70 * worldScale), h: (95 * worldScale), z: 9001});

		// ------ Define_Animations ------ //
		this.reel("PC_Idle00r", 2000, 0, 0, 47)		// Idle, facing right
			.reel("PC_Idle00l", 2000, 0, 1, 47)		// Idle, facing left
			.reel("PC_Walk00r", 1000, 0, 6, 23)		// Walking, facing right
			.reel("PC_Walk00l", 1000, 0, 7, 23)		// Walking, facing left
			.reel("PC_Run00r", 500, 0, 2, 11)		// Running, facing right
			.reel("PC_Run00l", 500, 0, 3, 11)		// Running, facing left
			.reel("PC_Jump00r_st", 500, 0, 4, 12)	// Jumping start, facing right
			.reel("PC_Jump00l_st", 500, 0, 5, 12)	// Jumping start, facing left
			.reel("PC_Jump00r_mid", 1000, 12, 4, 1)	// Falling, facing right
			.reel("PC_Jump00l_mid", 1000, 12, 5, 1)	// Falling, facing left
			.reel("PC_Bloat00r", 750, 0, 8, 18)		// Bloating, facing right
			.reel("PC_Bloat00l", 750, 0, 9, 18)		// Bloating, facing left
			.reel("PC_Invisible", 2000, 47, 3, 1);	// An unused spot in the tilemap

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},
});

// ------------- Player_Character_Sprite_Long ------------- //
Crafty.c("PC_Sprite_Long", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };

		this.requires("Actor, SpriteAnimation, SprLocOffset, spr_PC_Long")
			.attr({w: (70 * worldScale), h: (95 * worldScale), z: 9001});

		// ------ Define_Animations ------ //
		this.reel("PC_LongInvisible", 1000, 117, 0, 1)		// An unused spot in the tilemap
			.reel("PC_IdleBored00r", 4000, 0, 0, 116)		// IdleBored, facing right
			.reel("PC_IdleBored00l", 4000, 0, 1, 116);		// IdleBored, facing left

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},
});

// ------------- Player_Character ------------- //
Crafty.c("PC", {
	init: function() {
		this.maxVel = (650 * worldScale);
		this.accelSpeed = (this.maxVel * 2.6);
		this.decelSpeed = (this.maxVel * 3.6);
		
		this.jumpImpulse = (-620 * worldScale);
		this.curVel = { x: 0, y: 0 };
		this.lastDir = "right";
		this.resetPosCoords = { x: 0, y: 0 };
		this.isDead = false;
		this.canJump = true;
		this.idleTime = 0;

		var collidedD = false;

		this.requires("Actor, collisionDetection, Keyboard, Delay, Resettable")
			.attr({w: (35 * worldScale), h: (85 * worldScale)});

		this.spriteObj = Crafty.e("PC_Sprite");
		this.spriteObj.movParent = this;
		this.spriteObj.setOffset();

		this.spriteObj2 = Crafty.e("PC_Sprite_Long");
		this.spriteObj2.movParent = this;
		this.spriteObj2.setOffset();
		this.spriteObj2.animate("PC_LongInvisible", 1);

		this.deathEmitter = Crafty.e("Particle_Emitter");
		this.deathEmitter.movParent = this;
		this.deathEmitter.posOffset = {x: this.w/2, y: this.h/2};

		this.feetDustEmitter = Crafty.e("Particle_Emitter");
		this.feetDustEmitter.movParent = this;
		this.feetDustEmitter.posOffset = {x: this.w/2, y: this.h-5};

		// ------ Instance_Hitbox ------ //
		this.hitBox_down = Crafty.e("Actor, Color, Collision")
			.attr({ x: this.x, y: this.y, w: this.w - 4, h: 5, z: 101 })
			.color("red")
			.onHit("Solid", function(collData) {
				for (var n = collData.length-1; n > -1; --n) {
					var curObj = collData[n].obj;

					// Make a distincion between the BackGround and Ramp solids, as their collisions are calculated differently
					if (curObj.__c.BackGround || curObj.__c.ClipBlock_Player || curObj.__c.ClipBlock) {
						this.color("blue");
						collidedD = true;
					} else if (curObj.__c.Ramp) {
						if ((this.y+this.h) > curObj.getyLinF(this.x) || (this.y+this.h) > curObj.getyLinF(this.x+this.w)) {
							this.color("blue");
							collidedD = true;
						}
					}
				}
			}, function() {
				this.color("red");
				collidedD = false;
			});

		// ------ Key_inputs ------ //
		this.bind("KeyDown", function(e) {
			this.idleTime = 0;
			if (!this.isDead) {
				if (e.key == Crafty.keys.SPACE && collidedD == true)  {
					this.jump(this.jumpImpulse);
				} else if (e.key == Crafty.keys.Q) {
					Crafty("Resettable").each(function(i) {
						this.resetEnt();
					});
				} else if (e.key == Crafty.keys.S) {
					this.canJump = false;
				}
			}
		});
		this.bind("KeyUp", function(e) {
			this.idleTime = 0;
			if (!this.isDead) {
				if (e.key == Crafty.keys.SPACE) {
					if (this.curVel.y < 0) {
						this.curVel.y = 0; // Resets y velocity, so max jump height can be controlled
					}
				} else if (e.key == Crafty.keys.S) {
					this.canJump = true;
				}
			}
		});

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);
			// ------ PC_Movement ------ //
			if (!this.isDead) {
				if (this.isDown("A")) { // Moving left
					if (this.curVel.x > 0) { // Still moving right
						this.curVel.x = 0;
					} else if (this.curVel.x > -this.maxVel) { // If maxVel has not yet been reached, keep increasing curVel
						this.curVel.x -= this.decelSpeed * this.milliDT;
					}
				} else if (this.isDown("D")) { // Moving right
					if (this.curVel.x < 0) { // Still moving left
						this.curVel.x = 0;
					} else if (this.curVel.x < this.maxVel) { // If maxVel has not yet been reached, keep increasing curVel
						this.curVel.x -= -this.decelSpeed * this.milliDT;
					}
				} else {
					// ----- X_Velocity_Decrease ----- //
					if (this.curVel.x < -1) { // Moving left
						this.curVel.x += this.decelSpeed * this.milliDT;
					} else if (this.curVel.x > 1) { // Moving right
						this.curVel.x -= this.decelSpeed * this.milliDT;
					} else {
						this.curVel.x = 0;
					}
				}
				
				// ----- Y_Velocity_Decrease ----- //
				this.curVel.y += (worldGravity*2 * worldScale) * this.milliDT; // Gravity

				// ------ Set_Last_Movement_Direction ------ //
				if (this.curVel.x > 0) {
					this.lastDir = "right";
				} else if (this.curVel.x < 0) {
					this.lastDir = "left";
				}

				// ------ Play_Animations ------ //
				if (collidedD && !this.spriteObj.isPlaying("PC_Jump00r_st") && !this.spriteObj.isPlaying("PC_Jump00l_st")) {
					if (this.curVel.x > 0 && !this.spriteObj.isPlaying("PC_Run00r")) {
						this.spriteObj.animate("PC_Run00r", 1);
					} else if (this.curVel.x < 0 && !this.spriteObj.isPlaying("PC_Run00l")) {
						this.spriteObj.animate("PC_Run00l", 1);
					} else if (this.curVel.x == 0) {
						if (!this.spriteObj2.isPlaying("PC_IdleBored00r") && !this.spriteObj2.isPlaying("PC_IdleBored00l")) {
							if (this.lastDir == "right" && !this.spriteObj.isPlaying("PC_Idle00r")) {
								this.spriteObj.animate("PC_Idle00r", 1);
							} else if (this.lastDir == "left" && !this.spriteObj.isPlaying("PC_Idle00l")) {
								this.spriteObj.animate("PC_Idle00l", 1);
							}
						}
					}
				} else {
					if (this.curVel.y > 0) {
						if (this.lastDir == "right" && !this.spriteObj.isPlaying("PC_Jump00r_mid")) {
							this.spriteObj.animate("PC_Jump00r_mid", 1);
						} else if (this.lastDir == "left" && !this.spriteObj.isPlaying("PC_Jump00l_mid")) {
							this.spriteObj.animate("PC_Jump00l_mid", 1);
						}
					}
				}
			}

			this.idleTime += 1000 * this.milliDT;
			if (this.idleTime >= 20000) {
				if (this.isDead == false) {
					this.spriteObj.animate("PC_Invisible", 1);
					if (this.lastDir == "right") {
						this.spriteObj2.animate("PC_IdleBored00r", 1);
					} else if (this.lastDir == "left") {
						this.spriteObj2.animate("PC_IdleBored00l", 1);
					}
				}
			}
			if (!this.spriteObj2.isPlaying("PC_IdleBored00r") && !this.spriteObj2.isPlaying("PC_IdleBored00l") || this.curVel.x != 0 || this.curVel.y < 0 || this.curVel.y > 20) {
				this.spriteObj2.animate("PC_LongInvisible", 1);
			} else {
				this.idleTime = 0;
			}

			// ------ Update_Hitbox ------ //
			this.hitBox_down.x = (this.x + 2) + this.curVel.x * this.milliDT;
			this.hitBox_down.y = (this.y + this.h) + this.curVel.y * this.milliDT;

			// ---- Apply_Velocities ---- //
			this.x += this.curVel.x * this.milliDT;
			this.y += this.curVel.y * this.milliDT;
		});
	},

	// Makes the player jump and play the according anim
	jump: function(jumpImpulseIn) {
		this.curVel.y = jumpImpulseIn;
		if (this.lastDir == "right") {
			this.spriteObj.animate("PC_Jump00r_st", 1);
		} else if (this.lastDir == "left") {
			this.spriteObj.animate("PC_Jump00l_st", 1);
		}
	},

	// Makes the player die and play the according anim
	die: function() {
		// Make sure this isn't already dead, so this function does not get called multiple times
		if (!this.isDead) {
			var delay = 0;
			this.isDead = true;
			if (this.lastDir == "right") {
				// Make this float in the opposite direction
				this.curVel.x = -1400 * this.milliDT;
				this.curVel.y = -2800 * this.milliDT;
				// Animate this
				this.spriteObj.animate("PC_Bloat00r", 1);
			} else if (this.lastDir == "left") {
				// Make this float in the opposite direction
				this.curVel.x = 1400 * this.milliDT;
				this.curVel.y = -2800 * this.milliDT;
				// Animate this
				this.spriteObj.animate("PC_Bloat00l", 1);
			}

			// Delay the invisibility
			this.delay(function() {
				this.spriteObj.animate("PC_Invisible", 1);
				this.curVel.x = 0;
				this.curVel.y = 0;
			}, 900, 0);
			// Delay the deathEmitter
			this.delay(function() {
				this.deathEmitterSettings = { emitW: 40, emitH: 60, emitVel: { xMin: 0, xMax: 120, yMin: 120, yMax: 150 }, emitRandom: true, emitRandNegX: true, gravityType: "slowFall", emitCollSetting: "noCollide", emitExpire: true, emitLifeTime: 5000, sprite: "spr_PC_Parachute", fadeOutTime: 2000 };
				this.deathEmitter.emitParticles( this.deathEmitterSettings, 1, 12);
			}, 700, 0);
			// Delay resetEnt
			this.delay(function() {
				Crafty("Resettable").each(function(i) {
					this.resetEnt();
				});
			}, 3000, 0);
		}
	},

	resetEnt: function() {
		this.x = this.resetPosCoords.x;
		this.y = this.resetPosCoords.y;
		this.curVel.x = 0;
		this.curVel.y = 0;

		this.isDead = false;
		this.canJump = true;
	},

	setResetPos: function(xIn, yIn) {
		this.resetPosCoords.x = xIn;
		this.resetPosCoords.y = yIn - 10;
	},

	respondToCollision: function(obj, objDirType) {
		this.feetDustEmitterSettings = { emitW: 40, emitH: 40, emitVel: { xMin: 60, xMax: 80, yMin: -1, yMax: 0 }, emitRandom: true, emitRandNegX: true, rotationSpeed: 45, gravityType: "decelerate", emitCollSetting: "noCollide", emitExpire: true, emitLifeTime: 500, sprite: "spr_dust_01", fadeInTime: 500, fadeOutTime: 800 };
		var objL = obj.x,
			objR = obj.x + obj.w,
			objT = obj.y,
			objB = obj.y + obj.h;

		// ---- solidBlocks ---- //
		if (obj.__c.SolidBlock_backGround || obj.__c.ClipBlock_Player || obj.__c.ClipBlock) {
			if (objDirType == "isWallL") {
				this.curVel.x = 0;
				this.x = objL - this.w;
			} else if (objDirType == "isWallR" && obj.__c.Solid) {
				this.curVel.x = 0;
				this.x = objR;
			} else if (objDirType == "isCeiling" && obj.__c.Solid) {
				this.curVel.y = 0;
				this.y = objB;
			} else if (objDirType == "isFloor" && obj.__c.Solid) {
				if (this.curVel.y > (500 * worldScale)) {
					this.feetDustEmitter.emitParticles( this.feetDustEmitterSettings, 1, 5);
				}
				if (this.isDown("V")) {
					console.log(obj);
				}
				if (obj.curVel) {
					this.x += (obj.curVel.x * worldScale) * this.milliDT;
				}
				this.curVel.y = 0;
				this.y = objT - this.h;
			}
		}
		// ---- ramps ---- //
		if (objDirType == "isRampBL") {
			if (this.curVel.y > (500 * worldScale)) {
				this.feetDustEmitter.emitParticles( this.feetDustEmitterSettings, 1, 5);
			}
			this.curVel.y = 0;
			this.y = obj.getyLinF(this.x + this.curVel.x * this.milliDT) - this.h;
		} else if (objDirType == "isRampBR") {
			if (this.curVel.y > (500 * worldScale)) {
				this.feetDustEmitter.emitParticles( this.feetDustEmitterSettings, 1, 5);
			}
			this.curVel.y = 0;
			this.y = obj.getyLinF(this.x + this.w + this.curVel.x * this.milliDT) - this.h;
		} else if (objDirType == "isRampTL") {
			this.curVel.y = 0;
			this.y = obj.getyLinF(this.x + this.curVel.x * this.milliDT);
		} else if (objDirType == "isRampTR") {
			this.curVel.y = 0;
			this.y = obj.getyLinF(this.x + this.w + this.curVel.x * this.milliDT);
		}
	},
});

// ------------- Particle_Emitter ------------- //
var particleList = [];
var particleListIndex = 0;
Crafty.c("Particle_Emitter", {
	init: function() {
		this.posOffset = {x: 0, y: 0} ;
		this.movParent;
		
		this.requires("Actor, Collision, Delay");

		this.bind("EnterFrame", function(frameData) {
			// ---- Movement_Parent ---- //
			if (this.movParent) {
				this.x = this.movParent.x + this.posOffset.x;
				this.y = this.movParent.y + this.posOffset.y;
			}
		});
	},

	// Creates particles at this emitter, with the specified settings
	emitParticles: function( emitSettingsIn, emitDelay, emitCount ) {
		this.delay(function() {
			// ---- Set_Optional_Params ---- //
			var emitVelOut = { x: 0, y: 0 };

			if (emitSettingsIn.color) {
				var colorOut = emitSettingsIn.color;
			} else {
				var colorOut = null;
			}
			if (emitSettingsIn.sprite) {
				var spriteOut = emitSettingsIn.sprite;
			} else {
				var spriteOut = null;
			}
			if (emitSettingsIn.rotationSpeed) {
				var rotationSpeedOut = emitSettingsIn.rotationSpeed;
			} else {
				var rotationSpeedOut = 0;
			}
			if (emitSettingsIn.fadeOutTime) {
				var fadeOutTimeOut = emitSettingsIn.fadeOutTime;
			} else {
				var fadeOutTimeOut = 0;
			}
			if (emitSettingsIn.fadeInTime) {
				var fadeInTimeOut = emitSettingsIn.fadeInTime;
			} else {
				var fadeInTimeOut = 0;
			}
			if (emitSettingsIn.gravityType != "decelerate" && emitSettingsIn.gravityType != "slowFall") {
				var gravityTypeOut = "ignore";
			} else {
				var gravityTypeOut = emitSettingsIn.gravityType;
			}
			if (emitSettingsIn.emitStrength) {
				var emitStrength = emitSettingsIn.emitStrength;
			} else {
				var emitStrength = 1;
			}

			if (emitSettingsIn.emitRandom) {
				var emitRandom = emitSettingsIn.emitRandom;
			} else {
				var emitRandom = true;
			}
			if (emitSettingsIn.emitRandNegX) { // Setting allows x velocity to be multiplied by -1 randomly
				var emitRandNegX = emitSettingsIn.emitRandNegX;
			} else {
				var emitRandNegX = false;
			}
			if (emitSettingsIn.emitRandNegY) { // Setting allows y velocity to be multiplied by -1 randomly
				var emitRandNegY = emitSettingsIn.emitRandNegY;
			} else {
				var emitRandNegY = false;
			}

			if (emitSettingsIn.emitVel) {
				if (emitRandom == true) {
					emitVelOut.x = getRandomArbitrary((emitSettingsIn.emitVel.xMin * emitStrength), (emitSettingsIn.emitVel.xMax * emitStrength));
					emitVelOut.y = getRandomArbitrary((emitSettingsIn.emitVel.yMin * emitStrength), (emitSettingsIn.emitVel.yMax * emitStrength)) * (-1);
					if (emitRandNegX == true && Math.random() < 0.5) {
						emitVelOut.x *= (-1);
					}
					if (emitRandNegY == true && Math.random() < 0.5) {
						emitVelOut.y *= (-1);
					}
				} else {
					// 
				}
			} else {
				// 
			}
			// ---- Particle_Creation ---- //
			var propertiesOut = { x: this.x, y: this.y, w: (emitSettingsIn.emitW * worldScale), h: (emitSettingsIn.emitH * worldScale), xVel: (emitVelOut.x * worldScale), yVel: (emitVelOut.y * worldScale), gravityType: gravityTypeOut, collSetting: emitSettingsIn.emitCollSetting, expire: emitSettingsIn.emitExpire, lifeTime: emitSettingsIn.emitLifeTime, color: colorOut, sprite: spriteOut, rotationSpeed: rotationSpeedOut, fadeOutTime: fadeOutTimeOut, fadeInTime: fadeInTimeOut };
			particleList[particleListIndex] = Crafty.e("Particle");
			particleList[particleListIndex].setProperties( propertiesOut );
			particleListIndex++;
		}, emitDelay, --emitCount);
	},
});

// ------------- Particle ------------- //
Crafty.c("Particle", {
	init: function() {
		this.maxVel = 10;
		this.velSlow = 50;		// How quickly velocity decreases, higher values are faster

		this.curVel = { x: 0, y: 0 };
		this.rotationSpeed = 0;
		this.lifeTime = 1000;	// In ms
		this.expire = true;		// Sets whether particle will die after lifeTime runs out
		this.collisionSetting = "collide"; // Allowed types: dieCollide, noCollide, collide
		this.gravityType = "ignore"; // Allowed types: slowFall, decelerate, ignore

		this.alpha = 0;
		this.fadeOutTime = 0; // In ms, how long it takes for this particle to fade out
		this.fadeInTime = 0; // In ms, how long it takes for this particle to fade in
		this.framesToFadeOut = 0; // Used for calculating alpha blending of the fade out effect
		this.framesToFadeIn = 0; // Used for calculating alpha blending of the fade in effect
		this.fadeOutTimeInitial = 0; // Used for calculating alpha blending of the fade out effect
		this.fadeInTimeInitial = 0; // Used for calculating alpha blending of the fade in effect

		this.collObj;			// Object to hold information used in collision detection
		
		this.requires("Actor, SpriteAnimation, Collision");
		this.origin("center");

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);
			// ---- Initial_Fade_In ---- //
			if (this.fadeInTime > 0) {
				this.framesToFadeIn = (this.fadeInTimeInitial / frameData.dt);
				this.alpha += (1 / this.framesToFadeIn);
				this.fadeInTime -= 1000 * this.milliDT;
			}

			// --------- Velocity_Changes --------- //
			if (this.gravityType == "slowFall") {
				// ----- Velocity_x ----- //
				if (this.curVel.x < -0.1) {
					this.curVel.x += this.velSlow * this.milliDT;
				} else if (this.curVel.x > 0.1) {
					this.curVel.x -= this.velSlow * this.milliDT;
				} else {
					this.curVel.x = 0;
				}
				// ----- Velocity_y ----- //
				if (this.curVel.y < 40) {
					this.curVel.y += (worldGravity/4 * worldScale) * this.milliDT; // Gravity
				}
			} else if (this.gravityType == "decelerate") {
				// ----- Velocity_x ----- //
				this.curVel.x -= (this.curVel.x/25);
				// ----- Velocity_y ----- //
				this.curVel.y -= (this.curVel.y/25);
			}

			// ---- Apply_Velocities ---- //
			this.x += this.curVel.x * this.milliDT;
			this.y += this.curVel.y * this.milliDT;

			// --------- LifeTime --------- //
			if (this.expire == true && this.fadeInTime <= 0) {
				this.lifeTime -= 1000 * this.milliDT;
				if (this.lifeTime <= 0) {
					// ---- Fade_Out ---- //
					this.framesToFadeOut = (this.fadeOutTimeInitial / frameData.dt);
					this.alpha -= (1 / this.framesToFadeOut);
					this.fadeOutTime -= 1000 * this.milliDT;
					if (this.fadeOutTime <= 0) {
						this.destroy();
					}
				}
			}

			// --------- rotation --------- //
			this.rotation += this.rotationSpeed * this.milliDT;
		});
	},

	setProperties: function( propertiesIn ) {
		if (propertiesIn.color) {
			this.requires("Color");
			this.color(propertiesIn.color);
		}
		if (propertiesIn.fadeOutTime ) {
			this.fadeOutTime = propertiesIn.fadeOutTime;
			this.fadeOutTimeInitial = propertiesIn.fadeOutTime;
		} else {
			this.fadeOutTime = 0;
			this.fadeOutTimeInitial = 0;
		}
		if (propertiesIn.fadeInTime ) {
			this.fadeInTime = propertiesIn.fadeInTime;
			this.fadeInTimeInitial = propertiesIn.fadeInTime;
			this.alpha = 0;
		} else {
			this.fadeInTime = 0;
			this.fadeInTimeInitial = 0;
		}
		// If there is a sprite given, assign the sprite to this
		if (propertiesIn.sprite) {
			this.requires("SpriteAnimation, " + propertiesIn.sprite);
			// If the sprite is recognized here, it will automatically play the correct animation at creation
			// ---- Recognized_Sprites_List ---- //
			if (propertiesIn.sprite == "spr_PC_Parachute") {
				this.reel("parachute_00r", 2000, 0, 0, 18);
				this.reel("parachute_00l", 2000, 0, 1, 18);
				if (propertiesIn.xVel < 0) {
					this.animate("parachute_00l", 1);
				} else {
					this.animate("parachute_00r", 1);
				}
			}
		}

		this.curVel.x = propertiesIn.xVel;
		this.curVel.y = propertiesIn.yVel;
		this.rotationSpeed = propertiesIn.rotationSpeed;
		this.collisionSetting = propertiesIn.collisionSetting;
		this.gravityType = propertiesIn.gravityType;
		this.expire = propertiesIn.expire;
		this.lifeTime = propertiesIn.lifeTime;
		this.x = propertiesIn.x - propertiesIn.w/2;
		this.y = propertiesIn.y - propertiesIn.h/2;
		this.w = propertiesIn.w;
		this.h = propertiesIn.h;
		this.origin("center");
	},
});

// ------------- BlockDoor ------------- //
Crafty.c("BlockDoor", {
	init: function() {
		this.resetPosCoords = { x: 0, y: 0 };
		this.requires("Actor, spr_BlockDoor")
			.attr({ w: (128 * worldScale), h: (180 * worldScale) });

		this.hitBox = Crafty.e("Actor, Collision, Color")
			.attr({ w: this.w - 10, h: 10 })
			.color("red")
			.onHit("PC", function() {
				this.color("blue");
				advanceLevel();
				Game.bindViewport(PC);
			}, function() {
				this.color("red");
			});
	},

	setProperties: function(propertiesIn) {
		this.hitBox.x = this.x + (5 * worldScale);
		this.hitBox.y = this.y + this.h - (10 * worldScale);
	},
});

// ------------- Checkpoint ------------- //
Crafty.c("Checkpoint", {
	init: function() {
		this.requires("Actor, SpriteAnimation, spr_checkPoint_01")
			.attr({ w: (100 * worldScale), h: (200 * worldScale) });
		this.resetPosCoords = { x: this.x, y: this.y };
		var thisParent = this;
		this.reel("unfold_00r", 500, 0, 0, 9);
		this.reel("unfold_00l", 500, 0, 1, 9);
		this.isActive = false;

		this.hitBox = Crafty.e("Actor, Collision")
			.attr({ w: this.w - 10, h: this.h })
			.onHit("PC", function(collData) {
				var curObj = collData[0].obj;
				thisParent.activate(curObj);
			}, function() {
				// 
			});
	},

	activate: function(curObjIn) {
		if (!this.isActive) {
			this.isActive = true;
			this.animate("unfold_00r", 1);
			curObjIn.setResetPos((this.x + (14 * worldScale)), (this.y + this.h - curObjIn.h - 10));
		}
	},

	setProperties: function(propertiesIn) {
		this.hitBox.x = this.x;
		this.hitBox.y = this.y;
	},
});

// ------------- Spike_Ball_Sprite_01 ------------- //
Crafty.c("Spike_Ball_Sprite_01", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.rotationSpeed = 90;

		this.requires("Actor, SpriteAnimation, SprLocOffset, spr_spikeBall_01")
			.attr({ w: (150 * worldScale), h: (150 * worldScale), z: 5000 });

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},
});

// ------------- Spike_Ball_01 ------------- //
Crafty.c("Spike_Ball_01", {
	init: function() {
		this.requires("Actor, Delay, collisionDetection, Collision, Resettable")
			.attr({ w: (70 * worldScale), h: (70 * worldScale) });
		this.curVel = { x: 0, y: 0 };
		this.resetVel = { x: 0, y: 0 };
		this.resetPosCoords = { x: 0, y: 0};
		this.collType = "float"; // Allowed: float, roll, bounce
		this.bounceImpulse = -600;
		this.isDead = false;

		this.postImpactVel = { x: 0, y: 0 };
		this.hasImpacted = false; // Used for rolling, when first instanced, it waits for the first collision to happen before applying x velocities

		this.spriteObj = Crafty.e("Spike_Ball_Sprite_01");
		this.spriteObj.movParent = this;
		this.spriteObj.setOffset();
		this.spriteObj.origin("center");

		this.dustEmitter = Crafty.e("Particle_Emitter");
		this.dustEmitter.movParent = this;
		this.dustEmitter.posOffset = {x: 0, y: 0};

		this.onHit("PC", function(collData) {
			var curObj = collData[0].obj;
			curObj.die();
		}, function() {
			// 
		});

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);
			// ----- velocity_y ----- //
			if (this.collType == "roll" || this.collType == "bounce") {
				this.curVel.y += (worldGravity * worldScale) * this.milliDT; //Gravity
			}

			// Apply spriteObj rotation
			if (this.collType == "float") {
				if (this.curVel.x > 0 || this.curVel.y < 0) {
					this.spriteObj.rotation += this.spriteObj.rotationSpeed * this.milliDT;
				} else if (this.curVel.x < 0 || this.curVel.y > 0) {
					this.spriteObj.rotation -= this.spriteObj.rotationSpeed * this.milliDT;
				}
			} else if (this.collType == "roll") {
				if (this.curVel.x > 0) {
					this.spriteObj.rotation += this.spriteObj.rotationSpeed*2 * this.milliDT;
				} else if (this.curVel.x < 0) {
					this.spriteObj.rotation -= this.spriteObj.rotationSpeed*2 * this.milliDT;
				}
			} else if (this.collType == "bounce") {
				if (this.curVel.x > 0) {
					this.spriteObj.rotation += this.spriteObj.rotationSpeed * this.milliDT;
				} else if (this.curVel.x < 0) {
					this.spriteObj.rotation -= this.spriteObj.rotationSpeed * this.milliDT;
				}
			}

			// Apply velocities
			this.x += (this.curVel.x * worldScale) * this.milliDT;
			this.y += (this.curVel.y * worldScale) * this.milliDT;
		});
	},

	setProperties: function(propertiesIn) {
		if (propertiesIn.collType) {
			this.collType = propertiesIn.collType;
		} else {
			this.collType = "float";
		}
		if (propertiesIn.velocity) {
			this.curVel.x = propertiesIn.velocity.x;
			this.curVel.y = propertiesIn.velocity.y;
			this.resetVel.x = propertiesIn.velocity.x;
			this.resetVel.y = propertiesIn.velocity.y;
		}
	},

	resetEnt: function() {
		this.x = this.resetPosCoords.x;
		this.y = this.resetPosCoords.y;
		this.curVel.x = this.resetVel.x;
		this.curVel.y = this.resetVel.y;
	},

	setResetPos: function(xIn, yIn) {
		this.resetPosCoords.x = xIn;
		this.resetPosCoords.y = yIn;
		this.resetVel.x = this.curVel.x;
		this.resetVel.y = this.curVel.y;
	},

	die: function() {
		if (!this.isDead) {
			this.delay(function() {
				this.spriteObj.destroy();
				this.dustEmitter.destroy();
				this.destroy();
			}, 500, 0);
		}
		this.isDead = true;
	},

	respondToCollision: function(obj, objDirType) {
		var objL = obj.x,
			objR = obj.x + obj.w,
			objT = obj.y,
			objB = obj.y + obj.h,

			xVel = this.curVel.x,
			yVel = this.curVel.y;

		this.dustEmitCount = 3;
		this.dustEmitterSettings = { emitW: 60, emitH: 60, rotationSpeed: 45, gravityType: "decelerate", emitCollSetting: "noCollide", emitExpire: true, emitLifeTime: 500, sprite: "spr_dust_01", fadeInTime: 500, fadeOutTime: 800 };
		// Special case check for rolling spikeBalls, they should only start rolling as soon as they hit the floor
		if (this.collType == "roll") {
			if (this.hasImpacted == false) {
				this.curVel.x = this.postImpactVel.x;
				this.hasImpacted = true;
			}
		}

		// ---- solidBlocks ---- //
		if (obj.__c.SolidBlock_backGround || obj.__c.ClipBlock_Hazard || obj.__c.ClipBlock) {
			// ---- Wall_L ---- //
			if (objDirType == "isWallL") {
				// General settings
				this.dustEmitter.posOffset = {x: this.w, y: this.h/2};
				this.dustEmitterSettings.emitVel = { xMin: 0, xMax: 1, yMin: 60, yMax: 80 };
				this.dustEmitterSettings.emitRandNegX = false;
				this.dustEmitterSettings.emitRandNegY = true;
				// Specific settings
				this.curVel.x = -xVel;
				this.x = objL - this.w;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			// ---- Wall_R ---- //
			} else if (objDirType == "isWallR") {
				// General settings
				this.dustEmitter.posOffset = {x: 0, y: this.h/2};
				this.dustEmitterSettings.emitVel = { xMin: 0, xMax: 1, yMin: 60, yMax: 80 };
				this.dustEmitterSettings.emitRandNegX = false;
				this.dustEmitterSettings.emitRandNegY = true;
				// Specific settings
				this.curVel.x = -xVel;
				this.x = objR;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			// ---- Ceiling ---- //
			} else if (objDirType == "isCeiling") {
				// General settings
				this.dustEmitter.posOffset = {x: this.w/2, y: 0};
				this.dustEmitterSettings.emitVel = { xMin: 60, xMax: 80, yMin: 0, yMax: 1 };
				this.dustEmitterSettings.emitRandNegX = false;
				this.dustEmitterSettings.emitRandNegY = true;
				// Specific settings
				if (this.collType == "float") {
					this.curVel.y = -yVel;
					this.y = objB;
					this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
				} else if (this.collType == "roll") {
					this.curVel.y = 0;
					this.y = objB;
				} else if (this.collType == "bounce") {
					this.curVel.y = 0;
					this.y = objB;
					this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
				}
			// ---- Floor ---- //
			} else if (objDirType == "isFloor") {
				// General settings
				this.dustEmitter.posOffset = {x: this.w/2, y: this.h};
				this.dustEmitterSettings.emitVel = { xMin: 60, xMax: 80, yMin: 0, yMax: 1 };
				this.dustEmitterSettings.emitRandNegX = false;
				this.dustEmitterSettings.emitRandNegY = true;
				// Specific settings
				if (this.collType == "float") {
					this.curVel.y = -yVel;
					this.y = objT - this.h;
					this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
				} else if (this.collType == "roll") {
					if (yVel > 400) {
						this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
					}
					this.curVel.y = 0;
					this.y = objT - this.h;
				} else if (this.collType == "bounce") {
					this.curVel.y = this.bounceImpulse;
					this.y = objT - this.h;
					this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
				}
			}
		}
		// ---- Ramps ---- //
		// ---- Ramp_BL ---- //
		if (objDirType == "isRampBL") {
			// General settings
			this.dustEmitter.posOffset = {x: 0, y: this.h};
			this.dustEmitterSettings.emitVel = { xMin: 30, xMax: 80, yMin: 30, yMax: 80 };
			this.dustEmitterSettings.emitRandNegX = false;
			this.dustEmitterSettings.emitRandNegY = false;
			// Specific settings
			if (this.collType == "float") {
				this.curVel.x = yVel;
				this.curVel.y = xVel;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			} else if (this.collType == "roll") {
				if (xVel < 0) {
					if (this.x < obj.x + obj.w/2) {
						this.curVel.x = -xVel;
					}
				}
				if (yVel > 400) {
					this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
				}
				this.curVel.y = 0;
			} else if (this.collType == "bounce") {
				if (xVel < 0) {
					this.curVel.x = -xVel;
				}
				this.curVel.y = this.bounceImpulse;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			}
			this.y = obj.getyLinF(this.x + this.curVel.x * this.milliDT) - this.h;
		// ---- Ramp_BR ---- //
		} else if (objDirType == "isRampBR") {
			// General settings
			this.dustEmitter.posOffset = {x: this.w, y: this.h};
			this.dustEmitterSettings.emitVel = { xMin: -30, xMax: -80, yMin: 30, yMax: 80 };
			this.dustEmitterSettings.emitRandNegX = false;
			this.dustEmitterSettings.emitRandNegY = false;
			// Specific settings
			if (this.collType == "float") {
				this.curVel.x = -yVel;
				this.curVel.y = -xVel;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			} else if (this.collType == "roll") {
				if (xVel > 0) {
					if (this.x + this.w > obj.x + obj.w/2) {
						this.curVel.x = -xVel;
					}
				}
				if (yVel > 400) {
					this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
				}
				this.curVel.y = 0;
			} else if (this.collType == "bounce") {
				if (xVel > 0) {
					this.curVel.x = -xVel;
				}
				this.curVel.y = this.bounceImpulse;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			}
			this.y = obj.getyLinF(this.x + this.w + this.curVel.x * this.milliDT) - this.h;
		// ---- Ramp_TL ---- //
		} else if (objDirType == "isRampTL") {
			// General settings
			this.dustEmitter.posOffset = {x: 0, y: 0};
			this.dustEmitterSettings.emitVel = { xMin: 60, xMax: 80, yMin: -60, yMax: -80 };
			this.dustEmitterSettings.emitRandNegX = false;
			this.dustEmitterSettings.emitRandNegY = false;
			// Specific settings
			if (this.collType == "float") {
				this.curVel.x = -yVel;
				this.curVel.y = -xVel;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			} else if (this.collType == "roll") {
				// 
			} else if (this.collType == "bounce") {
				this.curVel.x = -xVel;
				this.curVel.y = 0;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			}
			this.y = obj.getyLinF(this.x + this.curVel.x * this.milliDT);
		// ---- Ramp_TR ---- //
		} else if (objDirType == "isRampTR") {
			// General settings
			this.dustEmitter.posOffset = {x: this.w, y: 0};
			this.dustEmitterSettings.emitVel = { xMin: -60, xMax: -80, yMin: -60, yMax: -80 };
			this.dustEmitterSettings.emitRandNegX = false;
			this.dustEmitterSettings.emitRandNegY = false;
			// Specific settings
			if (this.collType == "float") {
				this.curVel.x = yVel;
				this.curVel.y = xVel;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			} else if (this.collType == "roll") {
				// 
			} else if (this.collType == "bounce") {
				this.curVel.x = -xVel;
				this.curVel.y = 0;
				this.dustEmitter.emitParticles( this.dustEmitterSettings, 1, this.dustEmitCount);
			}
			this.y = obj.getyLinF(this.x + this.w + this.curVel.x * this.milliDT);
		}
	},
});

// ------------- Spike_Ball_Launcher_01 ------------- //
Crafty.c("Spike_Ball_Launcher_01", {
	init: function() {
		this.requires("Actor, Delay, Resettable, SpriteAnimation, spr_spikeBallLauncher_01")
			.attr({ w: (180 * worldScale), h: (150 * worldScale), z: 8000 });
		this.direction = "right"; // Recognized: "left", "right"
		this.shootDelay = 5000; // In ms, time between shots
		this.shootDelayTime = 0;
		this.projectileCollType = "roll"; // float, roll, bounce
		this.shootVel = 4;
		this.postImpactVel = { x: 2, y: 0 };

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);

			this.shootDelayTime += 1000 * this.milliDT;
			console.log(this.shootDelay);
			if (this.shootDelayTime >= this.shootDelay) {
				this.shootProjectile();
				this.shootDelayTime = 0;
			}
		});
	},

	setProperties: function(propertiesIn) {
		this.origin("center");
		this.direction = propertiesIn.direction;
		if (propertiesIn.shootDelay) {
			this.shootDelay = propertiesIn.shootDelay;
		} else {
			this.shootDelay = 5000; // Default
		}
		if (propertiesIn.shootVel) {
			this.shootVel = propertiesIn.shootVel;
		} else {
			this.shootVel = 4; // Default
		}
		if (propertiesIn.collType) {
			this.collType = propertiesIn.collType;
		} else {
			this.collType = "roll"; // Default
		}
		if (propertiesIn.postImpactVel) {
			this.postImpactVel = propertiesIn.postImpactVel;
		} else {
			this.postImpactVel = { x: 2, y: 0 };
		}
	},

	shootProjectile: function() {
		entitiesList[entitiesListIndex] = Crafty.e("Spike_Ball_01")
			.attr({ x: (this.x + (55 * worldScale)), y: (this.y + (55 * worldScale)) }); // Directly tied to size of launcher and spikeball_01, currently not optimal solution
		if (this.direction == "left") {
			entitiesList[entitiesListIndex].collType = this.projectileCollType;
			entitiesList[entitiesListIndex].postImpactVel = this.postImpactVel;
		} else if (this.direction == "right") {
			entitiesList[entitiesListIndex].collType = this.projectileCollType;
			entitiesList[entitiesListIndex].postImpactVel = this.postImpactVel;
		}
		entitiesListIndex++;
	},

	resetEnt: function() {
		this.shootDelayTime = 0;
	},
});

// ------------- Spike_Ball_Sprite_02 ------------- //
Crafty.c("Spike_Ball_Sprite_02", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.rotationSpeed = -150;

		this.requires("Actor, SprLocOffset, spr_spikeBall_02")
			.attr({ w: (120 * worldScale), h: (120 * worldScale), z: 8000 });

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},
});

// ------------- spr_SpikeBallOrigin_Sprite_02 ------------- //
Crafty.c("spr_SpikeBallOrigin_Sprite_02", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.rotationSpeed = 90;

		this.requires("Actor, SprLocOffset, spr_SpikeBallOrigin_02")
			.attr({ w: (120 * worldScale), h: (120 * worldScale), z: 8000 });

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},
});

// ------------- Spike_Ball_Chain_Sprite_02 ------------- //
Crafty.c("Spike_Ball_Chain_Sprite_02", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.angle = 0;

		this.requires("Actor, SprLocOffset, spr_SpikeBallChain_02")
			.attr({ w: (20 * worldScale), h: (12 * worldScale), z: 6000 });

		this.origin(0, this.h/2);

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},
});

// ------------- Spike_Ball_ChainAnchor_02 ------------- //
// Serves as anchor point for the chain sprite
Crafty.c("Spike_Ball_ChainAnchor_02", {
	init: function() {
		this.spriteObj = Crafty.e("Spike_Ball_Chain_Sprite_02");
		this.spriteObj.offset = { x: 0, y: this.spriteObj.h/2 };
		this.spriteObj.movParent = this;

		this.requires("Actor")
			.attr({ w: 1, h: 1 });
	},

	updateRot: function(angleIn) {
		this.spriteObj.rotation = angleIn;
	},
});

// ------------- Spike_Ball_HitBox_02 ------------- //
Crafty.c("Spike_Ball_HitBox_02", {
	init: function() {
		this.requires("Actor, Collision")
			.attr({ w: (60 * worldScale), h: (60 * worldScale) });

		this.rotationDir = "clockwise"; // clockwise, counterClockwise

		this.spriteObj = Crafty.e("Spike_Ball_Sprite_02");
		this.spriteObj.movParent = this;
		this.spriteObj.setOffset();
		this.spriteObj.origin("center");

		this.onHit("PC", function(collData) {
			var curObj = collData[0].obj;
			curObj.die();
		}, function() {
			// 
		});

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);
			// Apply spriteObj rotation
			if (this.rotationDir == "clockwise") {
				this.spriteObj.rotation += this.spriteObj.rotationSpeed * this.milliDT;
			} else if (this.rotationDir == "counterClockwise") {
				this.spriteObj.rotation -= this.spriteObj.rotationSpeed * this.milliDT;
			}
			
		});
	},
});

// ------------- Spike_Ball_02 ------------- //
// This entity is what handles all the logic; Instance this object, it will automatically assemble all the necessary components
Crafty.c("Spike_Ball_02", {
	init: function() {
		this.requires("Actor, HelperMaths, Resettable")
			.attr({ w: 2, h: 2 });
		this.resetPosCoords = { x: 0, y: 0};
		this.rotationDir = "clockwise"; // clockwise, counterClockwise
		this.rotationSpeed = 3;

		this.curRotationAngle = 0;
		this.radiusMultiplier = 1;
		this.chainLength = 200;
		this.radius = (this.chainLength * this.radiusMultiplier * worldScale); // Should be kept to step size of Spike_Ball_Chain_Sprite_02 width
		this.curRotPoint = { x: this.x + this.radius, y: this.y }; // Doesn't actually change, only gets used as a reference point
		this.nextRotPoint = { x: this.x + this.radius, y: this.y };

		this.chainSegArray = [];
		this.chainDistanceSegment = { x: 0, y: 0 };

		this.spikeBall = Crafty.e("Spike_Ball_HitBox_02");
		this.spikeBallOrigin = Crafty.e("spr_SpikeBallOrigin_Sprite_02");

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);
			// ---- Calculate_Rotation_Point ---- //
			if (this.rotationDir == "clockwise") {
				this.curRotationAngle += this.rotationSpeed * this.milliDT;
			} else if (this.rotationDir == "counterClockwise") {
				this.curRotationAngle -= this.rotationSpeed * this.milliDT;
			}
			this.nextRotPoint = this.getPointOnCirlce({ x: this.x, y: this.y }, this.curRotPoint, this.curRotationAngle); // args: (originPointIn, curPointIn, curAngleIn)

			// ---- Update_spikeBall ---- //
			this.spikeBall.x = this.nextRotPoint.x - this.spikeBall.w/2;
			this.spikeBall.y = this.nextRotPoint.y - this.spikeBall.h/2;

			// ---- Update_spikeBallOrigin ---- //
			this.spikeBallOrigin.x = this.x - (this.spikeBallOrigin.w/2);
			this.spikeBallOrigin.y = this.y - (this.spikeBallOrigin.h/2);

			// ---- Update_spikeBallChains ---- //
			this.updateChain();
		});
	},

	createChain: function() {
		// Updates this.chainSegArray so it contains the necessary amount of chain segments
		// (20 * worldscale) is the width of each of the chain segments, so if the width gets changed this value here must be changed, as well
		var u = 0;
		for (var i = 0; i <= this.radius; i += (20 * worldScale)) {
			this.chainSegArray[u] = Crafty.e("Spike_Ball_ChainAnchor_02");
			var curSeg = this.chainSegArray[u];
			curSeg.x = this.x;
			curSeg.y = this.y;
			u++;
		}
	},

	updateChain: function() {
		// Divide distance between origin and nextRotPoint by length of chain
		this.chainDistanceSegment.x = (this.x - this.nextRotPoint.x) / this.chainSegArray.length;
		this.chainDistanceSegment.y = (this.y - this.nextRotPoint.y) / this.chainSegArray.length;

		this.degAngle = this.getAtan2DegAngle({ x: this.x, y: this.y }, this.nextRotPoint);
		
		var curSegMultiplier = 1;
		for (var i = this.chainSegArray.length-1; i >= 0; --i) {
			var curSeg = this.chainSegArray[i];

			// Update location
			curSeg.x = this.x - (this.chainDistanceSegment.x * curSegMultiplier);
			curSeg.y = this.y - (this.chainDistanceSegment.y * curSegMultiplier);
			// Update rotation
			curSeg.updateRot(this.degAngle);

			curSegMultiplier++;
		}
	},

	setProperties: function(propertiesIn) {
		if (propertiesIn.rotationDir) {
			this.rotationDir = propertiesIn.rotationDir;
			this.spikeBall.rotationDir = propertiesIn.rotationDir;
		} else {
			this.rotationDir = "clockwise";
			this.spikeBall.rotationDir = "clockwise";
		}
		if (propertiesIn.rotationSpeed) {
			this.rotationSpeed = propertiesIn.rotationSpeed;
		} else {
			this.rotationSpeed = 3;
		}
		if (propertiesIn.radiusMultiplier) {
			this.radiusMultiplier = propertiesIn.radiusMultiplier;
		} else {
			this.radiusMultiplier = 1;
		}
		this.radius = (this.chainLength * this.radiusMultiplier * worldScale);
		this.curRotPoint = { x: this.x + this.radius, y: this.y}; // Doesn't actually change, only gets used as a reference point
		this.nextRotPoint = { x: this.x + this.radius, y: this.y};
		this.createChain();
	},

	resetEnt: function() {
		this.x = this.resetPosCoords.x;
		this.y = this.resetPosCoords.y;
		this.curRotPoint.x = this.x + this.radius;
		this.curRotPoint.y = this.y;
		this.curRotationAngle = 0;
		this.nextRotPoint.x = this.curRotPoint.x;
		this.nextRotPoint.y = this.curRotPoint.y;
	},

	setResetPos: function(xIn, yIn) {
		this.resetPosCoords.x = xIn;
		this.resetPosCoords.y = yIn;
	},
});

// ------------- JumpPad ------------- //
Crafty.c("JumpPad", {
	init: function() {
		var thisParent = this;
		this.isActive = false;
		this.resetPosCoords = { x: 0, y: 0 };
		this.requires("Actor, SpriteAnimation, spr_jumpPad_01")
			.attr({ w: (90 * worldScale), h: (90 * worldScale) });

		this.reel("uncompress_00r", 1000, 0, 0, 12);
		this.reel("uncompress_00l", 1000, 0, 1, 12);
		this.reel("recompress_00r", 500, 0, 2, 7);
		this.reel("recompress_00l", 500, 0, 3, 7);

		this.hitBox = Crafty.e("Actor, Collision, Color")
			.attr({ w: this.w - (10 * worldScale), h: (10 * worldScale) })
			.color("red")
			.onHit("PC", function(collData) {
				var curObj = collData[0].obj;
				this.color("blue");
				if (curObj.canJump) {
					curObj.jump((-20 * worldScale));
					thisParent.activate();
				}
			}, function() {
				this.color("red");
			});
	},

	activate: function() {
		this.isActive = true;
		this.animate("uncompress_00r", 1);

		this.bind("EnterFrame", function(frameData) {
			if (this.isActive == true && this.getReel().currentFrame == this.getReel().frames.length-1) {
				this.animate("recompress_00r", 1);
				this.isActive = false;
			}
		});
	},

	setProperties: function(propertiesIn) {
		this.hitBox.x = this.x + (5 * worldScale);
		this.hitBox.y = (this.y + this.h) - this.hitBox.h;
	},
});

// ------------- ProjectileShooter ------------- //
Crafty.c("ProjectileShooter", {
	init: function() {
		this.requires("Actor, Delay, Resettable, SpriteAnimation, spr_projectileShooter_01")
			.attr({ w: (90 * worldScale), h: (90 * worldScale), z: 8000 });
		this.reel("shoot_00r", 1000, 0, 0, 13);
		this.shootVel = 200;
		this.direction = "left"; // Recognized: "left", "right", "up", "down"
		this.projectileType = "default"; // Recognized: "default", "chase"
		this.shootDelay = 5000; // In ms, time between shots
		this.shootDelayTime = 0;
		this.lifeTime = 10000; // In ms, how long the projectile can exist

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);

			this.shootDelayTime += 1000 * this.milliDT;
			if (this.shootDelayTime >= this.shootDelay - 700) {
				if (!this.isPlaying("shoot_00r")) {
					this.animate("shoot_00r", 1);
				}
			}
			if (this.shootDelayTime >= this.shootDelay) {
				this.shootProjectile(this.projectileType);
				this.shootDelayTime = 0;
			}
		});
	},

	setProperties: function(propertiesIn) {
		this.origin("center");
		this.direction = propertiesIn.direction;
		if (propertiesIn.direction == "left") {
			this.rotation = 180;
		} else if (propertiesIn.direction == "right") {
			this.rotation = 0;
		} else if (propertiesIn.direction == "up") {
			this.rotation = 270;
		} else if (propertiesIn.direction == "down") {
			this.rotation = 90;
		}
		if (propertiesIn.shootVel) {
			this.shootVel = propertiesIn.shootVel;
		} else {
			this.shootVel = 200; // Default
		}
		if (propertiesIn.shootDelay) {
			this.shootDelay = propertiesIn.shootDelay;
		} else {
			this.shootDelay = 5000; // Default
		}
		if (propertiesIn.lifeTime) {
			this.lifeTime = propertiesIn.lifeTime;
		} else {
			this.lifeTime = 10000; // Default
		}
		if (propertiesIn.projectileType) {
			this.projectileType = propertiesIn.projectileType;
		} else {
			this.projectileType = "default"; // Default
		}
	},

	shootProjectile: function(projectileTypeIn) {
		if (projectileTypeIn == "default") {
			entitiesList[entitiesListIndex] = Crafty.e("Projectile")
			.attr({ x: (this.x + this.w/4), y: (this.y + this.h/4) });
			entitiesList[entitiesListIndex].lifeTime = this.lifeTime;
			if (this.direction == "left") {
				entitiesList[entitiesListIndex].curVel = { x: -this.shootVel, y: 0};
				entitiesList[entitiesListIndex].rotation = 0;
			} else if (this.direction == "right") {
				entitiesList[entitiesListIndex].curVel = { x: this.shootVel, y: 0 };
				entitiesList[entitiesListIndex].rotation = 180;
			} else if (this.direction == "up") {
				entitiesList[entitiesListIndex].curVel = { x: 0, y: -this.shootVel };
				entitiesList[entitiesListIndex].rotation = 90;
			} else if (this.direction == "down") {
				entitiesList[entitiesListIndex].curVel = { x: 0, y: this.shootVel };
				entitiesList[entitiesListIndex].rotation = 270;
			}
		} else if (projectileTypeIn == "chase") {
			entitiesList[entitiesListIndex] = Crafty.e("chaserProjectile_01")
			.attr({ x: (this.x + this.w/4), y: (this.y + this.h/4) });
			entitiesList[entitiesListIndex].lifeTime = this.lifeTime;
			if (this.direction == "left") {
				entitiesList[entitiesListIndex].curVel = { x: -this.shootVel, y: 0};
				entitiesList[entitiesListIndex].rotation = 180;
			} else if (this.direction == "right") {
				entitiesList[entitiesListIndex].curVel = { x: this.shootVel, y: 0 };
				entitiesList[entitiesListIndex].rotation = 0;
			} else if (this.direction == "up") {
				entitiesList[entitiesListIndex].curVel = { x: 0, y: -this.shootVel };
				entitiesList[entitiesListIndex].rotation = 270;
			} else if (this.direction == "down") {
				entitiesList[entitiesListIndex].curVel = { x: 0, y: this.shootVel };
				entitiesList[entitiesListIndex].rotation = 90;
			}
		}
		entitiesListIndex++;
	},

	resetEnt: function() {
		this.shootDelayTime = 0;
	},
});

// ------------- Projectile ------------- //
Crafty.c("Projectile", {
	init: function() {
		this.requires("Actor, Resettable, Collision, Delay, collisionDetection, spr_projectile_01")
			.attr({ w: (50 * worldScale), h: (50 * worldScale) });
		this.origin("center");
		this.lifeTime = 10000;
		this.curVel = { x: 0, y: 0 };
		this.isDead = false;

		this.onHit("PC", function(collData) {
			var curObj = collData[0].obj;
			curObj.die();
			this.die();
		}, function() {
			// 
		});

		this.deathEmitter = Crafty.e("Particle_Emitter");
		this.deathEmitter.movParent = this;
		this.deathEmitter.posOffset = { x: this.w, y: this.h/2 };
		this.deathEmitterSettings = { emitW: 40, emitH: 60, emitVel: { xMin: -80, xMax: -10, yMin: 60, yMax: 80 }, emitRandNegY: true, gravityType: "decelerate", emitExpire: true, emitLifeTime: 1000, sprite: "spr_glowRed_01", fadeOutTime: 1000 };

		this.tailEmitter = Crafty.e("Particle_Emitter");
		this.tailEmitter.movParent = this;
		this.tailEmitter.posOffset = {x: 0, y: this.h/2};
		this.tailEmitterSettings = { emitW: 30, emitH: 30, emitVel: { xMin: -20, xMax: -10, yMin: 10, yMax: 20 }, emitRandNegY: true, gravityType: "decelerate", emitExpire: true, emitLifeTime: 500, sprite: "spr_glowRed_01", fadeOutTime: 500 };
		this.tailEmitterWaitTime = 0;

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);

			this.tailEmitterWaitTime += 1000 * this.milliDT;
			if (this.tailEmitterWaitTime >= 60) {
				this.tailEmitter.emitParticles( this.tailEmitterSettings, 1, 1);
				this.tailEmitterWaitTime = 0;
			}

			// Update and check lifeTime
			this.lifeTime -= 1000 * this.milliDT;
			if (this.lifeTime <= 0) {
				this.die();
			}

			// Apply velocities
			this.x += (this.curVel.x * worldScale) * this.milliDT;
			this.y += (this.curVel.y * worldScale) * this.milliDT;
		});
	},

	respondToCollision: function(obj, objDirType) {
		if (obj.__c.SolidBlock_backGround || obj.__c.SolidBlock_ramp || obj.__c.ClipBlock_Hazard || obj.__c.ClipBlock) {
			this.die();
		}
	},

	die: function() {
		if (this.isDead == false) {
			this.isDead = true;
			this.deathEmitter.emitParticles( this.deathEmitterSettings, 1, 6);

			this.delay(function() {
				this.deathEmitter.destroy();
				this.tailEmitter.destroy();
				this.destroy();
			}, 100, 0);
		}
	},

	resetEnt: function() {
		this.die();
	},
});

// ------------- chaserProjectileSprite_01 ------------- //
Crafty.c("chaserProjectileSprite_01", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.rotationSpeed = 90;

		this.requires("Actor, SprLocOffset, spr_projectile_01")
			.attr({ w: (50 * worldScale), h: (50 * worldScale) });

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},
});

// ------------- chaserProjectile_01 ------------- //
Crafty.c("chaserProjectile_01", {
	init: function() {
		this.requires("Actor, HelperMaths, Resettable, Collision, Delay, collisionDetection")
			.attr({ w: (50 * worldScale), h: (50 * worldScale) });

		this.origin("center");

		this.spriteObj = Crafty.e("chaserProjectileSprite_01");
		this.spriteObj.movParent = this;
		this.spriteObj.origin("center");

		this.onHit("PC", function(collData) {
			var curObj = collData[0].obj;
			curObj.die();
			this.die();
		}, function() {
			// 
		});

		this.targetAngle = 0;
		this.rotSpeed = 150;
		this.angleDif = 0; // Is the difference between rotation and targetAngle
		this.angleInvDif = 0; // Is 360 - angleDif, basically the inverted distance from rotation to targetAngle
		this.radius = 200; // Is effectively the movement speed
		this.curRotPoint = { x: 0, y: 0 }; // Doesn't actually change, only gets used as a reference point
		this.nextRotPoint = { x: 0, y: 0 };

		this.curVel = { x: 0, y: 0 };
		this.lifeTime = 10000; // After time is up, projectile dies
		this.initialTime = 0; // After certain amount of time, chasing behaviour becomes active
		this.isDead = false;

		this.deathEmitter = Crafty.e("Particle_Emitter");
		this.deathEmitter.movParent = this;
		this.deathEmitterSettings = { emitW: 40, emitH: 60, emitVel: { xMin: -80, xMax: -10, yMin: 60, yMax: 80 }, emitRandNegY: true, gravityType: "decelerate", emitExpire: true, emitLifeTime: 1000, sprite: "spr_glowRed_01", fadeOutTime: 1000 };

		this.tailEmitter = Crafty.e("Particle_Emitter");
		this.tailEmitter.movParent = this;
		this.tailEmitterSettings = { emitW: 30, emitH: 30, emitVel: { xMin: -20, xMax: -10, yMin: 10, yMax: 20 }, emitRandNegY: true, gravityType: "decelerate", emitExpire: true, emitLifeTime: 500, sprite: "spr_glowRed_01", fadeOutTime: 500 };
		this.tailEmitterWaitTime = 0;

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);

			this.initialTime += 1000 * this.milliDT;

			this.targetAngle = this.getAtan2DegAngle({ x: this.x + this.w/2, y: this.y + this.h/2 }, { x: this.findTarget().x + this.findTarget().w/2, y: this.findTarget().y + this.findTarget().h/2 });
			// Prevent targetAngle from exiting the range of 0 to 360
			if (this.targetAngle < 0) {
				this.targetAngle += 360;
			}
			// Prevent this.rotation from exiting the range of 0 to 360
			if (this.rotation > 360) {
				this.rotation -= 360;
			} else if (this.rotation < 0) {
				this.rotation += 360;
			}
			if (this.initialTime >= 500) {
				// Check and apply rotation
				if (this.targetAngle > this.rotation && this.targetAngle - this.rotation > this.rotSpeed * this.milliDT) { // Check if rotation should be positive under normal circumstances
					this.angleDif = this.targetAngle - this.rotation;
					this.angleInvDif = 360 - this.angleDif;
					/* Check for smaller angle difference, basically a check to see if rotation would leave 0 to 360 range
					* I.e. if rotation is 11 and targetAngle is 350, then the smaller angle to rotate by would be the angleInvDif,
					* which would be 21, whereas the angleDif would be 339 */
					if (this.angleInvDif > this.angleDif) { // Check if normal circumstances apply, i.e. rotation should be positive
						this.rotation += this.rotSpeed * this.milliDT;
					} else if (this.angleInvDif < this.angleDif) { // Else go in opposite direction than under normal circumstances
						this.rotation -= this.rotSpeed * this.milliDT;
					}
				} else if (this.targetAngle < this.rotation && this.rotation - this.targetAngle > this.rotSpeed * this.milliDT) { // Check if rotation should be negative under normal circumstances
					this.angleDif = this.rotation - this.targetAngle;
					this.angleInvDif = 360 - this.angleDif;
					/* Check for smaller angle difference, basically a check to see if rotation would leave 0 to 360 range
					* I.e. if rotation is 332 and targetAngle is 13, then the smaller angle to rotate by would be the angleInvDif,
					* which would be 41, whereas the angleDif would be 319 */
					if (this.angleInvDif > this.angleDif) {
						this.rotation -= this.rotSpeed * this.milliDT;
					} else if (this.angleInvDif < this.angleDif) {
						this.rotation += this.rotSpeed * this.milliDT;
					}
				}
			}

			// Update and check lifeTime
			this.lifeTime -= 1000 * this.milliDT;
			if (this.lifeTime <= 0) {
				this.die();
			}

			// Update rotPoints
			this.curRotPoint = { x: this.x + this.w/2 + this.radius, y: this.y + this.h/2 };
			this.nextRotPoint = this.getPointOnCirlce({ x: this.x + this.w/2, y: this.y + this.h/2 }, this.curRotPoint, (this.rotation * Math.PI/180));

			// Update curVel
			this.curVel.x = this.nextRotPoint.x - (this.x + this.w/2);
			this.curVel.y = this.nextRotPoint.y - (this.y + this.h/2);

			// Apply velocity
			this.x += this.curVel.x * this.milliDT;
			this.y += this.curVel.y * this.milliDT;

			// Update this.spriteObj
			this.spriteObj.rotation = this.rotation - 180;

			// Update emitters
			this.tailEmitterSettings.emitVel = { xMin: -this.curVel.x/10, xMax: -this.curVel.x/10 + 40, yMin: -this.curVel.y/10, yMax: -this.curVel.y/10 + 40 };
			this.tailEmitter.posOffset = { x: this.w/2 + -this.curVel.x/10, y: this.h/2 + -this.curVel.y/10 };
			this.tailEmitterWaitTime += 1000 * this.milliDT;
			if (this.tailEmitterWaitTime >= 60) {
				this.tailEmitter.emitParticles( this.tailEmitterSettings, 1, 1);
				this.tailEmitterWaitTime = 0;
			}
			this.deathEmitterSettings.emitVel = { xMin: -200, xMax: 200, yMin: -200, yMax: 200 };
			this.deathEmitter.posOffset = { x: this.w/2 + this.curVel.x/10, y: this.h/2 + this.curVel.y/10 };
		});
	},

	findTarget: function() {
		return Crafty("PC").get(-1);
	},

	respondToCollision: function(obj, objDirType) {
		if (obj.__c.SolidBlock_backGround || obj.__c.SolidBlock_ramp || obj.__c.ClipBlock_Hazard || obj.__c.ClipBlock) {
			this.die();
		}
	},

	die: function() {
		if (this.isDead == false) {
			this.isDead = true;
			this.deathEmitter.emitParticles( this.deathEmitterSettings, 1, 6);

			this.delay(function() {
				this.spriteObj.destroy();
				this.deathEmitter.destroy();
				this.tailEmitter.destroy();
				this.destroy();
			}, 100, 0);
		}
	},

	resetEnt: function() {
		this.die();
	},
});

// ------------- Crusher_Sprite_01 ------------- //
Crafty.c("Crusher_Sprite_01", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.hitBoxOffset = { x: 0, y: 0 };
		this.collisionBoxOffset = { x: 0, y: 0 };
		this.hitBoxWH = (10 * worldScale);

		this.requires("Actor, SpriteAnimation, SprLocOffset, spr_crusher_01")
			.attr({ w: (180 * worldScale), h: (180 * worldScale), z: 5000 });

		// ---- Instance_HitBox ---- //
		this.hitBox = Crafty.e("Actor, Color, Collision");
		this.hitBox.attr({ z: 6000 })
		this.hitBox.color("red")
		this.hitBox.isActive = true;
		this.hitBox.onHit("PC", function(collData) {
			if (this.isActive == true) {
				for (var n = collData.length-1; n > -1; --n) {
					var curObj = collData[n].obj;

					curObj.die();
					this.color("blue");
				}
			}
		}, function() {
			this.color("red");
		});
		// ---- Instance_CollisionBox ---- //
		clipList[clipListIndex] = Crafty.e("ClipBlock");
		this.collisionBox = clipList[clipListIndex];
		clipListIndex++;

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}

			// ---- Update_HitBox ---- //
			this.hitBox.x = this.x + this.hitBoxOffset.x;
			this.hitBox.y = this.y + this.hitBoxOffset.y;

			// ---- Update_CollisionBox ---- //
			this.collisionBox.x = this.x + this.collisionBoxOffset.x;
			this.collisionBox.y = this.y + this.collisionBoxOffset.y;
		});
	},
});

// ------------- Crusher_01 ------------- //
Crafty.c("Crusher_01", {
	init: function() {
		this.movParent = null;
		this.requires("Actor, Resettable");

		this.spriteObj = Crafty.e("Crusher_Sprite_01");
		this.spriteObj.movParent = this;
		this.state = 0; // 0 = fully reset, 1 = warning, starting to move, 2 = crushing, moving fully
		this.stateTime = 0;
		this.direction = "down"; // down, up, right, left
		this.curVel = { x: 0, y: 0 };
		this.maxVel = { x: 0, y: 0 };
		this.resetPosCoords = { x: 0, y: 0 };

		this.bind("EnterFrame", function(frameData) {
			this.milliDT = (frameData.dt/1000);

			this.stateTime += 1000 * this.milliDT;
			// Go to stage 1
			if (this.state == 0 && this.stateTime >= 2000) {
				if (this.direction == "down" || this.direction == "right") {
					if (this.x < this.resetPosCoords.x + (10 * worldScale) && this.y < this.resetPosCoords.y + (10 * worldScale)) {
						this.curVel.x = this.maxVel.x;
						this.curVel.y = this.maxVel.y;
					} else {
						this.setState(1);
					}
				} else {
					if (this.x > this.resetPosCoords.x - (10 * worldScale) && this.y > this.resetPosCoords.y - (10 * worldScale)) {
						this.curVel.x = this.maxVel.x;
						this.curVel.y = this.maxVel.y;
					} else {
						this.setState(1);
					}
				}
			}
			// Go to stage 2
			if (this.state == 1 && this.stateTime >= 600) {
				if (this.direction == "down" || this.direction == "right") {
					if (this.x < this.resetPosCoords.x + (180 * worldScale) && this.y < this.resetPosCoords.y + (180 * worldScale)) {
						this.curVel.x = this.maxVel.x;
						this.curVel.y = this.maxVel.y;
					} else {
						this.setState(2);
					}
				} else {
					if (this.x > this.resetPosCoords.x - (180 * worldScale) && this.y > this.resetPosCoords.y - (180 * worldScale)) {
						this.curVel.x = this.maxVel.x;
						this.curVel.y = this.maxVel.y;
					} else {
						this.setState(2);
					}
				}
			}
			// Go to stage 0
			if (this.state == 2 && this.stateTime >= 1500) {
				if (this.direction == "down" || this.direction == "right") {
					if (this.x >= this.resetPosCoords.x && this.y >= this.resetPosCoords.y) {
						this.curVel.x = -this.maxVel.x;
						this.curVel.y = -this.maxVel.y;
					} else {
						this.setState(0);
					}
				} else {
					if (this.x <= this.resetPosCoords.x && this.y <= this.resetPosCoords.y) {
						this.curVel.x = -this.maxVel.x;
						this.curVel.y = -this.maxVel.y;
					} else {
						this.setState(0);
					}
				}
			}

			// Apply velocities
			this.x += (this.curVel.x * worldScale) * this.milliDT;
			this.y += (this.curVel.y * worldScale) * this.milliDT;

			// Pass velocities to collisionBox
			// The collisionBox doesn't actually do anything with this property, it only holds it for use during other ents' collision response
			this.spriteObj.collisionBox.curVel = { x: this.curVel.x, y: this.curVel.y };
		});
	},

	setState: function(stateIn) {
		this.curVel.x = 0;
		this.curVel.y = 0;
		this.state = stateIn;
		this.stateTime = 0;
	},

	setProperties: function(propertiesIn) {
		this.resetPosCoords = { x: this.x, y: this.y };
		this.direction = propertiesIn.direction;
		this.spriteObj.origin("center");
		if (propertiesIn.direction == "left") {
			this.spriteObj.rotation = 90;
			this.maxVel = { x: -100, y: 0 };

			this.spriteObj.hitBoxOffset.x = 0;
			this.spriteObj.hitBoxOffset.y = this.spriteObj.hitBoxWH/2;
			this.spriteObj.collisionBoxOffset.x = this.spriteObj.hitBoxWH;
			this.spriteObj.hitBox.w = this.spriteObj.hitBoxWH;
			this.spriteObj.hitBox.h = this.spriteObj.h - this.spriteObj.hitBoxWH;
			this.spriteObj.collisionBox.w = this.spriteObj.w - this.spriteObj.hitBoxWH;
			this.spriteObj.collisionBox.h = this.spriteObj.h;
		} else if (propertiesIn.direction == "right") {
			this.spriteObj.rotation = 270;
			this.maxVel = { x: 100, y: 0 };
			
			this.spriteObj.hitBoxOffset.x = this.spriteObj.w - this.spriteObj.hitBoxWH;
			this.spriteObj.hitBoxOffset.y = this.spriteObj.hitBoxWH/2;
			this.spriteObj.hitBox.w = this.spriteObj.hitBoxWH;
			this.spriteObj.hitBox.h = this.spriteObj.h - this.spriteObj.hitBoxWH;
			this.spriteObj.collisionBox.w = this.spriteObj.w - this.spriteObj.hitBoxWH;
			this.spriteObj.collisionBox.h = this.spriteObj.h;
		} else if (propertiesIn.direction == "up") {
			this.spriteObj.rotation = 180;
			this.maxVel = { x: 0, y: -100 };
			
			this.spriteObj.hitBoxOffset.x = this.spriteObj.hitBoxWH/2;
			this.spriteObj.hitBoxOffset.y = 0;
			this.spriteObj.collisionBoxOffset.y = this.spriteObj.hitBoxWH;
			this.spriteObj.hitBox.w = this.spriteObj.w - this.spriteObj.hitBoxWH;
			this.spriteObj.hitBox.h = this.spriteObj.hitBoxWH;
			this.spriteObj.collisionBox.w = this.spriteObj.w;
			this.spriteObj.collisionBox.h = this.spriteObj.h - this.spriteObj.hitBoxWH;
		} else if (propertiesIn.direction == "down") {
			this.spriteObj.rotation = 0;
			this.maxVel = { x: 0, y: 100 };
			
			this.spriteObj.hitBoxOffset.x = this.spriteObj.hitBoxWH/2;
			this.spriteObj.hitBoxOffset.y = this.spriteObj.h - this.spriteObj.hitBoxWH;
			this.spriteObj.hitBox.w = this.spriteObj.w - this.spriteObj.hitBoxWH;
			this.spriteObj.hitBox.h = this.spriteObj.hitBoxWH;
			this.spriteObj.collisionBox.w = this.spriteObj.w;
			this.spriteObj.collisionBox.h = this.spriteObj.h - this.spriteObj.hitBoxWH;
		}
		if (propertiesIn.shootVel) {
			this.shootVel = propertiesIn.shootVel;
		} else {
			this.shootVel = 200; // Default
		}
		if (propertiesIn.shootDelay) {
			this.shootDelay = propertiesIn.shootDelay;
		} else {
			this.shootDelay = 5000; // Default
		}
	},

	resetEnt: function() {
		this.stateTime = 0;
		this.state = 0;
		this.x = this.resetPosCoords.x;
		this.y = this.resetPosCoords.y;
		this.curVel.x = 0;
		this.curVel.y = 0;
	},
});