function BehaviourModel() {

	this.behaviours = {};
	this.addBehaviour(new jupiter.LifeBehaviour());
	this.addBehaviour(new jupiter.PositionBehaviour());
	this.addBehaviour(new jupiter.ColorBehaviour());
	this.addBehaviour(new jupiter.SizeBehaviour());
	this.addBehaviour(new jupiter.AngularVelocityBehaviour());
	this.addBehaviour(new jupiter.EmitDirectionBehaviour());
	this.addBehaviour(new jupiter.RotationBehaviour());
}

BehaviourModel.prototype.addBehaviour = function(behaviour) {
	if (this.behaviours[behaviour.getName()]) {
		this.behaviours[behaviour.getName()] = null;
		delete this.behaviours[behaviour.getName()];
	}

	this.behaviours[behaviour.getName()] = behaviour;
};

BehaviourModel.prototype.getBehaviourByName = function(name) {
	if (!this.behaviours[name]) {
		throw new Error("No behaviour by given name = " + name);
	}

	return this.behaviours[name];
};

module.exports = BehaviourModel;