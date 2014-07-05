/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

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
			PC.die();
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
			.attr({w: 75, h: 100, z: 9001});

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
		this.movSpeed = 0.1;
		this.maxVel = 10;
		this.jumpImpulse = -13;
		this.velSlow = 2;		//How quickly velocity decreases when collidedD, higher values are slower
		this.velSlowAir = 20; 	//How quickly velocity decreases when !collidedD, higher values are slower
		this.curVel = [0, 0];
		this.broadphasebox = {x: 0, y: 0, w: 0, h: 0 };
		this.lastDir = "right";
		this.resetPosCoords = { x: 0, y: 0 };
		this.isDead = false;

		var collidedD = false;

		this.requires("Actor, collisionDetection, Keyboard, Delay, Entity")
			.attr({w: 40, h: 90});

		this.spriteObj = Crafty.e("PC_Sprite");
		this.spriteObj.movParent = this;
		this.spriteObj.setOffset();

		this.deathEmitter = Crafty.e("ParticleEmitter");
		this.deathEmitter.movParent = this;
		this.deathEmitter.posOffset = {x: this.w/2, y: this.h/2};

		// ------ Instance_Hitbox ------ //
		this.hitBox_down = Crafty.e("Actor, Color, Collision")
			.attr({ x: this.x, y: this.y, w: this.w - 4, h: 5, z: 101 })
			.color("red")
			.onHit("Solid", function(collData) {
				for (var n = collData.length-1; n > -1; --n) {
					var curObj = collData[n];

					// Make a distincion between the BackGround and Ramp solids, as their collisions are calculated differently
					if (curObj.obj.__c.BackGround) {
						this.color("blue");
						collidedD = true;
					} else if (curObj.obj.__c.Ramp) {
						if ((this.y+this.h) > curObj.obj.getyLinF(this.x) || (this.y+this.h) > curObj.obj.getyLinF(this.x+this.w)) {
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
					this.jump();
				} else if (e.key == Crafty.keys.Q) {
					this.resetPos();
				}
			}
		});
		this.bind("KeyUp", function(e) {
			if (!this.isDead) {
				if (e.key == Crafty.keys.SPACE) {
					if (this.curVel[1] < 0) {
						this.curVel[1] = 0; // Resets y velocity, so max jump height can be controlled
					}
				}
			}
		});

		this.bind("EnterFrame", function(frameData) {
			// ------ PC_Movement ------ //
			if (!this.isDead) {
				if (this.isDown("A")) { //Moving left
					if (this.curVel[0] > -this.maxVel) {
						this.curVel[0] -= this.movSpeed * frameData.dt;
					}
				} else if (this.isDown("D")) { //Moving right
					if (this.curVel[0] < this.maxVel) {
						this.curVel[0] += this.movSpeed * frameData.dt;
					}
				}

				// ----- velocity_x ----- //
				if (this.curVel[0] < -0.1) {
					this.curVel[0] += this.movSpeed/2 * frameData.dt;
				} else if (this.curVel[0] > 0.1) {
					this.curVel[0] -= this.movSpeed/2 * frameData.dt;
				} else {
					this.curVel[0] = 0;
				}
				
				// ----- velocity_y ----- //
				this.curVel[1] += worldGravity * frameData.dt/2; //Gravity

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
	jump: function() {
		this.curVel[1] = this.jumpImpulse;
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
				this.deathEmitter.emitParticles( 40, 60, emitVel = {direction: "randomOmni", x: 4, y: -7, strength: null}, "decelerate", "noCollide", true, 8000, 1, 14, null, "spr_PC_Parachute");
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
	emitParticles: function( emitW, emitH, emitVelIn, gravityTypeIn, emitCollSetting, emitExpire, emitLifeTime, emitDelay, emitCount, colorIn, spriteIn ) {
		this.delay(function() {
			// ---- Set_Optional_Params ---- //
			var emitVelOut = {direction: null, x: null, y: null, strength: null};
			var colorOut = colorIn == null ? null : colorIn;
			var spriteOut = spriteIn == null ? null : spriteIn;

			if (emitVelIn.direction != null) {
				// Find out if emitVelIn.direction is among the list of recognized directions
				if (emitVelIn.direction == "randomOmni") {
					emitVelOut.x = getRandomArbitrary(1, 2);
					emitVelOut.y = getRandomArbitrary(2, 4) * (-1);
					if (Math.random() < 0.5) {
						emitVelOut.x = emitVelOut.x * (-1);
					}
				}
			} else {
				emitVelOut.x = emitVelIn.x == null ? null : emitVelIn.x;
				emitVelOut.y = emitVelIn.y == null ? null : emitVelIn.y;
			}

			if (gravityTypeIn != "default" && gravityTypeIn != "decelerate" && gravityTypeIn != "ignore") {
				var gravityTypeOut = "default";
			} else {
				var gravityTypeOut = gravityTypeIn;
			}

			// ---- Particle_Creation ---- //
			particleList[particleListIndex] = Crafty.e("Particle");
			particleList[particleListIndex].setProperties( this.x, this.y, emitW, emitH, emitVelOut, gravityTypeOut, emitCollSetting, emitExpire, emitLifeTime, colorOut, spriteOut );
			particleListIndex++;
		}, emitDelay, --emitCount);
	},
});

// ------------- Particle ------------- //
Crafty.c("Particle", {
	init: function() {
		this.maxVel = 10;
		this.velSlow = 1;		// How quickly velocity decreases, higher values are faster

		this.curVel = [0, 0];
		this.lifeTime = 1000;	// In ms
		this.expire = true;		// Sets whether particle will die after lifeTime runs out
		this.collisionSetting = "collide"; // Allowed types: dieCollide, noCollide, collide
		this.gravityType = "default"; // Allowed types: default, decelerate, ignore

		this.collObj;			// Object to hold information used in collision detection
		
		this.requires("Actor, Collision");

		this.bind("EnterFrame", function(frameData) {

			// --------- Velocity_Changes --------- //
			// ----- velocity_x ----- //
			if (this.curVel[0] < -0.1) {
				this.curVel[0] += this.velSlow / frameData.dt/2;
			} else if (this.curVel[0] > 0.1) {
				this.curVel[0] -= this.velSlow / frameData.dt/2;
			} else {
				this.curVel[0] = 0;
			}
			
			// ----- velocity_y ----- //
			if (this.gravityType == "default") {
				this.curVel[1] += worldGravity/3 * frameData.dt/2;
			} else if (this.gravityType == "decelerate") {
				if (this.curVel[1] < 1) {
					this.curVel[1] += worldGravity/5 * frameData.dt/2;
				}
			}

			// Apply velocities
			this.x += this.curVel[0];
			this.y += this.curVel[1];

			// --------- lifeTime --------- //
			this.lifeTime -= 1000 / frameData.dt; // 
			if (this.expire == true && this.lifeTime <= 0) {
				this.destroy();
			}
		});
	},

	setProperties: function( xIn, yIn, emitW, emitH, emitVel, gravityTypeIn, emitCollSetting, emitExpire, emitLifeTime, colorIn, spriteIn ) {
		if (emitVel.x) {
			this.curVel[0] = emitVel.x;
		}
		if (emitVel.y) {
			this.curVel[1] = emitVel.y;
		}

		if (colorIn != null) {
			this.requires("Color");
			this.color(colorIn);
		}

		// If there is a sprite given, assign the sprite to this
		if (spriteIn != null) {
			this.requires("SpriteAnimation, " + spriteIn);
			// If the sprite is recognized here, it will automatically play the correct animation at creation
			// ---- Recognized_Sprites_List ---- //
			if (spriteIn == "spr_PC_Parachute") {
				this.reel("parachute_00r", 2000, 0, 0, 18);
				this.reel("parachute_00l", 2000, 0, 1, 18);
				if (emitVel.x < 0) {
					this.animate("parachute_00l", 1);
				} else {
					this.animate("parachute_00r", 1);
				}
			}
		}

		this.x = xIn - emitW/2;
		this.y = yIn - emitH/2;
		this.w = emitW;
		this.h = emitH;
		this.collisionSetting = emitCollSetting;
		this.gravityType = gravityTypeIn;
		this.expire = emitExpire;
		this.lifeTime = emitLifeTime;
	},
});

// ------------- BlockDoor ------------- //
Crafty.c("BlockDoor", {
	init: function() {
		this.resetPosCoords = { x: 0, y: 0 };
		this.requires("Actor, spr_BlockDoor")
			.attr({ w: 128, h: 180});

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
			.attr({ w: 100, h: 200});
		this.resetPosCoords = { x: this.x, y: this.y };
		var thisParent = this;
		this.reel("unfold_00r", 500, 0, 0, 9);
		this.reel("unfold_00l", 500, 0, 1, 9);
		this.isActive = false;

		this.hitBox = Crafty.e("Actor, Collision, Color")
			.attr({ w: this.w - 10, h: 10 })
			.color("red")
			.onHit("PC", function(collData) {
				this.color("blue");
				thisParent.activate();
				collData[0].obj.setResetPos(thisParent.x, thisParent.y);
			}, function() {
				this.color("red");
			});
	},

	activate: function() {
		if (!this.isActive) {
			this.isActive = true;
			this.animate("unfold_00r", 1);
		}
	},
});

// ------------- Spike_Ball_Sprite ------------- //
Crafty.c("Spike_Ball_Sprite", {
	init: function() {
		this.movParent = null;
		this.offset = { x: 0, y: 0 };
		this.rotationSpeed = 10;

		this.requires("Actor, SpriteAnimation, spr_spikeBall_01")
			.attr({w: 150, h: 150, z: 8000});

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
			.attr({ w: 70, h: 70 });
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
			PC.die();
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
			this.spriteObj.rotation += this.spriteObj.rotationSpeed * (frameData.dt/100);

			// Apply velocities
			this.x += this.curVel[0];
			this.y += this.curVel[1];
		});
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