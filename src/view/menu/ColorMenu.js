var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var colorBehaviour = require("../../model").behaviourModel.colorBehaviour;

function ColorMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled:", {value: 0}),
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

inherit(ColorMenu, SubMenu);

ColorMenu.prototype.slider = function(id, label) {
	return SubMenu.prototype.slider.call(this, "", {
		id: id, label: label, labelWidth: 30, min: 0, max: 255, step: 1, value: 0
	});
};

ColorMenu.prototype.onMenuCreated = function() {
	this.bind("start_variance_r", colorBehaviour.startVariance, "r");
	this.bind("start_variance_g", colorBehaviour.startVariance, "g");
	this.bind("start_variance_b", colorBehaviour.startVariance, "b");
	this.bind("start_variance_alpha", colorBehaviour.startVariance, "alpha");

	this.bind("end_variance_r", colorBehaviour.startVariance, "r");
	this.bind("end_variance_g", colorBehaviour.startVariance, "g");
	this.bind("end_variance_b", colorBehaviour.startVariance, "b");
	this.bind("end_variance_alpha", colorBehaviour.startVariance, "alpha");
};

module.exports = ColorMenu;


