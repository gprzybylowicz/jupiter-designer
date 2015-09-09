var util = require("../util");
var service = require("../service");
var ParticleRenderer = require("./ParticleRenderer.js");
var projectModel = require("../model").projectModel;
var texturesModel = require("../model").texturesModel;

function ParticleView() {
	PIXI.Container.call(this);
	util.bind(this);

	var renderer = new ParticleRenderer(projectModel.emitter, texturesModel.getCurrentTexture());
	renderer.play();
	this.renderer = this.addChild(renderer);

	projectModel.on("markerPosition/changed", this.refreshRendererPosition);
	service.msg.on("project/loaded", this.onProjectLoaded);

	this.refreshRendererPosition();
}

util.inherit(ParticleView, PIXI.Container);

ParticleView.prototype.refreshRendererPosition = function() {
	this.renderer.position = projectModel.markerPositionInStageCoordinates;
};

ParticleView.prototype.onProjectLoaded = function() {
	this.renderer.reset();
};

module.exports = ParticleView;

