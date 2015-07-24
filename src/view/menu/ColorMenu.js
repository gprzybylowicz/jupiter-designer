var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var behaviourModel = require("../../model").behaviourModel;

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
	this.bind("start_variance_r", "r", this.getStartVariance);
	this.bind("start_variance_g", "g", this.getStartVariance);
	this.bind("start_variance_b", "b", this.getStartVariance);
	this.bind("start_variance_alpha", "alpha", this.getStartVariance);

	this.bind("end_variance_r", "r", this.getEndVariance);
	this.bind("end_variance_g", "g", this.getEndVariance);
	this.bind("end_variance_b", "b", this.getEndVariance);
	this.bind("end_variance_alpha", "alpha", this.getEndVariance);
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


