/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

// ------------- collisionDetection ------------- //
Crafty.c("collisionDetection", {
	updateBroadphasebox: function() {
		var xVel = this.curVel[0];
		var yVel = this.curVel[1];
		this.broadphasebox.x = xVel >= 0 ? this.x + xVel : this.x + xVel*2;
		this.broadphasebox.y = yVel >= 0 ? this.y + yVel : this.y + yVel*2;
		this.broadphasebox.w = xVel >= 0 ? this.w + xVel : this.w - xVel;
		this.broadphasebox.h = yVel >= 0 ? this.h + yVel : this.h - yVel;
	},

	// Attempts to predict this object's location in the next frame and prevent collisions beforehand
	// Uses the swept method, to deal with very fast objects
	checkCollisionSweptAABB: function(obj) {
		// Declare vars
		var xVel = this.curVel[0];
		var yVel = this.curVel[1];

		var xNext = this.x + xVel;
		var yNext = this.y + yVel;

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
			a = ((yNext - this.y) / (xNext - this.x));

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
					}
				} else if (xLinF2 >= objL && xLinF2 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from above
					if (obj.isFloor) {
						this.respondToCollision(obj, "isFloor");
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
					}
				} else if (xLinF0 >= objL && xLinF0 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from below
					if (obj.isCeiling) {
						this.respondToCollision(obj, "isCeiling");
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
					}
				} else if (xLinF2 >= objL && xLinF2 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from above
					if (obj.isFloor) {
						this.respondToCollision(obj, "isFloor");
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
					}
				} else if (xLinF0 >= objL && xLinF0 <= objR || xLinF1 >= objL && xLinF1 <= objR) { // Coming from below
					if (obj.isCeiling) {
						this.respondToCollision(obj, "isCeiling");
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
					}
				}
			} else if (yVel < 0) {
				// ---- Up ---- //
				// Resolve collisions
				if (r-2 >= objL && l+2 <= objR) { // Coming from below
					if (obj.isCeiling) {
						this.respondToCollision(obj, "isCeiling");
					}
				}
			}
		}
	},

	checkCollisionSweptRamp: function(obj) {
		// Declare vars
		var xVel = this.curVel[0];
		var yVel = this.curVel[1];

		var xNext = this.x + xVel;
		var yNext = this.y + yVel;

		var thisR = xNext + this.w,
			thisB = yNext + this.h;

		// Formulas
		// a = (y2-y1) / (x2-x1)
		// b = y1 - ax1 or b = y2 - ax2
		// y = ax + b
		// x = (y - b) / a

		// Find obj type
		if (obj.isBL) {
			if (this.x >= obj.x && this.x <= obj.x + obj.w - 2) {
				if (thisB > obj.getyLinF(this.x)) {
					this.respondToCollision(obj, "isRampBL");
				}
			}
		} else if (obj.isBR) {
			if (thisR >= obj.x + 2 && thisR <= obj.x + obj.w) {
				if (yNext + this.h > obj.getyLinF(thisR)) {
					this.respondToCollision(obj, "isRampBR");
				}
			}
		} else if (obj.isTL) {
			if (this.x >= obj.x && this.x < obj.x + obj.w) {
				if (yNext < obj.getyLinF(xNext)) {
					this.respondToCollision(obj, "isRampTL");
				}
			}
		} else if (obj.isTR) {
			if (thisR > obj.x && thisR <= obj.x + obj.w) {
				if (yNext < obj.getyLinF(thisR)) {
					this.respondToCollision(obj, "isRampTR");
				}
			}
		}
	},
});

// ------------- Debug Text ------------- //
Crafty.c("text_debug", {
	init: function() {
		this.requires("2D, DOM, Text")
			.attr({ w: 800, h: 20 })
			.textFont($text_css);
	},
});

