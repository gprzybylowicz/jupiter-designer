var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;

function BackgroundMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.button("Load image"),
			this.button("Remove background"),
			this.counter("Scale:", {step: 0.2, value: 1, min: 0, max: 10, align: "center"}),
			this.button("Color")
		]
	};
}

inherit(BackgroundMenu, SubMenu);

module.exports = BackgroundMenu;