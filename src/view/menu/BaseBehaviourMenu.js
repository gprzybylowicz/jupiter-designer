var controller = require("../../controller").behaviourController;

function BaseBehaviourMenu(gui, behaviour) {
	this.behaviour = behaviour;

	gui.add(this, "enableBehaviour").name("Enable");
}

Object.defineProperty(BaseBehaviourMenu.prototype, "enableBehaviour", {
	get: function() {
		return this._enableBehaviour || false;
	},
	set: function(value) {
		this._enableBehaviour = value;

		if (value) {
			this.enable();
		}
		else {
			this.disable();
		}
	}
});

BaseBehaviourMenu.prototype.enable = function() {
	controller.enableBehaviour(this.behaviour);
};

BaseBehaviourMenu.prototype.disable = function() {
	controller.disableBehaviour(this.behaviour);
};

module.exports = BaseBehaviourMenu;