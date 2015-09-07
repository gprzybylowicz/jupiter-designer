var util = require("../util");
var service = require("../service");
var texturesModel = require("../model").texturesModel;

function ParticleRenderer(emitter, config) {
	jupiter.Renderer.call(this, emitter, config);
	util.bind(this);

	service.msg.on("texture/changed", this.onTextureChanged);
}

util.inherit(ParticleRenderer, jupiter.Renderer);

ParticleRenderer.prototype.onTextureChanged = function() {
	this.texture = texturesModel.getCurrentTexture();

	for (var i = 0; i < this.unusedSprites.length; ++i) {
		this.unusedSprites[i].texture = texturesModel.getCurrentTexture();
	}

	for (i = 0; i < this.children.length; ++i) {
		this.children[i].texture = texturesModel.getCurrentTexture();
	}
};

module.exports = ParticleRenderer;