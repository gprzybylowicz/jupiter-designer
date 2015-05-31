var SubMenu = require("./SubMenu.js");
var inherit = require("../../util").inherit;

var controller = require("../../controller").textureMenuController;

function TextureMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.button("Export texture"),
			this.button("Upload texture"),
			this.button("Load predefined")
		]
	};
}

inherit(TextureMenu, SubMenu);

module.exports = TextureMenu;