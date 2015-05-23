var ProjectMenuController = require("./ProjectMenuController.js");

module.exports = {
	projectMenuController: new ProjectMenuController(),

	//todo: deprecated - to remove
	ColorController: require("./ColorController.js"),
	LifeController: require("./LifeController.js"),
	PositionController: require("./PositionController.js"),
	SizeController: require("./SizeController.js"),
	EmitterController: require("./EmitterController.js")
};