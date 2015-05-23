var ProjectMenuController = require("./menu/ProjectMenuController.js");
var TextureMenuController = require("./menu/TextureMenuController.js");

module.exports = {
	projectMenuController: new ProjectMenuController(),
	textureMenuController: new TextureMenuController(),

	//todo: deprecated - to remove
	ColorController: require("./ColorController.js"),
	LifeController: require("./LifeController.js"),
	PositionController: require("./PositionController.js"),
	SizeController: require("./SizeController.js"),
	EmitterController: require("./EmitterController.js")
};