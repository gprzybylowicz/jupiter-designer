var file = require("../service").file;
var msg = require("../service").msg;
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;

function ProjectMenuController() {
	//this.loadPredefined();
	msg.on("position/changed", this.onPositionChanged, this);
}

ProjectMenuController.prototype.saveProject = function() {

};

ProjectMenuController.prototype.loadProject = function() {

};

ProjectMenuController.prototype.export = function() {
	var parser = new jupiter.ConfigParser();
	file.saveAsJson("particle_config", parser.write(projectModel.emitter));
};

ProjectMenuController.prototype.load = function() {

};

ProjectMenuController.prototype.reset = function() {

};

ProjectMenuController.prototype.loadPredefined = function() {
	var current = predefinedModel.getCurrent();
	var parser = new jupiter.ConfigParser();
	projectModel.emitter = parser.read(current);

};

ProjectMenuController.prototype.onPositionChanged = function() {
    console.log("position/changed");
};

module.exports = ProjectMenuController;