function PIXIRenderer(emitter, texture) {
	PIXI.Container.call(this);

	this.setEmitter(emitter);
	this.texture = texture;
	this.sprites = {};

	this.unusedSprites = [];

	this.play();
}

PIXIRenderer.prototype = Object.create(PIXI.Container.prototype);
PIXIRenderer.prototype.constructor = PIXIRenderer;

PIXIRenderer.prototype.play = function() {
	//if (!this.emitter.play) {
	this.emitter.play = true;
	PIXI.ticker.shared.add(this.update, this);
	//}
};

PIXIRenderer.prototype.stop = function() {
	this.emitter.play = false;
	PIXI.ticker.shared.remove(this.update, this);
};

PIXIRenderer.prototype.update = function(dt) {
	this.emitter.update(dt / 100);
};

PIXIRenderer.prototype.setEmitter = function(emitter) {
	this.emitter = emitter;
	this.emitter.setObserver(this);
};

PIXIRenderer.prototype.onCreate = function(particle) {
	var sprite = this.getOrCreateSprite();
	sprite.visible = true;
	particle.sprite = sprite;
};

PIXIRenderer.prototype.getOrCreateSprite = function() {
	if (this.unusedSprites.length > 0) {
		return this.unusedSprites.pop();
	}

	var sprite = new PIXI.Sprite(this.texture);
	sprite.anchor.set(0.5, 0.5);
	return this.addChild(sprite);
};

PIXIRenderer.prototype.onUpdate = function(particle) {
	var sprite = particle.sprite;

	sprite.x = particle.position.x;
	sprite.y = particle.position.y;

	sprite.scale.x = particle.size.x;
	sprite.scale.y = particle.size.y;

	sprite.tint = particle.color.hex;
	sprite.alpha = particle.color.alpha;
};

PIXIRenderer.prototype.onRemove = function(particle) {
	var sprite = particle.sprite;
	particle.sprite = null;
	sprite.visible = false;
	this.unusedSprites.push(sprite);
};

module.exports = PIXIRenderer;