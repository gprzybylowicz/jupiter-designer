//var BaseBehaviourMenu = require("./BaseBehaviourMenu.js");
//var model = require("../../model").behaviourModel;
//
//function PositionMenu(gui) {
//	BaseBehaviourMenu.call(this, gui, model.positionBehaviour);
//
//	this.addPositionFolder(gui, 500);
//	this.addVelocityFolder(gui, 500);
//	this.addAccelerationFolder(gui, 500);
//}
//
//PositionMenu.prototype = Object.create(BaseBehaviourMenu.prototype);
//PositionMenu.prototype.constructor = PositionMenu;
//
//PositionMenu.prototype.addPositionFolder = function(gui, range) {
//	var folder = gui.addFolder("Position");
//	folder.add(this.behaviour.position, "x", -range, range);
//	folder.add(this.behaviour.position, "y", -range, range);
//	folder.add(this.behaviour.positionVariance, "x", -range, range).name("variance X");
//	folder.add(this.behaviour.positionVariance, "y", -range, range).name("variance Y");
//	folder.open();
//};
//
//PositionMenu.prototype.addVelocityFolder = function(gui, range) {
//	var folder = gui.addFolder("Velocity");
//	folder.add(this.behaviour.velocity, "x", -range, range);
//	folder.add(this.behaviour.velocity, "y", -range, range);
//	folder.add(this.behaviour.velocityVariance, "x", -range, range).name("variance X");
//	folder.add(this.behaviour.velocityVariance, "y", -range, range).name("variance Y");
//};
//
//PositionMenu.prototype.addAccelerationFolder = function(gui, range) {
//	var folder = gui.addFolder("Acceleration/Gravity");
//	folder.add(this.behaviour.acceleration, "x", -range, range);
//	folder.add(this.behaviour.acceleration, "y", -range, range);
//	folder.add(this.behaviour.accelerationVariance, "x", -range, range).name("variance X");
//	folder.add(this.behaviour.accelerationVariance, "y", -range, range).name("variance Y");
//};
//
//module.exports = PositionMenu;

var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;

function PositionMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {value: 0}),
			this.section("Position: "),
			this.positionSlider("X: "),
			this.positionSlider("Y: "),
			this.positionSlider("Variance X: "),
			this.positionSlider("Variance Y: "),
			this.section("Velocity: "),
			this.positionSlider("X: "),
			this.positionSlider("Y: "),
			this.positionSlider("Variance X: "),
			this.positionSlider("Variance Y: "),
			this.section("Acceleration/Gravity:"),
			this.positionSlider("X: "),
			this.positionSlider("Y: "),
			this.positionSlider("Variance X: "),
			this.positionSlider("Variance Y: ")

		]
	};
}

inherit(PositionMenu, SubMenu);

PositionMenu.prototype.positionSlider = function(label, style) {
	return this.slider(label, {labelWidth: 30, min: -500, max: 500, step: 1, value: 0}, style);
};

module.exports = PositionMenu;


