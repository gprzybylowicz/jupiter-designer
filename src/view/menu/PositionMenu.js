var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var bind = require("../../util").bind;
var behaviourModel = require("../../model").behaviourModel;

function PositionMenu() {
	SubMenu.call(this);
	bind(this);

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
		min: -500,
		max: 500,
		step: 1,
		value: 0
	});

	return slider;
};

PositionMenu.prototype.varianceSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 500,
		step: 1,
		value: 0
	});

	return slider;
};

PositionMenu.prototype.onMenuCreated = function() {
	this.bind("position_x", "x", this.getPosition);
	this.bind("position_y", "y", this.getPosition);
	this.bind("position_variance_x", "x", this.getPositionVariance);
	this.bind("position_variance_y", "y", this.getPositionVariance);

	this.bind("velocity_x", "x", this.getVelocity);
	this.bind("velocity_y", "y", this.getVelocity);
	this.bind("velocity_variance_x", "x", this.getVelocityVariance);
	this.bind("velocity_variance_y", "y", this.getVelocityVariance);

	this.bind("acceleration_x", "x", this.getAcceleration);
	this.bind("acceleration_y", "y", this.getAcceleration);
	this.bind("acceleration_variance_x", "x", this.getAccelerationVariance);
	this.bind("acceleration_variance_y", "y", this.getAccelerationVariance);
};

PositionMenu.prototype.getPosition = function() {
	return this.getBehaviour().position;
};

PositionMenu.prototype.getPositionVariance = function() {
	return this.getBehaviour().positionVariance;
};

PositionMenu.prototype.getVelocity = function() {
	return this.getBehaviour().velocity;
};

PositionMenu.prototype.getVelocityVariance = function() {
	return this.getBehaviour().velocityVariance;
};

PositionMenu.prototype.getAcceleration = function() {
	return this.getBehaviour().acceleration;
};

PositionMenu.prototype.getAccelerationVariance = function() {
	return this.getBehaviour().accelerationVariance;
};

PositionMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName("PositionBehaviour");
};

module.exports = PositionMenu;


