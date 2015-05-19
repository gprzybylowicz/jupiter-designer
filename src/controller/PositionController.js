

function PositionController(gui) {
	this.behaviour = new jupiter.PositionBehaviour();
	this.behaviour.velocity.y = 200;
	this.behaviour.velocityVariance.x = 0;
	this.behaviour.velocityVariance.y = 0;
	this.createGUI(gui);
}

PositionController.prototype.createGUI = function(gui) {
	this.addPositionFolder(gui, 500);
	this.addVelocityFolder(gui, 500);
	this.addAccelerationFolder(gui, 500);
};

PositionController.prototype.addPositionFolder = function(gui, range) {
	var folder = gui.addFolder("Position");
	folder.add(this.behaviour.position, "x", -range, range);
	folder.add(this.behaviour.position, "y", -range, range);
	folder.add(this.behaviour.positionVariance, "x", -range, range).name("variance X");
	folder.add(this.behaviour.positionVariance, "y", -range, range).name("variance Y");
	folder.open();
};

PositionController.prototype.addVelocityFolder = function(gui, range) {
	var folder = gui.addFolder("Velocity");
	folder.add(this.behaviour.velocity, "x", -range, range);
	folder.add(this.behaviour.velocity, "y", -range, range);
	folder.add(this.behaviour.velocityVariance, "x", -range, range).name("variance X");
	folder.add(this.behaviour.velocityVariance, "y", -range, range).name("variance Y");
};

PositionController.prototype.addAccelerationFolder = function(gui, range) {
	var folder = gui.addFolder("Acceleration/Gravity");
	folder.add(this.behaviour.acceleration, "x", -range, range);
	folder.add(this.behaviour.acceleration, "y", -range, range);
	folder.add(this.behaviour.accelerationVariance, "x", -range, range).name("variance X");
	folder.add(this.behaviour.accelerationVariance, "y", -range, range).name("variance Y");
};

module.exports = PositionController;

