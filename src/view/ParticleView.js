var inherit = require("../util").inherit;

function ParticleView() {
	PIXI.Container.call(this);

	var image = PIXI.Sprite.fromFrame("sparkle.png");
	image.x = 250;
	image.y = 150;
	image.scale.set(2, 2);

	this.addChild(image);
}

inherit(ParticleView, PIXI.Container);

module.exports = ParticleView;