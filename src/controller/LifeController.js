function LifeController(gui) {
	this.behaviour = new jupiter.LifeBehaviour();
	this.behaviour.maxLifeTime = 2.10;
	this.behaviour.timeVariance = 0.00;

	this.createGUI(gui);
}

LifeController.prototype.createGUI = function(gui) {
	var folder = gui.addFolder("Life");
	folder.add(this.behaviour, "maxLifeTime", 0, 10);
	folder.add(this.behaviour, "timeVariance", 0, 10).name("variance");
	folder.open();
};

module.exports = LifeController;
