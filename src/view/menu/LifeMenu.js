var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var lifeBehaviour = require("../../model").behaviourModel.lifeBehaviour;

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
	this.bind("life_slider_time", lifeBehaviour, "maxLifeTime");
	this.bind("life_slider_variance", lifeBehaviour, "timeVariance");
};


module.exports = LifeMenu;