
var MainView = require("./view").MainView;

window.addEventListener("load", function() {

	PIXI.loader.add("assets/spritesheet.json");
	PIXI.loader.once("complete", onLoaded);
	PIXI.loader.load();

	function onLoaded() {
		var emitter = new jupiter.Emitter();


		console.log(jupiter);
		var mainView = new MainView();
	}
});



