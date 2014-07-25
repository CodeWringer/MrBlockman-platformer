/**
 * Author Nicolas Haase
 * 
 *
 * This code was written on the basis of Crafty, a game engine by Louis Stowasser.
 * The author of this file is not responsible for or involved in the development of the Crafty game engine.
 */

var window_width = 1280,
	window_height = 720,
	
	worldScale = 0.8, // Global var for scaling the game world, use steps of .1, else the game breaks, because uneven numbers won't work
	worldGravity = 600 * worldScale, // Default value
	
	curLevel = 0;

Game = {

	// Initialize and start game
	start: function() {
		// Start crafty and set background color
		Crafty.init(window_width, window_height);
		Crafty.background("rgb(200, 200, 255)");

		// Scene to start with
		Crafty.enterScene("loading");
	},
	
	bindViewport: function(obj) {
		Crafty.bind("EnterFrame", function() {
			Crafty.viewport.y = window_height/2 - (obj.y + obj.h/2); // Viewport y changes
			Crafty.viewport.x = window_width/2 - (obj.x + obj.w/2); // Viewport x changes
		});
	},
};

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
};

$text_css = { "size": "24px", "family": "Arial", "color": "black", "text-align": "center" };