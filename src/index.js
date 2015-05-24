var PIXIRenderer = require("./PIXIRenderer.js");
//var EmitterController = require("./controller").EmitterController;
//var LifeController = require("./controller").LifeController;
//var PositionController = require("./controller").PositionController;
//var SizeController = require("./controller").SizeController;
//var ColorController = require("./controller").ColorController;
var test = require("./fileTest.js");

var Menu = require("./view/menu").Menu;

window.addEventListener("load", function() {

	var stage = new PIXI.Container();
	var renderer = new PIXI.WebGLRenderer(window.innerWidth / 2, window.innerHeight - 100);
	document.body.appendChild(renderer.view);

	PIXI.loader.add("assets/spritesheet.json");
	PIXI.loader.once("complete", onLoaded);
	PIXI.loader.load();

	function onLoaded() {
		var stats = new Stats();
		stats.domElement.style.position = "absolute";
		stats.domElement.style.left = "0px";
		stats.domElement.style.top = "0px";
		document.body.appendChild(stats.domElement);

		var config = {
			texture: PIXI.Texture.fromFrame("sparkle.png")
		};

		var image = PIXI.Sprite.fromFrame("sparkle.png");
		stage.addChild(image);

		image.x = 250;
		image.y = 150;
		image.scale.set(2, 2);

		var fileInput = {
			loadFile: function() {
				test(stage);
			}
		};


		var gui = new dat.GUI();
		var menu = new Menu(gui);
		//gui.add(fileInput, "loadFile").name("Load file");
		//var color = new dat.GUI();
		//
		//var emitterController = new EmitterController(gui);
		//var emitter = emitterController.emitter;
		//
		//var controllers = [
		//	new LifeController(gui),
		//	new PositionController(gui),
		//	new SizeController(gui),
		//	new ColorController(color)
		//];
		//
		//for (var i = 0; i < controllers.length; ++i) {
		//	emitter.behaviours.add(controllers[i].behaviour);
		//}
		//
		//var pixiRenderer = new PIXIRenderer(emitter, config);
		//stage.addChild(pixiRenderer);
		//pixiRenderer.x = 150;
		//pixiRenderer.y = 50;

		PIXI.ticker.shared.add(function() {
			stats.begin();
			renderer.render(stage);
			stats.end();
		}, this);
	}
});



