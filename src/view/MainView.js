var Menu = require("./menu/Menu.js");
var ParticleView = require("./ParticleView.js");

function MainView() {
	this.renderer = this.createRenderer();
	this.stage = this.createStage();
	this.stats = this.createStats();
	this.particleView = this.createParticleView();
	this.menu = this.createMenu();

	this.stage.interactive = true;
	this.stage.hitArea = new PIXI.Rectangle(0, 0, 600, 600);
	this.stage.mousemove = this.stage.touchmove = function() {
		console.log("ss");
	};

	this.draw();

}

MainView.prototype.createStage = function() {
	return new PIXI.Container();
};

MainView.prototype.createRenderer = function() {
	//todo: autodetect renderer
	//todo: dynamic size of renderer
	var renderer = new PIXI.WebGLRenderer(600, 600);
	document.getElementById("stage").appendChild(renderer.view);
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
	return new Menu();
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