// ------------- Actor ------------- //
Crafty.c("Actor", {
	init: function() {
		this.requires("2D, Canvas");
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
		this.requires("Actor, Solid, Trim, SpriteAnimation, spr_solidBlocks_trims_02");
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

// ------------- dotThing ------------- //
Crafty.c("dotThing", {
	init: function() {
		this.requires("Actor, Color")
			.attr({ w: 4, h: 4 })
			.color("red");
	},
});

// ------------- Hazard_Block ------------- //
Crafty.c("Hazard_Block", {
	init: function() {
		this.requires("Actor, Color, Collision")
			.color("rgb(255, 100, 100)");
		this.onHit("PC", function(collData) {
			var curObj = collData[0].obj;
			curObj.die();
		}, function() {
			// 
		});
	},
});

// ------------- Player_Character_Sprite ------------- //
Crafty.c("PC_Sprite", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };

		this.requires("Actor, SpriteAnimation, spr_PC")
			.attr({w: (70 * worldScale), h: (95 * worldScale), z: 9001});

		// ------ Define_Animations ------ //
		this.reel("PC_Idle00r", 2000, 0, 0, 47)		//Idle, facing right
			.reel("PC_Idle00l", 2000, 0, 1, 47)		//Idle, facing left
			.reel("PC_Walk00r", 1000, 0, 6, 23)		//Walking, facing right
			.reel("PC_Walk00l", 1000, 0, 7, 23)		//Walking, facing left
			.reel("PC_Run00r", 500, 0, 2, 11)		//Running, facing right
			.reel("PC_Run00l", 500, 0, 3, 11)		//Running, facing left
			.reel("PC_Jump00r_st", 500, 0, 4, 12)	//Jumping start, facing right
			.reel("PC_Jump00l_st", 500, 0, 5, 12)	//Jumping start, facing left
			.reel("PC_Jump00r_mid", 1000, 12, 4, 1)	//Falling, facing right
			.reel("PC_Jump00l_mid", 1000, 12, 5, 1)	//Falling, facing left
			.reel("PC_Bloat00r", 750, 0, 8, 18)		//Bloating, facing right
			.reel("PC_Bloat00l", 750, 0, 9, 18)		//Bloating, facing left
			.reel("PC_Invisible", 2000, 47, 3, 1);	//An unused spot in the tilemap

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},

	setOffset: function() {
		if (this.movParent != null) {
			this.offset.x = (this.w - this.movParent.w) / 2;
			this.offset.y = (this.h - this.movParent.h) / 2;
		} else {
			console.log("No movparent for PC_Sprite, can't set offset!");
		}
	},
});

