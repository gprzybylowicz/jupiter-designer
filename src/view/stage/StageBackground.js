var util = require("../../util");
var service = require("../../service");
var backgroundModel = require("../../model").backgroundModel;

function StageBackground() {
	PIXI.Container.call(this);
	util.bind(this);

	backgroundModel.on("isLocked/changed", this.onIsLockedChanged);
	backgroundModel.on("texture/changed", this.onTextureChanged);

	this.onIsLockedChanged();
}

util.inherit(StageBackground, PIXI.Container);

StageBackground.prototype.onIsLockedChanged = function() {
	this.interactive = backgroundModel.isLocked;
	this.buttonMode = backgroundModel.isLocked;
};

StageBackground.prototype.onTextureChanged = function() {
	console.log("onTextureChanged");
	if (!backgroundModel.texture && this.image) {
		this.removeChild(this.image);
		this.image = null;
	}
	else {
		this.image = this.image || this.createImage();
		this.image.texture = backgroundModel.texture;
	}
};

StageBackground.prototype.createImage = function() {
	var image = new PIXI.Sprite(PIXI.Texture.EMPTY);
	image.anchor.set(0.5, 0.5);
	return this.addChild(image);
};

module.exports = StageBackground;