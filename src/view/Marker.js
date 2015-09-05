var util = require("../util");
var service = require("../service");

function Marker(onDrag) {
	PIXI.Container.call(this);
	util.bind(this);

	this.onDrag = onDrag;
	this.interactive = true;
	this.buttonMode = true;
	this.dragging = false;
	this.image = this.createImage();

	this.mousedown = this.touchstart = this.onMouseDown;
	this.mouseup = this.mouseupoutside = this.touchend = this.touchendoutside = this.onMouseUp;
	this.mousemove = this.touchmove = this.onMouseMove;

	service.msg.on("stage/mouseOver", this.onMouseOverStage);
	service.msg.on("stage/mouseOut", this.onMouseOutStage);
}

util.inherit(Marker, PIXI.Container);

Marker.prototype.createImage = function() {
	var image = PIXI.Sprite.fromFrame("marker.png");
	image.anchor.set(0.5, 0.5);
	image.alpha = 0.7;

	return this.addChild(image);
};

Marker.prototype.onMouseDown = function() {
	this.dragging = true;
};

Marker.prototype.onMouseUp = function() {
	this.dragging = false;
};

Marker.prototype.onMouseMove = function(event) {
	if (this.dragging) {
		var newPosition = event.data.getLocalPosition(this.parent);
		this.setPosition(newPosition);
	}
};

Marker.prototype.setPosition = function(value) {
	this.x = value.x;
	this.y = value.y;
	this.onDrag(value);
};

Marker.prototype.onMouseOverStage = function() {
	this.image.alpha = 0.5;
};

Marker.prototype.onMouseOutStage = function() {
	this.image.alpha = 0.2;
};

module.exports = Marker;