var backgroundModel = require("../model").backgroundModel;
var service = require("../service");

function BackgroundMenuController() {
	service.msg.on("background/lock", this.onLock);
	service.msg.on("background/changeColor", this.onChangeColor);
	service.msg.on("background/loadTexture", this.onLoadTexture);
	service.msg.on("background/removeTexture", this.onRemoveTexture);
}

BackgroundMenuController.prototype.onLock = function(value) {
	backgroundModel.isLocked = value;
};

BackgroundMenuController.prototype.onChangeColor = function(value) {
	backgroundModel.color = value;
};

BackgroundMenuController.prototype.onLoadTexture = function() {
	console.log("onTextureChanged");

	var reader = new FileReader();
	reader.onload = function() {
		backgroundModel.texture = PIXI.Texture.fromImage(reader.result);
		document.getElementById("load-background").value = null;
	}.bind(this);

	reader.readAsDataURL(document.getElementById("load-background").files[0]);
};

BackgroundMenuController.prototype.onRemoveTexture = function() {
	backgroundModel.texture = null;
};
module.exports = BackgroundMenuController;