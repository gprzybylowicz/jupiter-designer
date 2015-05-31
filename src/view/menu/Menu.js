var ProjectMenu = require("./ProjectMenu.js");
var TextureMenu = require("./TextureMenu.js");
var BackgroundMenu = require("./BackgroundMenu.js");
var ColorMenu = require("./ColorMenu.js");
var LifeMenu = require("./LifeMenu.js");
var PositionMenu = require("./PositionMenu.js");
var SizeMenu = require("./SizeMenu.js");
var EmitterMenu = require("./EmitterMenu.js");

function Menu(gui) {
	//this.gui = gui;

	var menu = {
		view: "menu", id: "m1",
		layout: "y", width: 200,
		select: true,
		data: [
			{id: "1", value: "Translations", viewId: "t"},
			{id: "2", value: "Posts", viewId: "x"},
			{$template: "Separator"},
			{id: "3", value: "Info", template: {view: "checkbox", id: "field_a", label: "Second age", value: 1},}

		],
		on: {
			onMenuItemClick: function(id) {
				//$$("t1").setHTML("Click: " + this.getMenuItem(id).value);
				console.log(this.getMenuItem(id));

				if (this.visibleItem) {
					this.visibleItem.hide();
				}

				this.visibleItem = $$(this.getMenuItem(id).viewId);
				this.visibleItem.show();
				//$$("t").show();

				//t.show();
			}
		}
	};

	var tVisible = false;

	var t = {
		id: "t",
		hidden: true,
		rows: [
			{view: "button", id: "LoadBut", value: "Load", width: 200, align: "left"},
			{view: "button", value: "Save", width: 200, align: "center"},
			{view: "label", label: "Variance", height: 30, width: 200, align: "center"},
			{
				view: "slider",
				label: "R:",
				labelWidth: 50,
				min: 0,
				max: 255,
				value: 0,
				width: 200,
				align: "center"
			},
			{view: "checkbox", id: "field_a", label: "Second age", value: 1, width: 200, labelWidth: 100},
			{view: "button", value: "Info", width: 200, align: "right"}]
	};

	var x = {hidden: true, view: "button", id: "x", value: "Load 2", width: 200, align: "left"};

	//$$("m1").select(1);

	//console.log($$("menu"));
	//ui.getNode("menu").addView({template:"sss"});



	//console.log(a);
	//this.node = a.getNode("stage");
	//console.log(this.node);

	var general = [
		new ProjectMenu(),
		new TextureMenu()
		//new BackgroundMenu(this.addClosedFolder("Background"));
		//new EmitterMenu(this.addClosedFolder("Emitter"));
		//new LifeMenu(this.addClosedFolder("Life Behaviour"));
		//new ColorMenu(this.addClosedFolder("Color Behaviour"));
		//new PositionMenu(this.addClosedFolder("Position Behaviour"));
		//new SizeMenu(this.addClosedFolder("Size Behaviour"));
	];

	var menuColumns = [menu];
	for (var i = 0; i < general.length; i++) {
		menuColumns.push(general[i].ui);
	}

	menuColumns.push({body: {content: "stage"}});

	console.log(menuColumns);
	webix.ui({
		type: "space",
		cols: menuColumns
	});
}

Menu.prototype.addClosedFolder = function(name) {
	var folder = this.gui.addFolder(name);
	folder.close();
	return folder;
};

module.exports = Menu;