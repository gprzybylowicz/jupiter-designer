var ProjectMenuController = require("./ProjectMenuController.js");
var TextureMenuController = require("./TextureMenuController.js");
var BackgroundMenuController = require("./BackgroundMenuController.js");
var BehaviourController = require("./BehaviourController.js");

module.exports = {
	projectMenuController: new ProjectMenuController(),
	textureMenuController: new TextureMenuController(),
	backgroundMenuController: new BackgroundMenuController(),
	behaviourController: new BehaviourController()
};