// ------------- Player_Character ------------- //
Crafty.c("PC", {
	init: function() {
		this.movSpeed = (40 * worldScale);
		this.maxVel = (10 * worldScale);
		this.jumpImpulse = (-12.5 * worldScale);
		this.velSlow = (2 * worldScale);		//How quickly velocity decreases when collidedD, higher values are slower
		this.velSlowAir = (20 * worldScale); 	//How quickly velocity decreases when !collidedD, higher values are slower
		this.curVel = [0, 0];
		this.broadphasebox = {x: 0, y: 0, w: 0, h: 0 };
		this.lastDir = "right";
		this.resetPosCoords = { x: 0, y: 0 };
		this.isDead = false;
		this.canJump = true;

		var collidedD = false;

		this.requires("Actor, collisionDetection, Keyboard, Delay, Entity")
			.attr({w: (35 * worldScale), h: (85 * worldScale)});

		this.spriteObj = Crafty.e("PC_Sprite");
		this.spriteObj.movParent = this;
		this.spriteObj.setOffset();

		this.deathEmitter = Crafty.e("ParticleEmitter");
		this.deathEmitter.movParent = this;
		this.deathEmitter.posOffset = {x: this.w/2, y: this.h/2};

		this.feetDustEmitter = Crafty.e("ParticleEmitter");
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
					if (curObj.__c.BackGround) {
						this.color("blue");
						collidedD = true;
					} else if (curObj.__c.Ramp) {
						if ((this.y+this.h) > curObj.getyLinF(this.x) || (this.y+this.h) > curObj.getyLinF(this.x+this.w)) {
							this.color("blue");
							collidedD = true;
						}
					} else {
						this.color("red");
						collidedD = false;
					}
				}
			}, function() {
				this.color("red");
				collidedD = false;
			});

		// ------ Key_inputs ------ //
		this.bind("KeyDown", function(e) {
			if (!this.isDead) {
				if (e.key == Crafty.keys.SPACE && collidedD == true)  {
					this.jump(this.jumpImpulse);
				} else if (e.key == Crafty.keys.Q) {
					this.resetPos();
				} else if (e.key == Crafty.keys.S) {
					this.canJump = false;
				}
			}
		});
		this.bind("KeyUp", function(e) {
			if (!this.isDead) {
				if (e.key == Crafty.keys.SPACE) {
					if (this.curVel[1] < 0) {
						this.curVel[1] = 0; // Resets y velocity, so max jump height can be controlled
					}
				} else if (e.key == Crafty.keys.S) {
					this.canJump = true;
				}
			}
		});

		this.bind("EnterFrame", function(frameData) {
			// ------ PC_Movement ------ //
			if (!this.isDead) {
				if (this.isDown("A")) { //Moving left
					if (this.curVel[0] > -this.maxVel) {
						this.curVel[0] -= this.movSpeed / frameData.dt;
					}
				} else if (this.isDown("D")) { //Moving right
					if (this.curVel[0] < this.maxVel) {
						this.curVel[0] += this.movSpeed / frameData.dt;
					}
				}

				// ----- velocity_x ----- //
				if (this.curVel[0] < -0.1) {
					this.curVel[0] += (this.movSpeed/2) / frameData.dt;
				} else if (this.curVel[0] > 0.1) {
					this.curVel[0] -= (this.movSpeed/2) / frameData.dt;
				} else {
					this.curVel[0] = 0;
				}
				
				// ----- velocity_y ----- //
				this.curVel[1] += (worldGravity * worldScale) * frameData.dt/2; //Gravity

				// ---- Collision_Detection ---- //
				this.updateBroadphasebox();
				for (var i = solidBlockList.length-1; i > -1; --i) {
					var tile = solidBlockList[i];
					if (tile.x+tile.w > this.broadphasebox.x && tile.x < this.broadphasebox.x+this.broadphasebox.w) {
						if (tile.y+tile.h > this.broadphasebox.y && tile.y < this.broadphasebox.y+this.broadphasebox.h) {
							this.checkCollisionSweptAABB(tile);
						}
					}
				}
				for (var i = solidRampList.length-1; i > -1; --i) {
					var rampTile = solidRampList[i];
					if (rampTile.x+rampTile.w > this.broadphasebox.x && rampTile.x < this.broadphasebox.x+this.broadphasebox.w) {
						if (rampTile.y+rampTile.h > this.broadphasebox.y && rampTile.y < this.broadphasebox.y+this.broadphasebox.h) {
							this.checkCollisionSweptRamp(rampTile);
						}
					}
				}

				// ------ Set_Last_Movement_Direction ------ //
				if (this.curVel[0] > 0) {
					this.lastDir = "right";
				} else if (this.curVel[0] < 0) {
					this.lastDir = "left";
				}
				// ------ Play_Animations ------ //
				if (collidedD && !this.spriteObj.isPlaying("PC_Jump00r_st") && !this.spriteObj.isPlaying("PC_Jump00l_st")) {
					if (this.curVel[0] > 0 && !this.spriteObj.isPlaying("PC_Run00r")) {
						this.spriteObj.animate("PC_Run00r", 1);
					} else if (this.curVel[0] < 0 && !this.spriteObj.isPlaying("PC_Run00l")) {
						this.spriteObj.animate("PC_Run00l", 1);
					} else if (this.curVel[0] == 0) {
						if (this.lastDir == "right" && !this.spriteObj.isPlaying("PC_Idle00r")) {
							this.spriteObj.animate("PC_Idle00r", 1);
						} else if (this.lastDir == "left" && !this.spriteObj.isPlaying("PC_Idle00l")) {
							this.spriteObj.animate("PC_Idle00l", 1);
						}
					}
				} else {
					if (this.curVel[1] > 0) {
						if (this.lastDir == "right" && !this.spriteObj.isPlaying("PC_Jump00r_mid")) {
							this.spriteObj.animate("PC_Jump00r_mid", 1);
						} else if (this.lastDir == "left" && !this.spriteObj.isPlaying("PC_Jump00l_mid")) {
							this.spriteObj.animate("PC_Jump00l_mid", 1);
						}
					}
				}
			}

			// ------ Update_Hitbox ------ //
			this.hitBox_down.x = (this.x + 2) + this.curVel[0];
			this.hitBox_down.y = (this.y + this.h) + this.curVel[1];

			// ---- Apply_Velocities ---- //
			this.x += this.curVel[0];
			this.y += this.curVel[1];
		});
	},

	// Makes the player jump and play the according anim
	jump: function(jumpImpulseIn) {
		this.curVel[1] = jumpImpulseIn;
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
				this.curVel[0] = -0.5;
				this.curVel[1] = -1;
				// Animate this
				this.spriteObj.animate("PC_Bloat00r", 1);
			} else if (this.lastDir == "left") {
				// Make this float in the opposite direction
				this.curVel[0] = 0.5;
				this.curVel[1] = -1;
				// Animate this
				this.spriteObj.animate("PC_Bloat00l", 1);
			}

			// Delay the invisibility
			this.delay(function() {
				this.spriteObj.animate("PC_Invisible", 1);
				this.curVel[0] = 0;
				this.curVel[1] = 0;
			}, 900, 0);
			// Delay the deathEmitter
			this.delay(function() {
				// this.deathEmitter.emitParticles( (40 * worldScale), (60 * worldScale), emitVel = { direction: "randomUpWideBurst", strength: 1 }, "fall", "noCollide", true, 8000, 1, 14, null, "spr_PC_Parachute", 0);
				this.deathEmitterSettings = { emitW: (40 * worldScale), emitH: (60 * worldScale), emitDir: "randomUpWideBurst", emitStrength: 1, gravityType: "slowFall", emitCollSetting: "noCollide", emitExpire: true, emitLifeTime: 5000, sprite: "spr_PC_Parachute", fadeOutTime: 2000 };
				this.deathEmitter.emitParticles( this.deathEmitterSettings, 1, 12);
			}, 650, 0);
			// Delay resetPos
			this.delay(function() {
				this.resetPos();
				this.isDead = false;
			}, 3000, 0);
		}
	},

	resetPos: function() {
		this.x = this.resetPosCoords.x;
		this.y = this.resetPosCoords.y;
		this.curVel[0] = 0;
		this.curVel[1] = 0;
	},

	setResetPos: function(xIn, yIn) {
		this.resetPosCoords.x = xIn;
		this.resetPosCoords.y = yIn - 10;
	},

	respondToCollision: function(obj, objDirType) {
		var objL = obj.x,
			objR = obj.x + obj.w,
			objT = obj.y,
			objB = obj.y + obj.h;

		if (objDirType == "isWallL") { // SolidBlocks
			this.curVel[0] = 0;
			this.x = objL - this.w;
		} else if (objDirType == "isWallR") {
			this.curVel[0] = 0;
			this.x = objR;
		} else if (objDirType == "isCeiling") {
			this.curVel[1] = 0;
			this.y = objB;
		} else if (objDirType == "isFloor") {
			if (this.curVel[1] > 8) {
				// this.feetDustEmitter.emitParticles( (6 * worldScale), (6 * worldScale), emitVel = { direction: "randomUpNarrowBurst", strength: 1 }, "decelerate", "noCollide", true, 1000, 1, 14, "rgb(183, 163, 139)", null, 65);
			}
			this.curVel[1] = 0;
			this.y = objT - this.h;

		} else if (objDirType == "isRampBL") { // Ramps
			this.curVel[1] = 0;
			this.y = obj.getyLinF(this.x + this.curVel[0]) - this.h;
		} else if (objDirType == "isRampBR") {
			this.curVel[1] = 0;
			this.y = obj.getyLinF(this.x + this.w + this.curVel[0]) - this.h;
		} else if (objDirType == "isRampTL") {
			this.curVel[1] = 0;
			this.y = obj.getyLinF(this.x + this.curVel[0]);
		} else if (objDirType == "isRampTR") {
			this.curVel[1] = 0;
			this.y = obj.getyLinF(this.x + this.w + this.curVel[0]);
		}
	},
});

