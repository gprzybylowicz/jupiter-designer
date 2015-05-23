//1. Load
//2. Remove
//3. Set Ccale (x,y)
//4. Set Color
//4. Enable drag and move(default:true)

var controller = require("../../controller").backgroundMenuController;

function BackgroundMenu(gui) {
	gui.add(controller, "load").name("Load image");
	gui.add(controller, "remove").name("Remove image");
	gui.add(controller, "setScale").name("Set scale");
	gui.add(controller, "setColor").name("Set color");
	//gui.add(controller, "enableDragEndMove").name("Enable darge and move");
}

module.exports = BackgroundMenu;