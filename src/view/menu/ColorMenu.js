var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;

function ColorMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled:", {value: 0}),
			{view: "colorpicker", label: "Start", name: "color", value: "#ffffff"},
			{view: "colorpicker", label: "End", name: "color", value: "#ffffff"},
			this.section("Start variance:"),
			this.slider("", {label: "R:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
			this.slider("", {label: "G:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
			this.slider("", {label: "B:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
			this.slider("", {label: "A:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
			this.section("End variance:"),
			this.slider("", {label: "R:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
			this.slider("", {label: "G:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
			this.slider("", {label: "B:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
			this.slider("", {label: "A:", labelWidth: 30, min: 0, max: 255, step: 1, value: 0}),
		]
	};
}

inherit(ColorMenu, SubMenu);

module.exports = ColorMenu;


