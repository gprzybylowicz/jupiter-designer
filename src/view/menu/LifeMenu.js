var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;

function LifeMenu() {
	SubMenu.call(this);

	this.ui = {
		autoheight: false,
		rows: [
			this.slider("Life time:", {min: 0, max: 10, step: 0.1, value: 2}),
			this.slider("Life variance:", {min: 0, max: 10, step: 0.1, value: 0})
		]
	};
}

inherit(LifeMenu, SubMenu);

module.exports = LifeMenu;