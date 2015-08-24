var Model = require("./Model.js");
var util = require("../util");

function BackgroundModel() {
	Model.call(this);

	this.property("color", 0x0000);
	this.property("isLocked", true);
	this.property("texture", null);
	this.property("imagePosition", new PIXI.Point(0, 0));
}

util.inherit(BackgroundModel, Model);

BackgroundModel.prototype.serialize = function() {
	var data = {};
	data.color = this.color;
	data.isLocked = this.isLocked;
	data.imagePosition = {x: this.imagePosition.x, y: this.imagePosition.y};
	if (this.texture) {
		data.textureUrl = this.texture.baseTexture.imageUrl;
	}

	return data;
};

BackgroundModel.prototype.deserialize = function(data) {
	this.color = data.color || 0x0000;
	this.isLocked = data.isLocked || true;
	this.imagePosition = new PIXI.Point(data.imagePosition.x, data.imagePosition.y);

	if (data.textureUrl) {
		this.texture = PIXI.Texture.fromImage(data.textureUrl);
	}
};

module.exports = BackgroundModel;