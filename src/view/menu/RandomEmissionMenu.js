var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;
var emissionModel = require("../../model").emissionModel;

function RandomEmissionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		id: "random_emit_controller_menu",
		rows: [
			this.counter("Emission rate:", {
				id: "emission_rate",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			}),
			this.counter("Max particles:", {
				id: "emission_max_particles",
				step: 1, value: 0, min: 0, max: 2000, align: "center", format: webix.i18n.numberFormat
			})
		]
	};
}

util.inherit(RandomEmissionMenu, SubMenu);

RandomEmissionMenu.prototype.onActive = function() {
	this.onEmitterChanged();

	$$("emission_rate").attachEvent("onChange", this.onEmissionRateChanged);
	$$("emission_max_particles").attachEvent("onChange", this.onMaxParticlesChanged);

};

RandomEmissionMenu.prototype.onDestroy = function() {
	$$("emission_rate").detachEvent("onChange", this.onEmissionRateChanged);
	$$("emission_max_particles").detachEvent("onChange", this.onMaxParticlesChanged);
	service.msg.off("emitter/changed", this.onEmitterChanged);
};

RandomEmissionMenu.prototype.onEmissionRateChanged = function(value) {
	this.getController().emissionRate = value;
};

RandomEmissionMenu.prototype.onMaxParticlesChanged = function(value) {
	this.getController().maxParticles = value;
};

RandomEmissionMenu.prototype.onEmitterChanged = function() {
	$$("emission_rate").setValue(this.getController().emissionRate);
	$$("emission_max_particles").setValue(this.getController().maxParticles);
};

RandomEmissionMenu.prototype.getController = function() {
	return emissionModel.getEmissionByName(jupiter.EmissionTypes.RANDOM);
};

module.exports = RandomEmissionMenu;