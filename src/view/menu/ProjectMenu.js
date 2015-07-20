var controller = require("../../controller").projectMenuController;
//var service = require("../../")

function ProjectMenu() {
	this.ui = {
		rows: [
			{view: "button", value: "Save Project", width: 200},
			{view: "button", value: "Load Project", width: 200},
			{view: "button", value: "Export config", width: 200},
			{view: "button", value: "Load config", width: 200},
			{view: "button", value: "Load predefined", width: 200, click: this.onLoadPredefined},
			{view: "button", value: "Reset", width: 200}
		]
	};
}

ProjectMenu.prototype.onLoadPredefined = function() {
	console.log("sfdfds");
	controller.loadPredefined();
};

module.exports = ProjectMenu;