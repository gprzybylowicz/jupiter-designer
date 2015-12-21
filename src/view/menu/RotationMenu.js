var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function RotationMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "rotation_enable", value: 0}),
			this.rangedSlider("rotation", "Rotation/sec: "),
			this.rangedSlider("variance", "Variance: ")
		]
	};
}

util.inherit(RotationMenu, SubMenu);

RotationMenu.prototype.rangedSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: -360,
		max: 360,
		step: 0.01,
		value: 0
	});

	return slider;
};

RotationMenu.prototype.onMenuCreated = function() {
	this.bind("rotation", "rotationInDegrees", this.getBehaviour);
	this.bind("variance", "varianceInDegrees", this.getBehaviour);

	$$("rotation_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

RotationMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

RotationMenu.prototype.onEmitterChanged = function() {
	$$("rotation_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

RotationMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.ROTATION_BEHAVIOUR);
};

module.exports = RotationMenu;


