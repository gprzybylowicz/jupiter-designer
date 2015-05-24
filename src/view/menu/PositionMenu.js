var BaseBehaviourMenu = require("./BaseBehaviourMenu.js");
var model = require("../../model").behaviourModel;

function PositionMenu(gui) {
	BaseBehaviourMenu.call(this, gui, model.positionBehaviour);

	this.addPositionFolder(gui, 500);
	this.addVelocityFolder(gui, 500);
	this.addAccelerationFolder(gui, 500);
}

PositionMenu.prototype = Object.create(BaseBehaviourMenu.prototype);
PositionMenu.prototype.constructor = PositionMenu;

PositionMenu.prototype.addPositionFolder = function(gui, range) {
	var folder = gui.addFolder("Position");
	folder.add(this.behaviour.position, "x", -range, range);
	folder.add(this.behaviour.position, "y", -range, range);
	folder.add(this.behaviour.positionVariance, "x", -range, range).name("variance X");
	folder.add(this.behaviour.positionVariance, "y", -range, range).name("variance Y");
	folder.open();
};

PositionMenu.prototype.addVelocityFolder = function(gui, range) {
	var folder = gui.addFolder("Velocity");
	folder.add(this.behaviour.velocity, "x", -range, range);
	folder.add(this.behaviour.velocity, "y", -range, range);
	folder.add(this.behaviour.velocityVariance, "x", -range, range).name("variance X");
	folder.add(this.behaviour.velocityVariance, "y", -range, range).name("variance Y");
};

PositionMenu.prototype.addAccelerationFolder = function(gui, range) {
	var folder = gui.addFolder("Acceleration/Gravity");
	folder.add(this.behaviour.acceleration, "x", -range, range);
	folder.add(this.behaviour.acceleration, "y", -range, range);
	folder.add(this.behaviour.accelerationVariance, "x", -range, range).name("variance X");
	folder.add(this.behaviour.accelerationVariance, "y", -range, range).name("variance Y");
};

module.exports = PositionMenu;