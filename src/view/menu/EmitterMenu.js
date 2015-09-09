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
				step: 0.1, value: 20, min: 0, max: 200, align: "center", format: webix.i18n.numberFormat
			}),
			{id: "duration", view: "text", value: -1, label: "Duration", labelAlign: "left"}
		]

	};
}

util.inherit(EmitterMenu, SubMenu);

EmitterMenu.prototype.onMenuCreated = function() {
	$$("emit_per_second").attachEvent("onChange", this.onEmitPerSecondChanged);
	$$("duration").attachEvent("onChange", this.onDurationChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

EmitterMenu.prototype.onEmitPerSecondChanged = function(value) {
	projectModel.emitter.emitController.emitPerSecond = value;
};

EmitterMenu.prototype.onDurationChanged = function(value) {
	value = parseFloat(value);
	if (!isNaN(value)) {
		projectModel.emitter.emitController.duration = value;
	}

	$$("duration").setValue(projectModel.emitter.emitController.duration);
};

EmitterMenu.prototype.onEmitterChanged = function() {
	$$("emit_per_second").setValue(projectModel.emitter.emitController.emitPerSecond);
	$$("duration").setValue(projectModel.emitter.emitController.duration);
};

module.exports = EmitterMenu;