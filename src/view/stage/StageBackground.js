var util = require("../../util");
var service = require("../../service");
var backgroundModel = require("../../model").backgroundModel;

function StageBackground() {
	PIXI.Container.call(this);
	util.bind(this);

	backgroundModel.on("isLocked/changed", this.onIsLockedChanged);
	backgroundModel.on("texture/changed", this.onTextureChanged);
	backgroundModel.on("imagePosition/changed", this.onPositionChanged);

	this.mousedown = this.touchstart = this.onMouseDown;
	this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = this.onMouseUp;
	this.mousemove = this.touchmove = this.onMouseMove;

	this.onIsLockedChanged();
}

util.inherit(StageBackground, PIXI.Container);

StageBackground.prototype.onIsLockedChanged = function() {
	this.interactive = !backgroundModel.isLocked;
	this.buttonMode = !backgroundModel.isLocked;
};

StageBackground.prototype.onTextureChanged = function() {
	if (!backgroundModel.texture && this.image) {
		this.removeChild(this.image);
		this.image = null;
	}
	else {
		this.image = this.image || this.createImage();
		this.image.texture = backgroundModel.texture;
		this.onPositionChanged();
	}
};

StageBackground.prototype.onPositionChanged = function() {
	if (this.image) {
		this.image.x = backgroundModel.imagePosition.x;
		this.image.y = backgroundModel.imagePosition.y;
	}
};

StageBackground.prototype.createImage = function() {
	var image = new PIXI.Sprite(PIXI.Texture.EMPTY);
	image.anchor.set(0.5, 0.5);
	return this.addChild(image);
};

StageBackground.prototype.onMouseDown = function() {
	this.dragging = true;
};

StageBackground.prototype.onMouseUp = function() {
	this.dragging = false;
};

StageBackground.prototype.onMouseMove = function(event) {
	if (this.dragging) {
		var newPosition = event.data.getLocalPosition(this);
		backgroundModel.imagePosition = newPosition.clone();
	}
};

module.exports = StageBackground;