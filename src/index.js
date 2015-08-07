var MainView = require("./view").MainView;
var texturesModel = require("./model").texturesModel;

window.addEventListener("load", function() {

	PIXI.loader.add("assets/spritesheet.json");
	PIXI.loader.add(texturesModel.getTextureUrls());
	PIXI.loader.once("complete", onLoaded);
	PIXI.loader.load();

	function onLoaded() {
		texturesModel.setDefaultTexture();
		var emitter = new jupiter.Emitter();

		console.log(jupiter);
		var mainView = new MainView();
	}
});



