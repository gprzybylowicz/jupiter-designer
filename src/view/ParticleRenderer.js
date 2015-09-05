var util = require("../util");
var service = require("../service");
var texturesModel = require("../model").texturesModel;
var PIXIRenderer = require("../PIXIRenderer.js");

function ParticleRenderer(emitter, config) {
	PIXIRenderer.call(this, emitter, config);
	util.bind(this);

	service.msg.on("texture/changed", this.onTextureChanged);
}

util.inherit(ParticleRenderer, PIXIRenderer);

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