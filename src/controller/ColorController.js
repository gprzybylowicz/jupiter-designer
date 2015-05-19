
function ColorController(gui) {
	this.behaviour = new jupiter.ColorBehaviour();
	this.behaviour.start.set(255, 255, 255, 1);
	this.behaviour.end.set(255, 255, 255, 1);

	this.createGUI(gui);
}

ColorController.prototype.createGUI = function(gui) {
	this.addStartColorFolder(gui);
	this.addEndColorFolder(gui);
};

ColorController.prototype.addStartColorFolder = function(gui) {
	var folder = gui.addFolder("Start color");
	folder.addColor(this.behaviour.start, "hex");
	folder.add(this.behaviour.start, "alpha", 0, 1);
	folder.add(this.behaviour.startVariance, "r", 0, 255).name("variance r");
	folder.add(this.behaviour.startVariance, "g", 0, 255).name("variance g");
	folder.add(this.behaviour.startVariance, "b", 0, 255).name("variance b");
	folder.add(this.behaviour.startVariance, "alpha", 0, 1).name("variance alpha");
	folder.open();

};

ColorController.prototype.addEndColorFolder = function(gui) {
	var folder = gui.addFolder("End color");
	folder.addColor(this.behaviour.end, "hex");
	folder.add(this.behaviour.end, "alpha", 0, 1);
	folder.add(this.behaviour.endVariance, "r", 0, 255).name("variance r");
	folder.add(this.behaviour.endVariance, "g", 0, 255).name("variance g");
	folder.add(this.behaviour.endVariance, "b", 0, 255).name("variance b");
	folder.add(this.behaviour.endVariance, "alpha", 0, 1).name("variance alpha");
	folder.open();

};

module.exports = ColorController;
