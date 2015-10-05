var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var bind = require("../../util").bind;
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function AngularVelocityMenu() {
	SubMenu.call(this);
	bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "angular_velocity_enable", value: 0}),
			this.rangedSlider("degrees", "Degrees/sec:"),
			this.rangedSlider("degrees_variance", "Degrees variance/sec:"),
			this.rangedSlider("max_radius", "Max radius:"),
			this.rangedSlider("max_radius_variance", "Max radius variance:"),
			this.rangedSlider("min_radius", "Min radius:"),
			this.rangedSlider("min_radius_variance", "Min radius variance:")
		]
	};
}

inherit(AngularVelocityMenu, SubMenu);

AngularVelocityMenu.prototype.rangedSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: -1000,
		max: 1000,
		step: 0.01,
		value: 0
	});

	return slider;
};

AngularVelocityMenu.prototype.onMenuCreated = function() {
	this.bind("degrees", "degrees");
	this.bind("degrees_variance", "degreesVariance");

	this.bind("max_radius", "maxRadius");
	this.bind("max_radius_variance", "maxRadiusVariance");

	this.bind("min_radius", "minRadius");
	this.bind("min_radius_variance", "minRadiusVariance");

	$$("angular_velocity_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

AngularVelocityMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

AngularVelocityMenu.prototype.onEmitterChanged = function() {
	$$("angular_velocity_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

AngularVelocityMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName("AngularVelocityBehaviour");
};

module.exports = AngularVelocityMenu;


