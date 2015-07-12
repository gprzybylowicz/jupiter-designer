var ProjectMenu = require("./ProjectMenu.js");
var TextureMenu = require("./TextureMenu.js");
var BackgroundMenu = require("./BackgroundMenu.js");
var ColorMenu = require("./ColorMenu.js");
var LifeMenu = require("./LifeMenu.js");
var PositionMenu = require("./PositionMenu.js");
var SizeMenu = require("./SizeMenu.js");
var EmitterMenu = require("./EmitterMenu.js");
var service = require("../../service");

function Menu() {
	//this.gui = gui;

	this.currentViewId = null;
	var menu = {
		view: "menu", id: "m1",
		layout: "y", width: 200,
		height: window.innerHeight,
		select: true,
		data: [
			{value: "Project", menuView: new ProjectMenu()},
			{value: "Texture", menuView: new TextureMenu()},
			{value: "Background", menuView: new BackgroundMenu()},
			{$template: "Separator"},
			{value: "Emitter", menuView: new EmitterMenu()},
			{value: "Life", id: "temp", menuView: new LifeMenu()},
			{value: "Color", menuView: new ColorMenu()},
			{value: "Position", menuView: new PositionMenu()}
			//{value: "Size", menuView: new SizeMenu()}

		],
		on: {
			onMenuItemClick: this.onMenuItemClick.bind(this)
		}
	};

	this.ui = webix.ui({
		type: "space",
		cols: [
			menu,
			{body: {content: "stage"}}
		]
	});

	webix.event(window, "resize", function() {
		$$("m1").define("height", window.innerHeight);
	}.bind(this));

	this.onMenuItemClick("temp");
	service.msg.emit("menu/created");
}

Menu.prototype.onMenuItemClick = function(id) {
	if (this.currentViewId) {
		this.ui.removeView(this.currentViewId);
	}

	var item = $$("m1").getMenuItem(id);
	this.currentViewId = this.ui.addView(item.menuView.ui, 1);
	this.ui.adjust();

};
module.exports = Menu;