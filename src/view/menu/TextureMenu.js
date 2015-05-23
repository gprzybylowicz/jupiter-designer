//1. Export particle texture
//2. Load particle texture
//3. Load peddefined

var controller = require("../../controller").textureMenuController;

function ProjectMenu(gui) {
	gui.add(controller, "exportParticleTexture").name("Export particle texture");
	gui.add(controller, "loadParticleTexture").name("Load particle texture");
	gui.add(controller, "loadPredefined").name("Load predefined form list");
}

module.exports = ProjectMenu;