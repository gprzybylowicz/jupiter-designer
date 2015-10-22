var file = require("../service").file;
var service = require("../service");
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;
var behaviourModel = require("../model").behaviourModel;
var emissionModel = require("../model").emissionModel;
var texturesModel = require("../model").texturesModel;
var backgroundModel = require("../model").backgroundModel;

function ProjectMenuController() {
	service.msg.on("project/save", this.onSaveProject, this);
	service.msg.on("project/load", this.onLoadProject, this);
	service.msg.on("project/exportConfig", this.onExportConfig, this);
	service.msg.on("project/loadConfig", this.onLoadConfig, this);
	service.msg.on("project/loadPredefined", this.onLoadPredefined, this);

	projectModel.on("emitterConfig/changed", this.onEmitterConfigChanged, this);
	projectModel.on("emitterConfig/changed", this.refreshEmitController, this);
}

ProjectMenuController.prototype.onLoadProject = function() {
	var reader = new FileReader();
	reader.onload = function() {
		var data = JSON.parse(reader.result);
		this.loadProject(data);

	}.bind(this);

	reader.readAsText(document.getElementById("load-project").files[0]);
};

ProjectMenuController.prototype.loadProject = function(data) {
	projectModel.deserialize(data.project);
	texturesModel.deserialize(data.texture);
	backgroundModel.deserialize(data.background);

	service.msg.emit("project/loaded");
};

ProjectMenuController.prototype.onSaveProject = function() {
	var data = {};
	data.project = projectModel.serialize();
	data.texture = texturesModel.serialize();
	data.background = backgroundModel.serialize();

	file.saveAs("project.jup", data);
};

ProjectMenuController.prototype.onExportConfig = function() {
	file.saveAsJson("particle_config", projectModel.emitter.getParser().write());
};

ProjectMenuController.prototype.onLoadConfig = function() {
	var reader = new FileReader();
	reader.onload = function() {
		projectModel.setEmitterConfig(JSON.parse(reader.result));
	}.bind(this);

	reader.readAsText(document.getElementById("load-config").files[0]);
};

ProjectMenuController.prototype.reset = function() {
	this.onLoadPredefined("radial");
};

ProjectMenuController.prototype.onLoadPredefined = function(name) {
	this.loadProject(predefinedModel.getByName(name));
};
ProjectMenuController.prototype.onEmitterConfigChanged = function() {
	this.refreshBehaviours();
	this.refreshEmitController();
	service.msg.emit("emitter/changed");
};

ProjectMenuController.prototype.refreshBehaviours = function() {
	var behaviours = projectModel.emitter.behaviours.getAll();
	for (var i = 0; i < behaviours.length; i++) {
		behaviourModel.addBehaviour(behaviours[i]);
	}
};

ProjectMenuController.prototype.refreshEmitController = function() {
	emissionModel.addEmission(projectModel.emitter.emitController);
};

module.exports = ProjectMenuController;