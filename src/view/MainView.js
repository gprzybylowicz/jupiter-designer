var Menu = require("./menu/Menu.js");
var ParticleView = require("./ParticleView.js");

function MainView() {
	this.renderer = this.createRenderer();
	this.stage = this.createStage();
	this.stats = this.createStats();
	this.menu = this.createMenu();
	this.particleView = this.createParticleView();

	this.draw();
}

MainView.prototype.createStage = function() {
	return new PIXI.Container();
};

MainView.prototype.createRenderer = function() {
	//todo: autodetect renderer
	//todo: dynamic size of renderer
	var renderer = new PIXI.WebGLRenderer(window.innerWidth / 2, window.innerHeight - 100);
	document.body.appendChild(renderer.view);
	return renderer;
};

MainView.prototype.createStats = function() {
	var stats = new Stats();
	stats.domElement.style.position = "absolute";
	stats.domElement.style.left = "0px";
	stats.domElement.style.top = "0px";
	document.body.appendChild(stats.domElement);
	return stats;
};

MainView.prototype.createMenu = function() {
	var gui = new dat.GUI();
	return new Menu(gui);
};

MainView.prototype.createParticleView = function() {
	return this.stage.addChild(new ParticleView());
};

MainView.prototype.draw = function() {
	PIXI.ticker.shared.add(function() {
		this.stats.begin();
		this.renderer.render(this.stage);
		this.stats.end();
	}, this);
};

module.exports = MainView;