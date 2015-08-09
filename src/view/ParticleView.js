var inherit = require("../util").inherit;
var ParticleRenderer = require("./ParticleRenderer.js");
var Marker = require("./Marker.js");
var projectModel = require("../model").projectModel;
var texturesModel = require("../model").texturesModel;

function ParticleView() {
	PIXI.Container.call(this);

	var config = {
		texture: texturesModel.getCurrentTexture()
	};

	var renderer = new ParticleRenderer(projectModel.emitter, config);
	renderer.play();
	this.addChild(renderer);

	var marker = new Marker(function(position) {
		renderer.position = position;
	});
	this.addChild(marker);
}

inherit(ParticleView, PIXI.Container);

module.exports = ParticleView;