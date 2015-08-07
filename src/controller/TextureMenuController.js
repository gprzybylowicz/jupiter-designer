var service = require("../service");
var texturesModel = require("../model").texturesModel;

function TextureMenuController() {
	service.msg.on("texture/change", this.onTextureChange);
}

TextureMenuController.prototype.exportParticleTexture = function() {

};

TextureMenuController.prototype.onTextureChange = function(name) {
	texturesModel.changeTexture(name);
	service.msg.emit("texture/changed");
};

TextureMenuController.prototype.loadPredefined = function() {

};

module.exports = TextureMenuController;