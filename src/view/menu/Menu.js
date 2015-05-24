var ProjectMenu = require("./ProjectMenu.js");
var TextureMenu = require("./TextureMenu.js");
var BackgroundMenu = require("./BackgroundMenu.js");
var ColorMenu = require("./ColorMenu.js");
var LifeMenu = require("./LifeMenu.js");
var PositionMenu = require("./PositionMenu.js");
var SizeMenu = require("./SizeMenu.js");

function Menu(gui) {
	this.gui = gui;

	new ProjectMenu(this.addClosedFolder("Project"));
	new TextureMenu(this.addClosedFolder("Texture"));
	new BackgroundMenu(this.addClosedFolder("Background"));
	new LifeMenu(this.addClosedFolder("Life Behaviour"));
	new ColorMenu(this.addClosedFolder("Color Behaviour"));
	new PositionMenu(this.addClosedFolder("Position Behaviour"));
	new SizeMenu(this.addClosedFolder("Size Behaviour"));
}

Menu.prototype.addClosedFolder = function(name) {
	var folder = this.gui.addFolder(name);
	folder.close();
	return folder;
};

module.exports = Menu;