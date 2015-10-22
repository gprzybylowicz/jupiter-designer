var projectModel = require("../model").projectModel;
var emissionModel = require("../model").emissionModel;
var service = require("../service");
var util = require("../util");

function EmissionController() {
	util.bind(this);
	service.msg.on("emission/change", this.onEmissionChanged);

	this.setEmissionByName(jupiter.EmissionTypes.DEFAULT);
}

EmissionController.prototype.onEmissionChanged = function(name) {
	if (projectModel.emitter.emitController.getName() !== name) {
		this.setEmissionByName(name);
	}
};

EmissionController.prototype.setEmissionByName = function(name) {
	var newController = emissionModel.getEmissionByName(name);
	projectModel.emitter.emitController = newController;
	projectModel.emitter.reset();
};

module.exports = EmissionController;
