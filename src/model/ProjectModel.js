var Model = require("./Model.js");
var util = require("../util");

function ProjectModel() {
	Model.call(this);

	this.emitter = new jupiter.Emitter();
	this.property("markerPosition", new PIXI.Point(0, 0));
}

util.inherit(ProjectModel, Model);

ProjectModel.prototype.hasActiveBehaviour = function(behaviour) {
	var behavious = this.emitter.behaviours.getAll();

	for (var i = 0; i < behavious.length; ++i) {
		if (behavious[i].getName() === behaviour.getName()) {
			return true;
		}
	}

	return false;
};

ProjectModel.prototype.serialize = function() {
	var data = {};
	data.emitterConfig = this.emitter.getParser().write();
	data.markerPosition = {x: this.imagePosition.x, y: this.imagePosition.y};

	return data;
};

ProjectModel.prototype.deserialize = function(data) {
	this.imagePosition = new PIXI.Point(data.imagePosition.x, data.imagePosition.y);
	this.setEmitterConfig(data.emitterConfig);
};

ProjectModel.prototype.setEmitterConfig = function(config) {

	console.log(config);
	this.emitter.getParser().read(config);
	this.emit("emitterConfig/changed");
};

module.exports = ProjectModel;