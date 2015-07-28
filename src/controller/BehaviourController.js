var projectModel = require("../model").projectModel;
var service = require("../service");
var util = require("../util");

function BehaviourController() {
	util.bind(this);
	service.msg.on("behaviour/setEnable", this.onSetEnable);
}

BehaviourController.prototype.onSetEnable = function(enable, behaviour) {
	if (enable) {
		this.enableBehaviour(behaviour);
	}
	else {
		this.disableBehaviour(behaviour);
	}
};

BehaviourController.prototype.enableBehaviour = function(behaviour) {
	if (!projectModel.hasActiveBehaviour(behaviour)) {
		projectModel.emitter.behaviours.add(behaviour);
	}
};

BehaviourController.prototype.disableBehaviour = function(behaviour) {
	var behaviours = projectModel.emitter.behaviours.getAll();
	projectModel.emitter.behaviours.clear();

	for (var i = 0; i < behaviours.length; ++i) {
		if (behaviours[i].getName() !== behaviour.getName()) {
			projectModel.emitter.behaviours.add(behaviours[i]);
		}
	}

};

module.exports = BehaviourController;
