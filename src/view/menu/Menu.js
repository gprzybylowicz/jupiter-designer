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

	var subMenus = [
		{value: "Project", view: new ProjectMenu()},
		{value: "Texture", view: new TextureMenu()},
		{value: "Background", view: new BackgroundMenu()},
		{$template: "Separator"},
		{value: "Emitter", view: new EmitterMenu()},
		{value: "Life", view: new LifeMenu()},
		{value: "Color", view: new ColorMenu()},
		{value: "Position", view: new PositionMenu()},
		{value: "Size", view: new SizeMenu()}
	];

	var menu = {
		view: "menu", id: "m1",
		layout: "y", width: 200,
		height: window.innerHeight,
		select: true,
		data: subMenus,
		on: {
			onMenuItemClick: this.onMenuItemClick.bind(this)
		}
	};

	var uiColumns = [menu];
	for (var i = 0; i < subMenus.length; i++) {
		var subMenu = subMenus[i];
		if (subMenu.view) {
			subMenu.view.ui.batch = i.toString();
			uiColumns.push(subMenu.view.ui);
		}
	}

	uiColumns.push({body: {content: "stage"}});

	this.ui = webix.ui({
		type: "space",
		visibleBatch: "1",
		cols: uiColumns
	});

	webix.event(window, "resize", function() {
		$$("m1").define("height", window.innerHeight);
	}.bind(this));

	service.msg.emit("menu/created");
}

Menu.prototype.onMenuItemClick = function(id) {
	var item = $$("m1").getMenuItem(id);
	this.ui.showBatch(item.view.ui.batch);
	this.ui.adjust();

};
module.exports = Menu;