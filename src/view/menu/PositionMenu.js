var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;
var msg = require("../../service").msg;

function PositionMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {value: 0}),
			this.section("Position: "),
			this.positionSlider("X: ", this.emitPositionChanged),
			this.positionSlider("Y: ", this.emitPositionChanged),
			this.varianceSlider("Variance X: ", this.emitPositionChanged),
			this.varianceSlider("Variance Y: ", this.emitPositionChanged),
			this.section("Velocity: "),
			this.positionSlider("X: "),
			this.positionSlider("Y: "),
			this.varianceSlider("Variance X: "),
			this.varianceSlider("Variance Y: "),
			this.section("Acceleration/Gravity:"),
			this.positionSlider("X: "),
			this.positionSlider("Y: "),
			this.varianceSlider("Variance X: "),
			this.varianceSlider("Variance Y: ")

		]
	};
}

inherit(PositionMenu, SubMenu);

PositionMenu.prototype.positionSlider = function(label, onChanged) {
	var slider = this.slider(label, {
		labelWidth: 30,
		min: -1000,
		max: 1000,
		value: 0
		//on: {
		//	onValueChanged: function() {
		//		onChanged($$(slider.id).value);
		//	}
		//}
	});

	return slider;
};

PositionMenu.prototype.varianceSlider = function(label, onChanged) {
	var slider = this.slider(label, {
		labelWidth: 30,
		max: 1000,
		value: 0
		//on: {
		//	onValueChanged: function() {
		//		onChanged($$(slider.id).value);
		//	}
		//}
	});

	return slider;
};

PositionMenu.prototype.emitPositionChanged = function(value) {
	console.log(value);
};

module.exports = PositionMenu;


