var controller = require("../../controller").projectMenuController;
var util = require("../../util");
var service = require("../../service");

function ProjectMenu() {
	util.bind(this);

	this.ui = {
		rows: [
			{view: "button", value: "Save Project", width: 200},
			{view: "button", value: "Load Project", width: 200},
			{view: "button", value: "Export config", width: 200, click: this.onExportConfig},
			{view: "button", value: "Load config", width: 200, click: this.onLoadConfig},
			{view: "button", value: "Load predefined", width: 200, click: this.onLoadPredefined},
			{view: "button", value: "Reset", width: 200}
		]
	};

	//todo: refactor
	document.getElementById("load-config").onchange = function(){
		service.msg.emit("project/loadConfig");
	};

}

ProjectMenu.prototype.onLoadConfig = function() {
	document.getElementById("load-config").click();
};

ProjectMenu.prototype.onExportConfig = function() {
    service.msg.emit("project/exportConfig");
};

ProjectMenu.prototype.onLoadPredefined = function() {
	controller.loadPredefined();
};

module.exports = ProjectMenu;