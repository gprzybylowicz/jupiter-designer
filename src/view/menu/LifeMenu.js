var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var behaviourModel = require("../../model").behaviourModel;

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
	this.bind("life_slider_time", "maxLifeTime");
	this.bind("life_slider_variance", "timeVariance");

	service.msg.emit("behaviour/setEnable", true, this.getBehaviour());

};

LifeMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.LIFE_BEHAVIOUR);
};

module.exports = LifeMenu;