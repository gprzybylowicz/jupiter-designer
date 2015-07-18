var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");

var lifeBehaviour = {
	life: 0,
	variance: 0
};

function LifeMenu() {
	SubMenu.call(this);

	this.ui = {
		rows: [
			this.slider("Life time:", {
				id: "life_slider_time", min: 0, max: 10, step: 0.1, value: 5
			}),
			this.slider("Life variance:", {
				id: "life_slider_variance", min: 0, max: 10, step: 0.1, value: 0
			})
		]
	};
}

util.inherit(LifeMenu, SubMenu);

LifeMenu.prototype.onMenuCreated = function() {
	this.bind("life_slider_time", lifeBehaviour, "life");
	this.bind("life_slider_variance", lifeBehaviour, "variance");
};

module.exports = LifeMenu;