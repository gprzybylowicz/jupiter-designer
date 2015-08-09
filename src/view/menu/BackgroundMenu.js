var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");

function BackgroundMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.checkbox("Lock: ", {id: "lock_enable", value: 0}),
			this.button("Load image", {click: this.onLoadImage}),
			this.button("Remove background", {click: this.onRemoveBackground}),
			{view: "colorpicker", id: "background_color", label: "Color", name: "color", value: "#00000"}
		]
	};
}

util.inherit(BackgroundMenu, SubMenu);

BackgroundMenu.prototype.onMenuCreated = function() {
	$$("background_color").attachEvent("onChange", this.onColorChanged);

	//todo: refactor
	document.getElementById("load-background").onchange = function() {
		service.msg.emit("background/loadTexture");
	};
};

BackgroundMenu.prototype.onColorChanged = function() {
	var value = $$("background_color").getValue().replace("#", "0x");
	service.msg.emit("background/changeColor", value);
};

BackgroundMenu.prototype.onLoadImage = function() {
	document.getElementById("load-background").click();
};

BackgroundMenu.prototype.onRemoveBackground = function() {
    
};

module.exports = BackgroundMenu;