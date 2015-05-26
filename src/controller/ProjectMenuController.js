var service = require("../service");
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;


function ProjectMenuController() {
	//this.loadPredefined();
}

ProjectMenuController.prototype.saveProject = function() {

};

ProjectMenuController.prototype.loadProject = function() {

};

ProjectMenuController.prototype.export = function() {
	var parser = new jupiter.ConfigParser();
	service.file.saveAsJson("particle_config", parser.write(projectModel.emitter));
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

module.exports = ProjectMenuController;