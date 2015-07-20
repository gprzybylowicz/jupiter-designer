var projectModel = require("../model").projectModel;
var behaviourModel = require("../model").behaviourModel;

function BehaviourController() {
	//projectModel.emitter.emitController.emitPerSecond = 30;
	//projectModel.emitter.behaviours.add(behaviourModel.lifeBehaviour);
	//
	//todo: remove it
	//projectModel.emitter.behaviours.add(behaviourModel.positionBehaviour);
	//projectModel.emitter.behaviours.add(behaviourModel.sizeBehaviour);
	//projectModel.emitter.behaviours.add(behaviourModel.colorBehaviour);
}

BehaviourController.prototype.enableBehaviour = function(behaviour) {
	projectModel.emitter.behaviours.add(behaviour);
};

BehaviourController.prototype.disableBehaviour = function(behaviour) {

};

module.exports = BehaviourController;
