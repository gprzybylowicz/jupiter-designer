var inherit = require("../util").inherit;
var PIXIRenderer = require("../PIXIRenderer.js");
var projectModel = require("../model").projectModel;

function ParticleView() {
	PIXI.Container.call(this);

	var image = PIXI.Sprite.fromFrame("sparkle.png");
	image.x = 250;
	image.y = 150;
	image.scale.set(2, 2);

	this.addChild(image);

	var config = {
		texture: PIXI.Texture.fromFrame("sparkle.png")
	};

	var renderer = new PIXIRenderer(projectModel.emitter, config);
	this.addChild(renderer);
}

inherit(ParticleView, PIXI.Container);

module.exports = ParticleView;