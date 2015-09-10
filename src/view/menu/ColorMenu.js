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
			//{view: "colorpicker", id: "color_start", label: "Start", name: "color", value: "#ffffff"},
			//{view: "colorpicker", id: "color_end", label: "End", name: "color", value: "#ffffff"},
			this.section("Start:"),
			{view: "template", content: "start_color", autoheight: true},
			this.section("End:"),
			{view: "template", content: "end_color", autoheight: true},
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

	var startColor = $("#start_color_input");
	var startColorInfo = $("#start_color_info");
	startColor.spectrum(this.getColorPickerConfig());

	this.getStartColor = function() {
		return startColor;
	};
	this.getStartColorInfo = function() {
		return startColorInfo;
	};

	var endColor = $("#end_color_input");
	var endColorInfo = $("#end_color_info");
	endColor.spectrum(this.getColorPickerConfig());

	this.getEndColor = function() {
		return endColor;
	};

	this.getEndColorInfo = function() {
		return endColorInfo;
	};
}

util.inherit(ColorMenu, SubMenu);

ColorMenu.prototype.getColorPickerConfig = function() {
	return {
		color: "#ffffff",
		showInput: true,
		showAlpha: true,
		preferredFormat: "hex",
		clickoutFiresChange: true,
	};
};

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

	this.getStartColor().on("move.spectrum", this.onStartColorChanged);
	this.getStartColor().on("hide.spectrum", this.onStartColorChanged);
	this.getEndColor().on("move.spectrum", this.onEndColorChanged);
	this.getEndColor().on("hide.spectrum", this.onEndColorChanged);

};

ColorMenu.prototype.onStartColorChanged = function() {
	var color = this.getStartColor().spectrum("get").toRgb();
	this.getBehaviour().start.set(color.r, color.g, color.b, color.a);
};

ColorMenu.prototype.onEndColorChanged = function() {
	var color = this.getEndColor().spectrum("get").toRgb();
	this.getBehaviour().end.set(color.r, color.g, color.b, color.a);
};

ColorMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

ColorMenu.prototype.onEmitterChanged = function() {
	$$("color_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));

	this.getStartColor().spectrum("set", "#" + this.getBehaviour().start.hex.toString(16));
	this.getEndColor().spectrum("set", "#" + this.getBehaviour().end.hex.toString(16));

	this.refreshColorInfo();
};

ColorMenu.prototype.refreshColorInfo = function() {
	this.getStartColorInfo().text(this.getStartColor().spectrum("get").toRgbString());
	this.getEndColorInfo().text(this.getEndColor().spectrum("get").toRgbString());
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


