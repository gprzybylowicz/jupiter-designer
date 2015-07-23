var file = require("../service").file;
var service = require("../service");
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;
var behaviourModel = require("../model").behaviourModel;

function ProjectMenuController() {
	//this.loadPredefined();
	//msg.on("position/changed", this.onPositionChanged, this);
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
	projectModel.emitter.getParser().read(current);

	var behaviours = projectModel.emitter.behaviours.getAll();
	for (var i = 0; i < behaviours.length; i++) {
		behaviourModel.addBehaviour(behaviours[i]);
	}
	service.msg.emit("emitter/changed");

	//setTimeout(this.loadPredefined.bind(this), 2000);
};

ProjectMenuController.prototype.onPositionChanged = function() {
	console.log("position/changed");
};

module.exports = ProjectMenuController;