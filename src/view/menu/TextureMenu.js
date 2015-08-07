var SubMenu = require("./SubMenu.js");
var util = require("../../util");
var service = require("../../service");

var controller = require("../../controller").textureMenuController;
var texturesModel = require("../../model").texturesModel;

function TextureMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.ui = {
		rows: [
			this.button("Export texture"),
			this.button("Upload texture"),
			this.button("Show all", {click: this.onShowAll}),
			this.texturePreview()
		]
	};
}

util.inherit(TextureMenu, SubMenu);

module.exports = TextureMenu;

TextureMenu.prototype.texturePreview = function() {
	return {
		view: "carousel",
		id: "carousel",
		width: 100, height: 100,
		cols: this.getTexturesPreviewData(),
		navigation: {
			items: false
		}
	};

};

TextureMenu.prototype.onMenuCreated = function() {
	$$("carousel").attachEvent("onShow", function(name) {
		service.msg.emit("texture/change", name);
	});
};

TextureMenu.prototype.onShowAll = function() {
	this.texturesWindow = webix.ui({
		view: "window",
		body: {
			rows: [
				{
					view: "dataview",
					yCount: 2,
					xCount: 2,
					select: true,
					scroll: true,
					type: {
						width: 100,
						height: 100
					},
					template: imageTemplate,
					data: this.getTexturesViewData(),
					click: this.onMenuItemClick.bind(this)

				}
			]

		},
		head: false,
		top: 100,
		left: 100,
		width: 600,
		height: 500
	});

	this.texturesWindow.show();
};

TextureMenu.prototype.onMenuItemClick = function(name) {
	this.texturesWindow.hide();
	$$("carousel").setActive(name);
};

TextureMenu.prototype.getTexturesPreviewData = function() {
	return texturesModel.getTextures().map(function(texture) {
		return {id: texture.name, css: "image", template: imageTemplate, data: {src: texture.url}};
	});
};

TextureMenu.prototype.getTexturesViewData = function() {
	return texturesModel.getTextures().map(function(texture) {
		return {id: texture.name, src: texture.url, title: texture.name};
	});
};

function imageTemplate(obj) {
	return "<div class='texture-preview'><img src='" + obj.src + "' class='texture-preview-content' ondragstart='return false'/></div>";
}



