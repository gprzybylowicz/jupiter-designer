var model = require("../../model").behaviourModel;

function LifeMenu(gui) {
	var behaviour = model.lifeBehaviour;

	gui.add(behaviour, "maxLifeTime", 0, 10);
	gui.add(behaviour, "timeVariance", 0, 10).name("variance");
}

module.exports = LifeMenu;