var model = require("../../model").projectModel;

function EmitterMenu(gui) {
	gui.add(model.emitter.emitController, "emitPerSecond", 0, 2000).name("emit per sec");
	gui.open();
}

module.exports = EmitterMenu;
