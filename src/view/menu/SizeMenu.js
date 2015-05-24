var BaseBehaviourMenu = require("./BaseBehaviourMenu.js");
var model = require("../../model").behaviourModel;

function SizeMenu(gui) {
	BaseBehaviourMenu.call(this, gui, model.sizeBehaviour);

	this.createGUI(gui);
}

SizeMenu.prototype = Object.create(BaseBehaviourMenu.prototype);
SizeMenu.prototype.constructor = SizeMenu;

SizeMenu.prototype.createGUI = function(gui) {
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

module.exports = SizeMenu;

