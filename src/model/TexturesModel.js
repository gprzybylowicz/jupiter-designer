var PREDEFINED_TEXTURES = [
	{name: "circle", url: "assets/circle.png"},
	{name: "cloud", url: "assets/cloud.png"},
	{name: "flare", url: "assets/flare.png"},
	{name: "flare_blue", url: "assets/flare_blue.png"},
	{name: "sparkle", url: "assets/sparkle.png"}
];

function TexturesModel() {
	this.textures = PREDEFINED_TEXTURES.concat();
}

TexturesModel.prototype.setDefaultTexture = function() {
	this.changeTexture("circle");
};

TexturesModel.prototype.changeTexture = function(name) {
	var url;
	for (var i = 0; i < this.textures.length; i++) {
		if (this.textures[i].name === name) {
			url = this.textures[i].url;
		}
	}
	this.currentTexture = PIXI.Texture.fromFrame(url);
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

module.exports = TexturesModel;