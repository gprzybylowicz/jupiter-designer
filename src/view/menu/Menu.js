var ProjectMenu = require("./ProjectMenu.js");
var TextureMenu = require("./TextureMenu.js");
var BackgroundMenu = require("./BackgroundMenu.js");

function Menu(gui){
	this.gui = gui;

	this.projectMenu = new ProjectMenu(this.addClosedFolder("Project"));
	this.texturetMenu = new TextureMenu(this.addClosedFolder("Texture"));
	this.backgroundMenu = new BackgroundMenu(this.addClosedFolder("Background"));
}

Menu.prototype.addClosedFolder = function(name) {
    var folder =  this.gui.addFolder(name);
	folder.close();
	return folder;
};

module.exports = Menu;