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
		autoheight: false,
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

LifeMenu.prototype.bind = function(id, target, propertyName) {
	$$(id).onChanged = function(newValue) {
		target[propertyName] = newValue;
	};

	service.msg.on("emitter/changed", function() {
		$$(id).setValue(target[propertyName]);
	});
};

module.exports = LifeMenu;