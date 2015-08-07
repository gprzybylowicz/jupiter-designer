var file = require("../service").file;
var service = require("../service");
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;
var behaviourModel = require("../model").behaviourModel;

function ProjectMenuController() {
	service.msg.on("project/exportConfig", this.onExportConfig, this);
	service.msg.on("project/loadConfig", this.onLoadConfig, this);
	service.msg.on("project/loadPredefined", this.onLoadPredefined, this);
}

ProjectMenuController.prototype.saveProject = function() {

};

ProjectMenuController.prototype.loadProject = function() {

};

ProjectMenuController.prototype.onExportConfig = function() {
	file.saveAsJson("particle_config", projectModel.emitter.getParser().write());
};

ProjectMenuController.prototype.onLoadConfig = function() {
	var reader = new FileReader();
	reader.onload = function() {
		var data = JSON.parse(reader.result);
		this.loadConfig(data);
	}.bind(this);

	reader.readAsText(document.getElementById("load-config").files[0]);
};

ProjectMenuController.prototype.reset = function() {

};

ProjectMenuController.prototype.onLoadPredefined = function(name) {
	this.loadConfig(predefinedModel.getByName(name));
};

ProjectMenuController.prototype.loadConfig = function(config) {
	projectModel.emitter.getParser().read(config);

	var behaviours = projectModel.emitter.behaviours.getAll();
	for (var i = 0; i < behaviours.length; i++) {
		behaviourModel.addBehaviour(behaviours[i]);
	}
	service.msg.emit("emitter/changed");
};

module.exports = ProjectMenuController;