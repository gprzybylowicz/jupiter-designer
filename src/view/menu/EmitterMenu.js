var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;

function EmitterMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.counter("Emit per sec:", {step: 0.1, value: 1, min: 0, max: 10, align: "center"})
		]
	};
}

inherit(EmitterMenu, SubMenu);

module.exports = EmitterMenu;