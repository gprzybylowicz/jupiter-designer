var BaseBehaviourMenu = require("./BaseBehaviourMenu.js");
var model = require("../../model").behaviourModel;

function ColorMenu(gui) {
	BaseBehaviourMenu.call(this, gui, model.colorBehaviour);

	this.addStartColorFolder(gui, model.colorBehaviour);
	this.addEndColorFolder(gui, model.colorBehaviour);
}

ColorMenu.prototype = Object.create(BaseBehaviourMenu.prototype);
ColorMenu.prototype.constructor = ColorMenu;

ColorMenu.prototype.addStartColorFolder = function(gui, behaviour) {
	var folder = gui.addFolder("Start color");
	folder.addColor(behaviour.start, "hex");
	folder.add(behaviour.start, "alpha", 0, 1);
	folder.add(behaviour.startVariance, "r", 0, 255).name("variance r");
	folder.add(behaviour.startVariance, "g", 0, 255).name("variance g");
	folder.add(behaviour.startVariance, "b", 0, 255).name("variance b");
	folder.add(behaviour.startVariance, "alpha", 0, 1).name("variance alpha");
	folder.open();
};

ColorMenu.prototype.addEndColorFolder = function(gui, behaviour) {
	var folder = gui.addFolder("End color");
	folder.addColor(behaviour.end, "hex");
	folder.add(behaviour.end, "alpha", 0, 1);
	folder.add(behaviour.endVariance, "r", 0, 255).name("variance r");
	folder.add(behaviour.endVariance, "g", 0, 255).name("variance g");
	folder.add(behaviour.endVariance, "b", 0, 255).name("variance b");
	folder.add(behaviour.endVariance, "alpha", 0, 1).name("variance alpha");
	folder.open();
};


module.exports = ColorMenu;


