var ProjectMenuController = require("./menu/ProjectMenuController.js");
var TextureMenuController = require("./menu/TextureMenuController.js");
var BackgroundMenuController = require("./menu/BackgroundMenuController.js");
var BehaviourController = require("./BehaviourController.js");

module.exports = {
	projectMenuController: new ProjectMenuController(),
	textureMenuController: new TextureMenuController(),
	backgroundMenuController: new BackgroundMenuController(),
	behaviourController: new BehaviourController()
};