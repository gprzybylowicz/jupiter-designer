function PIXIRenderer(emitter, config) {
	PIXI.DisplayObjectContainer.call(this);

	this.setEmitter(emitter);
	this.config = config;
	this.sprites = {};
}

PIXIRenderer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXIRenderer.prototype.constructor = PIXIRenderer;

PIXIRenderer.prototype.updateTransform = function() {

	if(!this.lastUpdate){
		this.lastUpdate = Date.now();
	}
	var now = Date.now();
	var dt = (now - this.lastUpdate)/1000;
	this.lastUpdate = now;

	if(dt < 0.0000001) return;

    this.emitter.update(dt);
	PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};

PIXIRenderer.prototype.setEmitter = function(emitter) {
	this.emitter = emitter;
	this.emitter.setObserver(this);
};

PIXIRenderer.prototype.onCreate = function(particle) {
	this.createSprite(particle);
};

PIXIRenderer.prototype.onUpdate = function(particle) {
	var sprite = this.getSprite(particle);
	sprite.x = particle.position.x;
	sprite.y = particle.position.y;

	sprite.scale.x = particle.size.x;
	sprite.scale.y = particle.size.y;

	sprite.tint = particle.color.hex;
	sprite.alpha = particle.color.alpha;
};

PIXIRenderer.prototype.onRemove = function(particle) {
	this.removeSprite(particle);
};

PIXIRenderer.prototype.createSprite = function(particle) {
	var sprite = new PIXI.Sprite(this.config.texture);
	sprite.anchor.set(0.5, 0.5);
	this.sprites[particle.uid] = this.addChild(sprite);
};

PIXIRenderer.prototype.getSprite = function(particle) {
	return this.sprites[particle.uid];
};

PIXIRenderer.prototype.removeSprite = function(particle) {
	this.removeChild(this.getSprite(particle));
	delete this.sprites[particle.uid];
};


module.exports = PIXIRenderer;