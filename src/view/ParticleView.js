var inherit = require("../util").inherit;
var PIXIRenderer = require("../PIXIRenderer.js");
var projectModel = require("../model").projectModel;

function ParticleView() {
	PIXI.Container.call(this);

	var image = PIXI.Sprite.fromFrame("sparkle.png");
	image.x = 0;
	image.y = 0;
	image.anchor.set(0.5, 0.5);
	image.scale.set(2, 2);
	image.tint = 0xff0000;

	image.interactive = true;
	image.buttonMode = true;

	image.mousedown = image.touchstart = function() {
		this.dragging = true;
	};

	image.mouseup = image.mouseupoutside = image.touchend = image.touchendoutside = function(data) {
		this.dragging = false;
	};

	image.mousemove = image.touchmove = function(event) {
		if (this.dragging) {
			var newPosition = event.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x;
			this.position.y = newPosition.y;

			renderer.position = this.position.clone();
		}
	};

	this.addChild(image);

	var config = {
		texture: PIXI.Texture.fromFrame("sparkle.png")
	};

	var renderer = new PIXIRenderer(projectModel.emitter, config);
	renderer.play();
	this.addChild(renderer);
}

inherit(ParticleView, PIXI.Container);

module.exports = ParticleView;