var Model = require("./Model.js");
var util = require("../util");

var PREDEFINED_TEXTURES = [
	{name: "circle", url: "assets/circle.png"},
	{name: "cloud", url: "assets/cloud.png"},
	{name: "flare", url: "assets/flare.png"},
	{name: "flare_blue", url: "assets/flare_blue.png"},
	{name: "sparkle", url: "assets/sparkle.png"}
];

function TexturesModel() {
	Model.call(this);

	this.textures = PREDEFINED_TEXTURES.concat();
	this.currentTextureName = null;
	this.property("currentTexture", null);
}

util.inherit(TexturesModel, Model);

TexturesModel.prototype.setDefaultTexture = function() {
	this.setTextureByName("circle");
};

TexturesModel.prototype.setTextureByName = function(name) {
	var url;
	for (var i = 0; i < this.textures.length; i++) {
		if (this.textures[i].name === name) {
			url = this.textures[i].url;
		}
	}
	this.currentTextureName = name;
	this.currentTexture = PIXI.Texture.fromFrame(url);
};

TexturesModel.prototype.setTexture = function(texture) {
	this.currentTextureName = null;
	this.currentTexture = texture;
};

TexturesModel.prototype.getCurrentTexture = function() {
	return this.currentTexture;
};

TexturesModel.prototype.getTextures = function() {
	return this.textures;
};

TexturesModel.prototype.getTextureUrls = function() {
	return this.getTextures().map(function(texture) {
		return texture.url;
	});
};

TexturesModel.prototype.serialize = function() {
	return {name: this.currentTextureName, url: this.currentTexture.baseTexture.imageUrl};
};

TexturesModel.prototype.deserialize = function(data) {
	if (data.name) {
		this.setTextureByName(data.name);
	}
	else {
		this.setTexture(PIXI.Texture.fromImage(data.url));
	}
};

module.exports = TexturesModel;