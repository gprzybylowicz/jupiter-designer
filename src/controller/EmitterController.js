

function EmitterController(gui) {
	this.emitter = new jupiter.Emitter();
	this.emitter.emitController.emitPerSecond = 30;

	this.createGUI(gui);
}

EmitterController.prototype.createGUI = function(gui) {
	var folder = gui.addFolder("Emitter");
	folder.add(this.emitter.emitController, "emitPerSecond", 0, 2000).name("emit per sec");
	folder.open();
};


module.exports = EmitterController;
