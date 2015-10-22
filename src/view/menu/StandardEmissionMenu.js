var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;
var emissionModel = require("../../model").emissionModel;

function StandardEmissionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		id: "standard_emit_controller_menu",
		rows: [
			this.counter("Emission rate:", {
				id: "standard_emit_emission_rate",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			}),
			this.counter("Max particles:", {
				id: "standerd_emission_max_particles",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			})
		]
	};
}

util.inherit(StandardEmissionMenu, SubMenu);

StandardEmissionMenu.prototype.onActive = function() {
	this.onEmitterChanged();

	$$("standard_emit_emission_rate").attachEvent("onChange", this.onEmissionRateChanged);
	$$("standerd_emission_max_particles").attachEvent("onChange", this.onMaxParticlesChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

StandardEmissionMenu.prototype.onDestroy = function() {
	$$("standard_emit_emission_rate").detachEvent("onChange", this.onEmissionRateChanged);
	$$("standerd_emission_max_particles").detachEvent("onChange", this.onMaxParticlesChanged);
	service.msg.off("emitter/changed", this.onEmitterChanged);
};

StandardEmissionMenu.prototype.onEmissionRateChanged = function(value) {
	this.getController().emissionRate = value;
};

StandardEmissionMenu.prototype.onMaxParticlesChanged = function(value) {
	this.getController().maxParticles = value;
};

StandardEmissionMenu.prototype.onEmitterChanged = function() {
	$$("standard_emit_emission_rate").setValue(this.getController().emissionRate);
	$$("standerd_emission_max_particles").setValue(this.getController().maxParticles);
};

StandardEmissionMenu.prototype.getController = function() {
	return emissionModel.getEmissionByName(jupiter.EmissionTypes.UNIFORM);
};

module.exports = StandardEmissionMenu;