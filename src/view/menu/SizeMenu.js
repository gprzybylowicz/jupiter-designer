var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function SizeMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "size_enable", value: 0}),
			this.section("Start size: "),
			this.positionSlider("start_size_x", "X: "),
			this.positionSlider("start_size_y", "Y: "),
			this.varianceSlider("start_size_variance", "Variance: "),

			this.section("End size: "),
			this.positionSlider("end_size_x", "X: "),
			this.positionSlider("end_size_y", "Y: "),
			this.varianceSlider("end_size_variance", "Variance: ")
		]
	};
}

util.inherit(SizeMenu, SubMenu);

SizeMenu.prototype.positionSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 10,
		value: 1,
		step: 0.1
	});

	return slider;
};

SizeMenu.prototype.varianceSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 10,
		value: 0,
		step: 0.1
	});

	return slider;
};

SizeMenu.prototype.onMenuCreated = function() {
	this.bind("start_size_x", "x", this.getSizeStart);
	this.bind("start_size_y", "y", this.getSizeStart);
	this.bind("end_size_x", "x", this.getSizeEnd);
	this.bind("end_size_y", "y", this.getSizeEnd);
	this.bind("start_size_variance", "startVariance");
	this.bind("end_size_variance", "endVariance");

	$$("size_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

SizeMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

SizeMenu.prototype.onEmitterChanged = function() {
	$$("size_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

SizeMenu.prototype.getSizeStart = function() {
	return this.getBehaviour().sizeStart;
};

SizeMenu.prototype.getSizeEnd = function() {
	return this.getBehaviour().sizeEnd;
};

SizeMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.SIZE_BEHAVIOUR);
};

module.exports = SizeMenu;


