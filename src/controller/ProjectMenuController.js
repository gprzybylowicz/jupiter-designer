var file = require("../service").file;
var service = require("../service");
var projectModel = require("../model").projectModel;
var predefinedModel = require("../model").predefinedModel;
var behaviourModel = require("../model").behaviourModel;
var texturesModel = require("../model").texturesModel;
var backgroundModel = require("../model").backgroundModel;

function ProjectMenuController() {
	service.msg.on("project/save", this.onSaveProject, this);
	service.msg.on("project/load", this.onLoadProject, this);
	service.msg.on("project/exportConfig", this.onExportConfig, this);
	service.msg.on("project/loadConfig", this.onLoadConfig, this);
	service.msg.on("project/loadPredefined", this.onLoadPredefined, this);

	projectModel.on("emitterConfig/changed", this.refreshBehaviours);
}

ProjectMenuController.prototype.onLoadProject = function() {
	var reader = new FileReader();
	reader.onload = function() {
		var data = JSON.parse(reader.result);

		projectModel.deserialize(data.project);
		texturesModel.deserialize(data.texture);
		backgroundModel.deserialize(data.background);

		service.msg.emit("project/loaded");
	}.bind(this);

	reader.readAsText(document.getElementById("load-project").files[0]);
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
	this.onLoadPredefined("default");
};

ProjectMenuController.prototype.onLoadPredefined = function(name) {
	projectModel.setEmitterConfig(predefinedModel.getByName(name));
};

ProjectMenuController.prototype.refreshBehaviours = function() {
	var behaviours = projectModel.emitter.behaviours.getAll();
	for (var i = 0; i < behaviours.length; i++) {
		behaviourModel.addBehaviour(behaviours[i]);
	}
	service.msg.emit("emitter/changed");
};

module.exports = ProjectMenuController;