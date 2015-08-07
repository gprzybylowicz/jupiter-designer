var controller = require("../../controller").projectMenuController;
var util = require("../../util");
var service = require("../../service");
var predefinedModel = require("../../model").predefinedModel;

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
	document.getElementById("load-config").onchange = function() {
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
	var data = predefinedModel.getNames().map(function(name) {
		return {view: "text", value: name};
	});

	webix.ui({
		view: "window",
		modal: true,
		head: {view: "button", label: "close", align: "right", click: ("$$('choose_predefined_window').close();")},
		position: "center",
		id: "choose_predefined_window",
		body: {
			view: "menu",
			id: "choose_predefined_menu",
			select: true,
			data: data,
			layout: "y",
			scroll: "y",
			height: 300,
			on: {
				onMenuItemClick: this.onPredefinedClick
			}
		}
	}).show();
};

ProjectMenu.prototype.onPredefinedClick = function(id) {
	//console.log($$("choose_predefined_menu").getMenuItem(id));
	service.msg.emit("project/loadPredefined", $$("choose_predefined_menu").getMenuItem(id).value);
	$$("choose_predefined_window").hide();
	$$("choose_predefined_window").close();
};

module.exports = ProjectMenu;