var controller = require("../../controller").projectMenuController;

function ProjectMenu() {
	this.ui = {
		rows: [
			{view: "button", value: "Save Project", width: 200},
			{view: "button", value: "Load Project", width: 200},
			{view: "button", value: "Export config", width: 200},
			{view: "button", value: "Load config", width: 200},
			{view: "button", value: "Load predefined", width: 200},
			{view: "button", value: "Reset", width: 200}
		]
	};
}

module.exports = ProjectMenu;