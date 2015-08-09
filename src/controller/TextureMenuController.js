var service = require("../service");
var texturesModel = require("../model").texturesModel;

function TextureMenuController() {
	service.msg.on("texture/change", this.onTextureChange);
	service.msg.on("texture/upload", this.onUploadTexture);
}

TextureMenuController.prototype.exportParticleTexture = function() {

};

TextureMenuController.prototype.onTextureChange = function(name) {
	texturesModel.setTextureByName(name);
	service.msg.emit("texture/changed");
};

TextureMenuController.prototype.onUploadTexture = function() {
	var reader = new FileReader();
	reader.onload = function() {
		texturesModel.setTexture(PIXI.Texture.fromImage(reader.result));
		service.msg.emit("texture/changed");
		document.getElementById("load-texture").value = null;

	}.bind(this);

	reader.readAsDataURL(document.getElementById("load-texture").files[0]);
};

module.exports = TextureMenuController;