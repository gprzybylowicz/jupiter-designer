var SubMenu = require("./SubMenu.js");
var LifeMenu = require("./LifeMenu.js");
var EmitDirectionMenu = require("./EmitDirectionMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;

function GeneralMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.lifeMenu = new LifeMenu();
	this.emitDirectionMenu = new EmitDirectionMenu();

	this.ui = {
		rows: [
			this.section("Emitter:"),
			this.counter("Emit/sec:", {
				id: "emit_per_second",
				step: 0.1, value: 20, min: 0, max: 200, align: "center", format: webix.i18n.numberFormat
			}),
			{id: "duration", view: "text", value: -1, label: "Duration", labelAlign: "left"},
			this.section("Life:"),
			this.lifeMenu.ui,
			this.section("Emission direction:"),
			this.emitDirectionMenu.ui,
		]

	};
}

util.inherit(GeneralMenu, SubMenu);

GeneralMenu.prototype.onActive = function() {
	SubMenu.prototype.onActive.call(this);
	this.lifeMenu.onActive();
	this.emitDirectionMenu.onActive();
};

GeneralMenu.prototype.onMenuCreated = function() {
	$$("emit_per_second").attachEvent("onChange", this.onEmitPerSecondChanged);
	$$("duration").attachEvent("onChange", this.onDurationChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

GeneralMenu.prototype.onEmitPerSecondChanged = function(value) {
	projectModel.emitter.emitController.emitPerSecond = value;
};

GeneralMenu.prototype.onDurationChanged = function(value) {
	value = parseFloat(value);
	if (!isNaN(value)) {
		projectModel.emitter.emitController.duration = value;
	}

	$$("duration").setValue(projectModel.emitter.emitController.duration);
};

GeneralMenu.prototype.onEmitterChanged = function() {
	$$("emit_per_second").setValue(projectModel.emitter.emitController.emitPerSecond);
	$$("duration").setValue(projectModel.emitter.emitController.duration);
};

module.exports = GeneralMenu;