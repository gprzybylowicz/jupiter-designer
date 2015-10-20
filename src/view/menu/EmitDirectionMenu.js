var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");
var behaviourModel = require("../../model").behaviourModel;
var projectModel = require("../../model").projectModel;

function EmitDirectionMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Enabled: ", {id: "emit_angle_enable", value: 0}),
			this.slider("Angle:", {
				id: "emit_angle", min: 0, max: 360, step: 1, value: 0
			}),
			this.slider("Variance:", {
				id: "emit_angle_variance", min: 0, max: 360, step: 1, value: 0
			})
		]
	};
}

util.inherit(EmitDirectionMenu, SubMenu);

EmitDirectionMenu.prototype.onMenuCreated = function() {
	this.bind("emit_angle", "angleInDegrees");
	this.bind("emit_angle_variance", "varianceInDegrees");

	$$("emit_angle_enable").attachEvent("onChange", this.onEnableChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);

};

EmitDirectionMenu.prototype.onEnableChanged = function(value) {
	service.msg.emit("behaviour/setEnable", value, this.getBehaviour());
};

EmitDirectionMenu.prototype.onEmitterChanged = function() {
	$$("emit_angle_enable").setValue(projectModel.hasActiveBehaviour(this.getBehaviour()));
};

EmitDirectionMenu.prototype.getBehaviour = function() {
	return behaviourModel.getBehaviourByName(jupiter.BehaviourNames.EMIT_DIRECTION);
};

module.exports = EmitDirectionMenu;