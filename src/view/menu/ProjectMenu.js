//1. Save Project
//2. Load Project
//3. Export
//4. Load
//5. Reset
//6. Load predefined

var controller = require("../../controller").projectMenuController;

function ProjectMenu(gui) {
	gui.add(controller, "saveProject").name("Save Project");
	gui.add(controller, "loadProject").name("Load Project");
	gui.add(controller, "export").name("Export");
	gui.add(controller, "load").name("Load");
	gui.add(controller, "reset").name("Reset");
	gui.add(controller, "loadPredefined").name("Load predefined form list");
}

module.exports = ProjectMenu;