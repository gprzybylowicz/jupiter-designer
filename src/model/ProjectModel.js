var Model = require("./Model.js");
var util = require("../util");

function ProjectModel() {
	Model.call(this);

	this.stageSize = new PIXI.Point(600, 600);
	this.emitter = new jupiter.Emitter();
	this.property("markerPosition", new PIXI.Point(0.5, 0.5));
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
	data.markerPosition = {x: this.markerPosition.x, y: this.markerPosition.y};

	return data;
};

ProjectModel.prototype.deserialize = function(data) {
	this.markerPosition = new PIXI.Point(data.markerPosition.x, data.markerPosition.y);
	this.setEmitterConfig(data.emitterConfig);
};

ProjectModel.prototype.setEmitterConfig = function(config) {
	this.emitter.getParser().read(config);
	this.emit("emitterConfig/changed");
};

Object.defineProperty(ProjectModel.prototype, "markerPositionInStageCoordinates", {
	get: function() {
		return new PIXI.Point(this.markerPosition.x * this.stageSize.x, this.markerPosition.y * this.stageSize.y);
	},
	set: function(value) {
		this.markerPosition = new PIXI.Point(value.x / this.stageSize.x, value.y / this.stageSize.y);
	}
});
module.exports = ProjectModel;