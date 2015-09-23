var util = require("../util");
var service = require("../service");
var projectModel = require("../model").projectModel;
var texturesModel = require("../model").texturesModel;

function ParticleView() {
	PIXI.Container.call(this);
	util.bind(this);

	var renderer = new jupiter.Renderer(projectModel.emitter, texturesModel.getCurrentTexture());
	this.renderer = this.addChild(renderer);

	projectModel.on("markerPosition/changed", this.refreshRendererPosition);
	texturesModel.on("currentTexture/changed", this.onTextureChanged);
	service.msg.on("project/loaded", this.onProjectLoaded);
	projectModel.emitter.on("emitter/complete", this.onComplete);

	this.refreshRendererPosition();
}

util.inherit(ParticleView, PIXI.Container);

ParticleView.prototype.refreshRendererPosition = function() {
	this.renderer.position = projectModel.markerPositionInStageCoordinates;
};

ParticleView.prototype.onTextureChanged = function() {
	this.renderer.texture = texturesModel.getCurrentTexture();
};

ParticleView.prototype.onProjectLoaded = function() {
	projectModel.emitter.reset();
};

ParticleView.prototype.onComplete = function() {
	projectModel.emitter.resetAndPlay();
};

module.exports = ParticleView;

