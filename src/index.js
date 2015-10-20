var MainView = require("./view").MainView;
var texturesModel = require("./model").texturesModel;
var predefinedModel = require("./model").predefinedModel;

window.addEventListener("load", function() {

	//todo: extract
	PIXI.loader.use(function(resource, next) {
		if ((/\.(jup)$/i).test(resource.name)) {
			var start = resource.name.lastIndexOf("/") + 1;
			var end = resource.name.lastIndexOf(".");
			predefinedModel.add(resource.name.substring(start, end), JSON.parse(resource.data));
		}

		next();
	});
	PIXI.loader.add("assets/spritesheet.json");
	PIXI.loader.add(texturesModel.getTextureUrls());
	PIXI.loader.add(predefinedModel.getConfigUrls());
	PIXI.loader.once("complete", onLoaded);
	PIXI.loader.load();


	console.log(jupiter);
	function onLoaded() {
		texturesModel.setDefaultTexture();
		var mainView = new MainView();
	}
});



