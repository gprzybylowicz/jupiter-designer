

function SizeController(gui) {
	this.behaviour = new jupiter.SizeBehaviour();
	this.behaviour.sizeStart.set(1, 1);
	this.behaviour.sizeEnd.set(1, 1);

	this.createGUI(gui);
}

SizeController.prototype.createGUI = function(gui) {
	var startFolder = gui.addFolder("Start size/scale");
	startFolder.add(this.behaviour.sizeStart, "x", 0, 10);
	startFolder.add(this.behaviour.sizeStart, "y", 0, 10);
	startFolder.add(this.behaviour, "startVariance", 0, 10).name("variance");
	startFolder.open();

	var endFolder = gui.addFolder("End size/scale");
	endFolder.add(this.behaviour.sizeEnd, "x", 0, 10);
	endFolder.add(this.behaviour.sizeEnd, "y", 0, 10);
	endFolder.add(this.behaviour, "endVariance", 0, 10).name("variance");
	endFolder.open();
};

module.exports = SizeController;