// ------------- ParticleEmitter ------------- //
var particleList = [];
var particleListIndex = 0;
Crafty.c("ParticleEmitter", {
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

			if (emitSettingsIn.emitDir != null) {
				// Find out if emitVelIn.direction is among the list of recognized directions
				if (emitSettingsIn.emitDir == "randomUpWideBurst") {
					emitVelOut.x = getRandomArbitrary((1 * emitSettingsIn.emitStrength), (2 * emitSettingsIn.emitStrength));
					emitVelOut.y = getRandomArbitrary((2 * emitSettingsIn.emitStrength), (4 * emitSettingsIn.emitStrength)) * (-1);
					if (Math.random() < 0.5) {
						emitVelOut.x = emitVelOut.x * (-1);
					}
				} else if (emitSettingsIn.emitDir == "randomUpNarrowBurst") {
					emitVelOut.x = getRandomArbitrary((0 * emitSettingsIn.emitStrength), (2 * emitSettingsIn.emitStrength));
					emitVelOut.y = getRandomArbitrary((0 * emitSettingsIn.emitStrength), (1 * emitSettingsIn.emitStrength)) * (-1);
					if (Math.random() < 0.5) {
						emitVelOut.x = emitVelOut.x * (-1);
					}
				}
			} else if (emitSettingsIn.emitVelX && emitSettingsIn.emitVelY) {
				emitVelOut.x = emitSettingsIn.emitVelX;;
				emitVelOut.y = emitSettingsIn.emitVelY;
			} else {
				emitVelOut.x = 0;
				emitVelOut.y = 0;
			}

			if (emitSettingsIn.gravityType != "decelerate" && emitSettingsIn.gravityType != "slowFall") {
				var gravityTypeOut = "ignore";
			} else {
				var gravityTypeOut = emitSettingsIn.gravityType;
			}

			// ---- Particle_Creation ---- //
			var propertiesOut = { x: this.x, y: this.y, w: emitSettingsIn.emitW, h: emitSettingsIn.emitH, xVel: emitVelOut.x, yVel: emitVelOut.y, gravityType: gravityTypeOut, collSetting: emitSettingsIn.emitCollSetting, expire: emitSettingsIn.emitExpire, lifeTime: emitSettingsIn.emitLifeTime, color: colorOut, sprite: spriteOut, rotationSpeed: rotationSpeedOut, fadeOutTime: fadeOutTimeOut, fadeInTime: fadeInTimeOut };
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

		this.curVel = [0, 0];
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
			// ---- Initial_Fade_In ---- //
			if (this.fadeInTime > 0) {
				this.framesToFadeIn = (this.fadeInTimeInitial / frameData.dt);
				this.alpha += (1 / this.framesToFadeIn);
				this.fadeInTime -= 1000 * (frameData.dt/1000);
			}

			// --------- Velocity_Changes --------- //
			// ----- Velocity_x ----- //
			if (this.curVel[0] < -0.1) {
				this.curVel[0] += this.velSlow * (frameData.dt/1000);
			} else if (this.curVel[0] > 0.1) {
				this.curVel[0] -= this.velSlow * (frameData.dt/1000);
			} else {
				this.curVel[0] = 0;
			}
			
			// ----- Velocity_y ----- //
			if (this.gravityType == "slowFall") {
				if (this.curVel[1] < 1) {
					this.curVel[1] += worldGravity*50 * (frameData.dt/1000);
				}
			} else if (this.gravityType == "decelerate") {
				this.curVel[0] -= (this.curVel[0]/25);
				this.curVel[1] -= (this.curVel[1]/25);
			}

			// ---- Apply_Velocities ---- //
			this.x += this.curVel[0];
			this.y += this.curVel[1];

			// --------- LifeTime --------- //
			if (this.expire == true && this.fadeInTime <= 0) {
				this.lifeTime -= 1000 * (frameData.dt/1000);
				if (this.lifeTime <= 0) {
					// ---- Fade_Out ---- //
					this.framesToFadeOut = (this.fadeOutTimeInitial / frameData.dt);
					this.alpha -= (1 / this.framesToFadeOut);
					this.fadeOutTime -= 1000 * (frameData.dt/1000);
					if (this.fadeOutTime <= 0) {
						this.destroy();
					}
				}
			}

			// --------- rotation --------- //
			this.rotation += this.rotationSpeed * (frameData.dt/1000);
		});
	},

	setProperties: function( propertiesIn ) {
		if (propertiesIn.xVel) {
			this.curVel[0] = propertiesIn.xVel;
		}
		if (propertiesIn.yVel) {
			this.curVel[1] = propertiesIn.yVel;
		}

		if (propertiesIn.color != null) {
			this.requires("Color");
			this.color(propertiesIn.color);
		}

		// If there is a sprite given, assign the sprite to this
		if (propertiesIn.sprite != null) {
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

		this.x = propertiesIn.x - propertiesIn.w/2;
		this.y = propertiesIn.y - propertiesIn.h/2;
		this.w = propertiesIn.w;
		this.h = propertiesIn.h;
		this.rotationSpeed = propertiesIn.rotationSpeed;
		this.collisionSetting = propertiesIn.collSetting;
		this.gravityType = propertiesIn.gravityType;
		this.expire = propertiesIn.expire;
		this.lifeTime = propertiesIn.lifeTime;
		this.fadeOutTime = propertiesIn.fadeOutTime;
		this.fadeInTime = propertiesIn.fadeInTime;
		this.fadeOutTimeInitial = propertiesIn.fadeOutTime;
		this.fadeInTimeInitial = propertiesIn.fadeInTime;
		if (this.fadeInTime > 0) {
			this.alpha = 0;
		}
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

		this.hitBox = Crafty.e("Actor, Collision, Color")
			.attr({ w: this.w - 10, h: 10 })
			.color("red")
			.onHit("PC", function(collData) {
				var curObj = collData[0].obj;
				this.color("blue");
				thisParent.activate(curObj);
			}, function() {
				this.color("red");
			});
	},

	activate: function(curObjIn) {
		if (!this.isActive) {
			this.isActive = true;
			this.animate("unfold_00r", 1);
			curObjIn.setResetPos(this.x, (this.y + this.h - curObjIn.h - 10));
		}
	},
});

