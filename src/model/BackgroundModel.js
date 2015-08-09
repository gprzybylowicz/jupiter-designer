var Model = require("./Model.js");
var util = require("../util");

function BackgroundModel() {
	Model.call(this);

	this.property("color", 0x0000);
	this.property("isLocked", true);
	this.property("texture", null);
}

util.inherit(BackgroundModel, Model);

module.exports = BackgroundModel;