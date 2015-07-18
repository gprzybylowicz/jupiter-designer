var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var sizeBehaviour = require("../../model").behaviourModel.sizeBehaviour;

function SizeMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {value: 0}),
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

inherit(SizeMenu, SubMenu);

SizeMenu.prototype.positionSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 10,
		value: 1
	});

	return slider;
};

SizeMenu.prototype.varianceSlider = function(id, label) {
	var slider = this.slider(label, {
		id: id,
		labelWidth: 30,
		min: 0,
		max: 10,
		value: 0
	});

	return slider;
};

SizeMenu.prototype.onMenuCreated = function() {
	this.bind("start_size_x", sizeBehaviour.sizeStart, "x");
	this.bind("start_size_y", sizeBehaviour.sizeStart, "y");
	this.bind("end_size_x", sizeBehaviour.sizeEnd, "x");
	this.bind("end_size_y", sizeBehaviour.sizeEnd, "y");
	this.bind("start_size_variance", sizeBehaviour, "startVariance");
	this.bind("end_size_variance", sizeBehaviour, "endVariance");
};

module.exports = SizeMenu;