// ------------- Spike_Ball_Sprite ------------- //
Crafty.c("Spike_Ball_Sprite", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.rotationSpeed = 90;

		this.requires("Actor, SpriteAnimation, spr_spikeBall_01")
			.attr({ w: (150 * worldScale), h: (150 * worldScale), z: 8000 });

		this.bind("EnterFrame", function(frameData) {
			// ------ Update_This ------ //
			if (this.movParent != null) {
				this.x = this.movParent.x - this.offset.x;
				this.y = this.movParent.y - this.offset.y;
			}
		});
	},

	setOffset: function() {
		if (this.movParent != null) {
			this.offset.x = (this.w - this.movParent.w) / 2;
			this.offset.y = (this.h - this.movParent.h) / 2;
		} else {
			console.log("No movparent for sprite, can't set offset!");
		}
	},
});

// ------------- Spike_Ball ------------- //
Crafty.c("Spike_Ball", {
	init: function() {
		this.requires("Actor, collisionDetection, Collision")
			.attr({ w: (70 * worldScale), h: (70 * worldScale) });
		this.curVel = [2, 0];
		this.resetVel = [2, 0];
		this.resetPosCoords = { x: 0, y: 0};
		this.broadphasebox = {x: 0, y: 0, w: 0, h: 0 };
		this.collType = "float"; // Allowed: float, roll, bounce

		this.spriteObj = Crafty.e("Spike_Ball_Sprite");
		this.spriteObj.movParent = this;
		this.spriteObj.setOffset();
		this.spriteObj.origin("center");

		this.onHit("PC", function(collData) {
			var curObj = collData[0].obj;
			curObj.die();
		}, function() {
			// 
		});

		this.bind("KeyDown", function(e) {
			if (e.key == Crafty.keys.Q) {
				this.resetPos();
			}
		});

		this.bind("EnterFrame", function(frameData) {
			// ---- Collision_Detection ---- //
			this.updateBroadphasebox();
			for (var i = solidBlockList.length-1; i > -1; --i) {
				var tile = solidBlockList[i];
				if (tile.x+tile.w > this.broadphasebox.x && tile.x < this.broadphasebox.x+this.broadphasebox.w) {
					if (tile.y+tile.h > this.broadphasebox.y && tile.y < this.broadphasebox.y+this.broadphasebox.h) {
						this.checkCollisionSweptAABB(tile);
					}
				}
			}
			for (var i = solidRampList.length-1; i > -1; --i) {
				var rampTile = solidRampList[i];
				if (rampTile.x+rampTile.w > this.broadphasebox.x && rampTile.x < this.broadphasebox.x+this.broadphasebox.w) {
					if (rampTile.y+rampTile.h > this.broadphasebox.y && rampTile.y < this.broadphasebox.y+this.broadphasebox.h) {
						this.checkCollisionSweptRamp(rampTile);
					}
				}
			}

			// Apply spriteObj rotation
			this.spriteObj.rotation += this.spriteObj.rotationSpeed * (frameData.dt/1000);

			// Apply velocities
			this.x += (this.curVel[0] * worldScale);
			this.y += (this.curVel[1] * worldScale);
		});
	},

	setProperties: function(propertiesIn) {
		this.collType = propertiesIn.collType;
	},

	resetPos: function() {
		this.x = this.resetPosCoords.x;
		this.y = this.resetPosCoords.y;
		this.curVel[0] = this.resetVel[0];
		this.curVel[1] = this.resetVel[1];
	},

	setResetPos: function(xIn, yIn) {
		this.resetPosCoords.x = xIn;
		this.resetPosCoords.y = yIn;
	},

	respondToCollision: function(obj, objDirType) {
		var objL = obj.x,
			objR = obj.x + obj.w,
			objT = obj.y,
			objB = obj.y + obj.h,

			xVel = this.curVel[0],
			yVel = this.curVel[1];

		this.spriteObj.rotationSpeed = -this.spriteObj.rotationSpeed;

		if (objDirType == "isWallL") { // SolidBlocks
			this.curVel[0] = -xVel;
			this.x = objL - this.w;
		} else if (objDirType == "isWallR") {
			this.curVel[0] = -xVel;
			this.x = objR;
		} else if (objDirType == "isCeiling") {
			this.curVel[1] = -yVel;
			this.y = objB;
		} else if (objDirType == "isFloor") {
			this.curVel[1] = -yVel;
			this.y = objT - this.h;

		} else if (objDirType == "isRampBL") { // Ramps
			this.curVel[0] = yVel;
			this.curVel[1] = xVel;
			this.y = obj.getyLinF(this.x) - this.h;
		} else if (objDirType == "isRampBR") {
			this.curVel[0] = -yVel;
			this.curVel[1] = -xVel;
			this.y = obj.getyLinF(this.x + this.w) - this.h;
		} else if (objDirType == "isRampTL") {
			this.curVel[0] = -yVel;
			this.curVel[1] = -xVel;
			this.y = obj.getyLinF(this.x);
		} else if (objDirType == "isRampTR") {
			this.curVel[0] = yVel;
			this.curVel[1] = xVel;
			this.y = obj.getyLinF(this.x + this.w);
		}
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
			.attr({ w: this.w - 10, h: 10 })
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
});

// ------------- ProjectileShooter ------------- //
Crafty.c("ProjectileShooter", {
	init: function() {
		this.requires("Actor, Delay, Entity, SpriteAnimation, spr_projectileShooter_01")
			.attr({ w: (90 * worldScale), h: (90 * worldScale), z: 5000 });
		this.reel("shoot_00r", 1000, 0, 0, 13);
		this.shootVel = 3;
		this.direction = "left"; // Recognized: "left", "right", "up", "down"

		this.delay(function() { // Start animation
			this.animate("shoot_00r", 1);
			this.delay(function() { // Instance projectile at end of animation
				this.shootProjectile();
			}, 700, 0);
		}, 5000, -1); // Loop infinitely
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
			this.shootVel = 3;
		}
	},

	shootProjectile: function() {
		entitiesList[entitiesListIndex] = Crafty.e("Projectile")
			.attr({ x: (this.x + this.w/4), y: (this.y + this.h/4) });
		if (this.direction == "left") {
			entitiesList[entitiesListIndex].curVel = [-this.shootVel, 0];
			entitiesList[entitiesListIndex].rotation = 0;
		} else if (this.direction == "right") {
			entitiesList[entitiesListIndex].curVel = [this.shootVel, 0];
			entitiesList[entitiesListIndex].rotation = 180;
		} else if (this.direction == "up") {
			entitiesList[entitiesListIndex].curVel = [0, -this.shootVel];
			entitiesList[entitiesListIndex].rotation = 90;
		} else if (this.direction == "down") {
			entitiesList[entitiesListIndex].curVel = [0, this.shootVel];
			entitiesList[entitiesListIndex].rotation = 270;
		}
		entitiesListIndex++;
	},
});

