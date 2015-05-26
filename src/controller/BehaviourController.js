var projectModel = require("../model").projectModel;
var behaviourModel = require("../model").behaviourModel;

function BehaviourController() {
	projectModel.emitter.behaviours.add(behaviourModel.lifeBehaviour);
}

BehaviourController.prototype.enableBehaviour = function(behaviour) {
	projectModel.emitter.behaviours.add(behaviour);
};

BehaviourController.prototype.disableBehaviour = function(behaviour) {

};

module.exports = BehaviourController;
