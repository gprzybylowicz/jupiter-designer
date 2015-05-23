var ProjectMenu = require("./ProjectMenu.js");
var TextureMenu = require("./TextureMenu.js");

function Menu(gui){
	this.gui = gui;
	
	this.projectMenu = new ProjectMenu(this.addClosedFolder("Project"));
	this.texturetMenu = new TextureMenu(this.addClosedFolder("Texture"));
}

Menu.prototype.addClosedFolder = function(name) {
    var folder =  this.gui.addFolder(name);
	folder.close();
	return folder;
};

module.exports = Menu;