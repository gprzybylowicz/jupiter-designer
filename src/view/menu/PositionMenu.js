var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var positionBehaviour = require("../../model").behaviourModel.positionBehaviour;

function PositionMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {value: 0}),
			this.section("Position: "),
			this.positionSlider("position_x", "X: "),
			this.positionSlider("position_y", "Y: "),
			this.varianceSlider("position_variance_x", "Variance X: "),
			this.varianceSlider("position_variance_y", "Variance Y: "),
			this.section("Velocity: "),
			this.positionSlider("velocity_x", "X: "),
			this.positionSlider("velocity_y", "Y: "),
			this.varianceSlider("velocity_variance_x", "Variance X: "),
			this.varianceSlider("velocity_variance_y", "Variance Y: "),
			this.section("Acceleration/Gravity:"),
			this.positionSlider("acceleration_x", "X: "),
			this.positionSlider("acceleration_y", "Y: "),
			this.varianceSlider("acceleration_variance_x", "Variance X: "),
			this.varianceSlider("acceleration_variance_y", "Variance Y: ")

		]
	};
}

inherit(PositionMenu, SubMenu);

PositionMenu.prototype.positionSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: -1000,
		max: 1000,
		value: 0
	});

	return slider;
};

PositionMenu.prototype.varianceSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		max: 1000,
		value: 0
	});

	return slider;
};

PositionMenu.prototype.onMenuCreated = function() {
	this.bind("position_x", positionBehaviour.position, "x");
	this.bind("position_y", positionBehaviour.position, "y");
	this.bind("position_variance_x", positionBehaviour.positionVariance, "x");
	this.bind("position_variance_y", positionBehaviour.positionVariance, "y");

	this.bind("velocity_x", positionBehaviour.velocity, "x");
	this.bind("velocity_y", positionBehaviour.velocity, "y");
	this.bind("velocity_variance_x", positionBehaviour.velocityVariance, "x");
	this.bind("velocity_variance_y", positionBehaviour.velocityVariance, "y");

	this.bind("acceleration_x", positionBehaviour.acceleration, "x");
	this.bind("acceleration_y", positionBehaviour.acceleration, "y");
	this.bind("acceleration_variance_x", positionBehaviour.accelerationVariance, "x");
	this.bind("acceleration_variance_y", positionBehaviour.accelerationVariance, "y");
};

module.exports = PositionMenu;


