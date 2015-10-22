var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var emissionModel = require("../../model").emissionModel;

function DefaultEmissionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		id: "default_emit_controller_menu",
		rows: [
			this.counter("Emit/sec:", {
				id: "emit_per_second",
				step: 0.1, value: 0, min: 0, max: 200, align: "center", format: webix.i18n.numberFormat
			})
		]
	};
}

util.inherit(DefaultEmissionMenu, SubMenu);

DefaultEmissionMenu.prototype.onActive = function() {
	this.onEmitterChanged();

	$$("emit_per_second").attachEvent("onChange", this.onEmitPerSecondChanged);
};

DefaultEmissionMenu.prototype.onDestroy = function() {
	$$("emit_per_second").detachEvent("onChange", this.onEmitPerSecondChanged);
};

DefaultEmissionMenu.prototype.onEmitPerSecondChanged = function(value) {
	this.getController().emitPerSecond = value;
};

DefaultEmissionMenu.prototype.onEmitterChanged = function() {
	$$("emit_per_second").setValue(this.getController().emitPerSecond);
};

DefaultEmissionMenu.prototype.getController = function() {
	return emissionModel.getEmissionByName(jupiter.EmissionTypes.DEFAULT);
};

module.exports = DefaultEmissionMenu;