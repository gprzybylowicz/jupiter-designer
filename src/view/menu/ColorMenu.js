var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;
var service = require("../../service");

function ColorMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled:", {id: "color_enable", value: 0}),
			{view: "colorpicker", label: "Start", name: "color", value: "#ffffff"},
			{view: "colorpicker", label: "End", name: "color", value: "#ffffff"},
			this.section("Start variance:"),
			this.slider("start_variance_r", "R:"),
			this.slider("start_variance_g", "G:"),
			this.slider("start_variance_b", "B:"),
			this.slider("start_variance_alpha", "A:"),
			this.section("End variance:"),
			this.slider("end_variance_r", "R:"),
			this.slider("end_variance_g", "G:"),
			this.slider("end_variance_b", "B:"),
			this.slider("end_variance_alpha", "A:")

		]
	};
}

util.inherit(ColorMenu, SubMenu);

ColorMenu.prototype.slider = function(id, label) {
	return SubMenu.prototype.slider.call(this, "", {
		id: id, label: label, labelWidth: 30, min: 0, max: 255, step: 1, value: 0
	});
};

ColorMenu.prototype.onMenuCreated = function() {
	this.bind("start_variance_r", "r", this.getStartVariance);
	this.bind("start_variance_g", "g", this.getStartVariance);
	this.bind("start_variance_b", "b", this.getStartVariance);
	this.bind("start_variance_alpha", "alpha", this.getStartVariance);

	this.bind("end_variance_r", "r", this.getEndVariance);
	this.bind("end_variance_g", "g", this.getEndVariance);
	this.bind("end_variance_b", "b", this.getEndVariance);
	this.bind("end_variance_alpha", "alpha", this.getEndVariance);

	$$("color_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

ColorMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

ColorMenu.prototype.onEmitterChanged = function() {
	$$("color_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

ColorMenu.prototype.getStartVariance = function() {
	return this.getBehaviour().startVariance;
};

ColorMenu.prototype.getEndVariance = function() {
	return this.getBehaviour().endVariance;
};

ColorMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName("ColorBehaviour");
};

module.exports = ColorMenu;


