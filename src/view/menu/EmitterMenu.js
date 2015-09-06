var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;

function EmitterMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.counter("Emit per sec:", {
				id: "emit_per_second",
				step: 0.1, value: 1, min: 0, max: 100, align: "center", format: webix.i18n.numberFormat
			})
		]

	};
}

util.inherit(EmitterMenu, SubMenu);

EmitterMenu.prototype.onMenuCreated = function() {
	$$("emit_per_second").attachEvent("onChange", this.onEmitPerSecondChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

EmitterMenu.prototype.onEmitPerSecondChanged = function(value) {
	projectModel.emitter.emitController.emitPerSecond = value;
};

EmitterMenu.prototype.onEmitterChanged = function() {
	$$("emit_per_second").setValue(projectModel.emitter.emitController.emitPerSecond);
};

module.exports = EmitterMenu;