// ------------- Projectile ------------- //
Crafty.c("Projectile", {
	init: function() {
		this.requires("Actor, Entity, Collision, collisionDetection, SpriteAnimation, spr_projectile_01")
			.attr({ w: (50 * worldScale), h: (50 * worldScale) });
		this.origin("center");
		this.onHit("PC", function(collData) {
			var curObj = collData[0].obj;
			curObj.die();
		}, function() {
			// 
		});
		this.lifeTime = 0;
		this.curVel = [0, 0];
		this.broadphasebox = {x: 0, y: 0, w: 0, h: 0 };

		this.deathEmitter = Crafty.e("ParticleEmitter");
		this.deathEmitter.movParent = this;
		this.deathEmitter.posOffset = {x: this.w, y: this.h/2};

		this.bind("EnterFrame", function(frameData) {
			// ---- Collision_Detection ---- //
			this.updateBroadphasebox();
			for (var i = solidBlockList.length-1; i > -1; --i) {
				var tile = solidBlockList[i];
				if (tile.x+tile.w > this.broadphasebox.x && tile.x < this.broadphasebox.x+this.broadphasebox.w) {
					if (tile.y+tile.h > this.broadphasebox.y && tile.y < this.broadphasebox.y+this.broadphasebox.h) {
						this.checkCollisionSweptAABB(tile);
					}
				}
			}
			for (var i = solidRampList.length-1; i > -1; --i) {
				var rampTile = solidRampList[i];
				if (rampTile.x+rampTile.w > this.broadphasebox.x && rampTile.x < this.broadphasebox.x+this.broadphasebox.w) {
					if (rampTile.y+rampTile.h > this.broadphasebox.y && rampTile.y < this.broadphasebox.y+this.broadphasebox.h) {
						this.checkCollisionSweptRamp(rampTile);
					}
				}
			}

			// Apply velocities
			this.x += (this.curVel[0] * worldScale);
			this.y += (this.curVel[1] * worldScale);
		});
	},

	respondToCollision: function(obj, objDirType) {
		this.destroy();
	},
});