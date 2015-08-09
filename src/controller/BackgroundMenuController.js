var backgroundModel = require("../model").backgroundModel;
var service = require("../service");

function BackgroundMenuController() {
	service.msg.on("background/lock", this.onLock);
	service.msg.on("background/changeColor", this.onChangeColor);
	service.msg.on("background/loadTexture", this.onLoadTexture);
	service.msg.on("background/removeTexture", this.onRemoveTexture);
}

BackgroundMenuController.prototype.onLock = function(value) {
	if (backgroundModel.isLocked !== value) {
		backgroundModel.isLocked = value;
		service.msg.emit("background/locked", value);
	}
};

BackgroundMenuController.prototype.onChangeColor = function(value) {
	if (backgroundModel.color !== value) {
		backgroundModel.color = value;
		service.msg.emit("background/colorChanged", value);
	}
};

BackgroundMenuController.prototype.onLoadTexture = function() {
	console.log("onLoadTexture");

	var reader = new FileReader();
	reader.onload = function() {
		backgroundModel.texture = PIXI.Texture.fromImage(reader.result);
		service.msg.emit("background/textureChanged");
	}.bind(this);

	reader.readAsDataURL(document.getElementById("load-background").files[0]);
};

BackgroundMenuController.prototype.onRemoveTexture = function() {
	backgroundModel.texture = null;
	service.msg.emit("background/textureChanged");
};
module.exports = BackgroundMenuController;